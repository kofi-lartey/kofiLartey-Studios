import React, { useState } from 'react';
import { FiLock, FiShield, FiArrowLeft, FiClock, FiMail, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { post } from '../utils/apiCall';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const ForgotPassword = () => {
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Timer for OTP expiration
  React.useEffect(() => {
    if (step === 'reset' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\s/g, '').slice(0, 6);
    const digits = pasted.split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6 && /^\d$/.test(digit)) {
        newOtp[i] = digit;
      }
    });
    setOtp(newOtp);
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await post('/users/forgot-password', { email });
      
      if (response.success) {
        setSuccess('Verification code sent to your email!');
        setStep('reset');
        setTimeLeft(300);
        
        // Start resend cooldown
        setResendDisabled(true);
        setResendCountdown(60);
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to send verification code');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send verification code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendDisabled) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await post('/users/forgot-password', { email });
      
      if (response.success) {
        setSuccess('New verification code sent!');
        setTimeLeft(300);
        
        setResendDisabled(true);
        setResendCountdown(60);
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to resend code');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }
    
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await post('/users/reset-password', {
        email,
        otp: enteredOtp,
        newPassword
      });
      
      if (response.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset password';
      setError(msg);
      setOtp(['', '', '', '', '', '']); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request Email Form
  if (step === 'request') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
        <NavBar />

        <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
            <a href="/login" className="inline-flex items-center gap-2 text-[9px] font-bold text-gray-600 hover:text-indigo-400 transition-colors mb-6 uppercase tracking-widest">
              <FiArrowLeft /> Back to Login
            </a>

            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">Forgot Password?</h1>
              <p className="text-gray-500 text-[11px] font-medium tracking-wide">Enter your email to receive a verification code.</p>
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

            <form onSubmit={handleRequestOTP} className="space-y-5">
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
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Step 2: Reset Password with OTP
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <a href="/login" className="inline-flex items-center gap-2 text-[9px] font-bold text-gray-600 hover:text-indigo-400 transition-colors mb-6 uppercase tracking-widest">
            <FiArrowLeft /> Back to Login
          </a>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">Reset Password</h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">Enter the code sent to {email}</p>
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

          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Verification Code</label>
              <div className="grid grid-cols-6 gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-lg text-center text-sm font-bold focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center px-1 pt-1">
                <span className="flex items-center gap-1 text-[9px] font-bold text-gray-700 uppercase">
                  <FiClock className="text-indigo-500" /> {formatTime(timeLeft)}
                </span>
                <button 
                  type="button" 
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                  className={`text-[9px] font-bold uppercase tracking-tighter transition-colors ${
                    resendDisabled ? 'text-gray-600 cursor-not-allowed' : 'text-indigo-500 hover:text-indigo-400'
                  }`}
                >
                  {resendDisabled ? `RESEND IN ${resendCountdown}s` : 'RESEND CODE'}
                </button>
              </div>
            </div>

            {/* Password Inputs */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">New Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Confirm New Password</label>
                <div className="relative group">
                  <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;