import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  FiSearch, FiUserPlus, FiCopy, FiCheck,
  FiExternalLink, FiUsers, FiFolder, FiHardDrive, FiTrash2,
  FiKey, FiMail, FiImage, FiAlertCircle, FiX, FiRefreshCw,
  FiCalendar, FiEdit2, FiUser, FiLink
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import { get, del, put } from "../utils/apiCall";
import { useMobileMenu } from "../hooks/useMobileMenu";
import SkipLink from "../components/SkipLink";

// Environment variable for storage limit (default: 5GB)
const MAX_STORAGE_GB = parseFloat(import.meta.env.REACT_APP_MAX_STORAGE_GB || 5);

// Separate modal components for better performance
const DeleteModal = ({ isOpen, gallery, onClose, onConfirm, isLoading, getStatusColor }) => {
  const [confirmText, setConfirmText] = useState("");
  
  if (!isOpen || !gallery) return null;
  
  const isConfirmValid = confirmText === "DELETE";
  
  return (
     <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 md:backdrop-blur-sm" onClick={onClose}>
       <div className="isolate transform-gpu will-change-transform backface-hidden bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-full">
                <FiTrash2 className="text-red-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Gallery</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors" aria-label="Close">
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <FiAlertCircle size={18} />
              <span className="font-bold text-sm uppercase tracking-wider">Permanent Deletion</span>
            </div>
            <p className="text-red-400/80 text-xs leading-relaxed">
              This action cannot be undone. Everything associated with this gallery will be permanently deleted.
            </p>
          </div>

           <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
             <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-[9px] uppercase text-gray-600">Gallery Name</p><p className="text-sm text-white font-medium">{gallery.galleryName}</p></div>
              <div><p className="text-[9px] uppercase text-gray-600">Client</p><p className="text-sm text-white">{gallery.name}</p></div>
              <div><p className="text-[9px] uppercase text-gray-600">Images</p><p className="text-sm text-white font-bold">{gallery.imageCount || 0}</p></div>
              <div><p className="text-[9px] uppercase text-gray-600">Status</p><span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(gallery.status)}`}>{gallery.status}</span></div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-3">Type <span className="text-white font-bold bg-red-500/20 px-2 py-0.5 rounded">DELETE</span> to confirm:</p>
            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type DELETE to confirm" className="w-full bg-black/40 border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none transition-colors transition-transform transition-opacity border-white/10 text-gray-400" autoFocus />
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/10 p-6 rounded-b-2xl">
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium">Cancel</button>
            <button onClick={onConfirm} disabled={!isConfirmValid || isLoading} className={`flex-1 px-4 py-3 rounded-xl transition-colors transition-transform transition-opacity text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isConfirmValid && !isLoading ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-600/20 text-red-400/50 cursor-not-allowed'}`}>
              {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</> : <><FiTrash2 size={16} />Delete Permanently</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WhatsAppModal = ({ isOpen, gallery, onClose, onSend, isLoading, error: modalError }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (gallery) {
      setMessage(`Hi ${gallery.name},\n\nHere is your private photo gallery: ${gallery.link}?accessKey=${gallery.accessKey}\n\nAccess Key: ${gallery.accessKey}\n\nEnjoy! 📸`);
    }
  }, [gallery]);
  
  if (!isOpen || !gallery) return null;
  
  return (
     <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 md:backdrop-blur-sm" onClick={onClose}>
       <div className="isolate transform-gpu will-change-transform backface-hidden bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full"><FaWhatsapp className="text-green-500" size={20} /></div>
            <div><h3 className="text-lg font-bold text-white">Share via WhatsApp</h3><p className="text-xs text-gray-500">Send gallery link to your client</p></div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1" aria-label="Close"><FiX size={20} /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><p className="text-[9px] uppercase text-gray-500 tracking-wider">Gallery</p><p className="text-sm text-white font-medium mt-0.5 break-words">{gallery.galleryName}</p></div>
              <div><p className="text-[9px] uppercase text-gray-500 tracking-wider">Client</p><p className="text-sm text-white font-medium mt-0.5 break-words">{gallery.name}</p></div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 overflow-hidden"><FiKey size={12} className="text-gray-500 shrink-0" /><code className="text-xs text-indigo-400 font-mono truncate">{gallery.accessKey}</code></div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Client's WhatsApp Number *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2"><FaWhatsapp className="text-green-500" size={16} /><span className="text-gray-600">|</span></div>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+233 50 987 6543" className="w-full bg-black/40 border border-white/10 rounded-xl pl-[72px] pr-4 py-3 text-white text-sm focus:border-green-500 outline-none transition-colors transition-transform transition-opacity placeholder:text-gray-600" autoFocus />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 outline-none transition-colors transition-transform transition-opacity resize-none placeholder:text-gray-600" />
            <p className="text-[10px] text-gray-600 mt-1">Gallery link and access key will be included automatically</p>
          </div>

          <div className="bg-green-500/[0.03] border border-green-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><FaWhatsapp size={12} className="text-green-500" /><p className="text-[10px] uppercase text-green-400 font-bold tracking-wider">Preview</p></div>
            <p className="text-xs text-gray-300 whitespace-pre-wrap break-words leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="border-t border-white/10 p-6 flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium">Cancel</button>
          <button onClick={() => onSend(phoneNumber, message)} disabled={isLoading || !phoneNumber} className="flex-[2] px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors transition-transform transition-opacity shadow-lg shadow-green-600/20">
            {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Opening WhatsApp...</> : <><FaWhatsapp size={16} />Share via WhatsApp</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// Table row component with memo for performance
const ClientTableRow = React.memo(({ client, copyStatus, onCopyLink, onCopyAccessKey, onOpenWhatsApp, onOpenDelete, formatDate, getStatusColor }) => (
  <tr className="group hover:bg-white/[0.02] transition-colors">
    <td className="px-6 md:px-8 py-4 md:py-6">
      <div className="flex items-center gap-3 md:gap-4">
        <img src={client.avatar} alt={client.name} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-colors transition-transform transition-opacity" />
        <div>
          <p className="text-xs md:text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{client.name}</p>
          <div className="flex items-center gap-2 mt-1"><FiCalendar size={10} className="text-gray-600" /><p className="text-[10px] text-gray-500">Created: {formatDate(client.createdAt)}</p></div>
        </div>
      </div>
    </td>
    <td className="px-6 md:px-8 py-4 md:py-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2"><FiMail size={12} className="text-gray-600" /><span className="text-xs text-gray-400">{client.email}</span></div>
        <div className="flex items-center gap-2"><FiKey size={12} className="text-gray-600" /><code className="text-[10px] md:text-[11px] text-indigo-400 font-mono bg-indigo-400/10 px-2 py-1 rounded">{client.accessKey}</code>
          <button onClick={() => onCopyAccessKey(client.accessKey, client.id)} className="text-gray-500 hover:text-indigo-400 transition-colors" aria-label="Copy access key">
            {copyStatus === `key-${client.id}` ? <FiCheck size={12} className="text-green-400" /> : <FiCopy size={12} />}
          </button>
        </div>
      </div>
    </td>
    <td className="px-6 md:px-8 py-4 md:py-6"><span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full border w-fit ${getStatusColor(client.status)}`}>{client.status}</span></td>
    <td className="px-6 md:px-8 py-4 md:py-6">
      <p className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">{client.galleryName}</p>
      <div className="flex items-center gap-2 mt-1 md:mt-2"><span className="text-[10px] text-gray-500 flex items-center gap-1"><FiImage size={10} /> {client.imageCount} images</span></div>
    </td>
    <td className="px-6 md:px-8 py-4 md:py-6 text-right">
      <div className="flex justify-end items-center gap-1 md:gap-2">
        <button onClick={() => onCopyLink(client.link, client.id)} className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 transition-colors transition-transform transition-opacity duration-200 active:scale-95" aria-label="Copy gallery link">
          {copyStatus === client.id ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}
        </button>
        <a href={`${client.link}?accessKey=${client.accessKey}`} target="_blank" rel="noopener noreferrer" className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-400 transition-colors transition-transform transition-opacity duration-200 active:scale-95" aria-label="Open gallery">
          <FiExternalLink size={14} />
        </a>
        <button onClick={() => onOpenWhatsApp(client)} className="p-1.5 md:p-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 hover:text-green-300 transition-colors transition-transform transition-opacity duration-200 active:scale-95" aria-label="Share via WhatsApp">
          <FaWhatsapp size={14} />
        </button>
        <button onClick={() => onOpenDelete(client)} className="p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors transition-transform transition-opacity duration-200 active:scale-95" aria-label="Delete gallery">
          <FiTrash2 size={14} />
        </button>
      </div>
    </td>
  </tr>
));

const MobileClientCard = React.memo(({ client, copyStatus, onCopyLink, onOpenWhatsApp, onOpenDelete, getStatusColor }) => (
  <div className="p-4 hover:bg-white/[0.02] transition-colors border-b border-white/5">
    <div className="flex items-start gap-3 mb-3">
      <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{client.name}</p>
        <p className="text-xs text-gray-400 truncate">{client.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border w-fit ${getStatusColor(client.status)}`}>{client.status}</span>
          <span className="text-[9px] text-gray-500">• {client.galleryName}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <div className="flex items-center gap-1 text-gray-500"><FiImage size={12} /> {client.imageCount} images</div>
      <div className="flex items-center gap-1 text-gray-500"><FiKey size={12} /> <code className="text-indigo-400 font-mono text-[10px]">{client.accessKey}</code></div>
    </div>
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
      <button onClick={() => onCopyLink(client.link, client.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors transition-transform transition-opacity active:scale-95">
        {copyStatus === client.id ? <FiCheck size={14} className="text-green-400" /> : <FiCopy size={14} />}<span className="text-xs">Link</span>
      </button>
      <a href={`${client.link}?accessKey=${client.accessKey}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors transition-transform transition-opacity active:scale-95">
        <FiExternalLink size={14} /><span className="text-xs">View</span>
      </a>
      <button onClick={() => onOpenWhatsApp(client)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-green-600/20 rounded-lg text-green-400 hover:bg-green-600/40 transition-colors transition-transform transition-opacity active:scale-95">
        <FaWhatsapp size={14} /><span className="text-xs">Share</span>
      </button>
      <button onClick={() => onOpenDelete(client)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-colors transition-transform transition-opacity active:scale-95">
        <FiTrash2 size={14} /><span className="text-xs">Delete</span>
      </button>
    </div>
  </div>
));

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, subtitleColor = "text-green-500", storagePercentage }) => {
  if (storagePercentage !== undefined) {
  return (
    <div className="isolate transform-gpu will-change-transform bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-colors transition-transform transition-opacity">
      <div className="flex items-center gap-3 mb-2"><Icon className="text-indigo-400" size={20} /><p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{title}</p></div>
      <div className="mt-2"><h3 className="text-4xl font-bold text-white">{value} <span className="text-lg text-gray-500">GB</span></h3>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden"><div className="bg-indigo-500 h-full transition-colors transition-transform transition-opacity duration-500" style={{ width: `${Math.min(storagePercentage, 100)}%` }} /></div>
      </div>
    </div>
  );
  }
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/20 transition-colors transition-transform transition-opacity">
      <div className="flex items-center gap-3 mb-2"><Icon className="text-indigo-400" size={20} /><p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{title}</p></div>
      <div className="flex items-baseline gap-4 mt-2"><h3 className="text-4xl font-bold text-white">{value}</h3><span className={`${subtitleColor} text-xs font-bold`}>{subtitle}</span></div>
    </div>
  );
};

const Clients = () => {
  const [copyStatus, setCopyStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ totalGalleries: 0, activeGalleries: 0, totalImages: 0, totalStorage: "0.0" });
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [whatsAppSending, setWhatsAppSending] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10, hasNextPage: false, hasPrevPage: false });
  const [currentPage, setCurrentPage] = useState(1);
  const mobileMenu = useMobileMenu();
  const searchTimeoutRef = useRef(null);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchTerm]);

  // Global styles for hardware acceleration and overflow fixes
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Force hardware acceleration */
      .transform-gpu {
        transform: translateZ(0);
      }
      .will-change-transform {
        will-change: transform;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      /* Fix Safari/Android PWA scroll bug */
      html,
      body,
      #root {
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { loadClients(); }, [currentPage]);

  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const response = await get('/gallery/all/stats');
      if (response.success && response.data?.overview) {
        const { overview } = response.data;
        setStats({
          totalGalleries: overview.totalGalleries || 0,
          activeGalleries: overview.activeGalleries || 0,
          totalImages: overview.totalImages || 0,
          totalStorage: formatStorageSize(overview.totalStorageUsed || '0 KB')
        });
      }
    } catch (error) { console.error('Failed to fetch stats:', error); }
    finally { setIsStatsLoading(false); }
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
      if (response.success) {
        let galleries = [], paginationData = null;
        if (Array.isArray(response.data)) { galleries = response.data; paginationData = response.pagination; }
        else if (response.data && Array.isArray(response.data.galleries)) { galleries = response.data.galleries; paginationData = response.data.pagination || response.pagination; }
        else if (response.data && response.data.data) { galleries = response.data.data; paginationData = response.data.pagination; }
        else { galleries = []; paginationData = response.pagination; }

        const clientList = galleries.map(gallery => ({
          id: gallery._id, galleryId: gallery._id, galleryID: gallery.galleryInfo?.galleryID || gallery.id,
          name: gallery.clientDetails?.clientName || gallery.clientDetails?.name || 'N/A',
          email: gallery.clientDetails?.email || 'N/A', status: gallery.isAccessKeyActive ? "Active" : "Expired",
          galleryName: gallery.galleryInfo?.galleryName || gallery.galleryName || 'Untitled',
          link: gallery.galleryUrl || gallery.shareLink || '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(gallery.clientDetails?.clientName || gallery.clientDetails?.name || 'User')}&background=4f46e5&color=fff&bold=true&length=2`,
          createdAt: gallery.clientDetails?.dateCreated || gallery.createdAt || new Date().toISOString(),
          imageCount: gallery.galleryInfo?.totalImages || gallery.imageCount || 0,
          accessKey: gallery.accessKey || 'N/A', expiration: gallery.galleryInfo?.expirationPeriod || gallery.expiration || 'Never Expire',
          originalData: gallery
        }));
        setClients(clientList);
        if (paginationData) setPagination({
          currentPage: paginationData.currentPage || 1, totalPages: paginationData.totalPages || 1,
          totalItems: paginationData.totalItems || clientList.length, itemsPerPage: paginationData.itemsPerPage || 10,
          hasNextPage: paginationData.hasNextPage || false, hasPrevPage: paginationData.hasPrevPage || false
        });
      } else throw new Error(response.message || "Failed to load galleries");
    } catch (error) { console.error('Failed to load clients:', error); setError(error.message || "Failed to load galleries"); }
    finally { setIsLoading(false); }
  };

  const openWhatsAppModal = (client) => { setSelectedGallery(client); setShowWhatsAppModal(true); };
  
  const handleSendWhatsApp = useCallback((phoneNumber, message) => {
    if (!phoneNumber) { setError("Please enter the client's WhatsApp number"); setTimeout(() => setError(""), 3000); return; }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!phoneRegex.test(cleanNumber) && !phoneRegex.test('+' + cleanNumber)) { setError("Please enter a valid phone number (e.g., +1234567890)"); setTimeout(() => setError(""), 3000); return; }
    setWhatsAppSending(true);
    const finalNumber = cleanNumber.startsWith('+') ? cleanNumber.substring(1) : cleanNumber;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodedMessage}`;
    setTimeout(() => { window.open(whatsappUrl, '_blank', 'noopener,noreferrer'); setWhatsAppSending(false); setShowWhatsAppModal(false); setError("WhatsApp opened! Send the message to share the gallery."); setTimeout(() => setError(""), 4000); }, 500);
  }, []);

  const openDeleteModal = (client) => { setSelectedGallery(client); setShowDeleteModal(true); };
  
  const handleDeleteGallery = async () => {
    if (!selectedGallery) return;
    setDeleteLoading(true);
    try {
      const response = await del(`/gallery/main/${selectedGallery.galleryId}`);
      if (response.success) { setShowDeleteModal(false); setSelectedGallery(null); await loadClients(); await fetchStats(); }
      else setError(response.message || "Failed to delete gallery");
    } catch (error) { console.error('Delete error:', error); setError(error.response?.data?.message || error.message || "Failed to delete gallery"); }
    finally { setDeleteLoading(false); }
  };

  const handleCopyLink = useCallback((link, id) => {
    const client = clients.find(c => c.id === id);
    const fullLink = client ? `${link}?accessKey=${client.accessKey}` : link;
    navigator.clipboard.writeText(fullLink);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  }, [clients]);

  const handleCopyAccessKey = useCallback((accessKey, id) => {
    navigator.clipboard.writeText(accessKey);
    setCopyStatus(`key-${id}`);
    setTimeout(() => setCopyStatus(null), 2000);
  }, []);

  const filteredClients = useMemo(() => {
    if (!debouncedSearchTerm) return clients;
    const term = debouncedSearchTerm.toLowerCase();
    return clients.filter(client => client.name.toLowerCase().includes(term) || client.email.toLowerCase().includes(term) || client.galleryName.toLowerCase().includes(term));
  }, [clients, debouncedSearchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-400 border-green-400/20 bg-green-400/5';
      case 'Expired': return 'text-red-400 border-red-400/20 bg-red-400/5';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const storagePercentage = (parseFloat(stats.totalStorage) / MAX_STORAGE_GB) * 100;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <SkipLink />
      <Sidebar isMobileMenuOpen={mobileMenu.isOpen} closeMobileMenu={mobileMenu.close} />
      <main id="main-content" className={`flex-1 flex flex-col ${mobileMenu.isOpen ? 'ml-0' : ''} lg:ml-64 overflow-x-hidden`} tabIndex={-1}>
        <DashboardNavbar onMenuToggle={mobileMenu.toggle} isMobileMenuOpen={mobileMenu.isOpen} />
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4 md:space-y-6 lg:space-y-8 pb-safe">
          
          {/* Stats Grid - Fixed overflow issue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard icon={FiFolder} title="Total Galleries" value={stats.totalGalleries} subtitle="All time" subtitleColor="text-green-500" isLoading={isStatsLoading} />
            <StatsCard icon={FiUsers} title="Active Galleries" value={stats.activeGalleries} subtitle="Currently active" subtitleColor="text-indigo-400" isLoading={isStatsLoading} />
            <StatsCard icon={FiImage} title="Total Images" value={stats.totalImages} subtitle="Across all galleries" subtitleColor="text-green-500" isLoading={isStatsLoading} />
            <StatsCard icon={FiHardDrive} title="Storage Used" value={stats.totalStorage} storagePercentage={storagePercentage} isLoading={isStatsLoading} />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-96">
              <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Search by name, email, or gallery..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-300 outline-none focus:border-indigo-500/50 transition-colors transition-transform transition-opacity" aria-label="Search clients" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => { loadClients(); fetchStats(); }} disabled={isLoading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors transition-transform transition-opacity active:scale-95" aria-label="Refresh">
                <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} /><span className="hidden sm:inline">Refresh</span>
              </button>
              <button onClick={() => window.location.href = '/gallery'} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors transition-transform transition-opacity shadow-lg active:scale-95" aria-label="Create new client">
                <FiUserPlus size={16} /><span className="hidden sm:inline">Create New Client</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`rounded-xl p-4 flex items-center gap-3 ${error.includes('successfully') || error.includes('WhatsApp opened') ? 'bg-green-600/10 border border-green-500/20' : 'bg-red-600/10 border border-red-500/20'}`} role="alert">
              <FiAlertCircle className={error.includes('successfully') || error.includes('WhatsApp opened') ? 'text-green-400' : 'text-red-400'} size={18} />
              <span className={error.includes('successfully') || error.includes('WhatsApp opened') ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{error}</span>
              <button onClick={() => setError("")} className="ml-auto text-gray-400 hover:text-gray-300" aria-label="Dismiss"><FiX size={18} /></button>
            </div>
          )}

           {/* Client Table/List */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="text-center py-20" role="status">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-gray-500 text-sm mt-4">Loading galleries...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center"><FiUsers size={32} className="text-gray-600" /></div>
                <p className="text-gray-500 text-sm">No galleries found</p>
                <button onClick={() => window.location.href = '/dashboard'} className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors transition-transform transition-opacity active:scale-95">Go to Gallery</button>
              </div>
            ) : (
              <>
                {/* Mobile Layout */}
                <div className="block lg:hidden divide-y divide-white/5">
                  {filteredClients.map(client => <MobileClientCard key={client.id} client={client} copyStatus={copyStatus} onCopyLink={handleCopyLink} onOpenWhatsApp={openWhatsAppModal} onOpenDelete={openDeleteModal} getStatusColor={getStatusColor} />)}
                </div>
                {/* Desktop Table Layout */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead><tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-600 tracking-widest"><th className="px-6 py-5">CLIENT IDENTITY</th><th className="px-6 py-5">CONTACT & ACCESS</th><th className="px-6 py-5">STATUS</th><th className="px-6 py-5">GALLERY INFO</th><th className="px-6 py-5 text-right">ACTIONS</th></tr></thead>
                    <tbody className="divide-y divide-white/5">{filteredClients.map(client => <ClientTableRow key={client.id} client={client} copyStatus={copyStatus} onCopyLink={handleCopyLink} onCopyAccessKey={handleCopyAccessKey} onOpenWhatsApp={openWhatsAppModal} onOpenDelete={openDeleteModal} formatDate={formatDate} getStatusColor={getStatusColor} />)}</tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 bg-black/20">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Showing {filteredClients.length} of {pagination.totalItems} galleries</p>
                <div className="flex gap-2"><button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={!pagination.hasPrevPage} className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm border border-white/10 hover:bg-white/10 transition-colors transition-transform transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">Previous</button><span className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">{pagination.currentPage} / {pagination.totalPages}</span><button onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))} disabled={!pagination.hasNextPage} className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm border border-white/10 hover:bg-white/10 transition-colors transition-transform transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">Next</button></div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>

      <DeleteModal isOpen={showDeleteModal} gallery={selectedGallery} onClose={() => { setShowDeleteModal(false); setSelectedGallery(null); }} onConfirm={handleDeleteGallery} isLoading={deleteLoading} getStatusColor={getStatusColor} />
      <WhatsAppModal isOpen={showWhatsAppModal} gallery={selectedGallery} onClose={() => { setShowWhatsAppModal(false); setSelectedGallery(null); }} onSend={handleSendWhatsApp} isLoading={whatsAppSending} />
    </div>
  );
};

export default Clients;