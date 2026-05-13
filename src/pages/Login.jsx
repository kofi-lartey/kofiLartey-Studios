import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiShield, FiCheckCircle, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isVerified, setIsVerified] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); // Local loading state
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading, isLoading } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const verified = localStorage.getItem('isVerified');
    const verifiedEmail = localStorage.getItem('verifiedEmail');
    if (verified && verifiedEmail) {
      setFormData(prev => ({ ...prev, email: verifiedEmail }));
      setIsVerified(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localLoading || authLoading) return;

    setLocalLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      localStorage.removeItem('isVerified');
      localStorage.removeItem('verifiedEmail');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';

      // Check if error indicates email not verified
      const errorMsg = msg.toLowerCase();
      if (errorMsg.includes('verify') ||
        errorMsg.includes('confirmed') ||
        errorMsg.includes('not verified') ||
        err.response?.data?.nextStep === 'verify-email') {
        // Redirect to resend verification page
        navigate('/resend-verification', { state: { email: formData.email } });
      } else {
        setError(msg);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  // Don't show the form while restoring session (prevents flicker)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">

        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">

          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-500 mb-2">kofiLartey Studio</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">Welcome Back</h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">Enter your credentials to access your workspace.</p>
          </div>

          {isVerified && (
            <div className="mb-6 p-3 bg-green-600/10 border border-green-500/30 rounded-xl flex items-center gap-2">
              <FiCheck className="text-green-500" />
              <span className="text-[10px] text-green-400 font-bold">Email Verified - Please Log In</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl">
              <p className="text-xs text-red-400 font-medium text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@studio.com"
                  required
                  disabled={localLoading || authLoading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[9px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors tracking-wide"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={localLoading || authLoading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 pl-10 pr-12 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={localLoading || authLoading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-500 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={localLoading || authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {localLoading || authLoading ? 'Signing In...' : 'Sign In to Workspace'}
            </button>
          </form>

          <p className="text-center mt-8 text-[11px] text-gray-600">
            Don't have an account? <Link to="/register" className="text-white font-bold hover:text-indigo-400 transition-colors">Create an account</Link>
          </p>

          <div className="flex justify-center items-center gap-5 mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-black text-gray-600">
              <FiShield className="text-indigo-500 text-[10px]" /> SECURE
            </div>
            <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-black text-gray-600">
              <FiCheckCircle className="text-indigo-500 text-[10px]" /> PRO CHOICE
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;