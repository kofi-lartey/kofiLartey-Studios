import { useState, useEffect } from "react";
import { 
  FiKey, FiLink, FiCopy, FiCheck, FiGrid, FiColumns, FiPlus, 
  FiRefreshCw, FiSearch, FiExternalLink, FiAlertCircle,
  FiUser, FiMail, FiClock, FiShield, FiDownload, FiX, FiImage
} from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import RecentUploads from "../components/RecentUploads";
import { get, post } from "../utils/apiCall";
import { useMobileMenu } from "../hooks/useMobileMenu";
import SkipLink from "../components/SkipLink";

const Gallery = () => {
  const [copied, setCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryNameSearch, setGalleryNameSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [expiration, setExpiration] = useState("Never Expire");
  const [downloadPermissions, setDownloadPermissions] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [refreshUploads, setRefreshUploads] = useState(0);
  const [generatedShareLink, setGeneratedShareLink] = useState("");
  const [showLinkCard, setShowLinkCard] = useState(false);
  const [allGalleries, setAllGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [existingConfiguration, setExistingConfiguration] = useState(null);
  const [checkingConfig, setCheckingConfig] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [error, setError] = useState(null);
  const mobileMenu = useMobileMenu();

  // Load all galleries from API on mount
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get('gallery/gallery/names');
      console.log('📁 Galleries fetched:', response);

      if (response && response.success && response.data) {
        const formattedGalleries = response.data.map(gallery => ({
          id: gallery.id,
          name: gallery.galleryName,
          galleryID: gallery.galleryID,
          status: gallery.galleryStatus,
          createdAt: gallery.galleryDateCreated,
          imageCount: gallery.totalImages || 0,
          hasConfiguration: gallery.hasConfiguration || false
        }));
        setAllGalleries(formattedGalleries);
      } else {
        console.error('Invalid response format:', response);
        setError('Failed to load galleries. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setError(error.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // ADDED: Handle search function
  const handleSearch = () => {
    if (!galleryNameSearch && !searchTerm) {
      showToastMessage("Please select a gallery or enter search term", "error");
      return;
    }

    const results = allGalleries.filter(gallery =>
      (galleryNameSearch && gallery.name.toLowerCase().includes(galleryNameSearch.toLowerCase())) ||
      (searchTerm && gallery.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (results.length === 1) {
      selectGallery(results[0]);
    } else if (results.length > 1) {
      showToastMessage(`Found ${results.length} galleries. Please select one from the list.`, "info");
    } else {
      showToastMessage("No gallery found matching your search", "error");
    }
  };

  // Check if gallery already has configuration
  const checkExistingConfiguration = async (galleryID) => {
    if (!galleryID) {
      console.warn('No gallery ID provided');
      return false;
    }
    
    setCheckingConfig(true);
    setError(null);
    
    try {
      console.log(`🔍 Fetching config for gallery: ${galleryID}`);
      
      const response = await get(`/gallery/main/${galleryID}/config`);
      
      console.log('📦 Config response:', response);
      
      if (response && response.success === true && response.data) {
        const config = response.data;
        
        console.log('✅ Config found:', config);
        
        let shareUrl = config.galleryURL || 
                       config.shareLink || 
                       config.url || 
                       config.publicUrl ||
                       config.galleryUrl;
        
        if (shareUrl && !shareUrl.startsWith('http')) {
          shareUrl = `${window.location.origin}${shareUrl}`;
        }
        
        const accessKeyValue = config.accessKey || config.key;
        
        if (!shareUrl || !accessKeyValue) {
          console.warn('⚠️ Config missing URL or Access Key');
          setShowLinkCard(false);
          setExistingConfiguration(null);
          return false;
        }
        
        setGeneratedShareLink(shareUrl);
        setAccessKey(accessKeyValue);
        setExistingConfiguration(config);
        setShowLinkCard(true);
        
        if (config.clientInfo) {
          setUserName(config.clientInfo.name || config.clientInfo.clientName || "");
          setUserEmail(config.clientInfo.email || "");
        }
        
        if (config.downloadPermission !== undefined) {
          setDownloadPermissions(config.downloadPermission);
        }
        
        if (config.expirationPeriod) {
          setExpiration(config.expirationPeriod);
        }
        
        showToastMessage("Existing configuration loaded successfully!", "success");
        return true;
      } 
      
      if (response && response.status === 404) {
        console.log('📭 No configuration found');
        setShowLinkCard(false);
        setExistingConfiguration(null);
        setGeneratedShareLink("");
        setAccessKey("");
        return false;
      }
      
      if (response && response.data === null) {
        console.log('📭 No configuration data');
        setShowLinkCard(false);
        setExistingConfiguration(null);
        return false;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Error checking configuration:', error);
      
      if (error.response?.status === 404) {
        console.log('📭 Configuration not found (404) - This is normal for new galleries');
        setShowLinkCard(false);
        setExistingConfiguration(null);
        setGeneratedShareLink("");
        setAccessKey("");
        return false;
      }
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.message || 'Failed to load configuration');
      }
      
      setShowLinkCard(false);
      setExistingConfiguration(null);
      return false;
    } finally {
      setCheckingConfig(false);
    }
  };

  const selectGallery = async (gallery) => {
    console.log('🎯 Selecting gallery:', gallery);
    
    setSelectedGallery(gallery);
    setRefreshUploads(prev => prev + 1);
    
    setExistingConfiguration(null);
    setShowLinkCard(false);
    setGeneratedShareLink("");
    setAccessKey("");
    setError(null);
    
    if (!gallery.hasConfiguration) {
      setUserName("");
      setUserEmail("");
      setExpiration("Never Expire");
      setDownloadPermissions(false);
    }
    
    if (gallery.hasConfiguration) {
      await checkExistingConfiguration(gallery.galleryID);
    }
  };

  // Create Gallery Share Link
  const handleCreateAndGenerate = async () => {
    if (!selectedGallery) {
      showToastMessage("Please select a gallery first", "error");
      return;
    }

    if (!userName || !userEmail) {
      showToastMessage("Please fill in all required fields", "error");
      return;
    }

    setCreatingLink(true);
    setError(null);

    try {
      const payload = {
        galleryID: selectedGallery.galleryID,
        name: userName,
        email: userEmail,
        studioName: selectedGallery.name,
        expirationPeriod: expiration,
        downloadPermission: downloadPermissions,
        gallerySettings: {
          allowDownloads: downloadPermissions,
          allowWatermark: false,
          themeColor: "#FF6B6B",
          allowSocialShare: true,
          requireAccessKey: true
        },
        metadata: {
          clientNotes: `Gallery shared with ${userName}`,
          tags: ["shared", "client-gallery"]
        }
      };

      console.log('🚀 Creating gallery share link:', payload);

      const response = await post('/gallery/main/create', payload);
      console.log('✅ Gallery share response:', response);

      if (response && response.success && response.data) {
        const galleryData = response.data;
        
        let shareUrl = galleryData.galleryURL || 
                       galleryData.shareLink || 
                       galleryData.url;
        
        if (!shareUrl && galleryData.accessKey) {
          shareUrl = `${window.location.origin}/gallery/${selectedGallery.galleryID}?accessKey=${galleryData.accessKey}`;
        }
        
        const accessKeyValue = galleryData.accessKey;
        
        console.log('📋 Generated - URL:', shareUrl, 'Access Key:', accessKeyValue);
        
        setGeneratedShareLink(shareUrl);
        setAccessKey(accessKeyValue);
        setShowLinkCard(true);
        setExistingConfiguration(galleryData);
        
        showToastMessage("Gallery share link created successfully!", "success");
        
        setAllGalleries(prev => prev.map(g => 
          g.id === selectedGallery.id ? { ...g, hasConfiguration: true } : g
        ));
      } else {
        throw new Error(response?.message || 'Failed to generate link');
      }
    } catch (error) {
      console.error('Error creating gallery share:', error);
      
      if (error.response?.data?.message?.includes('already exists') || 
          error.response?.status === 409) {
        showToastMessage("This gallery already has a configuration. Loading existing share link...", "info");
        await checkExistingConfiguration(selectedGallery.galleryID);
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to generate share link';
        showToastMessage(errorMsg, "error");
      }
    } finally {
      setCreatingLink(false);
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleCopy = (text, item) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setCopied(true);
    showToastMessage("Copied to clipboard!", "success");
    setTimeout(() => {
      setCopied(false);
      setCopiedItem(null);
    }, 2000);
  };

  const handleDownloadToggle = () => {
    setDownloadPermissions(!downloadPermissions);
  };

  const handleGallerySelectFromList = (gallery) => {
    selectGallery(gallery);
  };

  const openShareLink = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <SkipLink />
      <Sidebar isMobileMenuOpen={mobileMenu.isOpen} closeMobileMenu={mobileMenu.close} />

      <main
        id="main-content"
        className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${mobileMenu.isOpen ? 'ml-0' : ''} lg:ml-64 overflow-x-hidden`}
        tabIndex={-1}
      >
        <DashboardNavbar onMenuToggle={mobileMenu.toggle} isMobileMenuOpen={mobileMenu.isOpen} />

        <div className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 lg:space-y-10 pb-safe">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gallery Management</h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-xl">
                Configure access permissions and generate secure sharing links for your portfolio.
              </p>
            </div>
          </div>

          {/* Toast Notification */}
          {toast.show && (
            <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 max-w-sm ${
              toast.type === "success" ? 'bg-green-600/90 border border-green-500/50' :
              toast.type === "error" ? 'bg-red-600/90 border border-red-500/50' :
              'bg-blue-600/90 border border-blue-500/50'
            }`}>
              <div className="flex items-center gap-3">
                {toast.type === "success" ? (
                  <FiCheck size={18} className="text-white" />
                ) : toast.type === "error" ? (
                  <FiAlertCircle size={18} className="text-white" />
                ) : (
                  <FiAlertCircle size={18} className="text-white" />
                )}
                <p className="text-white text-sm break-words">{toast.message}</p>
                <button onClick={() => setToast({ show: false, message: "", type: "success" })} className="ml-2 text-white/70 hover:text-white">
                  <FiX size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-red-400" size={18} />
                <p className="text-red-400 text-sm">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-400/70 hover:text-red-400">
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Existing Configuration Warning Banner */}
          {selectedGallery && existingConfiguration && (
            <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="text-amber-400 font-bold text-sm">Existing Gallery Configuration Found</p>
                  <p className="text-gray-400 text-xs mt-1">
                    This gallery already has a shared configuration. You can use the existing link below or create a new one.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Link Card */}
          {showLinkCard && generatedShareLink && (
            <div className={`rounded-2xl p-4 sm:p-5 backdrop-blur-sm overflow-hidden ${
              existingConfiguration 
                ? 'bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30'
                : 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/30'
            }`}>
              <div className="flex flex-col gap-4 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <FiLink className="text-indigo-400" size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                      {existingConfiguration ? "Existing Shareable Link" : "New Shareable Link"}
                    </p>
                    {existingConfiguration && (
                      <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Previously Created
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">Gallery URL</label>
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-xs sm:text-sm text-white font-mono break-all flex-1">
                        {generatedShareLink}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openShareLink(generatedShareLink)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-colors"
                          title="Open in new tab"
                        >
                          <FiExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleCopy(generatedShareLink, 'link')}
                          className="p-2 bg-white/10 hover:bg-indigo-600/20 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"
                          title="Copy link"
                        >
                          {copiedItem === 'link' ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <FiKey size={10} /> Access Key
                  </label>
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <code className="text-xs sm:text-sm text-indigo-400 font-mono break-all flex-1">
                        {accessKey}
                      </code>
                      <button
                        onClick={() => handleCopy(accessKey, 'key')}
                        className="p-2 bg-white/10 hover:bg-indigo-600/20 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors self-start sm:self-auto"
                        title="Copy access key"
                      >
                        {copiedItem === 'key' ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {existingConfiguration && existingConfiguration.clientInfo && (
                  <div className="mt-2 pt-3 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[9px] text-gray-500">Client Name</p>
                        <p className="text-white text-sm mt-1">{existingConfiguration.clientInfo?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500">Email</p>
                        <p className="text-white text-sm mt-1 break-all">{existingConfiguration.clientInfo?.email || 'N/A'}</p>
                      </div>
                      {existingConfiguration.expirationDate && (
                        <div>
                          <p className="text-[9px] text-gray-500">Expires</p>
                          <p className="text-white text-sm mt-1">{new Date(existingConfiguration.expirationDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[9px] text-gray-500">Downloads</p>
                        <p className="text-white text-sm mt-1">{existingConfiguration.downloadPermission ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    onClick={() => handleCopy(generatedShareLink, 'link')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                  >
                    <FiCopy size={14} />
                    Copy Full Link
                  </button>
                  <button
                    onClick={() => openShareLink(generatedShareLink)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                  >
                    <FiExternalLink size={14} />
                    Preview Gallery
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            
            {/* Left Column: Settings */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                <h4 className="text-[11px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Configuration Settings</h4>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                    <FiClock className="inline mr-1" size={10} /> Link Expiration
                  </label>
                  <select
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    disabled={!!existingConfiguration}
                    className={`w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl py-2.5 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${
                      existingConfiguration ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/20'
                    }`}
                  >
                    <option className="bg-black">Never Expire</option>
                    <option className="bg-black">1 hour</option>
                    <option className="bg-black">24 hours</option>
                    <option className="bg-black">7 days</option>
                    <option className="bg-black">30 days</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 group">
                  <div>
                    <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
                      <FiDownload size={14} /> Download Permissions
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Allow high-res downloads</p>
                  </div>
                  <button
                    onClick={handleDownloadToggle}
                    disabled={!!existingConfiguration}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                      downloadPermissions ? 'bg-indigo-600' : 'bg-gray-700'
                    } ${existingConfiguration ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                      downloadPermissions ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="pt-2">
                  <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/15 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <FiShield className="text-amber-400/70 flex-shrink-0 mt-0.5" size={12} />
                      <p className="text-[9px] text-amber-400/70 leading-relaxed">
                        💎 Advanced features like watermarking, analytics, and branding are available on Pro Plan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Client Details & Link Generation */}
            <div className="lg:col-span-2 min-w-0 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                {/* Left Side: Select Gallery */}
                <div className="space-y-6 min-w-0">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em] mb-3 flex items-center gap-2">
                      <FiSearch size={12} />
                      Select Gallery
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-2">
                          Gallery Name
                        </label>
                        <select
                          value={galleryNameSearch}
                          onChange={(e) => setGalleryNameSearch(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500 transition-all"
                          disabled={loading}
                        >
                          <option value="" className="bg-black">-- Select a gallery --</option>
                          {allGalleries.map((gallery) => (
                            <option key={gallery.id} value={gallery.name} className="bg-black">
                              {gallery.name} ({gallery.imageCount || 0} images) {gallery.hasConfiguration ? '🔗' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by gallery name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 pr-28 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 outline-none transition-all"
                        />
                        <button
                          onClick={handleSearch}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-all"
                        >
                          Search
                        </button>
                      </div>
                    </div>

                    {allGalleries.length > 0 && (
                      <div className="mt-4">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                          Quick Select
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {allGalleries.map((gallery) => (
                            <button
                              key={gallery.id}
                              onClick={() => handleGallerySelectFromList(gallery)}
                              className={`w-full text-left p-3 rounded-xl transition-all ${
                                selectedGallery?.id === gallery.id 
                                  ? 'bg-indigo-600/20 border border-indigo-500/30' 
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <p className="text-sm font-medium text-white truncate">{gallery.name}</p>
                                {gallery.hasConfiguration && (
                                  <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Configured
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1">ID: {gallery.galleryID}</p>
                              <p className="text-[9px] text-gray-500">{gallery.imageCount || 0} images</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedGallery && (
                      <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                        <p className="text-[10px] text-indigo-400 font-bold">✓ Gallery Selected</p>
                        <p className="text-sm text-white mt-1 font-medium">{selectedGallery.name}</p>
                        <p className="text-[10px] text-gray-400">ID: {selectedGallery.galleryID}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Client Details */}
                <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden hover:border-white/15 transition-all">
                  <div className="absolute top-0 right-0 p-3 opacity-5">
                    <FiUser size={48} className="text-white" />
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em] mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      Client Information
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1">
                          Selected Gallery
                        </label>
                        <div className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-gray-400 break-words">
                          {selectedGallery ? selectedGallery.name : 'No gallery selected'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1">
                          <FiUser className="inline mr-1" size={10} /> Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          disabled={!!existingConfiguration}
                          className={`w-full bg-transparent border-b border-white/10 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all ${
                            existingConfiguration ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1">
                          <FiMail className="inline mr-1" size={10} /> Email Address *
                        </label>
                        <input
                          type="email"
                          placeholder="hello@example.com"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          disabled={!!existingConfiguration}
                          className={`w-full bg-transparent border-b border-white/10 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all ${
                            existingConfiguration ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>

                      <button
                        onClick={handleCreateAndGenerate}
                        disabled={!selectedGallery || creatingLink || checkingConfig}
                        className={`w-full mt-4 text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                          existingConfiguration
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                        }`}
                      >
                        {checkingConfig 
                          ? 'Checking...' 
                          : existingConfiguration 
                            ? 'View Existing Link' 
                            : creatingLink 
                              ? 'Generating...' 
                              : 'Create & Generate Link'}
                      </button>

                      {existingConfiguration && (
                        <p className="text-center text-[9px] text-amber-500 mt-2">
                          This gallery already has a configuration. Click above to view the existing share link.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className={`w-2 h-2 rounded-full absolute animate-ping ${
                      selectedGallery && existingConfiguration ? 'bg-amber-500' : selectedGallery ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <span className={`w-2 h-2 rounded-full relative ${
                      selectedGallery && existingConfiguration ? 'bg-amber-500' : selectedGallery ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    {selectedGallery 
                      ? existingConfiguration 
                        ? `EXISTING CONFIGURATION: ${selectedGallery.name}` 
                        : `READY: ${selectedGallery.name}`
                      : "SELECT A GALLERY TO CONTINUE"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads Section - This shows all images */}
          {selectedGallery && (
            <div className="mt-6 lg:mt-8">
              <RecentUploads
                key={refreshUploads}
                refreshTrigger={refreshUploads}
                selectedGallery={selectedGallery}
              />
            </div>
          )}
          
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Gallery;