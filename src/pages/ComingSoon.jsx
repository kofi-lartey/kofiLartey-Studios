import React from 'react';
import { FiArrowRight, FiInstagram, FiTwitter, FiCamera, FiZap } from 'react-icons/fi';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30 relative overflow-hidden">
      <NavBar />

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Added pt-28 to push content below the fixed NavBar */}
      <main className="flex-1 flex flex-col items-center justify-start md:justify-center px-6 pt-28 pb-20 relative z-10 text-center">
        
        {/* Content Container to ensure proper spacing */}
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 mb-8 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Arriving Summer 2026</span>
          </div>

          {/* Hero Section */}
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
            The Future of <br className="hidden md:block" /> Studio Workflow.
          </h1>
          
          <p className="max-w-[600px] text-gray-500 text-sm md:text-lg font-medium leading-relaxed mb-12">
            kofiLartey Studio is a professional-grade ecosystem designed to streamline gallery management, client proofing, and instant delivery.
            <span className="text-white block mt-2"> Built for photographers who value precision.</span>
          </p>

          {/* Waitlist Form */}
          <div className="w-full max-w-[450px] space-y-4 mb-20">
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email for early access"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-6 pr-32 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all backdrop-blur-md"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                Join Waitlist <FiArrowRight className="text-sm" />
              </button>
            </form>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
              Join 1,200+ photographers already in line.
            </p>
          </div>

          {/* Feature Teasers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] text-left hover:border-white/10 transition-colors group backdrop-blur-sm">
              <FiZap className="text-indigo-500 text-xl mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-bold mb-2 uppercase tracking-wider">Instant Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Lightning-fast cloud syncing for immediate client previews and final handovers.</p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] text-left hover:border-white/10 transition-colors group backdrop-blur-sm">
              <FiCamera className="text-indigo-500 text-xl mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-bold mb-2 uppercase tracking-wider">Smart Galleries</h3>
              <p className="text-xs text-gray-500 leading-relaxed">AI-powered culling and automated watermarking designed for studio aesthetics.</p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] text-left hover:border-white/10 transition-colors group backdrop-blur-sm">
              <FiInstagram className="text-indigo-500 text-xl mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-bold mb-2 uppercase tracking-wider">Client Experience</h3>
              <p className="text-xs text-gray-500 leading-relaxed">High-end portal for clients to select, favorite, and download their favorite captures.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;