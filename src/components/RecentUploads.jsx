import React, { useState, useEffect, useCallback } from 'react';
import { FiGrid, FiList, FiTrash2, FiDownload, FiFolder, FiAlertCircle, FiCheckSquare, FiX } from 'react-icons/fi';
import Skeleton from './Skeleton';
import { get, del, post } from '../utils/apiCall';

const RecentUploads = ({ refreshTrigger, selectedGallery }) => {
  const [images, setImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGallery, setCurrentGallery] = useState(selectedGallery || null);
  const [galleryInfo, setGalleryInfo] = useState(null);

  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  // Update current gallery when selectedGallery changes
  useEffect(() => {
    console.log('🔄 RecentUploads - selectedGallery changed:', selectedGallery);
    setCurrentGallery(selectedGallery);
    // Exit select mode when gallery changes
    setSelectMode(false);
    setSelectedImages(new Set());
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

  // Toggle select mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedImages(new Set());
    }
  };

  // Toggle individual image selection
  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  // Select all images
  const selectAllImages = () => {
    const allIds = new Set(images.map(img => img.id));
    setSelectedImages(allIds);
  };

  // Deselect all images
  const deselectAllImages = () => {
    setSelectedImages(new Set());
  };

  // Delete single image
  const deleteImage = async (imageId) => {
    if (!currentGallery?.galleryID) return;

    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await del(`/gallery/${currentGallery.galleryID}/images/${imageId}`);
      console.log('🗑️ Image deleted:', response);

      if (response.success) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        // Remove from selection if selected
        if (selectedImages.has(imageId)) {
          const newSelected = new Set(selectedImages);
          newSelected.delete(imageId);
          setSelectedImages(newSelected);
        }
      } else {
        throw new Error(response.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(error.response?.data?.message || error.message || 'Failed to delete image');
    }
  };

  // Bulk delete selected images
  // In your RecentUploads component
  // In RecentUploads component

  const deleteSelectedImages = async () => {
    if (!currentGallery?.galleryID || selectedImages.size === 0) return;
    // Debug token storage
    console.log('🔍 Checking all token storage locations:');
    console.log('localStorage.token:', localStorage.getItem('token')?.substring(0, 30));
    console.log('localStorage.authToken:', localStorage.getItem('authToken')?.substring(0, 30));
    console.log('sessionStorage.token:', sessionStorage.getItem('token')?.substring(0, 30));

    const imageIdsArray = Array.from(selectedImages);

    if (!window.confirm(`Are you sure you want to delete ${imageIdsArray.length} selected image(s)?`)) return;

    setDeleting(true);

    try {
      // ✅ Use del instead of post
      const response = await del(
        `gallery/${currentGallery.galleryID}/images/deleteMultiple`,
        { imageIds: imageIdsArray }  // Pass data as second argument
      );

      console.log('🗑️ Bulk delete response:', response);

      if (response.success) {
        setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
        setSelectedImages(new Set());
        setSelectMode(false);

        const { deletedCount, notFoundCount } = response.data;
        let message = `${deletedCount} image(s) deleted successfully`;
        if (notFoundCount > 0) {
          message += ` (${notFoundCount} not found)`;
        }
        alert(message);
      } else {
        throw new Error(response.message || 'Failed to delete images');
      }
    } catch (error) {
      console.error('Error deleting images:', error);
      alert(error.response?.data?.message || error.message || 'Failed to delete images');
    } finally {
      setDeleting(false);
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
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {galleryInfo?.galleryName || currentGallery.name || 'Gallery Images'}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            {galleryInfo?.totalImages || images.length} image{images.length !== 1 ? 's' : ''} •
            Gallery ID: {currentGallery.galleryID}
            {selectMode && selectedImages.size > 0 && (
              <span className="text-indigo-400 ml-2">
                • {selectedImages.size} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Select mode toggle */}
          <button
            onClick={toggleSelectMode}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all touch-target active:scale-95 ${selectMode
              ? 'bg-indigo-600 text-white'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
          >
            {selectMode ? (
              <span className="flex items-center gap-2">
                <FiX size={14} />
                Cancel
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiCheckSquare size={14} />
                Select
              </span>
            )}
          </button>

          {/* Bulk actions when in select mode */}
          {selectMode && (
            <>
              <button
                onClick={selectAllImages}
                className="px-3 py-2 text-[10px] text-gray-400 hover:text-white transition-colors touch-target"
              >
                Select All
              </button>
              {selectedImages.size > 0 && (
                <button
                  onClick={deselectAllImages}
                  className="px-3 py-2 text-[10px] text-gray-400 hover:text-white transition-colors touch-target"
                >
                  Deselect All
                </button>
              )}
              <button
                onClick={deleteSelectedImages}
                disabled={selectedImages.size === 0 || deleting}
                className="px-3 md:px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-600/30 transition-all touch-target active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiTrash2 size={14} />
                {deleting ? 'Deleting...' : `Delete (${selectedImages.size})`}
              </button>
            </>
          )}

          {/* View mode toggle */}
          {!selectMode && (
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
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {images.map((img) => {
            const isSelected = selectedImages.has(img.id);

            return (
              <div
                key={img.id}
                className={`group relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-300 ${selectMode
                  ? 'cursor-pointer ' + (isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-white/10 hover:border-indigo-500/50')
                  : 'border-white/5'
                  } bg-white/5`}
                onClick={() => selectMode && toggleImageSelection(img.id)}
              >
                <img
                  src={img.thumbnail || img.url}
                  alt={img.name}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${selectMode ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                    } ${isSelected ? 'brightness-75' : ''}`}
                  loading="lazy"
                />

                {/* Selection checkbox */}
                {selectMode && (
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-black/50 border-white/30'
                    }`}>
                    {isSelected && <FiCheckSquare size={14} className="text-white" />}
                  </div>
                )}

                {/* Hover overlay - only show when not in select mode */}
                {!selectMode && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 md:p-4 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(img.id);
                        }}
                        className="p-1.5 md:p-2 bg-black/50 rounded-lg text-red-400 hover:text-red-300 transition-colors touch-target active:scale-95"
                      >
                        <FiTrash2 size={14} />
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
                )}

                {/* Select mode info overlay */}
                {selectMode && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] md:text-xs font-bold text-white truncate">{img.name}</p>
                    <p className="text-[8px] md:text-[9px] text-gray-400 mt-0.5">
                      {img.sizeFormatted}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2 md:space-y-3">
          {images.map((img) => {
            const isSelected = selectedImages.has(img.id);

            return (
              <div
                key={img.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-all ${selectMode
                  ? 'cursor-pointer ' + (isSelected ? 'bg-indigo-600/10 border border-indigo-500/30' : 'bg-white/[0.02] border border-white/5 hover:border-indigo-500/30')
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
                  } touch-target`}
                onClick={() => selectMode && toggleImageSelection(img.id)}
              >
                {/* Selection checkbox for list view */}
                {selectMode && (
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'bg-black/50 border-white/30'
                    }`}>
                    {isSelected && <FiCheckSquare size={14} className="text-white" />}
                  </div>
                )}

                <img
                  src={img.thumbnail || img.url}
                  alt={img.name}
                  className={`w-full sm:w-16 h-16 rounded-lg object-cover ${isSelected ? 'brightness-75' : ''}`}
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

                {/* Actions - only show when not in select mode */}
                {!selectMode && (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(img.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors active:scale-95 touch-target"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentUploads;