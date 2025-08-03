import joblib
import numpy as np
from pathlib import Path
import os
from flask import current_app

# Global model variable
model = None
feature_names = None

class ModelLoadError(Exception):
    """Custom exception for model loading errors"""
    pass

def load_model():
    """Load the machine learning model"""
    global model, feature_names
    
    if model is None:
        try:
            model_path = current_app.config['MODEL_CONFIG']['MODEL_PATH']
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")
                
            model = joblib.load(model_path)
            
            # Get feature names if available
            if hasattr(model, 'feature_names_in_'):
                feature_names = list(model.feature_names_in_)
            
            current_app.logger.info("Model loaded successfully")
            return model
            
        except Exception as e:
            current_app.logger.error(f"Error loading model: {str(e)}")
            raise ModelLoadError(f"Failed to load model: {str(e)}")
    
    return model

def predict(features):
    """
    Make a prediction using the loaded model
    
    Args:
        features: List or dict of feature values
        
    Returns:
        dict: Prediction result with class and confidence
    """
    try:
        model = load_model()
        
        # Convert dict to list if needed
        if isinstance(features, dict):
            if not feature_names:
                raise ValueError("Feature names not available for dictionary input")
            features = [features.get(feature, 0) for feature in feature_names]
        
        # Convert to numpy array and ensure correct shape
        features_array = np.array(features, dtype=np.float32).reshape(1, -1)
        
        # Make prediction
        prediction = int(model.predict(features_array)[0])
        proba = model.predict_proba(features_array)[0]
        confidence = float(proba[prediction])
        
        # Ensure prediction is binary (0 or 1)
        prediction = 1 if prediction > 0 else 0
        
        return {
            'prediction': prediction,
            'confidence': confidence,
            'status': 'success'
        }
        
    except Exception as e:
        current_app.logger.error(f"Prediction error: {str(e)}")
        raise

def init_model():
    """Initialize the model when the app starts"""
    try:
        load_model()
        return True
    except Exception as e:
        current_app.logger.error(f"Failed to initialize model: {str(e)}")
        return False
