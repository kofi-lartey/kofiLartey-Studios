import React, { useState, useEffect, useCallback } from 'react';
import { FiGrid, FiList, FiTrash2, FiDownload, FiFolder, FiAlertCircle } from 'react-icons/fi';
import Skeleton from './Skeleton';
import { get, del } from '../utils/apiCall';

const RecentUploads = ({ refreshTrigger, selectedGallery }) => {
  const [images, setImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGallery, setCurrentGallery] = useState(selectedGallery || null);
  const [galleryInfo, setGalleryInfo] = useState(null);

  // Update current gallery when selectedGallery changes
  useEffect(() => {
    console.log('🔄 RecentUploads - selectedGallery changed:', selectedGallery);
    setCurrentGallery(selectedGallery);
    // Don't reset loading here - let fetchImages handle it
  }, [selectedGallery]);

  // Fetch images when currentGallery or refreshTrigger changes
  const fetchImages = useCallback(async () => {
    console.log('📸 fetchImages called with galleryID:', currentGallery?.galleryID);
    
    if (!currentGallery?.galleryID) {
      console.log('❌ No galleryID, showing empty state');
      setImages([]);
      setGalleryInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/gallery/${currentGallery.galleryID}/images`;
      console.log('🌐 Fetching from URL:', url);
      
      const response = await get(url);
      console.log('📸 API Response:', response);

      if (response.success) {
        const imagesData = response.data || [];
        console.log(`📸 Found ${imagesData.length} images in gallery`);
        
        const formattedImages = imagesData.map(img => {
          let imageData = img;
          if (img._doc) imageData = img._doc;
          if (img.__parentArray && img._doc) imageData = img._doc;
          
          return {
            id: imageData.imageId || imageData._id,
            url: imageData.imageUrl,
            name: imageData.imageName || imageData.originalName || 'Untitled',
            originalName: imageData.originalName,
            size: imageData.size,
            sizeFormatted: imageData.sizeFormatted || `${(imageData.size / 1024).toFixed(2)} KB`,
            mimeType: imageData.mimeType,
            dimensions: imageData.dimensions,
            uploadedAt: imageData.uploadedAt,
            order: imageData.order,
            thumbnail: imageData.optimizedThumbnail || imageData.imageUrl,
            medium: imageData.optimizedMedium || imageData.imageUrl
          };
        });
        
        setImages(formattedImages);
        
        if (response.galleryInfo) {
          console.log('📁 Gallery info:', response.galleryInfo);
          setGalleryInfo(response.galleryInfo);
        }
      } else {
        throw new Error(response.message || 'Failed to load images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [currentGallery]);

  // Re-fetch when gallery changes or refreshTrigger is called
  useEffect(() => {
    fetchImages();
  }, [fetchImages, refreshTrigger, currentGallery?.galleryID]);

  const deleteImage = async (imageId) => {
    if (!currentGallery?.galleryID) return;

    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await del(`/gallery/${currentGallery.galleryID}/images/${imageId}`);
      console.log('🗑️ Image deleted:', response);

      if (response.success) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        fetchImages();
      } else {
        throw new Error(response.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(error.response?.data?.message || error.message || 'Failed to delete image');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Display loading skeletons
  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3">
          <Skeleton variant="text" width="40%" height="1.75rem" />
          <Skeleton variant="text" width="60%" height="1rem" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-image" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 md:py-20 border border-red-500/20 rounded-xl md:rounded-3xl bg-red-500/[0.01]">
        <FiAlertCircle className="text-red-500 text-4xl md:text-5xl mx-auto mb-4" />
        <p className="text-red-400 text-sm">Failed to load images</p>
        <p className="text-gray-500 text-xs mt-2">{error}</p>
        <button
          onClick={fetchImages}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-500 transition-colors active:scale-95 touch-target"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentGallery?.galleryID) {
    return (
      <div className="text-center py-12 md:py-20 border border-white/5 rounded-xl md:rounded-3xl bg-white/[0.01]">
        <FiFolder className="text-gray-600 text-4xl md:text-5xl mx-auto mb-4" />
        <p className="text-gray-500 text-sm">No gallery selected</p>
        <p className="text-gray-600 text-xs mt-2">Select or create a gallery to view images.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 md:py-20 border border-white/5 rounded-xl md:rounded-3xl bg-white/[0.01]">
        <FiFolder className="text-gray-600 text-4xl md:text-5xl mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          No images in "{galleryInfo?.galleryName || currentGallery.name || currentGallery.galleryID}" yet.
        </p>
        <p className="text-gray-600 text-xs mt-2">Upload images to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {galleryInfo?.galleryName || currentGallery.name || 'Gallery Images'}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            {galleryInfo?.totalImages || images.length} image{images.length !== 1 ? 's' : ''} •
            Gallery ID: {currentGallery.galleryID}
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 h-9 md:h-10 w-20 md:w-24">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 flex items-center justify-center rounded-md transition-all touch-target ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
            <FiGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center rounded-md transition-all touch-target ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 bg-white/5">
              <img
                src={img.thumbnail || img.url}
                alt={img.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 md:p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="p-1.5 md:p-2 bg-black/50 rounded-lg text-red-400 hover:text-red-300 transition-colors touch-target active:scale-95"
                  >
                    <FiTrash2 size={14} md:size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-xs md:text-xs font-bold text-white truncate">{img.name}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 mt-1">
                    {img.sizeFormatted} • {formatDate(img.uploadedAt)}
                  </p>
                  {img.dimensions?.width && img.dimensions?.height && (
                    <p className="text-[8px] md:text-[9px] text-gray-500 mt-0.5">
                      {img.dimensions.width} × {img.dimensions.height}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {images.map((img) => (
            <div key={img.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors touch-target">
              <img
                src={img.thumbnail || img.url}
                alt={img.name}
                className="w-full sm:w-16 h-16 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <p className="text-xs md:text-sm font-bold text-white truncate">{img.name}</p>
                <p className="text-[9px] md:text-[10px] text-gray-500 mt-1">
                  {img.sizeFormatted} • {formatDate(img.uploadedAt)}
                </p>
                {img.dimensions?.width && img.dimensions?.height && (
                  <p className="text-[8px] md:text-[9px] text-gray-600 mt-0.5">
                    {img.dimensions.width} × {img.dimensions.height}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                <a
                  href={img.url}
                  download={img.originalName || img.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-white transition-colors active:scale-95 touch-target"
                >
                  <FiDownload size={16} />
                </a>
                <button
                  onClick={() => deleteImage(img.id)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors active:scale-95 touch-target"
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
