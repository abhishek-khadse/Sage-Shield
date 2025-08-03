from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from pathlib import Path
import os
import random
import time
import psutil
import platform
import socket
from datetime import datetime, timedelta
import json
import threading
from collections import deque

# Global variables
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
startup_time = time.time()
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
                current_net_io = psutil.net_io_counters()
                current_time = time.time()
                time_diff = current_time - self.last_time
                
                if time_diff > 0:
                    # Update network stats
                    global network_stats
                    network_stats = {
                        'bytes_sent': current_net_io.bytes_sent,
                        'bytes_recv': current_net_io.bytes_recv,
                        'packets_sent': current_net_io.packets_sent,
                        'packets_recv': current_net_io.packets_recv,
                        'error_in': current_net_io.errin,
                        'error_out': current_net_io.errout,
                        'drop_in': current_net_io.dropin,
                        'drop_out': current_net_io.dropout
                    }
                    
                    # Update traffic history
                    now = datetime.utcnow().isoformat()
                    traffic_history['timestamps'].append(now)
                    traffic_history['bytes_sent'].append(current_net_io.bytes_sent)
                    traffic_history['bytes_recv'].append(current_net_io.bytes_recv)
                    traffic_history['packets_sent'].append(current_net_io.packets_sent)
                    traffic_history['packets_recv'].append(current_net_io.packets_recv)
                    
                    self.last_net_io = current_net_io
                    self.last_time = current_time
                
                time.sleep(1)  # Update every second
            except Exception as e:
                print(f"Error in network monitor: {e}")
                time.sleep(5)  # Wait before retrying

# Create and start the network monitor
network_monitor = NetworkMonitor()

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_pyfile('config.py')
    
    # Initialize extensions
    CORS(app)
    
    # Start network monitor
    if not network_monitor.is_alive():
        network_monitor.start()
    
    # Register blueprints
    from .routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Initialize model
    with app.app_context():
        from .models.predictor import init_model
        init_model()
    
    # Simple route for health check
    @app.route('/')
    def health_check():
        return {
            'status': 'healthy',
            'service': 'SageShield Backend',
            'version': '1.0.0'
        }
    
    return app
