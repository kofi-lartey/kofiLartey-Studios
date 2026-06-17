import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiUploadCloud, FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/apiCall";

const DashboardNavbar = ({ onMenuToggle, isMobileMenuOpen, title = 'Dashboard' }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    studioName: "",
    avatar: ""
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await get('/users/me');
      console.log('Navbar profile fetch:', response);
      
      if (response.success && response.data?.user) {
        const userDataFromAPI = response.data.user;
        setUserData({
          fullName: userDataFromAPI.name || "",
          studioName: userDataFromAPI.studioName || "",
          avatar: userDataFromAPI.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        });
        
        // Update localStorage for fallback
        localStorage.setItem('studioUser', JSON.stringify({
          fullName: userDataFromAPI.name,
          studioName: userDataFromAPI.studioName,
          avatar: userDataFromAPI.profileImage
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to localStorage if API fails
      loadUserDataFromLocal();
    } finally {
      setLoading(false);
    }
  };

  const loadUserDataFromLocal = () => {
    const savedUser = localStorage.getItem('studioUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData({
        fullName: user.fullName || user.name || "",
        studioName: user.studioName || "",
        avatar: user.avatar || user.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      });
    }
  };

  useEffect(() => {
    fetchUserData();
    
    // Listen for profile updates from Settings
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUserData({
          fullName: event.detail.fullName || event.detail.name || userData.fullName,
          studioName: event.detail.studioName || userData.studioName,
          avatar: event.detail.avatar || event.detail.profileImage || userData.avatar
        });
      }
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // Sync with AuthContext when user changes
  useEffect(() => {
    if (user && userData.fullName === "") {
      setUserData({
        fullName: user.name || user.fullName || "",
        studioName: user.studioName || "",
        avatar: user.profileImage || user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force logout even if API fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('studioUser');
      navigate('/login');
    }
  };

  const handleUpload = () => {
    navigate('/galleries');
  };

  return (
    <nav className="h-16 border-b border-white/5 bg-[#0a0a0c] flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      {/* Left side - Menu button + Logo + Search */}
      <div className="flex items-center gap-3 md:gap-8 flex-1">
        {/* Hamburger menu button (mobile only) */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors touch-target rounded-lg"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Logo - hidden on mobile to save space */}
        <div className="flex items-center gap-2 hidden sm:flex">
            <img 
                src="https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png"
                alt="kofiLartey Studios Logo"
                className="h-6 w-auto"
            />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-blue-100">{title}</h1>
        </div>

        {/* Search bar - collapsed on mobile to toggle */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search your creative assets..."
            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors touch-target rounded-lg"
          aria-label="Toggle search"
        >
          <FiSearch size={20} />
        </button>
      </div>

      {/* Mobile search bar (collapsible) */}
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-16 md:hidden p-4 bg-[#0a0a0c] border-b border-white/5 animate-slide-down">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search..."
              autoFocus
              className="w-full bg-white/5 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      )}

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Notifications - hidden on small mobile */}
        <button className="relative text-gray-400 hover:text-white transition-colors hidden sm:block">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0c]" />
        </button>
        
        {/* Upload button */}
        <button 
          onClick={handleUpload}
          className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 md:px-4 py-2 rounded-lg border border-indigo-500/30 transition-all text-xs md:text-sm font-bold active:scale-95 touch-target"
        >
          <FiUploadCloud size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <div className="hidden md:block h-8 w-[1px] bg-white/10" />

        {/* User profile dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="text-right hidden md:block">
              {loading ? (
                <>
                  <div className="h-3 w-20 bg-white/10 rounded animate-pulse mb-1"></div>
                  <div className="h-2 w-12 bg-white/10 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-white leading-none">{userData.fullName || "User"}</p>
                  <p className="text-[10px] text-indigo-400 uppercase tracking-tighter mt-1">{userData.studioName || "Studio"}</p>
                </>
              )}
            </div>
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse"></div>
            ) : (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-9 h-9 rounded-full grayscale hover:grayscale-0 transition-all cursor-pointer border border-white/10 object-cover touch-target"
              />
            )}
          </div>
           
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors active:scale-95 touch-target"
              >
                <FiUser size={16} />
                <span>Account Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 active:scale-95 touch-target"
              >
                <FiLogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;