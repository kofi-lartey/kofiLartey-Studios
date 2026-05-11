import { useState, useEffect } from "react";
import { FiSearch, FiUserPlus, FiMoreHorizontal, FiCopy, FiCheck, FiExternalLink, FiUsers, FiFolder, FiHardDrive } from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";

const Clients = () => {
  const [copyStatus, setCopyStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalGalleries: 0,
    totalStorage: 0
  });

  // Load clients from localStorage
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    // Get all galleries from localStorage
    const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    
    // Transform galleries into client format
    const clientList = galleries.map(gallery => {
      // Calculate total images in this gallery
      const galleryKey = `gallery_${gallery.id}`;
      const galleryImages = JSON.parse(localStorage.getItem(galleryKey) || '[]');
      const totalSize = galleryImages.reduce((sum, img) => sum + (img.size || 0), 0);
      
      return {
        id: gallery.id,
        name: gallery.clientName || gallery.name,
        email: gallery.clientEmail,
        status: gallery.downloadPermissions ? "Active" : "Maintenance",
        tag: gallery.expiration === "never" ? "Unlimited" : `Expires: ${gallery.expiration}`,
        galleries: 1, // Each gallery has one client
        galleryName: gallery.name,
        link: gallery.shareLink || `${window.location.origin}/gallery/${gallery.name.toLowerCase().replace(/\s+/g, "_")}/${gallery.id}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(gallery.clientName || gallery.name)}&background=4f46e5&color=fff&bold=true&length=2`,
        createdAt: gallery.createdAt,
        imageCount: galleryImages.length,
        storageUsed: totalSize,
        accessKey: gallery.accessKey,
        expiration: gallery.expiration,
        downloadPermissions: gallery.downloadPermissions
      };
    });
    
    setClients(clientList);
    
    // Calculate stats
    const totalClients = clientList.length;
    const totalGalleries = clientList.reduce((sum, client) => sum + client.galleries, 0);
    const totalStorage = clientList.reduce((sum, client) => sum + (client.storageUsed || 0), 0);
    
    setStats({
      totalClients,
      totalGalleries,
      totalStorage: (totalStorage / 1024 / 1024 / 1024).toFixed(1) // Convert to GB
    });
  };

  const handleCopyLink = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.galleryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-green-400 border-green-400/20 bg-green-400/5';
      case 'Awaiting': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5';
      case 'Maintenance': return 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
    }
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

          {/* Database Controls */}
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
            <button 
              onClick={() => window.location.href = '/gallery'}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              <FiUserPlus size={16} /> Create New Client
            </button>
          </div>

          {/* Client Table */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            {filteredClients.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <FiUsers size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">No clients found</p>
                <p className="text-gray-600 text-xs mt-2">Create your first client from the Gallery Management page</p>
                <button 
                  onClick={() => window.location.href = '/gallery'}
                  className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Go to Gallery
                </button>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-600 tracking-widest">
                    <th className="px-8 py-6">Client Identity</th>
                    <th className="px-8 py-6">Contact Channel</th>
                    <th className="px-8 py-6">Project Status</th>
                    <th className="px-8 py-6">Gallery Info</th>
                    <th className="px-8 py-6 text-right">Interaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={client.avatar} alt="" className="w-10 h-10 rounded-lg object-cover group-hover:scale-110 transition-all" />
                          <div>
                            <p className="text-sm font-bold text-white">{client.name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Created: {new Date(client.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <span className="text-xs text-gray-400 font-mono block">{client.email}</span>
                          <span className="text-[9px] text-gray-600 mt-1 block">Access Key: {client.accessKey}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border w-fit ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                            {client.tag}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-semibold text-indigo-400">{client.galleryName}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-500">
                              📷 {client.imageCount} images
                            </span>
                            <span className="text-[10px] text-gray-500">
                              💾 {(client.storageUsed / 1024 / 1024).toFixed(1)} MB
                            </span>
                          </div>
                          {client.expiration && client.expiration !== "never" && (
                            <p className="text-[9px] text-yellow-600 mt-1">Expires: {client.expiration}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <div className="flex items-center bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all">
                            <span className="text-[10px] text-gray-500 font-mono mr-3 truncate max-w-[150px]">
                              {client.link.split('/').pop()}
                            </span>
                            <button 
                              onClick={() => handleCopyLink(client.link, client.id)}
                              className="text-indigo-400 hover:text-white transition-colors"
                            >
                              {copyStatus === client.id ? <FiCheck /> : <FiCopy />}
                            </button>
                          </div>
                          <a 
                            href={client.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-indigo-400 transition-colors"
                          >
                            <FiExternalLink size={16} />
                          </a>
                          <button className="p-2 text-gray-500 hover:text-white transition-colors">
                            <FiMoreHorizontal />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {/* Pagination Mockup */}
            {filteredClients.length > 0 && (
              <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/20">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Showing {filteredClients.length} of {clients.length} clients
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-white/5 text-gray-500 text-xs border border-white/10 cursor-not-allowed opacity-50">
                    Prev
                  </button>
                  <button className="px-3 py-1 rounded bg-indigo-600 text-white text-xs border border-indigo-500/50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Clients;