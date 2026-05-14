import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <img 
                    src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                    alt="kofiLartey Studios Logo"
                    className="h-12 md:h-15 w-auto"
                />
                <span className="text-lg md:text-xl font-bold tracking-tighter text-blue-100 hidden md:inline">
                    kofiLartey <span className="text-blue-500">Studio</span>
                </span>
            </Link>

            {/* Hamburger menu button (mobile) */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors touch-target rounded-lg"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
            >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-gray-400">
                <Link to="/coming-soon" className="hover:text-white transition-colors">Showcase</Link>
                <Link to="/coming-soon" className="hover:text-white transition-colors">Features</Link>
                <Link to="/coming-soon" className="hover:text-white transition-colors">Pricing</Link>
            </div>

            {/* Desktop Auth & Action Buttons */}
            <div className="hidden lg:flex items-center gap-4 md:gap-8">
                {/* CLIENT ACCESS - Always visible for all users */}
                <Link
                    to="/clientGallery"
                    className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Client Access
                </Link>

                {isAuthenticated ? (
                    <>
                        <button
                            onClick={() => logout()}
                            className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                        <Link
                            to="/dashboard"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 md:px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] inline-block text-center active:scale-95 touch-target"
                        >
                            Upload
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="hidden sm:flex items-center gap-6 border-r border-white/10 pr-6">
                            <Link 
                                to="/login" 
                                className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="text-[10px] uppercase font-bold tracking-widest text-white/90 hover:text-white bg-white/5 px-3 md:px-4 py-2 rounded-lg border border-white/10 transition-all hover:bg-white/10"
                            >
                                Register
                            </Link>
                        </div>

                        <Link
                            to="/register"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 md:px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] inline-block text-center active:scale-95 touch-target"
                        >
                            Upload
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />
                    
                    {/* Mobile Menu Panel */}
                    <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#050505] border-l border-white/10 z-50 lg:hidden animate-slide-in overflow-y-auto">
                        <div className="p-6">
                            {/* Mobile logo */}
                            <div className="flex items-center justify-between mb-8">
                                <Link to="/" className="hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                                    <h2 className="text-xl font-bold text-white tracking-tighter">
                                        kofiLartey <span className="text-blue-500">Studio</span>
                                    </h2>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-white transition-colors touch-target rounded-lg"
                                    aria-label="Close menu"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Mobile Navigation Links */}
                            <nav className="space-y-2 mb-8">
                                <Link 
                                    to="/coming-soon"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 text-base font-medium text-gray-300 hover:text-white border-b border-white/5"
                                >
                                    Showcase
                                </Link>
                                <Link 
                                    to="/coming-soon"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 text-base font-medium text-gray-300 hover:text-white border-b border-white/5"
                                >
                                    Features
                                </Link>
                                <Link 
                                    to="/coming-soon"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 text-base font-medium text-gray-300 hover:text-white border-b border-white/5"
                                >
                                    Pricing
                                </Link>
                            </nav>

                            {/* Mobile Auth Buttons */}
                            <div className="space-y-3">
                                <Link
                                    to="/clientGallery"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center py-3 text-sm font-bold text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors"
                                >
                                    Client Access
                                </Link>

                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full py-3 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default NavBar;