import numpy as np
from typing import List, Union, Dict, Any

def preprocess_features(features: Union[List[float], Dict[str, float]]) -> List[float]:
    """
    Preprocess input features for the model.
    
    Args:
        features: Either a list of feature values or a dictionary mapping feature names to values
        
    Returns:
        List of preprocessed feature values in the correct order
        
    Example:
        # List input
        features = [1.0, 2.0, 3.0, ...]
        preprocessed = preprocess_features(features)
        
        # Dict input
        features = {"feature1": 1.0, "feature2": 2.0, ...}
        preprocessed = preprocess_features(features)
    """
    # If features is a dictionary, convert to list in the correct order
    if isinstance(features, dict):
        # Define the expected feature order (update this based on your model's requirements)
        feature_order = [
            # Add your feature names in the correct order here
            # Example: 'feature1', 'feature2', 'feature3', ...
        ]
        
        # Convert dict to list in the correct order
        try:
            processed = [float(features[feat]) for feat in feature_order]
        except KeyError as e:
            raise ValueError(f"Missing feature in input: {e}")
    else:
        # If features is already a list, just ensure it's a list of floats
        processed = [float(x) for x in features]
    
    # Add any additional preprocessing steps here
    # For example, normalization, scaling, etc.
    
    return processed

def validate_features(features: List[float]) -> bool:
    """
    Validate that the features meet the expected requirements.
    
    Args:
        features: List of feature values
        
    Returns:
        bool: True if features are valid, False otherwise
    """
    # Add your validation logic here
    # For example, check for None values, NaNs, or value ranges
    
    if not features:
        return False
    
    if any(not isinstance(x, (int, float)) or np.isnan(x) for x in features):
        return False
    
    return True
