import React from 'react';
import { FiDownload, FiMail, FiGlobe, FiCamera, FiExternalLink } from 'react-icons/fi';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';

const PressKit = () => {
  const brandColors = [
    { name: 'Brand Indigo', hex: '#4F46E5', rgb: '79, 70, 229' },
    { name: 'Dark Background', hex: '#050505', rgb: '5, 5, 5' },
    { name: 'Light Gray', hex: '#9CA3AF', rgb: '156, 163, 175' },
    { name: 'White', hex: '#FFFFFF', rgb: '255, 255, 255' },
  ];

  const downloadAsset = (asset) => {
    // In production, these would be actual file paths
    console.log(`Downloading: ${asset.name}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-urbanist text-white selection:bg-indigo-500/30">
      <NavBar />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8">
              <FiCamera className="text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Press Resources</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Press Kit
            </h1>
            
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Brand assets, product imagery, and media resources for press and partnership inquiries.
            </p>
          </header>

          {/* About Section */}
          <section className="mb-16 p-8 bg-white/[0.02] border border-white/5 rounded-[24px]">
            <h2 className="text-2xl font-bold text-white mb-4">About kofiLartey Studio</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              kofiLartey Studio is a professional-grade platform designed for photographers who value precision and efficiency. Our cloud-based solution streamlines gallery management, client proofing, and instant delivery, built for studios that demand the highest quality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Founded</h3>
                <p className="text-white">2024</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</h3>
                <p className="text-white">Global (Remote)</p>
              </div>
            </div>
          </section>

          {/* Logo Assets */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Logo Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Primary Logo (Dark Background)', file: 'logo-dark.png', size: '2.4 MB' },
                { name: 'Primary Logo (Light Background)', file: 'logo-light.png', size: '2.1 MB' },
                { name: 'Icon Only', file: 'logo-icon.png', size: '856 KB' },
                { name: 'Wordmark', file: 'logo-wordmark.png', size: '1.2 MB' },
              ].map((asset) => (
                <div key={asset.name} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white">{asset.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{asset.file} • {asset.size}</p>
                    </div>
                    <FiDownload className="text-gray-500" />
                  </div>
                  <div className="h-32 bg-white/[0.03] rounded-xl border border-white/5 flex items-center justify-center mb-4">
                    <span className="text-gray-600 text-xs">Logo Preview</span>
                  </div>
                  <button 
                    onClick={() => downloadAsset(asset)}
                    className="w-full py-2 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Download PNG
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Brand Colors */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Brand Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brandColors.map((color) => (
                <div key={color.name} className="text-center">
                  <div 
                    className="w-full h-24 rounded-xl mb-3 border border-white/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h3 className="text-xs font-bold text-white">{color.name}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{color.hex}</p>
                  <p className="text-[10px] text-gray-600">rgb({color.rgb})</p>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Typography</h2>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px]">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Font</h3>
                <p className="text-4xl font-bold text-white">Inter / Urbanist</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our brand uses Inter for UI elements and Urbanist for headings and display text. Both are clean, modern sans-serif typefaces optimized for digital experiences.
              </p>
            </div>
          </section>

          {/* Media Contact */}
          <section className="mb-16">
            <h2 className="text-xl font-bold text-white mb-6">Media Contact</h2>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px]">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center">
                  <FiMail className="text-indigo-500 text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Press Inquiries</h3>
                  <p className="text-gray-400">kofilartey12@gmail.com</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a 
                  href="mailto:kofilartey12@gmail.com" 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <FiMail size={16} />
                  <span>Email Press Team</span>
                </a>
                <a 
                  href="https://kofilartey.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <FiGlobe size={16} />
                  <span>Visit Website</span>
                  <FiExternalLink size={12} />
                </a>
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Social Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Twitter', handle: '@kofiLarteyStudio' },
                { name: 'Instagram', handle: '@kofiLarteyStudio' },
                { name: 'LinkedIn', handle: 'kofiLartey Studio' },
                { name: 'GitHub', handle: 'kofiLartey' },
              ].map((social) => (
                <div key={social.name} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                  <h3 className="font-bold text-white">{social.name}</h3>
                  <p className="text-[10px] text-gray-500">{social.handle}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PressKit;