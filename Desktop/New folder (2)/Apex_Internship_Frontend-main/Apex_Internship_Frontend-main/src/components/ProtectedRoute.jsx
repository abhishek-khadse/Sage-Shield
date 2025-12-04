import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Wrapper
 * NOW A PURE COMPONENT: No side effects, no API calls.
 * It trusts the Parent (App.jsx) to handle the validation.
 */
const ProtectedRoute = ({ 
  isAuthenticated, 
  redirectPath = '/login', 
  children,
  user, // Accepted to check roles if needed later
  requiredRoles = [] 
}) => {
  const location = useLocation();

  // 1. Check Authentication
  if (!isAuthenticated) {
    // Redirect to login, saving the location they tried to access
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // 2. Check Roles (Optional - simplistic implementation)
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles?.includes(role) || user.role === role
    );
    
    if (!hasRequiredRole) {
      // User is logged in but doesn't have permission. 
      // Redirect to home or a "403 Unauthorized" page.
      return <Navigate to="/" replace />;
    }
  }

  // 3. Render Content
  return children ? children : <Outlet />;
};

export default ProtectedRoute;