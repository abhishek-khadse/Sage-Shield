import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent

# Model configuration
MODEL_CONFIG = {
    'MODEL_PATH': os.path.join(BASE_DIR, 'model', 'RFC_spyder_Classifier.joblib'),
    'REQUIRED_FEATURES': [
        # Add your feature names here in the exact order expected by the model
        # Example: 'feature1', 'feature2', 'feature3', ...
    ]
}

# Application configuration
class Config:
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    
    # API Settings
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Model configuration
    MODEL_CONFIG = MODEL_CONFIG

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    TESTING = True

class ProductionConfig(Config):
    DEBUG = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
