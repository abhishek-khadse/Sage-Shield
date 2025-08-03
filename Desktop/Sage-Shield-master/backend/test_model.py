#!/usr/bin/env python3
"""
Test script for SageShield backend model and API.
"""
import sys
import json
import requests
import numpy as np
from pathlib import Path
import joblib
from app import create_app
from app.models.predictor import load_model, predict

def test_model_loading():
    """Test if the model loads correctly."""
    print("\n=== Testing Model Loading ===")
    try:
        model = load_model()
        if model is not None:
            print("✅ Model loaded successfully")
            return True
        else:
            print("❌ Failed to load model: Model is None")
            return False
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return False

def test_prediction():
    """Test making a prediction with the model."""
    print("\n=== Testing Model Prediction ===")
    try:
        # Create a sample input (adjust based on your model's expected input)
        # This is a placeholder - you'll need to adjust the features to match your model
        sample_features = [0] * 20  # Adjust the number of features as needed
        
        result = predict(sample_features)
        
        if result and 'prediction' in result and 'confidence' in result:
            print(f"✅ Prediction successful")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']:.4f}")
            return True
        else:
            print("❌ Prediction failed: Invalid result format")
            return False
            
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return False

def test_api_endpoints(base_url='http://127.0.0.1:5000'):
    """Test the API endpoints."""
    print("\n=== Testing API Endpoints ===")
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Health check endpoint: OK")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        return False
    
    # Test model info
    try:
        response = requests.get(f"{base_url}/api/model/info")
        data = response.json()
        print(f"✅ Model info: {data.get('status', 'unknown')}")
        if 'features' in data:
            print(f"   Features: {len(data['features'])} features")
    except Exception as e:
        print(f"❌ Model info error: {str(e)}")
        return False
    
    # Test prediction endpoint
    try:
        # Create a sample input (adjust based on your model's expected input)
        sample_features = [0] * 20  # Adjust the number of features as needed
        
        response = requests.post(
            f"{base_url}/api/predict",
            json={"features": sample_features},
            headers={"Content-Type": "application/json"}
        )
        
        data = response.json()
        if response.status_code == 200 and 'prediction' in data:
            print("✅ Prediction endpoint: OK")
            print(f"   Prediction: {data['prediction']}")
            print(f"   Confidence: {data['confidence']:.4f}")
        else:
            print(f"❌ Prediction failed: {response.status_code} - {data.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction endpoint error: {str(e)}")
        return False
    
    return True

def run_tests():
    """Run all tests."""
    print("🚀 Starting SageShield Backend Tests")
    print("=" * 50)
    
    # Create a test app context
    app = create_app()
    
    with app.app_context():
        # Test model loading
        model_loaded = test_model_loading()
        
        # Test prediction
        prediction_ok = test_prediction()
        
        # Test API endpoints
        print("\nStarting test server...")
        from threading import Thread
        import time
        
        # Start the Flask app in a separate thread
        def run_app():
            app.run(port=5000, use_reloader=False)
            
        server = Thread(target=run_app)
        server.daemon = True
        server.start()
        
        # Give the server a moment to start
        time.sleep(2)
        
        # Test API endpoints
        api_ok = test_api_endpoints()
        
        print("\n" + "=" * 50)
        print("Test Results:")
        print(f"✅ Model Loading: {'PASSED' if model_loaded else '❌ FAILED'}")
        print(f"✅ Prediction: {'PASSED' if prediction_ok else '❌ FAILED'}")
        print(f"✅ API Endpoints: {'PASSED' if api_ok else '❌ FAILED'}")
        
        return all([model_loaded, prediction_ok, api_ok])

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
