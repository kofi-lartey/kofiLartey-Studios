import { useState, useEffect } from "react";
import { FiKey, FiLink, FiCopy, FiCheck, FiGrid, FiColumns, FiPlus, FiRefreshCw, FiSearch, FiMenu } from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import RecentUploads from "../components/RecentUploads";
import { get, post } from "../utils/apiCall";
import { useMobileMenu } from "../hooks/useMobileMenu";
import SkipLink from "../components/SkipLink";

const Gallery = () => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryName, setGalleryName] = useState("");
  const [galleryNameSearch, setGalleryNameSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [expiration, setExpiration] = useState("Never Expire");
  const [downloadPermissions, setDownloadPermissions] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [refreshUploads, setRefreshUploads] = useState(0);
  const [recentUploadsKey, setRecentUploadsKey] = useState(0);
  const [generatedShareLink, setGeneratedShareLink] = useState("");
  const [showLinkCard, setShowLinkCard] = useState(false);
  const [allGalleries, setAllGalleries] = useState([]);
  const [galleryPreviewImages, setGalleryPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const mobileMenu = useMobileMenu();

  // Load all galleries from API on mount
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await get('gallery/gallery/names');
      console.log('📁 Galleries fetched:', response);
      
      if (response.success && response.data) {
        const formattedGalleries = response.data.map(gallery => ({
          id: gallery.id,
          name: gallery.galleryName,
          galleryID: gallery.galleryID,
          status: gallery.galleryStatus,
          createdAt: gallery.galleryDateCreated,
          imageCount: gallery.totalImages || 0
        }));
        setAllGalleries(formattedGalleries);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch gallery images for preview
  const fetchGalleryImages = async (galleryID) => {
    try {
      const response = await get(`/gallery/${galleryID}/images`);
      console.log('📸 Gallery images fetched:', response);
      
      if (response.success && response.data) {
        const imagesData = response.data || [];
        const formattedImages = imagesData.map(img => ({
          id: img.imageId || img._id,
          url: img.imageUrl,
          name: img.imageName || img.originalName || 'Untitled',
          size: img.size,
          uploadedAt: img.uploadedAt
        }));
        setGalleryPreviewImages(formattedImages.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setGalleryPreviewImages([]);
    }
  };

  const handleSearch = () => {
    if (!galleryNameSearch && !searchTerm) {
      console.log("Please select a gallery name or enter client info");
      return;
    }

    const results = allGalleries.filter(g =>
      (galleryNameSearch && g.name.toLowerCase().includes(galleryNameSearch.toLowerCase())) ||
      (searchTerm && (g.name?.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (results.length === 1) {
      selectGallery(results[0]);
    }
  };

  const selectGallery = (gallery) => {
    setSelectedGallery(gallery);
    setGalleryName(gallery.name);
    setRefreshUploads(prev => prev + 1);
    
    // Fetch images for preview
    fetchGalleryImages(gallery.galleryID);
  };

  // Create Gallery Share Link - Backend generates access key
  const handleCreateAndGenerate = async () => {
    if (!selectedGallery) {
      alert("Please select a gallery first");
      return;
    }

    if (!userName || !userEmail) {
      alert("Please fill in all required fields");
      return;
    }

    setCreatingLink(true);

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

      if (response.success && response.data) {
        const galleryData = response.data;
        setGeneratedShareLink(galleryData.galleryURL);
        setAccessKey(galleryData.accessKey); // ✅ Backend generated access key
        setShowLinkCard(true);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error(response.message || 'Failed to generate link');
      }
    } catch (error) {
      console.error('Error creating gallery share:', error);
      alert(error.response?.data?.message || error.message || 'Failed to generate share link');
    } finally {
      setCreatingLink(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadToggle = () => {
    setDownloadPermissions(!downloadPermissions);
  };

  const handleGallerySelectFromList = (gallery) => {
    selectGallery(gallery);
  };

  const handleGalleryNameChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      alert("Please create a gallery first from the Dashboard upload section");
      setGalleryName("");
      return;
    }
    setGalleryName(value);
    const selected = allGalleries.find(g => g.name === value);
    if (selected) {
      selectGallery(selected);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Skip to main content link for accessibility */}
      <SkipLink />

      {/* Sidebar with mobile menu props */}
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
        
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-10 pb-safe">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gallery Management</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-2 max-w-xl">
                Configure access permissions and generate secure sharing links for your portfolio.
              </p>
            </div>
          </div>

          {/* Generated Link Card */}
          {showLinkCard && generatedShareLink && (
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1">Shareable Link</p>
                  <p className="text-sm text-white font-mono truncate">{generatedShareLink}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Access Key: <span className="text-indigo-400 font-mono">{accessKey}</span></p>
                </div>
                <button
                  onClick={() => handleCopy(generatedShareLink)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-all"
                >
                  <FiCopy size={14} /> Copy Link
                </button>
              </div>
            </div>
          )}

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column: Settings */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                <h4 className="text-[11px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Configuration</h4>
              </div>

              <div className="space-y-5">
                {/* Access Key Display - Only shows after generation */}
                {accessKey && (
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                      Generated Access Key
                    </label>
                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center justify-between">
                      <span className="font-mono text-sm text-white tracking-wider">{accessKey}</span>
                      <button
                        onClick={() => handleCopy(accessKey)}
                        className="text-gray-500 hover:text-indigo-400 transition-colors"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-600 mt-2">This key is automatically generated by the system</p>
                  </div>
                )}

                {/* Link Expiration */}
                <div>
                  <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                    Link Expiration
                  </label>
                  <select
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl py-2.5 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer hover:border-white/20"
                  >
                    <option className="bg-black">Never Expire</option>
                    <option className="bg-black">1 Hour</option>
                    <option className="bg-black">24 Hours</option>
                    <option className="bg-black">7 Days</option>
                    <option className="bg-black">30 Days</option>
                  </select>
                </div>

                {/* Download Permissions Toggle */}
                <div className="flex items-center justify-between py-2 group">
                  <div>
                    <p className="text-sm font-medium text-gray-200">Download Permissions</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Allow high-res downloads</p>
                  </div>
                  <button
                    onClick={handleDownloadToggle}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(79,70,229,0.4)] hover:shadow-[0_0_16px_rgba(79,70,229,0.6)] ${downloadPermissions ? 'bg-indigo-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${downloadPermissions ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Premium Feature Badge */}
                <div className="pt-2">
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-[9px] text-amber-400/80 uppercase tracking-wider font-bold">
                      💎 Watermarking & Advanced Features Available on Pro Plan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Client Details & Link Generation */}
            <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Left Side: Search Existing Gallery */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em] mb-3 flex items-center gap-2">
                      <FiSearch size={12} />
                      Select Gallery
                    </h4>
                    <div className="space-y-3 relative">
                      <div>
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-2">
                          Gallery Name
                        </label>
                        <select
                          value={galleryNameSearch}
                          onChange={(e) => setGalleryNameSearch(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                          disabled={loading}
                        >
                          <option value="" className="bg-black">-- Select a gallery --</option>
                          {allGalleries.map((gallery) => (
                            <option key={gallery.id} value={gallery.name} className="bg-black">
                              {gallery.name} ({gallery.imageCount || 0} images)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Or search by gallery name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 pr-28 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <button
                          onClick={handleSearch}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-all shadow-lg"
                        >
                          Search
                        </button>
                      </div>
                    </div>

                    {/* All Galleries List */}
                    {allGalleries.length > 0 && (
                      <div className="mt-4">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                          Quick Select Gallery
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {allGalleries.map((gallery) => (
                            <button
                              key={gallery.id}
                              onClick={() => handleGallerySelectFromList(gallery)}
                              className={`w-full text-left p-2 rounded-lg transition-all ${selectedGallery?.id === gallery.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                            >
                              <p className="text-sm font-medium text-white">{gallery.name}</p>
                              <p className="text-[10px] text-gray-400">ID: {gallery.galleryID}</p>
                              <p className="text-[9px] text-gray-500">{gallery.imageCount || 0} images</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedGallery && (
                      <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                        <p className="text-[10px] text-indigo-400 font-bold">✓ Gallery Selected</p>
                        <p className="text-sm text-white mt-1">{selectedGallery.name}</p>
                        <p className="text-[10px] text-gray-400">ID: {selectedGallery.galleryID}</p>
                      </div>
                    )}
                  </div>
                </div>

                 {/* Right Side: Client Details */}
                 <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-4 md:p-5 relative overflow-hidden hover:border-white/15 transition-all">
                   <div className="absolute top-0 right-0 p-3 opacity-10">
                     <FiPlus size={48} className="text-white" />
                   </div>

                   <div className="relative z-10">
                     <h4 className="text-[10px] md:text-xs uppercase font-bold text-indigo-400 tracking-[0.2em] mb-4 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                       Client Information
                     </h4>

                     <div className="space-y-4">
                       <div className="group">
                         <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1 group-focus-within:text-indigo-400 transition-colors">
                           Selected Gallery
                         </label>
                         <div className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-xs md:text-sm text-gray-400">
                           {selectedGallery ? selectedGallery.name : 'No gallery selected'}
                         </div>
                       </div>

                       <div className="group">
                         <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1 group-focus-within:text-indigo-400 transition-colors">
                           Full Name *
                         </label>
                         <input
                           type="text"
                           placeholder="John Doe"
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                           className="w-full bg-transparent border-b border-white/10 py-2.5 text-xs md:text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all"
                         />
                       </div>

                       <div className="group">
                         <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1 group-focus-within:text-indigo-400 transition-colors">
                           Email Address *
                         </label>
                         <input
                           type="email"
                           placeholder="hello@example.com"
                           value={userEmail}
                           onChange={(e) => setUserEmail(e.target.value)}
                           className="w-full bg-transparent border-b border-white/10 py-2.5 text-xs md:text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all"
                         />
                       </div>

                       <button
                         onClick={handleCreateAndGenerate}
                         disabled={!selectedGallery || creatingLink}
                         className="w-full mt-4 md:mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] md:text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {creatingLink ? 'Generating...' : 'Create & Generate Link'}
                       </button>
                     </div>
                   </div>
                 </div>
              </div>

              {/* Footer / Status Bar */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="w-2 h-2 bg-green-500 rounded-full absolute animate-ping" />
                    <span className="w-2 h-2 bg-green-500 rounded-full relative" />
                  </div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    {selectedGallery ? `ACTIVE GALLERY: ${selectedGallery.name}` : "SYSTEM READY: SELECT A GALLERY FIRST"}
                  </p>
                </div>

                {copied && (
                  <div className="bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-200 px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 animate-in slide-in-from-right duration-300">
                    <FiCheck size={12} strokeWidth={3} />
                    Copied to Clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          {selectedGallery && (
            <div className="mt-6 md:mt-8">
              <RecentUploads
                key={recentUploadsKey}
                refreshTrigger={refreshUploads}
                selectedGallery={selectedGallery}
              />
            </div>
          )}

          {/* Gallery Preview Section */}
          <section className="pt-4 md:pt-6">
            <div className="flex justify-between items-end mb-4 md:mb-8 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {selectedGallery ? `${selectedGallery.name} Preview` : "Gallery Preview"}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  {selectedGallery ? `${galleryPreviewImages.length} images in this gallery` : "Select a gallery to preview images."}
                </p>
              </div>
              <div className="flex gap-3 text-gray-500">
                <FiGrid className="cursor-pointer hover:text-white" />
                <FiColumns className="cursor-pointer text-white" />
              </div>
            </div>

            {selectedGallery && galleryPreviewImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {galleryPreviewImages.map((img, index) => (
                  <div key={img.id || index} className="group relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 md:p-4 flex flex-col justify-end">
                      <p className="text-xs font-bold text-white truncate">{img.name}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 mt-1">
                        {(img.size / 1024 / 1024).toFixed(1)} MB • {img.uploadedAt ? new Date(img.uploadedAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
                {selectedGallery ? (
                  <>
                    <p className="text-gray-500 text-sm">No images uploaded to this gallery yet.</p>
                    <p className="text-gray-600 text-xs mt-2">Upload images from the dashboard to see them here.</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Select a gallery from the list to preview images.</p>
                )}
              </div>
            )}
           </section>
        </div>

        <Footer />
      </main>
      
      {/* Mobile menu overlay handled by Sidebar */}
    </div>
  );
};

export default Gallery;