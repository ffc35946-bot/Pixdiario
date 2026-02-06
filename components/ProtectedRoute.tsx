
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // After login/register, if user hasn't set PIX key, redirect them
  if (!currentUser?.pixKey && location.pathname !== '/add-pix') {
      return <Navigate to="/add-pix" replace />;
  }
  
  // If user has set PIX key but is trying to access add-pix again, redirect to home
  if(currentUser?.pixKey && location.pathname === '/add-pix') {
      return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;
