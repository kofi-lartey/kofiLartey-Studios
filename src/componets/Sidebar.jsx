import React, { useState, useEffect } from "react";
import { FiGrid, FiImage, FiBarChart2, FiUsers, FiSettings, FiPlus, FiHelpCircle, FiLogOut, FiX, FiShield } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isMobileMenuOpen, closeMobileMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [studioInfo, setStudioInfo] = useState({
        studioName: "kofilarteyStudio",
        studioTier: "Premium Tier"
    });

    useEffect(() => {
        loadStudioInfo();
        
        // Listen for studio updates from Settings
        const handleStudioUpdate = (event) => {
            if (event.detail) {
                setStudioInfo({
                    studioName: event.detail.studioName,
                    studioTier: event.detail.studioTier
                });
            }
        };
        
        // Listen for workspace deletion
        const handleWorkspaceDelete = () => {
            loadStudioInfo();
        };
        
        window.addEventListener('studioInfoUpdated', handleStudioUpdate);
        window.addEventListener('workspaceDeleted', handleWorkspaceDelete);
        
        return () => {
            window.removeEventListener('studioInfoUpdated', handleStudioUpdate);
            window.removeEventListener('workspaceDeleted', handleWorkspaceDelete);
        };
    }, []);

    const loadStudioInfo = () => {
        const savedStudio = localStorage.getItem('studioInfo');
        if (savedStudio) {
            const studio = JSON.parse(savedStudio);
            setStudioInfo({
                studioName: studio.studioName || "kofilarteyStudio",
                studioTier: studio.studioTier || "Premium Tier"
            });
        }
    };

    const handleSignOut = async () => {
        try {
            await logout();
            // Clear any additional studio data
            localStorage.removeItem('currentGallery');
            localStorage.removeItem('currentAccessKey');
            sessionStorage.clear();
            closeMobileMenu?.();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleHelpCenter = () => {
        // WhatsApp link with pre-filled message
        const phoneNumber = "233557655008"; // Ghana number format
        const message = encodeURIComponent("Hello! I need assistance with kofiLartey Studio. Can you help me?");
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        closeMobileMenu?.();
    };

    const menuItems = [
        { icon: <FiGrid />, label: "Dashboard", path: "/dashboard" },
        { icon: <FiImage />, label: "Galleries", path: "/galleries" },
        { icon: <FiUsers />, label: "Clients", path: "/clients" },
        // { icon: <FiShield />, label: "Admin", path: "/admin" },
        { icon: <FiSettings />, label: "Settings", path: "/settings" },
    ];

    // Desktop Sidebar - always visible on lg screens
    const desktopSidebar = (
        <aside className="hidden lg:flex w-64 h-screen bg-[#050505] border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-50">
            <div className="mb-10">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <h2 className="text-2xl font-bold text-white tracking-tighter">
                        {studioInfo.studioName}
                    </h2>
                </Link>
                <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Studio Workspace</p>
                    <p className="text-xs text-indigo-400 font-medium mt-1">{studioInfo.studioTier}</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-white/5 text-white border-r-2 border-indigo-500"
                                    : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <Link to="/gallery" onClick={closeMobileMenu}>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all active:scale-95">
                        <FiPlus /> New Gallery
                    </button>
                </Link>

                <div className="pt-4 border-t border-white/5 space-y-1">
                    <button 
                        onClick={handleHelpCenter}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-white text-xs transition-colors"
                    >
                        <FiHelpCircle /> Help Center
                    </button>
                    <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-400 text-xs transition-colors"
                    >
                        <FiLogOut /> Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );

    // Mobile Drawer
    const mobileDrawer = (
        <>
            {/* Overlay backdrop */}
            <div 
                className={`mobile-overlay lg:hidden ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />
            
            {/* Mobile drawer panel */}
            <aside className={`mobile-drawer lg:hidden ${isMobileMenuOpen ? 'active' : ''}`} role="dialog" aria-label="Mobile navigation">
                {/* Close button */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#050505] border-b border-white/5">
                    <Link to="/" className="hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
                        <h2 className="text-xl font-bold text-white tracking-tighter">
                            {studioInfo.studioName}
                        </h2>
                    </Link>
                    <button
                        onClick={closeMobileMenu}
                        className="p-2 text-gray-500 hover:text-white transition-colors touch-target rounded-lg"
                        aria-label="Close menu"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-6 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Studio Workspace</p>
                        <p className="text-xs text-indigo-400 font-medium mt-1">{studioInfo.studioTier}</p>
                    </div>

                    <nav className="space-y-1 mb-6">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={closeMobileMenu}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all touch-target ${isActive
                                            ? "bg-white/5 text-white border-r-2 border-indigo-500"
                                            : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-3">
                        <Link to="/gallery" onClick={closeMobileMenu}>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all active:scale-95 touch-target">
                                <FiPlus /> New Gallery
                            </button>
                        </Link>

                        <div className="pt-4 border-t border-white/5 space-y-1">
                            <button 
                                onClick={handleHelpCenter}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white text-xs transition-colors touch-target"
                            >
                                <FiHelpCircle /> Help Center
                            </button>
                            <button 
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 text-xs transition-colors touch-target"
                            >
                                <FiLogOut /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );

    return (
        <>
            {desktopSidebar}
            {mobileDrawer}
        </>
    );
};

export default Sidebar;