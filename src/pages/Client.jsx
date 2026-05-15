import { useState, useEffect } from "react";
import {
  FiSearch, FiUserPlus, FiMoreHorizontal, FiCopy, FiCheck,
  FiExternalLink, FiUsers, FiFolder, FiHardDrive, FiTrash2,
  FiKey, FiMail, FiImage, FiAlertCircle, FiX, FiRefreshCw,
  FiCalendar, FiEdit2, FiSave, FiUser, FiAtSign, FiLock,
  FiCamera, FiClock, FiMenu, FiLink, FiDownload, FiEye,
  FiBarChart2, FiSend
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import { get, del, put } from "../utils/apiCall";
import { useMobileMenu } from "../hooks/useMobileMenu";
import SkipLink from "../components/SkipLink";

const Clients = () => {
  const [copyStatus, setCopyStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalGalleries: 0,
    activeGalleries: 0,
    totalImages: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalStorage: "0.0"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const mobileMenu = useMobileMenu();

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    galleryName: "",
    clientName: "",
    email: "",
    accessKey: "",
    expirationPeriod: "Never Expire",
    allowDownloads: true
  });

  // WhatsApp state
  const [whatsAppData, setWhatsAppData] = useState({
    senderNumber: "",
    clientNumber: "",
    customMessage: ""
  });
  const [whatsAppSending, setWhatsAppSending] = useState(false);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Load clients when page changes
  useEffect(() => {
    loadClients();
  }, [currentPage]);

  const fetchStats = async () => {
    try {
      const response = await get('/gallery/all/stats');
      console.log('📊 Stats response:', response);

      if (response.success && response.data?.overview) {
        const { overview } = response.data;
        setStats({
          totalGalleries: overview.totalGalleries || 0,
          activeGalleries: overview.activeGalleries || 0,
          totalImages: overview.totalImages || 0,
          totalViews: overview.totalViews || 0,
          totalDownloads: overview.totalDownloads || 0,
          totalStorage: formatStorageSize(overview.totalStorageUsed || '0 KB')
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const formatStorageSize = (storageString) => {
    if (!storageString) return '0.0';

    const match = storageString.match(/^([\d.]+)\s*(KB|MB|GB|TB)$/i);
    if (!match) return '0.0';

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case 'KB': return (value / (1024 * 1024)).toFixed(2);
      case 'MB': return (value / 1024).toFixed(2);
      case 'GB': return value.toFixed(2);
      case 'TB': return (value * 1024).toFixed(2);
      default: return '0.00';
    }
  };

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
          id: gallery._id,
          galleryId: gallery._id,
          galleryID: gallery.galleryInfo?.galleryID || gallery.id,
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

  // ==========================================
  // WHATSAPP FUNCTIONS (Client-side only)
  // ==========================================

  const openWhatsAppModal = (client) => {
    setSelectedGallery(client);
    setWhatsAppData({
      senderNumber: "",
      clientNumber: "",
      customMessage: `Hi ${client.name},\n\nHere is your private photo gallery: ${client.link}?accessKey=${client.accessKey}\n\nAccess Key: ${client.accessKey}\n\nEnjoy! 📸`
    });
    setShowWhatsAppModal(true);
  };

  const handleSendWhatsApp = () => {
    if (!whatsAppData.clientNumber) {
      setError("Please enter the client's WhatsApp number");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setWhatsAppSending(true);

    // Clean the phone number (remove non-digits)
    const cleanNumber = whatsAppData.clientNumber.replace(/\D/g, '');

    // Encode the message for URL
    const message = encodeURIComponent(whatsAppData.customMessage);

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

    // Small delay for UX
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setWhatsAppSending(false);
      setShowWhatsAppModal(false);

      // Show success message
      setError("WhatsApp opened! Send the message to share the gallery.");
      setTimeout(() => setError(""), 4000);
    }, 500);
  };

  const openDeleteModal = (client) => {
    setSelectedGallery(client);
    setDeleteConfirmText("");
    setShowDeleteModal(true);
  };

  const handleDeleteGallery = async () => {
    if (!selectedGallery) return;

    if (deleteConfirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await del(`/gallery/main/${selectedGallery.galleryId}`);

      if (response.success) {
        setShowDeleteModal(false);
        setSelectedGallery(null);
        setDeleteConfirmText("");
        await loadClients();
        await fetchStats();
      } else {
        setError(response.message || "Failed to delete gallery");
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data?.message || error.message || "Failed to delete gallery");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditGallery = (client) => {
    // Disabled for now - uncomment when ready
    // setSelectedGallery(client);
    // setEditFormData({...});
    // setShowEditModal(true);
    alert("Edit gallery feature coming soon!");
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
        await fetchStats();
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
    const client = clients.find(c => c.id === id);
    const fullLink = client ? `${link}?accessKey=${client.accessKey}` : link;
    navigator.clipboard.writeText(fullLink);
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
    switch (status) {
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

  // ==========================================
  // WHATSAPP MODAL
  // ==========================================
  const WhatsAppModal = () => {
    if (!showWhatsAppModal || !selectedGallery) return null;

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">

        <div className="
        bg-[#0a0a0a]
        border border-white/10
        rounded-2xl
        w-full
        max-w-2xl
        max-h-[90vh]
        overflow-hidden
        shadow-2xl
        flex flex-col
      ">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <FaWhatsapp className="text-green-500" size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Share via WhatsApp
                </h3>
                <p className="text-xs text-gray-500">
                  Send gallery link to your client
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="text-gray-500 hover:text-white transition-colors p-1"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">

            {/* Gallery Info Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div>
                  <p className="text-[9px] uppercase text-gray-500 tracking-wider">
                    Gallery
                  </p>

                  <p className="text-sm text-white font-medium mt-0.5 break-words">
                    {selectedGallery.galleryName}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase text-gray-500 tracking-wider">
                    Client
                  </p>

                  <p className="text-sm text-white font-medium mt-0.5 break-words">
                    {selectedGallery.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 overflow-hidden">
                <FiKey size={12} className="text-gray-500 shrink-0" />

                <code className="text-xs text-indigo-400 font-mono truncate">
                  {selectedGallery.accessKey}
                </code>
              </div>
            </div>

            {/* Client Number Input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Client's WhatsApp Number *
              </label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <FaWhatsapp className="text-green-500" size={16} />
                  <span className="text-gray-600">|</span>
                </div>

                <input
                  type="tel"
                  value={whatsAppData.clientNumber}
                  onChange={(e) =>
                    setWhatsAppData({
                      ...whatsAppData,
                      clientNumber: e.target.value,
                    })
                  }
                  placeholder="+233 50 987 6543"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-[72px] pr-4 py-3 text-white text-sm focus:border-green-500 outline-none transition-all placeholder:text-gray-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Message
              </label>

              <textarea
                value={whatsAppData.customMessage}
                onChange={(e) =>
                  setWhatsAppData({
                    ...whatsAppData,
                    customMessage: e.target.value,
                  })
                }
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 outline-none transition-all resize-none placeholder:text-gray-600"
                placeholder="Customize your message..."
              />

              <p className="text-[10px] text-gray-600 mt-1">
                Gallery link and access key will be included automatically
              </p>
            </div>

            {/* Preview */}
            <div className="bg-green-500/[0.03] border border-green-500/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaWhatsapp size={12} className="text-green-500" />

                <p className="text-[10px] uppercase text-green-400 font-bold tracking-wider">
                  Preview
                </p>
              </div>

              <p className="text-xs text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
                {whatsAppData.customMessage}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-6 flex gap-3 shrink-0">

            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleSendWhatsApp}
              disabled={whatsAppSending || !whatsAppData.clientNumber}
              className="flex-[2] px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/20"
            >
              {whatsAppSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  <FaWhatsapp size={16} />
                  Share via WhatsApp
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!showDeleteModal || !selectedGallery) return null;

    const isConfirmValid = deleteConfirmText === "DELETE";

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-full">
                  <FiTrash2 className="text-red-500" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Gallery</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Warning */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <FiAlertCircle size={18} />
                <span className="font-bold text-sm uppercase tracking-wider">Permanent Deletion</span>
              </div>
              <p className="text-red-400/80 text-xs leading-relaxed">
                This action cannot be undone. Everything associated with this gallery will be permanently deleted.
              </p>
            </div>

            {/* Gallery Details */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Details</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase text-gray-600">Gallery Name</p>
                  <p className="text-sm text-white font-medium">{selectedGallery.galleryName}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-600">Gallery ID</p>
                  <p className="text-xs text-indigo-400 font-mono">{selectedGallery.galleryID}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-600">Client</p>
                  <p className="text-sm text-white">{selectedGallery.name}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-600">Email</p>
                  <p className="text-xs text-gray-400 truncate">{selectedGallery.email}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-600">Images</p>
                  <p className="text-sm text-white font-bold">{selectedGallery.imageCount || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-gray-600">Status</p>
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(selectedGallery.status)}`}>
                    {selectedGallery.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3">
                <p className="text-[9px] uppercase text-gray-600 mb-1">Gallery URL</p>
                <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-white/5">
                  <FiLink size={12} className="text-gray-500 flex-shrink-0" />
                  <p className="text-[10px] text-gray-400 truncate">{selectedGallery.link}</p>
                </div>
              </div>
            </div>

            {/* What Will Be Lost */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">What Will Be Lost</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiImage size={12} className="text-red-400/60" />
                  <span>{selectedGallery.imageCount || 0} images from Cloudinary</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiFolder size={12} className="text-red-400/60" />
                  <span>Gallery and all metadata</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiKey size={12} className="text-red-400/60" />
                  <span>Access keys and permissions</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiLink size={12} className="text-red-400/60" />
                  <span>Gallery share link</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiUser size={12} className="text-red-400/60" />
                  <span>Client access for {selectedGallery.name}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-3">
                Type <span className="text-white font-bold bg-red-500/20 px-2 py-0.5 rounded">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none transition-all ${deleteConfirmText === "DELETE"
                  ? 'border-red-500 text-red-400'
                  : 'border-white/10 text-gray-400'
                  }`}
                autoFocus
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/10 p-6 rounded-b-2xl">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGallery}
                disabled={!isConfirmValid || deleteLoading}
                className={`flex-1 px-4 py-3 rounded-xl transition-all text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isConfirmValid && !deleteLoading
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-red-600/20 text-red-400/50 cursor-not-allowed'
                  }`}
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
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

        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-4 md:space-y-8 pb-safe">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiFolder className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Total Galleries</p>
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.totalGalleries}</h3>
                <span className="text-green-500 text-xs font-bold">All time</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiUsers className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Active Galleries</p>
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.activeGalleries}</h3>
                <span className="text-indigo-400 text-xs font-bold">Currently active</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiImage className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Total Images</p>
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.totalImages}</h3>
                <span className="text-green-500 text-xs font-bold">Across all galleries</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <FiHardDrive className="text-indigo-400" size={20} />
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Storage Used</p>
              </div>
              <div className="mt-2">
                <h3 className="text-4xl font-bold text-white">{stats.totalStorage} <span className="text-lg text-gray-500">GB</span></h3>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${Math.min((parseFloat(stats.totalStorage) / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, or gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-10 md:pl-12 pr-4 text-xs md:text-sm text-gray-300 outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={() => { loadClients(); fetchStats(); }}
                disabled={isLoading}
                className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 touch-target"
              >
                <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => window.location.href = '/gallery'}
                className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 md:px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 touch-target"
              >
                <FiUserPlus size={16} /> <span className="hidden sm:inline">Create New Client</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`rounded-xl p-4 flex items-center gap-3 ${error.includes('successfully') || error.includes('WhatsApp opened') ? 'bg-green-600/10 border border-green-500/20' : 'bg-red-600/10 border border-red-500/20'}`}>
              <FiAlertCircle className={error.includes('successfully') || error.includes('WhatsApp opened') ? 'text-green-400' : 'text-red-400'} size={18} />
              <span className={error.includes('successfully') || error.includes('WhatsApp opened') ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{error}</span>
              <button onClick={() => setError("")} className="ml-auto text-gray-400 hover:text-gray-300">
                <FiX size={18} />
              </button>
            </div>
          )}

          {/* Client Table/List */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-gray-500 text-xs md:text-sm mt-4">Loading galleries...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <FiUsers size={24} md:size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">No galleries found</p>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="mt-4 px-4 md:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 touch-target"
                >
                  Go to Gallery
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-white/5">
                  {filteredClients.map((client) => (
                    <div key={client.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{client.name}</p>
                          <p className="text-xs text-gray-400 truncate">{client.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border w-fit ${getStatusColor(client.status)}`}>
                              {client.status}
                            </span>
                            <span className="text-[9px] text-gray-500">• {client.galleryName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <FiImage size={12} /> {client.imageCount} images
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <FiKey size={12} /> <code className="text-indigo-400 font-mono text-[10px]">{client.accessKey}</code>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleCopyLink(client.link, client.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-indigo-400 transition-all active:scale-95 touch-target"
                        >
                          {copyStatus === client.id ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
                          <span className="text-xs">Link</span>
                        </button>
                        <a
                          href={`${client.link}?accessKey=${client.accessKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-indigo-400 transition-all active:scale-95 touch-target"
                        >
                          <FiExternalLink size={14} /> <span className="text-xs">View</span>
                        </a>
                        {/* WhatsApp button - Mobile */}
                        <button
                          onClick={() => openWhatsAppModal(client)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-600/20 rounded-lg text-green-400 hover:bg-green-600/40 transition-all active:scale-95 touch-target"
                          title="Share via WhatsApp"
                        >
                          <FaWhatsapp size={14} />
                          <span className="text-xs">Share</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(client)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-all active:scale-95 touch-target"
                        >
                          <FiTrash2 size={14} /> <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-600 tracking-widest">
                          <th className="px-6 md:px-8 py-4 md:py-6">CLIENT IDENTITY</th>
                          <th className="px-6 md:px-8 py-4 md:py-6">CONTACT & ACCESS</th>
                          <th className="px-6 md:px-8 py-4 md:py-6">STATUS</th>
                          <th className="px-6 md:px-8 py-4 md:py-6">GALLERY INFO</th>
                          <th className="px-6 md:px-8 py-4 md:py-6 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 md:px-8 py-4 md:py-6">
                              <div className="flex items-center gap-3 md:gap-4">
                                <img
                                  src={client.avatar}
                                  alt={client.name}
                                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
                                />
                                <div>
                                  <p className="text-xs md:text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
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

                            <td className="px-6 md:px-8 py-4 md:py-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FiMail size={12} className="text-gray-600" />
                                  <span className="text-xs text-gray-400">{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiKey size={12} className="text-gray-600" />
                                  <code className="text-[10px] md:text-[11px] text-indigo-400 font-mono bg-indigo-400/10 px-2 py-1 rounded">
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

                            <td className="px-6 md:px-8 py-4 md:py-6">
                              <div className="flex flex-col gap-1">
                                <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full border w-fit ${getStatusColor(client.status)}`}>
                                  {client.status}
                                </span>
                                <span className="text-[9px] text-gray-600">{client.tag}</span>
                              </div>
                            </td>

                            <td className="px-6 md:px-8 py-4 md:py-6">
                              <p className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                {client.galleryName}
                              </p>
                              <div className="flex items-center gap-2 mt-1 md:mt-2">
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <FiImage size={10} /> {client.imageCount} images
                                </span>
                              </div>
                            </td>

                            <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                              <div className="flex justify-end items-center gap-1 md:gap-2">
                                <button
                                  onClick={() => handleCopyLink(client.link, client.id)}
                                  className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 transition-all duration-200 active:scale-95 touch-target"
                                  title="Copy gallery link"
                                >
                                  {copyStatus === client.id ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
                                </button>

                                <a
                                  href={`${client.link}?accessKey=${client.accessKey}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 transition-all duration-200 active:scale-95 touch-target"
                                  title="Open gallery"
                                >
                                  <FiExternalLink size={14} />
                                </a>

                                {/* WhatsApp button - Desktop */}
                                <button
                                  onClick={() => openWhatsAppModal(client)}
                                  className="p-1.5 md:p-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 hover:text-green-300 transition-all duration-200 active:scale-95 touch-target"
                                  title="Share via WhatsApp"
                                >
                                  <FaWhatsapp size={14} />
                                </button>

                                {/* Edit button - DISABLED */}
                                <button
                                  onClick={() => handleEditGallery(client)}
                                  className="p-1.5 md:p-2 rounded-lg bg-white/10 text-gray-600 cursor-not-allowed transition-all duration-200 active:scale-95 touch-target opacity-50"
                                  title="Edit gallery (coming soon)"
                                  disabled
                                >
                                  <FiEdit2 size={14} />
                                </button>

                                <button
                                  onClick={() => openDeleteModal(client)}
                                  className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all duration-200 active:scale-95 touch-target"
                                  title="Delete gallery"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {pagination.totalPages > 1 && (
              <div className="p-4 md:p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 bg-black/20">
                <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest">
                  Showing {filteredClients.length} of {pagination.totalItems} galleries
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 md:px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-target"
                  >
                    Previous
                  </button>
                  <span className="px-3 md:px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={!pagination.hasNextPage}
                    className="px-3 md:px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-target"
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
      <WhatsAppModal />
    </div>
  );
};

export default Clients;