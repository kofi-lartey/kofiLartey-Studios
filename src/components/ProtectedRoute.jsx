import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, redirectTo = '/register' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader size={64} variant="default" />
          <div className="absolute inset-0 blur-2xl bg-indigo-500/20 rounded-full animate-pulse" />
        </div>
        <p className="text-gray-500 text-sm tracking-wider animate-pulse">Verifying access</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;