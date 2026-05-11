import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiUploadCloud } from "react-icons/fi";

const DashboardNavbar = () => {
  const [userData, setUserData] = useState({
    fullName: "Alex Rivera",
    role: "Pro Photographer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  });

  useEffect(() => {
    loadUserData();
    
    // Listen for profile updates from Settings
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUserData({
          fullName: event.detail.fullName,
          role: event.detail.role || "Pro Photographer",
          avatar: event.detail.avatar
        });
      }
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const loadUserData = () => {
    const savedUser = localStorage.getItem('studioUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData({
        fullName: user.fullName || "Alex Rivera",
        role: user.role || "Pro Photographer",
        avatar: user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      });
    }
  };

  return (
    <nav className="h-16 border-b border-white/5 bg-[#0a0a0c] flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2">
            <img 
                src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                alt="kofiLartey Studios Logo"
                className="h-6 w-auto"
            />
            <h1 className="text-xl font-bold tracking-tight text-blue-100">Dashboard</h1>
        </div>
        
        <div className="relative w-full max-w-md group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search your creative assets..."
            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0c]" />
        </button>
        
        <button className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-lg border border-indigo-500/30 transition-all text-sm font-bold">
          <FiUploadCloud />
          Upload
        </button>

        <div className="h-8 w-[1px] bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">{userData.fullName}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{userData.role}</p>
          </div>
          <img 
            src={userData.avatar} 
            alt="Profile" 
            className="w-9 h-9 rounded-full grayscale hover:grayscale-0 transition-all cursor-pointer border border-white/10 object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;