from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import random
import time
import psutil
import platform
import socket
from datetime import datetime, timedelta
import json
import threading
from collections import deque
import os

# Import the API blueprint
from app.routes.api import api_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage
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
    'timestamps': deque(maxlen=TRAFFIC_HISTORY_SIZE),
    'bytes_sent': deque(maxlen=TRAFFIC_HISTORY_SIZE),
    'bytes_recv': deque(maxlen=TRAFFIC_HISTORY_SIZE),
    'packets_sent': deque(maxlen=TRAFFIC_HISTORY_SIZE),
    'packets_recv': deque(maxlen=TRAFFIC_HISTORY_SIZE)
}

# Background thread for collecting network stats
class NetworkMonitor(threading.Thread):
    def __init__(self):
        super().__init__(daemon=True)
        self._stop_event = threading.Event()
        self.last_net_io = psutil.net_io_counters()
        self.last_time = time.time()
        
    def stop(self):
        self._stop_event.set()
        
    def run(self):
        while not self._stop_event.is_set():
            try:
                # Get current network stats
                net_io = psutil.net_io_counters()
                current_time = time.time()
                time_diff = current_time - self.last_time
                
                # Calculate rates (per second)
                bytes_sent = net_io.bytes_sent - self.last_net_io.bytes_sent
                bytes_recv = net_io.bytes_recv - self.last_net_io.bytes_recv
                packets_sent = net_io.packets_sent - self.last_net_io.packets_sent
                packets_recv = net_io.packets_recv - self.last_net_io.packets_recv
                
                # Update global stats
                network_stats.update({
                    'bytes_sent': bytes_sent / time_diff if time_diff > 0 else 0,
                    'bytes_recv': bytes_recv / time_diff if time_diff > 0 else 0,
                    'packets_sent': packets_sent / time_diff if time_diff > 0 else 0,
                    'packets_recv': packets_recv / time_diff if time_diff > 0 else 0,
                    'error_in': net_io.errin,
                    'error_out': net_io.errout,
                    'drop_in': net_io.dropin,
                    'drop_out': net_io.dropout
                })
                
                # Update history
                timestamp = datetime.now().strftime('%H:%M:%S')
                traffic_history['timestamps'].append(timestamp)
                traffic_history['bytes_sent'].append(bytes_sent / (1024 * time_diff) if time_diff > 0 else 0)  # KB/s
                traffic_history['bytes_recv'].append(bytes_recv / (1024 * time_diff) if time_diff > 0 else 0)  # KB/s
                traffic_history['packets_sent'].append(packets_sent / time_diff if time_diff > 0 else 0)
                traffic_history['packets_recv'].append(packets_recv / time_diff if time_diff > 0 else 0)
                
                # Update for next iteration
                self.last_net_io = net_io
                self.last_time = current_time
                
            except Exception as e:
                print(f"Error in network monitor: {e}")
            
            # Sleep for 1 second
            time.sleep(1)

# Start network monitor
network_monitor = NetworkMonitor()
network_monitor.start()

# Add before_request handler to log all incoming requests
@app.before_request
def log_request():
    if request.path.startswith('/api'):
        print(f"[{datetime.now()}] {request.method} {request.path}")
        if request.method in ['POST', 'PUT']:
            print(f"Request data: {request.get_json(silent=True) or request.data}")

# Mock model for now
class MockModel:
    def predict(self, X):
        return [random.choice([0, 1])]  # Return random 0 or 1 for now

model = MockModel()

def load_model():
    """Load the machine learning model"""
    global model
    if model is None:
        try:
            model = joblib.load(model_path)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise
    return model

@app.route('/')
def home():
    return "SageShield Backend is running!"

# System Status Endpoint
@app.route('/api/system/status', methods=['GET'])
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
        uptime = int(time.time() - boot_time)
        
        return jsonify({
            'status': 'connected',
            'last_checked': datetime.now().isoformat(),
            'uptime': uptime,
            'cpu_usage': cpu_percent,
            'cpu_cores': psutil.cpu_count(logical=True),
            'cpu_freq': psutil.cpu_freq().current if hasattr(psutil, 'cpu_freq') and callable(psutil.cpu_freq) else None,
            'memory_usage': memory.percent,
            'memory_total': memory.total,
            'memory_available': memory.available,
            'memory_used': memory.used,
            'swap_used': swap.percent,
            'disk_usage': disk.percent,
            'disk_total': disk.total,
            'disk_used': disk.used,
            'disk_free': disk.free,
            'network_interfaces': list(net_ifs.keys()),
            'active_processes': len(psutil.pids()),
            'system': {
                'os': platform.system(),
                'release': platform.release(),
                'version': platform.version(),
                'machine': platform.machine(),
                'processor': platform.processor(),
                'hostname': socket.gethostname(),
                'ip_address': socket.gethostbyname(socket.gethostname())
            }
        }), 200
    except Exception as e:
        print(f"Error in get_system_status: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Network Stats Endpoint
@app.route('/api/network/stats', methods=['GET'])
def get_network_stats():
    """Return live network statistics"""
    try:
        # Get current network connections
        connections = psutil.net_connections(kind='inet')
        
        # Get network interface stats
        net_io = psutil.net_io_counters()
        net_if_stats = psutil.net_if_stats()
        
        # Get active connections (ESTABLISHED state)
        active_connections = [
            conn for conn in connections 
            if conn.status == 'ESTABLISHED' 
            and conn.raddr and conn.raddr != ()  # Has remote address
        ]
        
        # Get interface details
        interfaces = []
        for name, stats in net_if_stats.items():
            if stats.isup:
                addrs = psutil.net_if_addrs().get(name, [])
                ipv4 = next((addr.address for addr in addrs if addr.family == socket.AF_INET), None)
                interfaces.append({
                    'name': name,
                    'ip_address': ipv4,
                    'is_up': stats.isup,
                    'speed': stats.speed,
                    'mtu': stats.mtu
                })
        
        # Get current network stats (from our background thread)
        current_stats = network_stats.copy()
        
        return jsonify({
            'total_connections': len(connections),
            'active_connections': len(active_connections),
            'bytes_sent': net_io.bytes_sent,
            'bytes_received': net_io.bytes_recv,
            'bytes_sent_rate': current_stats['bytes_sent'],  # Bytes per second
            'bytes_received_rate': current_stats['bytes_recv'],  # Bytes per second
            'packets_sent': net_io.packets_sent,
            'packets_received': net_io.packets_recv,
            'packets_sent_rate': current_stats['packets_sent'],  # Packets per second
            'packets_received_rate': current_stats['packets_recv'],  # Packets per second
            'error_count': net_io.errin + net_io.errout,
            'drop_count': net_io.dropin + net_io.dropout,
            'interfaces': interfaces,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"Error in get_network_stats: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Blocked IPs Endpoints
@app.route('/api/network/blocked-ips', methods=['GET'])
def get_blocked_ips():
    """Return list of blocked IPs"""
    try:
        # Get current active connections to show blocked vs active
        connections = psutil.net_connections(kind='inet')
        active_ips = {}
        
        for conn in connections:
            if conn.raddr and conn.raddr != ():  # Has remote address
                ip = conn.raddr.ip
                if ip not in active_ips:
                    active_ips[ip] = 0
                active_ips[ip] += 1
        
        # Return the list of blocked IPs with their timestamps and active status
        return jsonify({
            'blocked_ips': [
                {
                    'ip': ip, 
                    'timestamp': timestamp.isoformat(), 
                    'reason': info.get('reason', 'Manual block'),
                    'is_active': ip in active_ips,
                    'active_connections': active_ips.get(ip, 0)
                }
                for ip, (timestamp, info) in blocked_ips.items()
            ],
            'active_connections': len(connections),
            'unique_active_ips': len(active_ips),
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"Error in get_blocked_ips: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/network/block-ip', methods=['POST'])
def block_ip():
    """Add an IP to the blocked list"""
    try:
        data = request.get_json()
        ip = data.get('ip')
        reason = data.get('reason', 'No reason provided')
        
        if not ip:
            return jsonify({"error": "IP address is required"}), 400
            
        blocked_ips[ip] = {
            'reason': reason,
            'timestamp': datetime.now()
        }
        
        return jsonify({"status": "success", "message": f"IP {ip} blocked successfully"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/api/network/unblock-ip/<ip>', methods=['POST'])
def unblock_ip(ip):
    """Remove an IP from the blocked list"""
    try:
        if ip in blocked_ips:
            del blocked_ips[ip]
            return jsonify({"status": "success", "message": f"IP {ip} unblocked successfully"})
        else:
            return jsonify({"error": f"IP {ip} not found in blocked list"}), 404
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# Network Traffic Endpoint (live data)
@app.route('/api/network/traffic', methods=['GET'])
def get_network_traffic():
    """Return live network traffic data"""
    try:
        # Get current network interfaces
        net_io = psutil.net_io_counters(pernic=True)
        interfaces = {}
        
        for iface, io in net_io.items():
            interfaces[iface] = {
                'bytes_sent': io.bytes_sent,
                'bytes_recv': io.bytes_recv,
                'packets_sent': io.packets_sent,
                'packets_recv': io.packets_recv,
                'errin': io.errin,
                'errout': io.errout,
                'dropin': io.dropin,
                'dropout': io.dropout
            }
        
        # Get traffic history (from our background thread)
        history = {
            'timestamps': list(traffic_history['timestamps']),
            'bytes_sent': list(traffic_history['bytes_sent']),  # KB/s
            'bytes_recv': list(traffic_history['bytes_recv']),  # KB/s
            'packets_sent': list(traffic_history['packets_sent']),  # packets/s
            'packets_recv': list(traffic_history['packets_recv'])   # packets/s
        }
        
        return jsonify({
            'interfaces': interfaces,
            'history': history,
            'current_rate': network_stats,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        print(f"Error in get_network_traffic: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle prediction requests
    Expected JSON format:
    {
        "features": [list of feature values]
    }
    """
    try:
        data = request.get_json()
        features = data.get('features')
        
        if not features or not isinstance(features, list):
            return jsonify({"error": "Invalid input format. Expected 'features' array."}), 400
        
        model = load_model()
        prediction = model.predict([features])
        
        return jsonify({
            "prediction": int(prediction[0]),
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

# Register the API blueprint
app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('logs', exist_ok=True)
    
    # Load the model when the app starts
    load_model()
    
    # Configure logging
    import logging
    from logging.handlers import RotatingFileHandler
    
    # Ensure logs directory exists
    os.makedirs('logs', exist_ok=True)
    
    # Configure file handler
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    
    # Add handlers to app
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Sage Shield starting up...')
    
    # Start the application
    app.run(debug=True, host='0.0.0.0', port=5000)
