import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { post, get, del } from '../utils/apiCall';
import Loader from '../components/Loader';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const response = await get('/users/me');
      const userData = response?.data || response?.user || response;
      setUser(userData);
      setIsAuthenticated(true);
      setNeedsVerification(userData?.isVerified === false);
    } catch (error) {
      console.error('Session restore failed:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setNeedsVerification(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await post('/users/register', userData);
      const authData = response?.data || response;
      if (!authData?.token) {
        return response;
      }
      localStorage.setItem('authToken', authData.token);
      setUser(authData.user);
      setIsAuthenticated(true);
      setNeedsVerification(authData.user?.isVerified === false);
      return response;
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================================================
  // LOGIN - FIXED: Don't set authLoading on error without clearing
  // =========================================================

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await post('/users/login', {
        email,
        password
      });

      const authData = response?.data || response;

      if (!authData?.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('authToken', authData.token);
      setUser(authData.user);
      setIsAuthenticated(true);
      setNeedsVerification(authData.user?.isVerified === false);
      return authData;
    } catch (error) {
      // Clear any partial state on error
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setNeedsVerification(false);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const verifyOTP = async (otp, email) => {
    setAuthLoading(true);
    try {
      const response = await post('/users/verify-otp', {
        otp,
        email
      });
      const authData = response?.data || response;
      if (!authData?.token) {
        throw new Error('No token received');
      }
      localStorage.setItem('authToken', authData.token);
      setUser(authData.user);
      setIsAuthenticated(true);
      setNeedsVerification(false);
      return authData;
    } finally {
      setAuthLoading(false);
    }
  };

// =========================================================
   // LOGOUT
   // =========================================================

   const logout = async () => {
     try {
       await post('/users/sign-out');
     } catch (error) {
       console.error('Sign out error:', error);
     } finally {
       localStorage.removeItem('authToken');
       setUser(null);
       setIsAuthenticated(false);
       setNeedsVerification(false);
     }
   };

  const value = {
    user,
    isAuthenticated,
    needsVerification,
    isLoading: isInitializing,
    authLoading,
    register,
    login,
    verifyOTP,
    logout
  };

  // Only show loader on initial app load, not during auth actions
  if (isInitializing) {
    return <GlobalLoader />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const GlobalLoader = () => (
  <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center z-[9999]">
    <div className="text-center space-y-6">
      <Loader size={80} variant="default" />
      <p className="text-indigo-400 text-sm font-medium tracking-wider uppercase animate-pulse">
        Restoring Session
      </p>
    </div>
  </div>
);

export default AuthProvider;