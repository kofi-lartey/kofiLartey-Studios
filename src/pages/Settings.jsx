import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiUser, FiLock, FiEdit2, FiTrash2, FiShield, FiSave, FiAlertCircle, FiCheckCircle, FiInfo, FiUpload, FiX, FiMenu } from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import Loader from "../components/Loader";
import { get, patch, put } from "../utils/apiCall";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMobileMenu } from "../hooks/useMobileMenu";
import SkipLink from "../components/SkipLink";

const Settings = () => {
  const mobileMenu = useMobileMenu();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    studioName: "",
    profileImage: "",
  });

  const [userMetadata, setUserMetadata] = useState({
    isVerified: false,
    isActive: false,
    role: "",
    lastActive: "",
    createdAt: "",
    updatedAt: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setFetching(true);
    try {
      const response = await get('/users/me');
      console.log('Profile fetch response:', response);

      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          studioName: userData.studioName || "",
          profileImage: userData.profileImage || "",
        });
        setAvatarPreview(userData.profileImage || null);
        setUserMetadata({
          isVerified: userData.isVerified || false,
          isActive: userData.isActive || false,
          role: userData.role || "",
          lastActive: userData.lastActive || "",
          createdAt: userData.createdAt || "",
          updatedAt: userData.updatedAt || "",
          email: userData.email || ""  // ✅ Store email in metadata for comparison
        });
      } else {
        throw new Error(response.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const msg = error.response?.data?.message || error.message || "Failed to load profile";
      setMessage({ type: "error", text: msg });
    } finally {
      setFetching(false);
    }
  };

  // ✅ FIXED: Upload only profile image using PUT with FormData
  const handleImageUpload = async () => {
    if (!selectedImageFile) {
      setMessage({ type: "error", text: "Please select an image first" });
      return;
    }

    setImageUploading(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ Create FormData and append the file
      const formData = new FormData();
      formData.append('profileImage', selectedImageFile);

      console.log("🚀 Uploading profile image...");
      console.log("📸 File:", selectedImageFile.name, selectedImageFile.size, selectedImageFile.type);

      // ✅ Log FormData for debugging
      for (let pair of formData.entries()) {
        console.log(`📦 FormData: ${pair[0]} =`, pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]);
      }

      // ✅ Send the request
      const response = await put('/users/profile/image', formData);
      console.log("✅ Upload response:", response);

      if (response.success) {
        const newProfileImage = response.data?.profileImage || response.data?.user?.profileImage;

        if (newProfileImage) {
          setProfile(prev => ({
            ...prev,
            profileImage: newProfileImage,
          }));
          setAvatarPreview(newProfileImage);
        }

        // Update localStorage
        const userDataForStorage = {
          fullName: profile.name,
          email: profile.email,
          studioName: profile.studioName,
          avatar: newProfileImage,
          role: userMetadata.role
        };
        localStorage.setItem('studioUser', JSON.stringify(userDataForStorage));

        // Notify other components
        window.dispatchEvent(new CustomEvent('userProfileUpdated', {
          detail: userDataForStorage
        }));

        setMessage({ type: "success", text: "Profile picture updated successfully!" });
        setSelectedImageFile(null);

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        throw new Error(response.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to upload image";
      setMessage({ type: "error", text: msg });
    } finally {
      setImageUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile.name || !profile.email || !profile.studioName) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (!profile.email.includes('@')) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    // Store old email before update
    const oldEmail = userMetadata.email;
    const isEmailChanged = oldEmail !== profile.email;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('studioName', profile.studioName);

      const response = await patch('/users/profile', formData);
      console.log("✅ Profile update response:", response);

      if (response.success && response.data?.user) {
        const updatedUser = response.data?.user;

        setProfile({
          name: updatedUser.name,
          email: updatedUser.email,
          studioName: updatedUser.studioName,
          profileImage: updatedUser.profileImage || profile.profileImage,
        });

        setUserMetadata(prev => ({
          ...prev,
          isVerified: updatedUser.isVerified,
          isActive: updatedUser.isActive,
          role: updatedUser.role,
          lastActive: updatedUser.lastActive,
          updatedAt: updatedUser.updatedAt
        }));

        const userDataForStorage = {
          fullName: updatedUser.name,
          email: updatedUser.email,
          studioName: updatedUser.studioName,
          avatar: updatedUser.profileImage,
          role: updatedUser.role
        };
        localStorage.setItem('studioUser', JSON.stringify(userDataForStorage));

        window.dispatchEvent(new CustomEvent('userProfileUpdated', {
          detail: userDataForStorage
        }));

        // ✅ Check if email was changed and requires verification
        if (
          isEmailChanged &&
          response.data?.requiresNewVerification === true
        ) {
          console.log("📧 Email changed, redirecting to verification page...");

          const emailWasSent = response.data?.emailSent;

          setMessage({
            type: emailWasSent ? "warning" : "error",
            text: emailWasSent
              ? "Email updated! A verification code has been sent to your new email. Redirecting to verification page..."
              : "Email updated but verification email could not be sent. Please resend verification."
          });

          // Store email for verification page
          localStorage.setItem('confirmEmail', updatedUser.email);

          setTimeout(() => {
            navigate('/email-confirmation', {
              state: {
                email: updatedUser.email
              }
            });
          }, 2000);
        }
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to update profile";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("📸 File selected:", file);

    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: "error", text: "Please select an image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }

      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setMessage({ type: "", text: "" });
    }
  };

  const handleCancelImage = () => {
    setSelectedImageFile(null);
    setAvatarPreview(profile.profileImage || null);
  };

  const handleRemoveAvatar = async () => {
    setImageUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append('profileImage', '');

      const response = await put('/users/profile/image', formData);

      if (response.success) {
        setAvatarPreview(null);
        setProfile(prev => ({
          ...prev,
          profileImage: ""
        }));
        setSelectedImageFile(null);

        const userDataForStorage = {
          fullName: profile.name,
          email: profile.email,
          studioName: profile.studioName,
          avatar: "",
          role: userMetadata.role
        };
        localStorage.setItem('studioUser', JSON.stringify(userDataForStorage));

        window.dispatchEvent(new CustomEvent('userProfileUpdated', {
          detail: userDataForStorage
        }));

        setMessage({ type: "success", text: "Profile picture removed successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        throw new Error(response.message || "Failed to remove image");
      }
    } catch (error) {
      console.error("Remove image error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to remove image";
      setMessage({ type: "error", text: msg });
    } finally {
      setImageUploading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ Match the exact body format your backend expects
      const response = await patch('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });

      console.log("✅ Password update response:", response);

      if (response.success) {
        setMessage({ type: "success", text: response.message || "Password updated successfully!" });

        // Clear password fields after successful update
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        throw new Error(response.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to update password";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

   if (fetching) {
     return (
       <div className="min-h-screen bg-[#050505] flex">
         {/* Skip to main content link for accessibility */}
         <SkipLink />
         {/* Sidebar with mobile menu */}
         <Sidebar 
           isMobileMenuOpen={mobileMenu.isOpen} 
           closeMobileMenu={mobileMenu.close} 
         />
         <main 
           id="main-content"
           className={`flex-1 flex items-center justify-center transition-all duration-300 ${mobileMenu.isOpen ? 'ml-0' : ''} lg:ml-64`}
           tabIndex={-1}
         >
           <div className="text-center">
             <Loader size={48} variant="default" />
             <p className="text-gray-500 text-xs md:text-sm mt-4">Loading profile...</p>
           </div>
         </main>
       </div>
     );
   }

   return (
     <div className="min-h-screen bg-[#050505] flex">
       {/* Skip to main content link for accessibility */}
       <SkipLink />

       <Sidebar 
         isMobileMenuOpen={mobileMenu.isOpen} 
         closeMobileMenu={mobileMenu.close} 
       />

       <main 
         id="main-content"
         className={`flex-1 flex flex-col transition-all duration-300 ${mobileMenu.isOpen ? 'ml-0' : ''} lg:ml-64`}
         tabIndex={-1}
       >
         <DashboardNavbar onMenuToggle={mobileMenu.toggle} isMobileMenuOpen={mobileMenu.isOpen} />

         <div className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6 md:space-y-12 pb-safe">
           <header>
             <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Account Settings</h2>
             <p className="text-gray-500 text-xs md:text-sm mt-3">
               Manage your photography studio's global configuration, security protocols, and visual identity.
             </p>
           </header>

          {message.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-600/20 border-green-500/30' :
              message.type === 'warning' ? 'bg-yellow-600/20 border-yellow-500/30' :
                'bg-red-600/20 border-red-500/30'
              }`}>
              {message.type === 'success' ? <FiCheckCircle className="text-green-500" /> :
                message.type === 'warning' ? <FiInfo className="text-yellow-500" /> :
                  <FiAlertCircle className="text-red-500" />}
              <span className={`text-[11px] font-bold uppercase tracking-wider ${message.type === 'success' ? 'text-green-400' :
                message.type === 'warning' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                {message.text}
              </span>
            </div>
          )}

          {/* Account Status Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <FiShield className="text-xl" />
              <h3 className="text-lg font-semibold text-white">Account Status</h3>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Verification</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${userMetadata.isVerified ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-300">
                      {userMetadata.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${userMetadata.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className="text-sm text-gray-300">
                      {userMetadata.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Role</label>
                  <p className="text-sm text-gray-300 mt-1 capitalize">{userMetadata.role || 'User'}</p>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Last Active</label>
                  <p className="text-sm text-gray-300 mt-1">{formatDate(userMetadata.lastActive)}</p>
                </div>
              </div>
            </div>
          </section>

           {/* Profile Identity Section */}
           <section className="space-y-6">
             <div className="flex items-center gap-3 text-indigo-400">
               <FiUser className="text-lg md:text-xl" />
               <h3 className="text-base md:text-lg font-semibold text-white">Profile Identity</h3>
             </div>

             <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-8 space-y-4 md:space-y-8">
               <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                 <div className="relative group">
                   <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-white/5">
                     <img
                       src={avatarPreview || profile.profileImage || DEFAULT_AVATAR}
                       alt="Profile"
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white border-2 border-[#050505] hover:bg-indigo-500 transition-colors shadow-lg cursor-pointer touch-target">
                     <FiEdit2 size={12} />
                     <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                   </label>
                 </div>

                 <div className="flex-1 text-center sm:text-left">
                   <h4 className="text-sm font-medium text-white">Profile Picture</h4>
                   <p className="text-xs text-gray-500 mt-1">Recommended size: 800×800px. JPG or PNG. Max 5MB.</p>
                   <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                     <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer touch-target">
                       <FiEdit2 size={12} />
                       Choose Photo
                       <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                     </label>

                     {selectedImageFile && (
                       <>
                         <button
                           onClick={handleImageUpload}
                           disabled={imageUploading}
                           className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-1 rounded transition-colors disabled:opacity-50 active:scale-95 touch-target"
                         >
                           <FiUpload size={12} />
                           {imageUploading ? 'Uploading...' : 'Upload Now'}
                         </button>
                         <button
                           onClick={handleCancelImage}
                           className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-300 transition-colors active:scale-95 touch-target"
                         >
                           <FiX size={12} />
                           Cancel
                         </button>
                       </>
                     )}

                     {profile.profileImage && !selectedImageFile && (
                       <button
                         onClick={handleRemoveAvatar}
                         disabled={imageUploading}
                         className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 transition-colors active:scale-95 touch-target"
                       >
                         <FiTrash2 size={12} />
                         Remove
                       </button>
                     )}
                   </div>
                   {selectedImageFile && !imageUploading && (
                     <p className="text-[9px] text-yellow-500 mt-2">New photo ready. Click "Upload Now" to save.</p>
                   )}
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Full Name</label>
                   <input
                     type="text"
                     value={profile.name}
                     onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                     className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all touch-target"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Email Address</label>
                   <input
                     type="email"
                     value={profile.email}
                     onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                     className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all touch-target"
                   />
                   {!userMetadata.isVerified && (
                     <p className="text-[9px] text-yellow-500 mt-1">⚠️ Email not verified. Please check your inbox.</p>
                   )}
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Studio Name</label>
                   <input
                     type="text"
                     value={profile.studioName}
                     onChange={(e) => setProfile({ ...profile, studioName: e.target.value })}
                     className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all touch-target"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Studio Tier</label>
                   <div className="relative">
                     <select
                       value="coming-soon"
                       disabled
                       className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-gray-500 outline-none cursor-not-allowed opacity-70"
                     >
                       <option value="coming-soon">Coming Soon</option>
                     </select>
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent rounded-xl pointer-events-none" />
                   </div>
                   <p className="text-[9px] text-gray-600 mt-1 ml-1">✨ Premium features are on the way!</p>
                 </div>
               </div>

               <div className="flex justify-end">
                 <button
                   type="button"
                   onClick={handleProfileUpdate}
                   disabled={loading || imageUploading}
                   className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-6 md:px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-target"
                 >
                   {loading ? <Loader size={16} variant="minimal" /> : <FiSave size={14} />}
                   Save Profile Changes
                 </button>
               </div>
             </div>
           </section>

           {/* Security Protocols Section */}
           <section className="space-y-6">
             <div className="flex items-center gap-3 text-indigo-400">
               <FiLock className="text-lg md:text-xl" />
               <h3 className="text-base md:text-lg font-semibold text-white">Security Protocols</h3>
             </div>

             <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-8 space-y-4 md:space-y-8">
               <div>
                 <h4 className="text-sm font-medium text-white mb-4 md:mb-6">Change Password</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

                   {/* Current Password */}
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Current Password</label>
                     <div className="relative">
                       <input
                         type={showCurrentPassword ? "text" : "password"}
                         placeholder="••••••••"
                         value={passwordData.currentPassword}
                         onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                         className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 pr-10 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all touch-target"
                       />
                       <button
                         type="button"
                         onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors touch-target"
                       >
                         {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                       </button>
                     </div>
                   </div>

                   {/* New Password */}
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">New Password</label>
                     <div className="relative">
                       <input
                         type={showNewPassword ? "text" : "password"}
                         placeholder="••••••••"
                         value={passwordData.newPassword}
                         onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                         className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 pr-10 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all touch-target"
                       />
                       <button
                         type="button"
                         onClick={() => setShowNewPassword(!showNewPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors touch-target"
                       >
                         {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                       </button>
                     </div>
                   </div>

                   {/* Confirm New Password */}
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest ml-1">Confirm New</label>
                     <div className="relative">
                       <input
                         type={showConfirmPassword ? "text" : "password"}
                         placeholder="••••••••"
                         value={passwordData.confirmNewPassword}
                         onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                         className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 pr-10 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all touch-target"
                       />
                       <button
                         type="button"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors touch-target"
                       >
                         {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="pt-4 border-t border-white/5 flex justify-end">
                 <button
                   onClick={handlePasswordUpdate}
                   disabled={loading}
                   className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-6 md:px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-target"
                 >
                   {loading ? <Loader size={16} variant="minimal" /> : <FiLock size={14} />}
                   Update Password
                 </button>
               </div>
             </div>
           </section>

           {/* Danger Zone */}
           <section className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div>
               <h4 className="text-sm font-medium text-red-400">Delete Studio Workspace</h4>
               <p className="text-xs text-gray-500 mt-1">Permanently remove all galleries, client data, and assets. This action is irreversible.</p>
             </div>
             <button
               onClick={handleDeleteWorkspace}
               className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] font-bold text-red-400 uppercase tracking-widest transition-all active:scale-95 touch-target w-full sm:w-auto justify-center"
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