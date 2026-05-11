import React from 'react';
import { FiDownload, FiPlay, FiShare2, FiMaximize2, FiClock, FiCamera } from 'react-icons/fi';
import NavBar from '../componets/NavBar';
import Footer from '../componets/Footer';
import { Link } from 'react-router-dom';

const ViewDemo = () => {
    // Mock data reflecting the "The Anderson Wedding" layout
    const demoImages = [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000", // Wedding couple
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000", // Groom prep
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000", // Venue
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000", // Jewelry/Detail
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1000", // Celebration toast
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000", // Reception dance
    ];

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist text-white selection:bg-indigo-500/30">
            <NavBar />

            <main className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto w-full">

                {/* Gallery Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">✨ Private Collection</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                            The Anderson Wedding
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><FiCamera className="text-indigo-500" /> Julian Vance Photography</span>
                            <span className="flex items-center gap-2"><FiClock className="text-indigo-500" /> 342 High-Resolution Captures</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 w-full md:w-auto">
                            <FiDownload className="text-sm" /> Download All Gallery
                        </button>
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Expiration Date: Dec 31, 2026</span>
                    </div>
                </div>

                {/* Gallery Toolbar - Matching image_39c43a.jpg */}
                <div className="flex items-center justify-between py-4 border-y border-white/5 mb-10">
                    <div className="flex items-center gap-6">
                        <Link
                            to="/slideshow"
                            state={{ images: demoImages }}
                            className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                            <FiPlay className="text-indigo-500" /> Slideshow Mode
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors"><FiShare2 /></button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors"><FiMaximize2 /></button>
                    </div>
                </div>

                {/* Masonry Grid Simulation */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {demoImages.map((img, index) => (
                        <div key={index} className="relative group cursor-zoom-in overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:border-white/10">
                            <img
                                src={img}
                                alt={`Wedding Moment ${index}`}
                                className="w-full h-auto grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                            />
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                                <div className="flex justify-end gap-2">
                                    <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                        <FiDownload className="text-xs" />
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Moment {index + 1}</span>
                                    <span className="text-[10px] font-bold text-white/60">DSC09242_WED_MOMENT.ARW</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="mt-16 flex justify-center">
                    <button className="group px-10 py-4 border border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center gap-4">
                        View All 342 Images
                        <span className="group-hover:translate-y-1 transition-transform">▼</span>
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ViewDemo;