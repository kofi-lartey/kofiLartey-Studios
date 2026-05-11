import { useState, useEffect } from "react";
import { FiUser, FiLock, FiEdit2, FiTrash2, FiShield, FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import Loader from "../components/Loader";

const Settings = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    avatar: "",
    role: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [studioData, setStudioData] = useState({
    studioName: "kofilarteyStudio",
    studioTier: "Premium Tier"
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    loadUserData();
    loadStudioData();
  }, []);

  const loadUserData = () => {
    // Try to load from localStorage
    const savedUser = localStorage.getItem('studioUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setProfile({
        fullName: userData.fullName || "Alex Rivera",
        email: userData.email || "alex@kofilartey.studio",
        avatar: userData.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        role: userData.role || "Creative Director"
      });
      setAvatarPreview(userData.avatar || null);
    } else {
      // Default values
      setProfile({
        fullName: "Alex Rivera",
        email: "alex@kofilartey.studio",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        role: "Creative Director"
      });
    }
  };

  const loadStudioData = () => {
    const savedStudio = localStorage.getItem('studioInfo');
    if (savedStudio) {
      const studio = JSON.parse(savedStudio);
      setStudioData({
        studioName: studio.studioName || "kofilarteyStudio",
        studioTier: studio.studioTier || "Premium Tier"
      });
    }
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    setTimeout(() => {
      if (!profile.fullName || !profile.email) {
        setMessage({ type: "error", text: "Please fill in all required fields" });
        setLoading(false);
        return;
      }
      
      if (!profile.email.includes('@')) {
        setMessage({ type: "error", text: "Please enter a valid email address" });
        setLoading(false);
        return;
      }
      
      // Save to localStorage
      const userData = {
        ...profile,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('studioUser', JSON.stringify(userData));
      
      // Dispatch custom event to notify Sidebar and DashboardNavbar
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: userData }));
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setLoading(false);
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 500);
  };

  const handleStudioUpdate = () => {
    setLoading(true);
    
    setTimeout(() => {
      const studioInfo = {
        studioName: studioData.studioName,
        studioTier: studioData.studioTier,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('studioInfo', JSON.stringify(studioInfo));
      
      // Dispatch event to update Sidebar
      window.dispatchEvent(new CustomEvent('studioInfoUpdated', { detail: studioInfo }));
      
      setMessage({ type: "success", text: "Studio settings updated!" });
      setLoading(false);
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 500);
  };

  const handlePasswordUpdate = () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    setTimeout(() => {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setMessage({ type: "error", text: "Please fill in all password fields" });
        setLoading(false);
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setMessage({ type: "error", text: "New password must be at least 6 characters" });
        setLoading(false);
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" });
        setLoading(false);
        return;
      }
      
      localStorage.setItem('studioPassword', btoa(passwordData.newPassword));
      
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setLoading(false);
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setProfile({ 
      ...profile, 
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
    });
  };

  const handleDeleteWorkspace = () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete all galleries, client data, and assets. This action cannot be undone. Are you absolutely sure?")) {
      const confirmation = prompt('Type "DELETE" to confirm workspace deletion:');
      if (confirmation === "DELETE") {
        localStorage.clear();
        window.dispatchEvent(new CustomEvent('workspaceDeleted'));
        setMessage({ type: "success", text: "Workspace deleted. Redirecting..." });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage({ type: "error", text: "Workspace deletion cancelled" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <DashboardNavbar />
        
        <div className="p-8 max-w-5xl w-full mx-auto space-y-12">
          <header>
            <h2 className="text-4xl font-bold text-white tracking-tight">Account Settings</h2>
            <p className="text-gray-500 text-sm mt-3">
              Manage your photography studio's global configuration, security protocols, and visual identity.
            </p>
          </header>

          {message.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-600/20 border-green-500/30' : 'bg-red-600/20 border-red-500/30'
            }`}>
              {message.type === 'success' ? <FiCheckCircle className="text-green-500" /> : <FiAlertCircle className="text-red-500" />}
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                message.type === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {message.text}
              </span>
            </div>
          )}

          {/* Studio Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <FiShield className="text-xl" />
              <h3 className="text-lg font-semibold text-white">Studio Identity</h3>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Studio Name</label>
                  <input 
                    type="text" 
                    value={studioData.studioName}
                    onChange={(e) => setStudioData({...studioData, studioName: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Studio Tier</label>
                  <select
                    value={studioData.studioTier}
                    onChange={(e) => setStudioData({...studioData, studioTier: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                  >
                    <option>Basic Tier</option>
                    <option>Pro Tier</option>
                    <option>Premium Tier</option>
                    <option>Enterprise Tier</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleStudioUpdate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader size={16} variant="minimal" /> : <FiSave size={14} />}
                  Update Studio
                </button>
              </div>
            </div>
          </section>

          {/* Profile Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <FiUser className="text-xl" />
              <h3 className="text-lg font-semibold text-white">Profile Identity</h3>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-white/5">
                    <img 
                      src={avatarPreview || profile.avatar} 
                      alt="Representative" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white border-2 border-[#050505] hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer">
                    <FiEdit2 size={12} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white">Studio Representative</h4>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 800×800px. JPG or PNG.</p>
                  <div className="flex gap-4 mt-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                      Change Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                    <button 
                      onClick={handleRemoveAvatar}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader size={16} variant="minimal" /> : <FiSave size={14} />}
                  Save Profile
                </button>
              </div>
            </div>
          </section>

          {/* Security Protocols Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <FiLock className="text-xl" />
              <h3 className="text-lg font-semibold text-white">Security Protocols</h3>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 space-y-8">
              <div>
                <h4 className="text-sm font-medium text-white mb-6">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Confirm New</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button 
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader size={16} variant="minimal" /> : <FiLock size={14} />}
                  Update Password
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-medium text-red-400">Delete Studio Workspace</h4>
              <p className="text-xs text-gray-500 mt-1">Permanently remove all galleries, client data, and assets. This action is irreversible.</p>
            </div>
            <button 
              onClick={handleDeleteWorkspace}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] font-bold text-red-400 uppercase tracking-widest transition-all"
            >
              <FiTrash2 size={14} /> Terminate Workspace
            </button>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Settings;