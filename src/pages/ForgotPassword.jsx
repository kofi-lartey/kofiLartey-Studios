import React from 'react';
import { FiLock, FiShield, FiArrowLeft, FiClock } from 'react-icons/fi';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Compact Reset Card */}
        <div className="w-full max-w-[400px] bg-[#0A0A0A] border border-white/5 rounded-[20px] p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          
          <a href="/login" className="inline-flex items-center gap-2 text-[9px] font-bold text-gray-600 hover:text-indigo-400 transition-colors mb-6 uppercase tracking-widest">
            <FiArrowLeft /> Back to Login
          </a>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">Reset Password</h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">Enter the code sent to your email to continue.</p>
          </div>

          <form className="space-y-5">
            {/* 6-Digit Code Section */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Verification Code</label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    className="w-full h-10 bg-white/[0.03] border border-white/10 rounded-lg text-center text-sm font-bold focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center px-1 pt-1">
                <span className="flex items-center gap-1 text-[9px] font-bold text-gray-700 uppercase">
                  <FiClock className="text-indigo-500" /> 02:45
                </span>
                <button type="button" className="text-[9px] font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-tighter">Resend Code</button>
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
                    placeholder="••••••••"
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
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] mt-2">
              Update Password
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;