import React, { useState } from 'react';
import { FiArrowRight, FiCode, FiDatabase, FiZap, FiMail } from 'react-icons/fi';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';
import Loader from '../components/Loader';

const APIDocumentation = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />
      
      <main className="pt-28 pb-20 px-6 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8">
              <FiCode className="text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">API Documentation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-tight">
              API Documentation
            </h1>
            
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Integrate kofiLartey Studio's powerful features directly into your workflow.
            </p>
          </div>

          <div className="space-y-8">
            {/* Coming Soon Card */}
            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[24px] text-center backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <FiZap className="text-indigo-500 text-4xl" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
                Our developer API is under active development. It will provide comprehensive endpoints for gallery management, client interactions, analytics, and more.
              </p>

              {/* Email Opt-in Form */}
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label htmlFor="email" className="sr-only">Email address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 min-w-[140px]"
                    >
                      {isLoading ? <Loader size={18} variant="dots" /> : <>Notify Me <FiArrowRight /></>}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-wider">
                    Be the first to know when our API launches
                  </p>
                </form>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-indigo-400 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="font-bold">Thanks! We'll notify you.</span>
                  </div>
                  <p className="text-gray-500 text-xs">We'll send you an email when the API documentation is available.</p>
                </div>
              )}
            </div>

            {/* Planned API Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] hover:border-white/10 transition-colors group">
                <FiDatabase className="text-indigo-500 text-2xl mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Gallery Management</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Create, update, and manage galleries programmatically with comprehensive CRUD operations.
                </p>
              </div>
              
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] hover:border-white/10 transition-colors group">
                <FiCode className="text-indigo-500 text-2xl mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Client Integration</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Automate client invitations, proofing workflows, and download permissions.
                </p>
              </div>
            </div>

            {/* Expected Endpoints Preview */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px]">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Planned Endpoints</h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="text-gray-600">GET<span className="text-indigo-400 mx-2">/api/v1/galleries</span><span className="text-gray-500">List all galleries</span></div>
                <div className="text-gray-600">POST<span className="text-indigo-400 mx-2">/api/v1/galleries</span><span className="text-gray-500">Create new gallery</span></div>
                <div className="text-gray-600">GET<span className="text-indigo-400 mx-2">/api/v1/clients</span><span className="text-gray-500">List clients</span></div>
                <div className="text-gray-600">POST<span className="text-indigo-400 mx-2">/api/v1/uploads</span><span className="text-gray-500">Direct file upload</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default APIDocumentation;