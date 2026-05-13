import React, { useState, useEffect } from 'react';
import { FiMail, FiArrowLeft, FiCheckCircle, FiShield, FiClock, FiSend } from 'react-icons/fi';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { post } from '../utils/apiCall';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state if coming from login
  useEffect(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    }
  }, [location.state]);

  // Handle resend OTP request
  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // ✅ Use the correct resend-otp endpoint
      const response = await post('/users/resend-otp', { email });
      
      if (response.success) {
        setSuccess('Verification code sent to your email! Redirecting...');
        
        // Store email in localStorage for the confirmation page
        localStorage.setItem('confirmEmail', email);
        
        // Redirect to email confirmation page after 1.5 seconds
        setTimeout(() => {
          navigate('/email-confirmation', { state: { email: email } });
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to send verification code');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send verification code. Please make sure you have registered.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-[9px] font-bold text-gray-600 hover:text-indigo-400 transition-colors mb-6 uppercase tracking-widest">
            <FiArrowLeft /> Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-yellow-500 text-2xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-2">Resend Verification Code</h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">
              Your email hasn't been verified yet. Enter your email to receive a new verification code.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl">
              <p className="text-xs text-red-400 font-medium text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-600/20 border border-green-500/30 rounded-xl">
              <p className="text-xs text-green-400 font-medium text-center">{success}</p>
            </div>
          )}

          <form onSubmit={handleResendOTP} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-6 pt-4 text-center">
            <p className="text-[10px] text-gray-600">
              Already verified? <Link to="/login" className="text-indigo-500 hover:text-indigo-400">Login here</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResendVerification;