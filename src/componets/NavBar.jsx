import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    return (
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-md border-b border-white/5">
            {/* Logo */}
            
            <Link to="/" className="flex items-center gap-2">
                <img 
                    src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                    alt="kofiLartey Studios Logo"
                    className="h-15 w-auto"
                />
                <span className="text-xl font-bold tracking-tighter text-blue-100">
                    kofiLartey <span className="text-blue-500">Studio</span>
                </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-gray-400">
                <Link to="/coming-soon" className="hover:text-white transition-colors">Showcase</Link>
                <Link to="/coming-soon" className="hover:text-white transition-colors">Features</Link>
                <Link to="/coming-soon" className="hover:text-white transition-colors">Pricing</Link>
            </div>

            {/* Auth & Action Buttons */}
            <div className="flex items-center gap-4 md:gap-8">
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/clientGallery"
                            className="hidden md:block text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            Client Access
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                        <Link
                            to="/dashboard"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] inline-block text-center active:scale-95"
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
                                className="text-[10px] uppercase font-bold tracking-widest text-white/90 hover:text-white bg-white/5 px-4 py-2 rounded-lg border border-white/10 transition-all hover:bg-white/10"
                            >
                                Register
                            </Link>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link
                                to="/clientGallery"
                                className="hidden md:block text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white transition-colors"
                            >
                                Client Access
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] inline-block text-center active:scale-95"
                            >
                                Upload
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;