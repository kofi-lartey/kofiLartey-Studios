import React, { createContext, useContext, useState, useEffect } from 'react';
import Loader from '../components/Loader';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for user on initial load
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      id: '1',
      email,
      name: 'Professional Photographer',
      verified: true,
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (userData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pendingUser = {
      ...userData,
      verified: false,
    };

    localStorage.setItem('pendingUser', JSON.stringify(pendingUser));
    setIsLoading(false);
    return { success: true, requiresVerification: true };
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');

    localStorage.setItem('isVerified', 'true');
    localStorage.setItem('verifiedEmail', pendingUser.email);
    localStorage.removeItem('pendingUser');

    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('pendingUser');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user?.verified,
    login,
    register,
    verifyOTP,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {children}
        {isLoading && (
          <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center z-[9999]">
            <div className="text-center space-y-6">
              <Loader size={80} variant="default" />
              <p className="text-indigo-400 text-sm font-medium tracking-wider uppercase animate-pulse">
                Authenticating
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;