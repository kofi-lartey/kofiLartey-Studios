import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Deliver Client <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-400">
            Galleries Beautifully
          </span>
        </h1>
        <p className="mt-6 text-gray-400 text-lg max-w-md leading-relaxed">
          Upload finished photos, generate secure access links, and let clients download memories instantly. Engineered for professional workflows.
        </p>
        <div className="mt-10 flex gap-4">
          <Link to="/Dashboard" className="bg-indigo-200 hover:bg-white text-black font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2">
            Upload Gallery
          </Link>
          <Link to="/view-demo" className="border border-white/10 hover:bg-white/5 text-white font-bold px-8 py-3 rounded-full transition-colors">
            View Demo
          </Link>
        </div>
      </motion.div>

      <div className="relative">
        {/* Secure Access Badge */}
        <div className="absolute -top-6 left-10 z-20 bg-black/80 border border-white/10 p-4 rounded-xl backdrop-blur-xl shadow-2xl">
          <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Secure Access</p>
          <p className="font-mono text-yellow-500 tracking-widest flex items-center gap-2">
            <span>🔑</span> 7H2K-XP91
          </p>
        </div>

        {/* Main Image Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80" 
            alt="Wedding" 
            className="w-full grayscale-[20%]"
          />
        </div>

        {/* Progress Overlay */}
        <div className="absolute bottom-10 -right-4 z-20 bg-black/80 border border-white/10 p-5 rounded-xl backdrop-blur-xl w-64 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] uppercase text-gray-400 font-bold">Download Status</p>
            <p className="text-xs text-white font-bold">85%</p>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[85%] shadow-[0_0_10px_#3b82f6]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;