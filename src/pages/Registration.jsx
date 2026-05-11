import React, { useState } from 'react';
import { FiUser, FiCamera, FiMail, FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    studio: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pendingUser = {
      name: formData.name,
      studio: formData.studio,
      email: formData.email,
      password: formData.password,
      verified: false,
    };
    localStorage.setItem('pendingUser', JSON.stringify(pendingUser));
    localStorage.setItem('confirmEmail', formData.email);
    navigate('/email-confirmation');
  };

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

          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Studio Name</label>
              <div className="relative group">
                <FiCamera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input 
                  type="text" 
                  name="studio"
                  value={formData.studio}
                  onChange={handleChange}
                  placeholder="Sterling Visions"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

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

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-500 ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors text-sm" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] mt-2">
              Create Professional Account
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