import React, { useState, useEffect } from 'react';
import { FiGrid, FiList, FiMoreVertical, FiTrash2, FiDownload, FiFolder } from 'react-icons/fi';
import Skeleton from './Skeleton';
import { get } from '../utils/apiCall';

const RecentUploads = ({ refreshTrigger, selectedGallery }) => {
  const [images, setImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState([]);
  const [currentGallery, setCurrentGallery] = useState(selectedGallery || null);

  useEffect(() => {
    setCurrentGallery(selectedGallery);
  }, [selectedGallery]);

  useEffect(() => {
    const loadImages = () => {
      let storedImages = [];
      
      if (currentGallery && currentGallery.id) {
        // Load images from specific gallery
        const galleryKey = `gallery_${currentGallery.id}`;
        storedImages = JSON.parse(localStorage.getItem(galleryKey) || '[]');
      } else if (currentGallery && currentGallery.name) {
        // Load images from gallery by name
        const galleryKey = `gallery_${currentGallery.name}`;
        storedImages = JSON.parse(localStorage.getItem(galleryKey) || '[]');
      } else {
        // Load all images
        storedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
      }
      
      // Load galleries list
      const allGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
      setGalleries(allGalleries);
      
      setImages(storedImages);
      setLoading(false);
    };
    
    loadImages();
  }, [refreshTrigger, currentGallery]);

  const deleteImage = (id) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated);
    
    if (currentGallery && currentGallery.id) {
      const galleryKey = `gallery_${currentGallery.id}`;
      localStorage.setItem(galleryKey, JSON.stringify(updated));
    } else if (currentGallery && currentGallery.name) {
      const galleryKey = `gallery_${currentGallery.name}`;
      localStorage.setItem(galleryKey, JSON.stringify(updated));
    } else {
      localStorage.setItem('uploadedImages', JSON.stringify(updated));
    }
    
    // Update gallery image count
    const allGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    const updatedGalleries = allGalleries.map(g => {
      if (g.id === currentGallery?.id || g.name === currentGallery?.name) {
        return { ...g, imageCount: updated.length };
      }
      return g;
    });
    localStorage.setItem('galleries', JSON.stringify(updatedGalleries));
  };

   if (loading) {
     return (
       <div className="space-y-6">
         <div className="flex justify-between items-end">
           <div className="space-y-3">
             <Skeleton variant="text" width="40%" height="1.75rem" />
             <Skeleton variant="text" width="60%" height="1rem" />
           </div>
           <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 h-10 w-20" />
         </div>
         <Skeleton.Grid columns={4} rows={1} />
       </div>
     );
   }

  if (images.length === 0) {
    return (
      <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
        <FiFolder className="text-gray-600 text-5xl mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          {currentGallery ? `No images in "${currentGallery.name}" yet.` : 'No images uploaded yet.'}
        </p>
        <p className="text-gray-600 text-xs mt-2">Drag & drop to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {currentGallery ? `${currentGallery.name}` : 'All Galleries'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {images.length} image{images.length !== 1 ? 's' : ''} • 
            {currentGallery ? ` Gallery ID: ${currentGallery.id || currentGallery.name}` : ' Showing all uploads'}
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
            <FiGrid />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
            <FiList />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-white/5">
              <img 
                src={img.url} 
                alt={img.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <button 
                    onClick={() => deleteImage(img.id)}
                    className="p-1.5 bg-black/50 rounded-lg text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div>
                  <p className="text-xs font-bold text-white truncate">{img.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {(img.size / 1024 / 1024).toFixed(1)} MB • {new Date(img.uploadedAt).toLocaleDateString()}
                  </p>
                  {img.galleryName && (
                    <p className="text-[9px] text-indigo-400 mt-1 truncate">📁 {img.galleryName}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {images.map((img) => (
            <div key={img.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
              <img 
                src={img.url} 
                alt={img.name}
                className="w-16 h-16 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{img.name}</p>
                <p className="text-[10px] text-gray-500">
                  {(img.size / 1024 / 1024).toFixed(1)} MB • {new Date(img.uploadedAt).toLocaleDateString()}
                </p>
                {img.galleryName && (
                  <p className="text-[9px] text-indigo-400 mt-1">📁 Gallery: {img.galleryName}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={img.url} 
                  download={img.name}
                  className="p-2 text-gray-500 hover:text-white"
                >
                  <FiDownload size={16} />
                </a>
                <button 
                  onClick={() => deleteImage(img.id)}
                  className="p-2 text-gray-500 hover:text-red-400"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentUploads;