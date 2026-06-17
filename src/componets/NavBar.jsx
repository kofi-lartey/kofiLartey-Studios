import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
    { label: "Showcase", path: "/coming-soon" },
    { label: "Features", path: "/coming-soon" },
    { label: "Pricing", path: "/coming-soon" },
    // { label: "Admin", path: "/admin", accent: true }
];

const NavBar = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getLinkClass = (path, mobile = false) => {
        const active = location.pathname === path;

        if (mobile) {
            return `block py-3 text-base font-medium border-b border-white/5 transition-colors ${active ? 'text-blue-300' : 'text-gray-300 hover:text-white'}`;
        }

        return `text-xs font-medium uppercase tracking-widest transition-colors ${active ? 'text-blue-300' : 'text-gray-400 hover:text-white'}`;
    };

    return (
        <nav className={`fixed top-0 w-full z-50 flex items-center justify-between gap-3 px-4 md:px-8 py-4 md:py-6 transition-all duration-300 ${isScrolled ? 'bg-black/85 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <img
                    src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                    alt="kofiLartey Studios Logo"
                    className="h-10 md:h-12 w-auto object-contain"
                />
                <span className="text-sm md:text-lg font-bold tracking-tighter text-blue-100 hidden sm:inline">
                    kofiLartey <span className="text-blue-500">Studio</span>
                </span>
            </Link>

            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-target rounded-lg"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
            >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => (
                    <Link
                        key={`${link.label}-${link.path}`}
                        to={link.path}
                        className={getLinkClass(link.path)}
                        aria-current={location.pathname === link.path ? 'page' : undefined}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="hidden lg:flex items-center gap-3 md:gap-4">
                <Link
                    to="/clientGallery"
                    className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                    Client Access
                </Link>

                {isAuthenticated ? (
                    <button
                        onClick={() => logout()}
                        className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                ) : (
                    <div className="hidden sm:flex items-center gap-4 border-r border-white/10 pr-4">
                        <Link
                            to="/login"
                            className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-[10px] uppercase font-bold tracking-widest text-white/90 hover:text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10 transition-all hover:bg-white/10"
                        >
                            Register
                        </Link>
                    </div>
                )}

                <Link
                    to="/dashboard"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 md:px-5 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] inline-block text-center active:scale-95 touch-target"
                >
                    Upload
                </Link>
            </div>

            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#050505] border-l border-white/10 z-50 lg:hidden animate-slide-in overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <Link to="/" className="hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                                    <h2 className="text-xl font-bold text-white tracking-tighter">
                                        kofiLartey <span className="text-blue-500">Studio</span>
                                    </h2>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 transition-colors touch-target rounded-lg"
                                    aria-label="Close menu"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <nav className="space-y-2 mb-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={`mobile-${link.label}-${link.path}`}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={getLinkClass(link.path, true)}
                                        aria-current={location.pathname === link.path ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="space-y-3">
                                <Link
                                    to="/clientGallery"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center py-3 text-sm font-bold text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors"
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
                                            className="w-full py-3 text-sm font-bold text-red-300 hover:text-red-200 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                        {/* <Link
                                            to="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all border border-white/10"
                                        >
                                            Go to Admin
                                        </Link> */}
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
