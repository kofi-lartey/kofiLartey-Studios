import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginMockAdmin } from './utils/mockAdminAuth';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      loginMockAdmin(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (window.localStorage.getItem('mockAdminSession')) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-blue-500/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[430px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-300 mb-4">
              <FiShield size={24} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-400 mb-2">Frontend Mock Admin</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">Admin Access</h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">
              Use the local test credentials to preview the admin dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl">
              <p className="text-xs text-red-300 font-medium text-center">{error}</p>
            </div>
          )}

          <div className="mb-5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest font-bold text-blue-300 mb-1">Test Credentials</p>
            <p className="text-xs text-gray-400 break-all">Email: kofilartey12@gmail.com</p>
            <p className="text-xs text-gray-400">Password: 1234567890</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kofilartey12@gmail.com"
                  required
                  disabled={isLoading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500">Password</label>
                <Link
                  to="/admin"
                  className="text-[9px] font-bold text-blue-400 hover:text-blue-300 transition-colors tracking-wide"
                >
                  Dashboard
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors text-sm" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  required
                  disabled={isLoading}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 pl-10 pr-12 text-xs focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-400 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-lg font-bold text-xs transition-all shadow-lg shadow-blue-600/10 active:scale-[0.99] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Admin'}
            </button>
          </form>

          <p className="text-center mt-8 text-[11px] text-gray-600">
            <Link to="/" className="text-white font-bold hover:text-blue-400 transition-colors">Back to Studio</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
