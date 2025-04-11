from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from network_scanner import scanner
import logging
import os
import time

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Define allowed origins
ALLOWED_ORIGINS = [
    'https://sage-shield.onrender.com',
    'http://localhost:5173'
]

# Configure CORS with specific origin handling
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        origin = request.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            response.headers.add('Access-Control-Allow-Origin', origin)
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        return response

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers.add('Access-Control-Allow-Origin', origin)
    return response

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({"status": "running"})

@app.route('/api/analytics')
def get_analytics():
    """Get analytics data"""
    try:
        logger.debug("Analytics endpoint called")
        data = {
            "traffic": {
                "total": scanner.get_data()['stats'].get('bytesReceived', 0) + 
                        scanner.get_data()['stats'].get('bytesSent', 0),
                "blocked": 50,
                "suspicious": 10
            },
            "attacks": {
                "total": 60,
                "ddos": 20,
                "bruteforce": 30,
                "other": 10
            },
            "topAttackers": [
                {"ip": "192.168.1.100", "attempts": 30},
                {"ip": "192.168.1.101", "attempts": 20},
                {"ip": "192.168.1.102", "attempts": 10}
            ]
        }
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error in analytics endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    """Handle settings GET and POST requests"""
    try:
        if request.method == 'GET':
            logger.debug("Settings GET endpoint called")
            settings = [
                {
                    "title": "Monitoring",
                    "description": "Configure how the system monitors network traffic and threats",
                    "fields": [
                        {
                            "id": "monitoring-interval",
                            "label": "Monitoring Interval (seconds)",
                            "type": "number",
                            "value": 30
                        },
                        {
                            "id": "monitoring-enabled",
                            "label": "Enable Monitoring",
                            "type": "toggle",
                            "value": True
                        }
                    ]
                },
                {
                    "title": "Alerts",
                    "description": "Configure how you want to be notified of potential threats",
                    "fields": [
                        {
                            "id": "alerts-email",
                            "label": "Email Notifications",
                            "type": "toggle",
                            "value": False
                        },
                        {
                            "id": "alerts-desktop",
                            "label": "Desktop Notifications",
                            "type": "toggle",
                            "value": True
                        },
                        {
                            "id": "alerts-threshold",
                            "label": "Alert Threshold (%)",
                            "type": "number",
                            "value": 80
                        }
                    ]
                },
                {
                    "title": "Network Protection",
                    "description": "Configure how the system protects your network from threats",
                    "fields": [
                        {
                            "id": "network-scan-interval",
                            "label": "Network Scan Interval (seconds)",
                            "type": "number",
                            "value": 60
                        },
                        {
                            "id": "network-auto-block",
                            "label": "Auto-block Suspicious IPs",
                            "type": "toggle",
                            "value": True
                        },
                        {
                            "id": "network-block-threshold",
                            "label": "Block Threshold (attempts)",
                            "type": "number",
                            "value": 100
                        }
                    ]
                }
            ]
            logger.debug("Returning settings: %s", settings)
            return jsonify(settings)
        elif request.method == 'POST':
            logger.debug("Settings POST endpoint called")
            new_settings = request.get_json()
            logger.debug("Received settings: %s", new_settings)
            # Here you would typically save the settings to a database or file
            # For now, we'll just return success
            return jsonify({"message": "Settings saved successfully"})
    except Exception as e:
        logger.error("Error handling settings: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/traffic')
def get_traffic():
    """Get network traffic data"""
    try:
        data = scanner.get_data()
        return jsonify({
            "inbound": data['stats'].get('bytesReceived', 0),
            "outbound": data['stats'].get('bytesSent', 0),
            "total": data['stats'].get('networkLoad', 0)
        })
    except Exception as e:
        logger.error(f"Error in traffic endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/blocked-ips')
def get_blocked_ips():
    """Get list of blocked IPs"""
    try:
        # For now, return empty list as blocking is not implemented yet
        return jsonify([])
    except Exception as e:
        logger.error("Error getting blocked IPs: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/active-connections')
def get_active_connections():
    """Get active network connections"""
    try:
        data = scanner.get_data()
        return jsonify({
            "total": data['stats'].get('activeConnections', 0),
            "connections": data.get('nodes', [])
        })
    except Exception as e:
        logger.error(f"Error in active connections endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/test')
def test():
    """Test endpoint"""
    return jsonify({
        "message": "Server is running!",
        "scanner_status": "running" if scanner._running else "stopped",
        "data_sample": scanner.get_data()
    })

@app.route('/api/network/nodes')
def get_network_nodes():
    """Get network nodes"""
    try:
        logger.debug("Network nodes endpoint called")
        # Get network data from scanner
        data = scanner.get_data()
        
        # Transform data into the format expected by frontend
        nodes = [
            {
                'id': '1',
                'name': 'AWS Cloud',
                'type': 'cloud',
                'status': 'active',
                'connections': 3,
            },
            {
                'id': '2',
                'name': 'Core Switch',
                'type': 'switch',
                'status': 'active',
                'connections': 5,
            },
            {
                'id': '3',
                'name': 'Web Server',
                'type': 'server',
                'status': 'active',
                'connections': 2,
            },
            {
                'id': '4',
                'name': 'DB Server',
                'type': 'server',
                'status': 'warning',
                'connections': 1,
            },
            {
                'id': '5',
                'name': 'Dev PC',
                'type': 'pc',
                'status': 'active',
                'connections': 2,
            },
            {
                'id': '6',
                'name': 'Admin PC',
                'type': 'pc',
                'status': 'active',
                'connections': 2,
            },
        ]
        
        return jsonify(nodes)
    except Exception as e:
        logger.error(f"Error in network nodes endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/network/connections')
def get_network_connections():
    """Get network connections"""
    try:
        logger.debug("Network connections endpoint called")
        # Get network data from scanner
        data = scanner.get_data()
        
        # Transform data into the format expected by frontend
        connections = [
            {
                'source': '1',
                'target': '2',
                'status': 'active',
                'bandwidth': 1000
            },
            {
                'source': '2',
                'target': '3',
                'status': 'active',
                'bandwidth': 1000
            },
            {
                'source': '2',
                'target': '4',
                'status': 'error',
                'bandwidth': 0
            },
            {
                'source': '2',
                'target': '5',
                'status': 'active',
                'bandwidth': 100
            },
            {
                'source': '2',
                'target': '6',
                'status': 'active',
                'bandwidth': 100
            }
        ]
        
        return jsonify(connections)
    except Exception as e:
        logger.error(f"Error in network connections endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/network/stats')
def get_network_stats():
    """Get detailed network statistics"""
    try:
        logger.debug("Network stats endpoint called")
        data = scanner.get_data()
        stats = data.get('stats', {})
        
        return jsonify({
            "overview": {
                "totalDevices": len(data.get('nodes', [])) + 1,  # +1 for router
                "activeConnections": stats.get('activeConnections', 0),
                "networkLoad": stats.get('networkLoad', 0),
                "status": "healthy"
            },
            "traffic": {
                "inbound": stats.get('bytesReceived', 0),
                "outbound": stats.get('bytesSent', 0),
                "total": stats.get('bytesReceived', 0) + stats.get('bytesSent', 0)
            },
            "security": {
                "threatsBlocked": 0,
                "suspiciousActivities": 0,
                "lastAttackAttempt": None
            },
            # "health": {
            #     "cpuUsage": 0,
            #     "memoryUsage": 0,
            #     "uptime": 0,
            #     "status": "operational"
            # }
        })
    except Exception as e:
        logger.error(f"Error in network stats endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route('/api/system/health')
def get_system_health():
    """Get system health information"""
    try:
        logger.debug("System health endpoint called")
        return jsonify({
            "status": "operational",
            "services": {
                "networkScanner": "running" if scanner._running else "stopped",
                "monitoring": "active",
                "protection": "active"
            },
            "resources": {
                "cpu": 0,
                "memory": 0,
                "disk": 0
            },
            "lastUpdate": int(time.time())
        })
    except Exception as e:
        logger.error(f"Error in system health endpoint: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# Initialize the scanner when the app starts
try:
    scanner.start()
    logger.info("Network scanner started successfully")
except Exception as e:
    logger.error(f"Failed to start network scanner: {str(e)}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)