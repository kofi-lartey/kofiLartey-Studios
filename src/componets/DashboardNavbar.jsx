import { useState, useEffect } from "react";
import { FiSearch, FiBell, FiUploadCloud, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { get } from "../utils/apiCall";

const DashboardNavbar = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    studioName: "",
    avatar: ""
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

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
        
        <button 
          onClick={handleUpload}
          className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-lg border border-indigo-500/30 transition-all text-sm font-bold"
        >
          <FiUploadCloud />
          Upload
        </button>

        <div className="h-8 w-[1px] bg-white/10" />

        <div className="relative">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="text-right hidden sm:block">
              {loading ? (
                <>
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-1"></div>
                  <div className="h-2 w-16 bg-white/10 rounded animate-pulse"></div>
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
                className="w-9 h-9 rounded-full grayscale hover:grayscale-0 transition-all cursor-pointer border border-white/10 object-cover"
              />
            )}
          </div>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0c] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
              >
                <FiUser size={16} />
                <span>Account Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
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