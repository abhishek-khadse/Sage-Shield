from flask import jsonify

def success_response(data=None, message=None, status_code=200):
    """
    Create a standardized success response
    
    Args:
        data: The data to include in the response
        message: Optional success message
        status_code: HTTP status code (default: 200)
        
    Returns:
        Flask response with JSON data
    """
    response = {
        'status': 'success',
        'data': data if data is not None else {}
    }
    
    if message:
        response['message'] = message
        
    return jsonify(response), status_code

def error_response(message, status_code=400, details=None):
    """
    Create a standardized error response
    
    Args:
        message: Error message
        status_code: HTTP status code (default: 400)
        details: Additional error details
        
    Returns:
        Flask response with error details
    """
    response = {
        'status': 'error',
        'message': message
    }
    
    if details:
        response['details'] = details
        
    return jsonify(response), status_code
