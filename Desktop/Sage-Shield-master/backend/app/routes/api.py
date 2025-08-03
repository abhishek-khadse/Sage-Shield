from flask import Blueprint, request, jsonify, Response
import psutil
import platform
import socket
import time
from datetime import datetime
from collections import defaultdict

from ..models.predictor import predict, ModelLoadError

# Create blueprint
api_bp = Blueprint('api', __name__)

# In-memory storage for blocked IPs (in a real app, use a database)
blocked_ips = {}
network_stats = {
    'bytes_sent': 0,
    'bytes_recv': 0,
    'packets_sent': 0,
    'packets_recv': 0,
    'error_in': 0,
    'error_out': 0,
    'drop_in': 0,
    'drop_out': 0
}

# System startup time for uptime calculation
startup_time = time.time()

# Network traffic history (last 60 samples, one per second)
TRAFFIC_HISTORY_SIZE = 60
traffic_history = {
    'timestamps': [],
    'bytes_sent': [],
    'bytes_recv': [],
    'packets_sent': [],
    'packets_recv': []
}

def get_system_status():
    """Return live system status information"""
    try:
        # Get CPU usage (average over all cores)
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Get memory usage
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        
        # Get disk usage for the root partition
        disk = psutil.disk_usage('/')
        
        # Get network interfaces
        net_io = psutil.net_io_counters()
        net_ifs = psutil.net_if_addrs()
        
        # Get system info
        boot_time = psutil.boot_time()
        uptime = time.time() - boot_time
        
        return {
            'cpu': {
                'percent': cpu_percent,
                'cores': psutil.cpu_count(),
                'freq': psutil.cpu_freq().current if psutil.cpu_freq() else None
            },
            'memory': {
                'total': memory.total,
                'available': memory.available,
                'used': memory.used,
                'percent': memory.percent,
                'swap_total': swap.total,
                'swap_used': swap.used,
                'swap_percent': swap.percent
            },
            'disk': {
                'total': disk.total,
                'used': disk.used,
                'free': disk.free,
                'percent': disk.percent
            },
            'system': {
                'hostname': socket.gethostname(),
                'os': f"{platform.system()} {platform.release()}",
                'uptime': uptime,
                'boot_time': boot_time,
                'cpu_cores': psutil.cpu_count(),
                'cpu_physical_cores': psutil.cpu_count(logical=False),
                'cpu_percent': psutil.cpu_percent(interval=1, percpu=True)
            },
            'network': {
                'bytes_sent': net_io.bytes_sent,
                'bytes_recv': net_io.bytes_recv,
                'packets_sent': net_io.packets_sent,
                'packets_recv': net_io.packets_recv,
                'error_in': net_io.errin,
                'error_out': net_io.errout,
                'drop_in': net_io.dropin,
                'drop_out': net_io.dropout,
                'interfaces': len(net_ifs)
            },
            'timestamp': datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {'error': str(e)}, 500

@api_bp.route('/predict', methods=['POST'])
def predict_endpoint():
    """
    Handle prediction requests
    ---
    tags:
      - Predictions
    description: Make a prediction using the loaded model
    parameters:
      - in: body
        name: features
        description: Input features for prediction
        required: true
        schema:
          type: object
          properties:
            features:
              type: array
              items:
                type: number
              description: List of feature values in the correct order
    responses:
      200:
        description: Successful prediction
        schema:
          type: object
          properties:
            prediction:
              type: integer
              description: Predicted class (0 or 1)
            confidence:
              type: number
              format: float
              description: Confidence score of the prediction
            status:
              type: string
              example: success
      400:
        description: Invalid input format
      500:
        description: Internal server error
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({
                'error': 'Invalid input format. Expected JSON with "features" array.',
                'status': 'error'
            }), 400
        
        # Make prediction
        result = predict(data['features'])
        return jsonify(result)
        
    except ValueError as e:
        return jsonify({
            'error': f'Invalid input data: {str(e)}',
            'status': 'error'
        }), 400
        
    except ModelLoadError as e:
        return jsonify({
            'error': 'Model is not available',
            'details': str(e),
            'status': 'error'
        }), 503  # Service Unavailable
        
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e),
            'status': 'error'
        }), 500

@api_bp.route('/model/info', methods=['GET'])
def model_info():
    """
    Get information about the loaded model
    ---
    tags:
      - Model
    description: Get information about the loaded model
    responses:
      200:
        description: Model information
        schema:
          type: object
          properties:
            status:
              type: string
              example: loaded
            features:
              type: array
              items:
                type: string
      503:
        description: Model not loaded
    """
    from ..models.predictor import model, feature_names
    
    if model is None:
        return jsonify({
            'status': 'not_loaded',
            'error': 'Model is not loaded'
        }), 503
        
    return jsonify({
        'status': 'loaded',
        'features': feature_names if feature_names else []
    })

@api_bp.route('/system/status', methods=['GET'])
def system_status():
    """
    Get system status information
    ---
    tags:
      - System
    description: Get current system status including CPU, memory, disk, and network info
    responses:
      200:
        description: System status information
        schema:
          type: object
          properties:
            cpu:
              type: object
            memory:
              type: object
            disk:
              type: object
            system:
              type: object
            network:
              type: object
            timestamp:
              type: string
    """
    status = get_system_status()
    if isinstance(status, tuple) and status[1] == 500:
        return jsonify(status[0]), 500
    return jsonify(status)

@api_bp.route('/network/stats', methods=['GET'])
def network_stats_route():
    """
    Get network statistics
    ---
    tags:
      - Network
    description: Get current network statistics including interfaces and connections
    responses:
      200:
        description: Network statistics
        schema:
          type: object
          properties:
            interfaces:
              type: object
            connections:
              type: object
            stats:
              type: object
            timestamp:
              type: string
    """
    try:
        net_io = psutil.net_io_counters()
        net_ifs = psutil.net_if_stats()
        
        # Get active connections
        connections = psutil.net_connections(kind='inet')
        active_connections = len([c for c in connections if c.status == 'ESTABLISHED'])
        
        # Get per-interface stats
        interfaces = {}
        for iface, addrs in psutil.net_if_addrs().items():
            if iface in net_ifs:
                interfaces[iface] = {
                    'is_up': net_ifs[iface].isup,
                    'speed': net_ifs[iface].speed,
                    'mtu': net_ifs[iface].mtu,
                    'addresses': [
                        {
                            'family': str(addr.family),
                            'address': addr.address,
                            'netmask': addr.netmask,
                            'broadcast': addr.broadcast
                        } for addr in addrs
                    ]
                }
        
        # Update network stats
        global network_stats
        network_stats = {
            'bytes_sent': net_io.bytes_sent,
            'bytes_recv': net_io.bytes_recv,
            'packets_sent': net_io.packets_sent,
            'packets_recv': net_io.packets_recv,
            'error_in': net_io.errin,
            'error_out': net_io.errout,
            'drop_in': net_io.dropin,
            'drop_out': net_io.dropout
        }
        
        return jsonify({
            'interfaces': interfaces,
            'connections': {
                'active': active_connections,
                'total': len(connections)
            },
            'stats': network_stats,
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/network/blocked-ips', methods=['GET', 'POST'])
def blocked_ips_route():
    """
    Get or add blocked IPs
    ---
    tags:
      - Network
    description: Get list of blocked IPs or add a new IP to block
    parameters:
      - in: body
        name: ip_data
        description: IP address to block
        schema:
          type: object
          properties:
            ip:
              type: string
              description: IP address to block
            reason:
              type: string
              description: Reason for blocking
    responses:
      200:
        description: List of blocked IPs
        schema:
          type: object
          properties:
            blocked_ips:
              type: object
            count:
              type: integer
            timestamp:
              type: string
    """
    global blocked_ips
    
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'ip' not in data:
            return jsonify({'error': 'IP address is required'}), 400
            
        ip = data['ip']
        reason = data.get('reason', 'Manual block')
        blocked_ips[ip] = {
            'reason': reason,
            'blocked_at': datetime.utcnow().isoformat(),
            'blocked_by': 'system'
        }
        return jsonify({'message': f'IP {ip} blocked', 'blocked_ips': blocked_ips})
    
    # GET request
    return jsonify({
        'blocked_ips': blocked_ips,
        'count': len(blocked_ips),
        'timestamp': datetime.utcnow().isoformat()
    })

@api_bp.route('/network/blocked-ips/<ip>', methods=['DELETE'])
def unblock_ip_route(ip):
    """
    Unblock an IP address
    ---
    tags:
      - Network
    parameters:
      - in: path
        name: ip
        required: true
        type: string
        description: IP address to unblock
    responses:
      200:
        description: IP unblocked successfully
      404:
        description: IP not found in blocked list
    """
    global blocked_ips
    
    if ip in blocked_ips:
        del blocked_ips[ip]
        return jsonify({'message': f'IP {ip} unblocked', 'blocked_ips': blocked_ips})
    
    return jsonify({'error': 'IP not found in blocked list'}), 404

@api_bp.route('/network/traffic', methods=['GET'])
def network_traffic():
    """
    Get network traffic data
    ---
    tags:
      - Network
    description: Get current network traffic data
    responses:
      200:
        description: Network traffic data
        schema:
          type: object
          properties:
            interfaces:
              type: object
            history:
              type: object
            timestamp:
              type: string
            uptime:
              type: number
    """
    try:
        net_io = psutil.net_io_counters(pernic=True)
        interfaces = {}
        
        # Get per-interface stats
        for iface, stats in net_io.items():
            interfaces[iface] = {
                'bytes_sent': stats.bytes_sent,
                'bytes_recv': stats.bytes_recv,
                'packets_sent': stats.packets_sent,
                'packets_recv': stats.packets_recv,
                'error_in': stats.errin,
                'error_out': stats.errout,
                'drop_in': stats.dropin,
                'drop_out': stats.dropout
            }
        
        # Update traffic history
        now = datetime.utcnow().isoformat()
        traffic_history['timestamps'].append(now)
        traffic_history['bytes_sent'].append(sum(s.bytes_sent for s in net_io.values()))
        traffic_history['bytes_recv'].append(sum(s.bytes_recv for s in net_io.values()))
        traffic_history['packets_sent'].append(sum(s.packets_sent for s in net_io.values()))
        traffic_history['packets_recv'].append(sum(s.packets_recv for s in net_io.values()))
        
        # Trim history to max size
        for key in traffic_history:
            if len(traffic_history[key]) > TRAFFIC_HISTORY_SIZE:
                traffic_history[key] = traffic_history[key][-TRAFFIC_HISTORY_SIZE:]
        
        return jsonify({
            'interfaces': interfaces,
            'history': traffic_history,
            'timestamp': now,
            'uptime': time.time() - startup_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
