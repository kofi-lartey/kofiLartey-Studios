import { useState, useEffect } from "react";
import { FiKey, FiLink, FiCopy, FiCheck, FiGrid, FiColumns, FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import RecentUploads from "../components/RecentUploads";

const Gallery = () => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryName, setGalleryName] = useState("");
  const [galleryNameSearch, setGalleryNameSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [expiration, setExpiration] = useState("never");
  const [downloadPermissions, setDownloadPermissions] = useState(true);
  const [accessKey, setAccessKey] = useState("7H2K-XP91");
  const [generatedLink, setGeneratedLink] = useState("");
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [refreshUploads, setRefreshUploads] = useState(0);
  const [recentUploadsKey, setRecentUploadsKey] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [generatedShareLink, setGeneratedShareLink] = useState("");
  const [showLinkCard, setShowLinkCard] = useState(false);
  const [allGalleries, setAllGalleries] = useState([]);
  const [galleryPreviewImages, setGalleryPreviewImages] = useState([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load all galleries on mount
  useEffect(() => {
    loadGalleries();
    const savedGallery = localStorage.getItem('currentGallery');
    if (savedGallery) {
      const gallery = JSON.parse(savedGallery);
      setSelectedGallery(gallery);
      setGalleryName(gallery.name);
      setAccessKey(gallery.accessKey || "7H2K-XP91");
      loadGalleryImages(gallery);
    }
  }, []);

  const loadGalleries = () => {
    const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    setAllGalleries(galleries);
  };

  const loadGalleryImages = (gallery) => {
    if (!gallery) return;

    const galleryKey = `gallery_${gallery.id}`;
    const galleryImages = JSON.parse(localStorage.getItem(galleryKey) || '[]');
    setGalleryPreviewImages(galleryImages.slice(0, 6));
  };

  // Generate random access key
  const generateAccessKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const newKey = Array(8).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const formattedKey = `${newKey.slice(0, 4)}-${newKey.slice(4, 8)}`;
    setAccessKey(formattedKey);
    localStorage.setItem('currentAccessKey', formattedKey);

    // If there's a selected gallery, update its access key
    if (selectedGallery) {
      const updatedGallery = { ...selectedGallery, accessKey: formattedKey };
      updateGalleryInStorage(updatedGallery);
      setSelectedGallery(updatedGallery);

      // Regenerate link with new access key
      generateLinkForGallery(updatedGallery);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = () => {
    if (!galleryNameSearch && !searchTerm) {
      console.log("Please select a gallery name or enter client info");
      return;
    }

    const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    const results = galleries.filter(g =>
      (galleryNameSearch && g.name.toLowerCase().includes(galleryNameSearch.toLowerCase())) ||
      (searchTerm && (g.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);

    if (results.length === 1) {
      selectGallery(results[0]);
    }
  };

  const selectGallery = (gallery) => {
    setSelectedGallery(gallery);
    setGalleryName(gallery.name);
    setUserName(gallery.clientName || "");
    setUserEmail(gallery.clientEmail || "");
    setExpiration(gallery.expiration || "never");
    setDownloadPermissions(gallery.downloadPermissions !== undefined ? gallery.downloadPermissions : true);
    setAccessKey(gallery.accessKey || "7H2K-XP91");
    localStorage.setItem('currentGallery', JSON.stringify(gallery));
    localStorage.setItem('currentAccessKey', gallery.accessKey || "7H2K-XP91");
    setRefreshUploads(prev => prev + 1);
    setShowSearchDropdown(false);
    setIsCreatingNew(false);

    loadGalleryImages(gallery);
    generateLinkForGallery(gallery);
  };

  const generateLinkForGallery = (gallery) => {
    // Secure link with access key in URL
    const link = `${window.location.origin}/clientGallery?accessKey=${gallery.accessKey}`;
    setGeneratedShareLink(link);
    setShowLinkCard(true);
    
    // Save link to gallery
    const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    const updatedGalleries = galleries.map(g => {
      if (g.id === gallery.id) {
        return { ...g, shareLink: link, lastGenerated: new Date().toISOString() };
      }
      return g;
    });
    localStorage.setItem('galleries', JSON.stringify(updatedGalleries));
    setAllGalleries(updatedGalleries);
};

  const handleCreateAndGenerate = () => {
    let finalGalleryName = galleryName;

    if (!finalGalleryName || finalGalleryName === "new") {
      alert("Please select or enter a gallery name");
      return;
    }

    if (!userName || !userEmail) {
      alert("Please fill in all required fields");
      return;
    }

    // Generate a NEW access key for this gallery
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const newKey = Array(8).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newAccessKey = `${newKey.slice(0, 4)}-${newKey.slice(4, 8)}`;

    const existingGallery = allGalleries.find(g => g.name === finalGalleryName);

    let newGallery;

    if (existingGallery) {
      // Update existing gallery with new user and NEW access key
      newGallery = {
        ...existingGallery,
        clientName: userName,
        clientEmail: userEmail,
        expiration: expiration,
        downloadPermissions: downloadPermissions,
        accessKey: newAccessKey, // Update with new access key
        updatedAt: new Date().toISOString()
      };

      const updatedGalleries = allGalleries.map(g =>
        g.id === existingGallery.id ? newGallery : g
      );
      localStorage.setItem('galleries', JSON.stringify(updatedGalleries));
      setAllGalleries(updatedGalleries);
    } else {
      // Create new gallery with NEW access key
      newGallery = {
        id: `gallery_${Date.now()}`,
        name: finalGalleryName,
        createdAt: new Date().toISOString(),
        imageCount: 0,
        accessKey: newAccessKey,
        clientName: userName,
        clientEmail: userEmail,
        expiration: expiration,
        downloadPermissions: downloadPermissions,
        shareLink: ""
      };

      const updatedGalleries = [...allGalleries, newGallery];
      localStorage.setItem('galleries', JSON.stringify(updatedGalleries));
      setAllGalleries(updatedGalleries);
    }

    // Set as current gallery with the NEW access key
    setSelectedGallery(newGallery);
    setAccessKey(newAccessKey);
    localStorage.setItem('currentGallery', JSON.stringify(newGallery));
    localStorage.setItem('currentAccessKey', newAccessKey);

    generateLinkForGallery(newGallery);
    loadGalleryImages(newGallery);
    setRecentUploadsKey(prev => prev + 1);

    setGalleryNameSearch("");
    setSearchTerm("");
    setIsCreatingNew(false);

    console.log("Gallery created with access key:", newAccessKey);
  };

  const handleDownloadToggle = () => {
    setDownloadPermissions(!downloadPermissions);
  };

  const handleExpirationChange = (e) => {
    setExpiration(e.target.value);
    if (selectedGallery) {
      const updatedGallery = { ...selectedGallery, expiration: e.target.value };
      updateGalleryInStorage(updatedGallery);
      setSelectedGallery(updatedGallery);
    }
  };

  const updateGalleryInStorage = (updatedGallery) => {
    const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    const updatedGalleries = galleries.map(g =>
      g.id === updatedGallery.id ? updatedGallery : g
    );
    localStorage.setItem('galleries', JSON.stringify(updatedGalleries));
    setAllGalleries(updatedGalleries);
  };

  const handleDownloadPermissionsChange = () => {
    const newValue = !downloadPermissions;
    setDownloadPermissions(newValue);
    if (selectedGallery) {
      const updatedGallery = { ...selectedGallery, downloadPermissions: newValue };
      updateGalleryInStorage(updatedGallery);
      setSelectedGallery(updatedGallery);
    }
  };

  const handleGallerySelectFromList = (gallery) => {
    selectGallery(gallery);
  };

  const handleGalleryNameChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setIsCreatingNew(true);
      setGalleryName("");
    } else {
      setIsCreatingNew(false);
      setGalleryName(value);
      const selected = allGalleries.find(g => g.name === value);
      if (selected) {
        setUserName(selected.clientName || "");
        setUserEmail(selected.clientEmail || "");
        setAccessKey(selected.accessKey || "7H2K-XP91");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col">
        <DashboardNavbar />

        <div className="p-8 max-w-7xl w-full mx-auto space-y-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Gallery Management</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Configure access permissions and generate secure sharing links for your portfolio.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateAccessKey}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:bg-white/10 transition-all"
              >
                <FiRefreshCw size={14} /> Generate Access Key
              </button>
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

          {/* Configuration Grid - Same as before */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Settings */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                <h4 className="text-[11px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Configuration</h4>
              </div>

              <div className="space-y-5">
                {/* Access Key Display */}
                <div>
                  <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                    Current Access Key
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
                  <p className="text-[9px] text-gray-600 mt-2">This key is required to access the gallery</p>
                </div>

                {/* Link Expiration */}
                <div>
                  <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                    Link Expiration
                  </label>
                  <select
                    value={expiration}
                    onChange={handleExpirationChange}
                    className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl py-2.5 px-4 text-sm text-gray-300 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer hover:border-white/20"
                  >
                    <option className="bg-black">Never Expires</option>
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
                    onClick={handleDownloadPermissionsChange}
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

            {/* Right Column: Client Details & Link Generation - Same as before */}
            <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Search Existing User */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em] mb-3 flex items-center gap-2">
                      <FiSearch size={12} />
                      Search Existing User
                    </h4>
                    <div className="space-y-3 relative">
                      <div>
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-2">
                          Select Gallery Name
                        </label>
                        <select
                          value={galleryNameSearch}
                          onChange={(e) => setGalleryNameSearch(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
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
                          placeholder="Find client by name or email..."
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
                              <p className="text-[10px] text-gray-400">{gallery.clientName}</p>
                              <p className="text-[9px] text-gray-500">Key: {gallery.accessKey}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedGallery && (
                      <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                        <p className="text-[10px] text-indigo-400 font-bold">✓ Gallery Selected</p>
                        <p className="text-sm text-white mt-1">{selectedGallery.name}</p>
                        <p className="text-[10px] text-gray-400">Access Key: {selectedGallery.accessKey}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Create New User */}
                <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/10 rounded-2xl p-5 relative overflow-hidden hover:border-white/15 transition-all">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <FiPlus size={48} className="text-white" />
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em] mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      Create New User
                    </h4>

                    <div className="space-y-4">
                      <div className="group">
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1 group-focus-within:text-indigo-400 transition-colors">
                          Select or Create Gallery Name *
                        </label>
                        <select
                          value={isCreatingNew ? "new" : galleryName}
                          onChange={handleGalleryNameChange}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="" className="bg-black">-- Select existing gallery --</option>
                          {allGalleries.map((gallery) => (
                            <option key={gallery.id} value={gallery.name} className="bg-black">
                              {gallery.name} ({gallery.imageCount || 0} images)
                            </option>
                          ))}
                          <option value="new" className="bg-black text-indigo-400">+ Create new gallery</option>
                        </select>
                      </div>

                      {isCreatingNew && (
                        <div className="group">
                          <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1 group-focus-within:text-indigo-400 transition-colors">
                            New Gallery Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter new gallery name..."
                            value={galleryName}
                            onChange={(e) => setGalleryName(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all"
                            autoFocus
                          />
                        </div>
                      )}

                      <div className="group">
                        <label className="block text-[9px] uppercase text-gray-500 tracking-wider mb-1 group-focus-within:text-indigo-400 transition-colors">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all"
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
                          className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder:text-gray-700 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>

                      <button
                        onClick={handleCreateAndGenerate}
                        className="w-full mt-6 bg-gradient-to-r from-white to-gray-200 text-black text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-xl active:scale-[0.98]"
                      >
                        Create & Generate Link
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
                    {selectedGallery ? `ACTIVE GALLERY: ${selectedGallery.name}` : "SYSTEM READY: READY TO CREATE OR SEARCH"}
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
            <div className="mt-8">
              <RecentUploads
                key={recentUploadsKey}
                refreshTrigger={refreshUploads}
                selectedGallery={selectedGallery}
              />
            </div>
          )}

          {/* Gallery Preview Section */}
          <section className="pt-6">
            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedGallery ? `${selectedGallery.name} Preview` : "Gallery Preview"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedGallery ? `${galleryPreviewImages.length} images in this gallery` : "Select a gallery to preview images"}
                </p>
              </div>
              <div className="flex gap-3 text-gray-500">
                <FiGrid className="cursor-pointer hover:text-white" />
                <FiColumns className="cursor-pointer text-white" />
              </div>
            </div>

            {selectedGallery && galleryPreviewImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryPreviewImages.map((img, index) => (
                  <div key={img.id || index} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <p className="text-xs font-bold text-white truncate">{img.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {(img.size / 1024 / 1024).toFixed(1)} MB • {new Date(img.uploadedAt).toLocaleDateString()}
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
                  <p className="text-gray-500 text-sm">Select a gallery from the list or create a new one to preview images.</p>
                )}
              </div>
            )}
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Gallery;