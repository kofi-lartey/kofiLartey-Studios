import React, { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiArrowLeft, 
  FiClock, 
  FiCheckCircle, 
  FiShield, 
  FiCopy, 
  FiArrowRight 
} from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const TEST_OTP = '123456';

const EmailConfirmation = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isVerified]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('confirmEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setEmail('kofiLartey.y12@gmail.com');
    }
  }, []);

  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, navigate]);

  const handleChange = (index, value) => {
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
    
    const lastFilledIndex = Math.min(digits.length, 5);
    const nextInput = document.getElementById(`otp-${lastFilledIndex}`);
    if (nextInput) nextInput.focus();
  };

  const copyTestOTP = () => {
    navigator.clipboard.writeText(TEST_OTP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResendCode = () => {
    if (resendDisabled) return;
    
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
    
    setTimeLeft(300);
    console.log('Resending OTP to:', email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    if (enteredOtp === TEST_OTP) {
      try {
        setIsVerified(true);
        localStorage.removeItem('confirmEmail');
      } catch (err) {
        setError('Verification failed. Please try again.');
      }
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [otp]);

  if (isVerified) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-[420px] mx-auto bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                <FiCheckCircle className="text-green-500 text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-green-400">Verified Successfully!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Your email has been verified. Redirecting to login...
            </p>
            <Link to="/login" className="inline-block w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm transition-all">
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-[420px] mx-auto">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 md:p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-indigo-600/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <FiMail className="text-indigo-500 text-2xl" />
              </div>
            </div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-500 text-sm">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-white font-medium text-sm mt-1">
                {email}
              </p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-xl">
                <p className="text-xs text-red-400 font-medium text-center">{error}</p>
              </div>
            )}
            
            {/* Test OTP Helper */}
            <div className="mb-6 p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    TEST VERIFICATION CODE
                  </p>
                  <p className="text-lg font-mono font-bold text-indigo-400">{TEST_OTP}</p>
                </div>
                <button 
                  onClick={copyTestOTP} 
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  {copied ? <FiCheckCircle size={14} /> : <FiCopy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                {/* OTP Inputs */}
                <div className="grid grid-cols-6 gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      value={digit}
                      maxLength="1"
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl text-center text-lg font-bold focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                
                {/* Timer and Resend */}
                <div className="flex justify-between items-center px-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                    <FiClock className="text-indigo-500" /> 
                    EXPIRES IN {formatTime(timeLeft)}
                  </span>
                  <button 
                    type="button" 
                    onClick={handleResendCode}
                    disabled={resendDisabled}
                    className={`text-[10px] font-medium uppercase tracking-wide transition-colors ${
                      resendDisabled 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-indigo-500 hover:text-indigo-400'
                    }`}
                  >
                    {resendDisabled ? `RESEND IN ${resendCountdown}s` : 'RESEND CODE'}
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.99]"
              >
                Verify Account
              </button>
            </form>
            
            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors uppercase tracking-wide">
                <FiArrowLeft className="text-xs" /> Back to Login
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-medium text-gray-600">
                  <FiShield className="text-indigo-500 text-[10px]" /> Secure SSL
                </div>
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-medium text-gray-600">
                  <FiCheckCircle className="text-indigo-500 text-[10px]" /> System Operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmailConfirmation;