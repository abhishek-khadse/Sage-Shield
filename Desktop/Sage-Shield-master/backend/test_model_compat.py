#!/usr/bin/env python3
"""
Test script to verify model compatibility with scikit-learn 1.2.2
"""
import sys
import joblib
import numpy as np
from pathlib import Path

def test_model_loading():
    """Test if the model loads correctly with the compatible scikit-learn version."""
    print("\n=== Testing Model Loading with scikit-learn 1.2.2 ===")
    
    # Path to the model
    model_path = Path("model/RFC_spyder_Classifier.joblib")
    
    if not model_path.exists():
        print(f"❌ Model file not found at {model_path}")
        return False
    
    try:
        print(f"Loading model from {model_path}...")
        model = joblib.load(model_path)
        
        # Print model information
        print("✅ Model loaded successfully!")
        print(f"Model type: {type(model).__name__}")
        
        # Check feature names if available
        if hasattr(model, 'feature_names_in_'):
            print(f"\nModel expects {len(model.feature_names_in_)} features:")
            for i, name in enumerate(model.feature_names_in_):
                print(f"  {i+1}. {name}")
        
        # Try making a prediction with dummy data
        print("\nTesting prediction with dummy data...")
        if hasattr(model, 'n_features_in_'):
            n_features = model.n_features_in_
            dummy_input = np.zeros((1, n_features))  # Create dummy input with zeros
            
            try:
                prediction = model.predict(dummy_input)
                proba = model.predict_proba(dummy_input)
                
                print(f"✅ Prediction successful!")
                print(f"   Predicted class: {prediction[0]}")
                print(f"   Class probabilities: {proba[0]}")
                return True
                
            except Exception as e:
                print(f"❌ Prediction failed: {str(e)}")
                return False
        else:
            print("⚠️ Could not determine number of features for prediction test")
            return True
            
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Model Compatibility with scikit-learn 1.2.2")
    print("=" * 60)
    
    # Check scikit-learn version
    try:
        import sklearn
        print(f"scikit-learn version: {sklearn.__version__}")
        if sklearn.__version__ != '1.2.2':
            print("⚠️ Warning: scikit-learn version is not 1.2.2. Results may be unexpected.")
    except ImportError:
        print("❌ scikit-learn is not installed")
        sys.exit(1)
    
    # Run the test
    success = test_model_loading()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ All tests passed! The model is compatible with this environment.")
    else:
        print("❌ Some tests failed. Please check the error messages above.")
    
    sys.exit(0 if success else 1)
