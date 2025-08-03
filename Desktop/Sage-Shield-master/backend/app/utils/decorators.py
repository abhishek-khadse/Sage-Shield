from functools import wraps
from flask import request, jsonify


def validate_json(f):
    """
    Decorator to validate that the request contains valid JSON
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Content-Type must be application/json'
            }), 400
        return f(*args, **kwargs)
    return decorated_function


def require_api_key(api_key_header='X-API-Key'):
    """
    Decorator to require an API key for specific endpoints
    NOTE: This is a placeholder. In production, implement proper API key validation.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # In a real application, validate the API key here
            # For now, we'll just check if the header exists
            if api_key_header not in request.headers:
                return jsonify({
                    'status': 'error',
                    'message': 'API key is required'
                }), 401
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def handle_errors(f):
    """
    Decorator to handle exceptions and return appropriate JSON responses
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': 'An unexpected error occurred',
                'details': str(e)
            }), 500
    return decorated_function
