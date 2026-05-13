import React, { useState } from 'react';
import { FiUser, FiCamera, FiMail, FiLock, FiShield, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';
import { post } from '../utils/apiCall';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    studioName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    if (!/[@$!%*?&]/.test(password)) errors.push('One special character (@$!%*?&)');
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await post('/users/register', {
        name: formData.name,
        studioName: formData.studioName,
        email: formData.email,
        password: formData.password,
      });

      console.log('Registration response:', response);

      if (response?.success) {
        // Store email for verification page
        localStorage.setItem('confirmEmail', formData.email);

        // If token is returned immediately, store it
        if (response?.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }

        navigate('/email-confirmation', { state: { email: formData.email } });
      } else {
        setErrorMsg(response?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      let message = 'Registration failed. ';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message === 'Network Error') {
        message = 'Network error – check CORS or backend availability.';
      } else if (err.response?.status === 404) {
        message = 'API endpoint not found. Check your connection.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = formData.password ? validatePassword(formData.password) : [];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">

          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">Join the Studio</h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">Unlock your professional creative dashboard.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Sterling"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Studio Name */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Studio Name</label>
              <div className="relative group">
                <FiCamera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input
                  type="text"
                  name="studioName"
                  value={formData.studioName}
                  onChange={handleChange}
                  placeholder="Sterling Visions"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@studio.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Password with Toggle */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-sm" />
                  ) : (
                    <FiEye className="text-sm" />
                  )}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              {formData.password && (
                <div className="mt-2 p-2.5 bg-white/[0.02] rounded-lg border border-white/5">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-gray-500 mb-2">Password Requirements</p>
                  <div className="space-y-1">
                    {[
                      { text: 'At least 8 characters', met: formData.password.length >= 8 },
                      { text: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
                      { text: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
                      { text: 'One number', met: /\d/.test(formData.password) },
                      { text: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(formData.password) }
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-[10px]">
                        {req.met ? (
                          <FiCheckCircle className="text-green-500 text-[10px] flex-shrink-0" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full border border-gray-600 flex-shrink-0" />
                        )}
                        <span className={req.met ? 'text-green-400' : 'text-gray-600'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading || passwordErrors.length > 0} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Professional Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-[11px] text-gray-600">
            Already have an account? <a href="/login" className="text-white font-bold hover:text-indigo-400 transition-colors">Log in</a>
          </p>

          <div className="flex justify-center items-center gap-5 mt-6 pt-5 border-t border-white/5">
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

export default Registration;