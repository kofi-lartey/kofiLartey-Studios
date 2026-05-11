
import { FiShare2, FiLock, FiDownload, FiCheckCircle } from "react-icons/fi";
import NavBar from "../componets/NavBar";
import Hero from "../componets/Hero";
import Footer from "../componets/Footer";

const features = [
  { icon: <FiShare2 />, title: "Secure Sharing", desc: "Encrypted delivery channels ensure your client's most precious moments stay private." },
  { icon: <FiLock />, title: "Key Protection", desc: "One-time use access keys and time-limited links for ultimate control over gallery access." },
  { icon: <FiDownload />, title: "High Res Assets", desc: "Full resolution downloads with automated compression options for mobile viewing." },
  { icon: <FiCheckCircle />, title: "Watermark Pro", desc: "Intelligent watermark placement that protects your work without compromising aesthetics." },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <NavBar />
      <Hero />

      {/* Features Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Precision Workflow</h2>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2">Designed for the Modern Artisan</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Portfolio Showcase</h2>
            <p className="text-gray-500 mt-2">The signature aesthetic for premium photographers.</p>
          </div>
          <button className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:text-indigo-400 transition-colors">
            Explore All Galleries <span>→</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" className="rounded-xl aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500 border border-white/10" />
          <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80" className="rounded-xl aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-500 border border-white/10" />
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" className="rounded-xl aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-500 border border-white/10" />
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80" className="rounded-xl aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500 border border-white/10" />
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default HomePage;