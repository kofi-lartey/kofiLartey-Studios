import { useState, useEffect } from "react";
import { 
  FiSearch, FiUserPlus, FiMoreHorizontal, FiCopy, FiCheck, 
  FiExternalLink, FiUsers, FiFolder, FiHardDrive, FiTrash2, 
  FiKey, FiMail, FiImage, FiAlertCircle, FiX, FiRefreshCw, 
  FiCalendar, FiEdit2, FiSave, FiUser, FiAtSign, FiLock,
  FiCamera, FiClock
} from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import { get, del, put } from "../utils/apiCall";

const Clients = () => {
  const [copyStatus, setCopyStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalGalleries: 0,
    totalStorage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    galleryName: "",
    clientName: "",
    email: "",
    accessKey: "",
    expirationPeriod: "Never Expire",
    allowDownloads: true
  });

  // Load clients from API
  useEffect(() => {
    loadClients();
  }, [currentPage]);

  const loadClients = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await get(`/gallery/user/details?page=${currentPage}&limit=10`);
      
      console.log('API Response:', response);
      
      if (response.success) {
        let galleries = [];
        let paginationData = null;
        
        if (Array.isArray(response.data)) {
          galleries = response.data;
          paginationData = response.pagination;
        } else if (response.data && Array.isArray(response.data.galleries)) {
          galleries = response.data.galleries;
          paginationData = response.data.pagination || response.pagination;
        } else if (response.data && response.data.data) {
          galleries = response.data.data;
          paginationData = response.data.pagination;
        } else {
          galleries = [];
          paginationData = response.pagination;
        }
        
        const clientList = galleries.map(gallery => ({
          id: gallery.galleryInfo?.galleryID || gallery.id,
          galleryId: gallery.galleryInfo?.galleryID || gallery.id,
          name: gallery.clientDetails?.clientName || gallery.clientDetails?.name || 'N/A',
          email: gallery.clientDetails?.email || 'N/A',
          status: gallery.isAccessKeyActive ? "Active" : "Expired",
          tag: "Unlimited",
          galleries: 1,
          galleryName: gallery.galleryInfo?.galleryName || gallery.galleryName || 'Untitled',
          link: gallery.galleryUrl || gallery.shareLink || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(gallery.clientDetails?.clientName || gallery.clientDetails?.name || 'User')}&background=4f46e5&color=fff&bold=true&length=2`,
          createdAt: gallery.clientDetails?.dateCreated || gallery.createdAt || new Date().toISOString(),
          imageCount: gallery.galleryInfo?.totalImages || gallery.imageCount || 0,
          storageUsed: 0,
          accessKey: gallery.accessKey || 'N/A',
          expiration: gallery.galleryInfo?.expirationPeriod || gallery.expiration || 'Never Expire',
          downloadPermissions: gallery.galleryInfo?.settings?.allowDownloads || true,
          originalData: gallery
        }));
        
        setClients(clientList);
        
        if (paginationData) {
          setPagination({
            currentPage: paginationData.currentPage || 1,
            totalPages: paginationData.totalPages || 1,
            totalItems: paginationData.totalItems || clientList.length,
            itemsPerPage: paginationData.itemsPerPage || 10,
            hasNextPage: paginationData.hasNextPage || false,
            hasPrevPage: paginationData.hasPrevPage || false
          });
        }
        
        const totalClients = paginationData?.totalItems || clientList.length;
        const totalGalleries = paginationData?.totalItems || clientList.length;
        
        setStats({
          totalClients,
          totalGalleries,
          totalStorage: "0.0"
        });
      } else {
        throw new Error(response.message || "Failed to load galleries");
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
      setError(error.message || "Failed to load galleries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGallery = async () => {
    if (!selectedGallery) return;
    
    setDeleteLoading(true);
    try {
      const response = await del(`/gallery/${selectedGallery.galleryId}`);
      
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedGallery(null);
        await loadClients();
      } else {
        setError(response.message || "Failed to delete gallery");
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || "Failed to delete gallery");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditGallery = (client) => {
    setSelectedGallery(client);
    setEditFormData({
      galleryName: client.galleryName,
      clientName: client.name,
      email: client.email,
      accessKey: client.accessKey,
      expirationPeriod: client.expiration,
      allowDownloads: client.downloadPermissions
    });
    setShowEditModal(true);
  };

  const handleUpdateGallery = async () => {
    if (!selectedGallery) return;
    
    setEditLoading(true);
    try {
      const updateData = {
        galleryName: editFormData.galleryName,
        clientDetails: {
          clientName: editFormData.clientName,
          email: editFormData.email
        },
        accessKey: editFormData.accessKey,
        expirationPeriod: editFormData.expirationPeriod,
        settings: {
          allowDownloads: editFormData.allowDownloads
        }
      };
      
      const response = await put(`/gallery/${selectedGallery.galleryId}`, updateData);
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedGallery(null);
        await loadClients();
      } else {
        setError(response.message || "Failed to update gallery");
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || "Failed to update gallery");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCopyLink = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleCopyAccessKey = (accessKey, id) => {
    navigator.clipboard.writeText(accessKey);
    setCopyStatus(`key-${id}`);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const regenerateAccessKey = () => {
    const newKey = 'KEY' + Math.random().toString(36).substring(2, 15).toUpperCase();
    setEditFormData({ ...editFormData, accessKey: newKey });
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.galleryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-green-400 border-green-400/20 bg-green-400/5';
      case 'Expired': return 'text-red-400 border-red-400/20 bg-red-400/5';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!showDeleteModal) return null;
    
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-full">
                <FiTrash2 className="text-red-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Gallery</h3>
            </div>
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <p className="text-gray-400 mb-6">
            Are you sure you want to delete "<span className="text-white font-semibold">{selectedGallery?.galleryName}</span>"? 
            This action cannot be undone and will permanently remove all images and client access.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <FiAlertCircle size={16} />
              <span className="font-medium">Warning:</span>
            </div>
            <p className="text-red-400/80 text-xs mt-1">
              This will permanently delete {selectedGallery?.imageCount || 0} images and revoke access for {selectedGallery?.name}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteGallery}
              disabled={deleteLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={14} />
                  Delete Gallery
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Gallery Modal
  const EditModal = () => {
    if (!showEditModal) return null;
    
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-full">
                <FiEdit2 className="text-indigo-400" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Edit Gallery</h3>
            </div>
            <button 
              onClick={() => setShowEditModal(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Gallery Information */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <FiCamera size={14} /> Gallery Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Gallery Name</label>
                  <input
                    type="text"
                    value={editFormData.galleryName}
                    onChange={(e) => setEditFormData({...editFormData, galleryName: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                    placeholder="Gallery Name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Expiration Period</label>
                  <select
                    value={editFormData.expirationPeriod}
                    onChange={(e) => setEditFormData({...editFormData, expirationPeriod: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value="Never Expire">Never Expire</option>
                    <option value="7 Days">7 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Client Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <FiUser size={14} /> Client Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Client Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="text"
                      value={editFormData.clientName}
                      onChange={(e) => setEditFormData({...editFormData, clientName: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                      placeholder="Client Name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                      placeholder="client@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Access Settings */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <FiLock size={14} /> Access Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Access Key</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input
                        type="text"
                        value={editFormData.accessKey}
                        onChange={(e) => setEditFormData({...editFormData, accessKey: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-indigo-400 text-sm font-mono focus:border-indigo-500 outline-none"
                        placeholder="Access Key"
                      />
                    </div>
                    <button
                      onClick={regenerateAccessKey}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Generate New
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <p className="text-sm font-medium text-white">Allow Downloads</p>
                    <p className="text-xs text-gray-500">Enable clients to download images from this gallery</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.allowDownloads}
                      onChange={(e) => setEditFormData({...editFormData, allowDownloads: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateGallery}
              disabled={editLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {editLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <DashboardNavbar />
        
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiUsers className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Total Active Clients</p>
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.totalClients}</h3>
                <span className="text-green-500 text-xs font-bold">From gallery creations</span>
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiFolder className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Shared Galleries</p>
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.totalGalleries}</h3>
                <span className="text-indigo-400 text-xs font-bold">Active links</span>
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiHardDrive className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Storage Usage</p>
              </div>
              <div className="mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.totalStorage} <span className="text-lg text-gray-500">GB</span></h3>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by name, email, or gallery..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-300 outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={loadClients}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button 
                onClick={() => window.location.href = '/gallery'}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                <FiUserPlus size={16} /> Create New Client
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <FiAlertCircle className="text-red-400 flex-shrink-0" size={18} />
              <span className="text-red-400 text-sm">{error}</span>
              <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-300">
                <FiX size={18} />
              </button>
            </div>
          )}

          {/* Client Table */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-gray-500 text-sm mt-4">Loading galleries...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <FiUsers size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">No galleries found</p>
                <button 
                  onClick={() => window.location.href = '/gallery'}
                  className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Go to Gallery
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-600 tracking-widest">
                      <th className="px-8 py-6">CLIENT IDENTITY</th>
                      <th className="px-8 py-6">CONTACT & ACCESS</th>
                      <th className="px-8 py-6">STATUS</th>
                      <th className="px-8 py-6">GALLERY INFO</th>
                      <th className="px-8 py-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img 
                              src={client.avatar} 
                              alt={client.name} 
                              className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all" 
                            />
                            <div>
                              <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {client.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <FiCalendar size={10} className="text-gray-600" />
                                <p className="text-[10px] text-gray-500">
                                  Created: {formatDate(client.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FiMail size={12} className="text-gray-600" />
                              <span className="text-xs text-gray-400">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiKey size={12} className="text-gray-600" />
                              <code className="text-[11px] text-indigo-400 font-mono bg-indigo-400/10 px-2 py-1 rounded">
                                {client.accessKey}
                              </code>
                              <button 
                                onClick={() => handleCopyAccessKey(client.accessKey, client.id)}
                                className="text-gray-500 hover:text-indigo-400 transition-colors"
                                title="Copy access key"
                              >
                                {copyStatus === `key-${client.id}` ? <FiCheck size={12} className="text-green-400" /> : <FiCopy size={12} />}
                              </button>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full border w-fit ${getStatusColor(client.status)}`}>
                              {client.status}
                            </span>
                            <span className="text-[9px] text-gray-600">{client.tag}</span>
                          </div>
                        </td>
                        
                        <td className="px-8 py-6">
                          <p className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                            {client.galleryName}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <FiImage size={10} /> {client.imageCount} images
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {/* Copy Link Button */}
                            <button 
                              onClick={() => handleCopyLink(client.link, client.id)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 transition-all duration-200"
                              title="Copy gallery link"
                            >
                              {copyStatus === client.id ? <FiCheck size={16} className="text-green-400" /> : <FiCopy size={16} />}
                            </button>
                            
                            {/* View Gallery Button */}
                            <a 
                              href={client.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/10 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 transition-all duration-200"
                              title="Open gallery"
                            >
                              <FiExternalLink size={16} />
                            </a>
                            
                            {/* Edit Button */}
                            <button 
                              onClick={() => handleEditGallery(client)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-yellow-600/20 text-gray-400 hover:text-yellow-400 transition-all duration-200"
                              title="Edit gallery"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            
                            {/* Delete Button */}
                            <button 
                              onClick={() => {
                                setSelectedGallery(client);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 rounded-lg bg-white/10 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all duration-200"
                              title="Delete gallery"
                            >
                              <FiTrash2 size={16} />
                            </button>
                            
                            {/* More Options Button */}
                            <button 
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-200"
                              title="More options"
                            >
                              <FiMoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/20">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Showing {filteredClients.length} of {pagination.totalItems} galleries
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </main>
      
      {/* Modals */}
      <DeleteModal />
      <EditModal />
    </div>
  );
};

export default Clients;