import React, { useState, useEffect, useCallback } from 'react';
import { FiGrid, FiList, FiTrash2, FiDownload, FiFolder, FiAlertCircle, FiCheckSquare, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Skeleton from './Skeleton';
import { get, del, post } from '../utils/apiCall';

const RecentUploads = ({ refreshTrigger, selectedGallery }) => {
  const [images, setImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGallery, setCurrentGallery] = useState(selectedGallery || null);
  const [galleryInfo, setGalleryInfo] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Multi-select state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  // Update current gallery when selectedGallery changes
  useEffect(() => {
    console.log('🔄 RecentUploads - selectedGallery changed:', selectedGallery);
    setCurrentGallery(selectedGallery);
    // Reset pagination when gallery changes
    setCurrentPage(1);
    // Exit select mode when gallery changes
    setSelectMode(false);
    setSelectedImages(new Set());
  }, [selectedGallery]);

  // Fetch images when currentGallery, refreshTrigger, or pagination changes
  const fetchImages = useCallback(async () => {
    console.log('📸 fetchImages called with galleryID:', currentGallery?.galleryID, 'page:', currentPage, 'limit:', itemsPerPage);

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
      const url = `/gallery/${currentGallery.galleryID}/images?page=${currentPage}&limit=${itemsPerPage}`;
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
        setTotalItems(response.pagination?.totalItems || formattedImages.length);
        setTotalPages(response.pagination?.totalPages || 1);
        
        // Update currentPage from response if it exists
        if (response.pagination?.currentPage) {
          setCurrentPage(response.pagination.currentPage);
        }

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
  }, [currentGallery, currentPage, itemsPerPage]);

  // Re-fetch when gallery changes, refreshTrigger, or pagination changes
  useEffect(() => {
    fetchImages();
  }, [fetchImages, refreshTrigger, currentGallery?.galleryID, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Exit select mode when changing pages
      setSelectMode(false);
      setSelectedImages(new Set());
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectMode(false);
    setSelectedImages(new Set());
  };

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

  // Select all images on current page
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
        // Refresh current page
        fetchImages();
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
  const deleteSelectedImages = async () => {
    if (!currentGallery?.galleryID || selectedImages.size === 0) return;

    const imageIdsArray = Array.from(selectedImages);

    if (!window.confirm(`Are you sure you want to delete ${imageIdsArray.length} selected image(s)?`)) return;

    setDeleting(true);

    try {
      const response = await del(
        `gallery/${currentGallery.galleryID}/images/deleteMultiple`,
        { imageIds: imageIdsArray }
      );

      console.log('🗑️ Bulk delete response:', response);

      if (response.success) {
        // Refresh current page
        fetchImages();
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

  // Pagination component
  const PaginationControls = () => {
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
          range.push(i);
        }
      }

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      });

      return rangeWithDots;
    };

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10 mt-6">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
          </select>
          <span className="text-gray-500 text-xs">
            Showing {images.length} of {totalItems} images
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-target"
            aria-label="Previous page"
          >
            <FiChevronLeft size={16} />
          </button>
          
          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-target"
            aria-label="Next page"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
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
          {[...Array(itemsPerPage > 8 ? 8 : itemsPerPage)].map((_, i) => (
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
            {totalItems} image{totalItems !== 1 ? 's' : ''} •
            Gallery ID: {currentGallery.galleryID}
            {selectMode && selectedImages.size > 0 && (
              <span className="text-indigo-400 ml-2">
                • {selectedImages.size} selected
              </span>
            )}
            {totalPages > 1 && (
              <span className="text-gray-600 ml-2">
                • Page {currentPage} of {totalPages}
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {images.map((img) => {
              const isSelected = selectedImages.has(img.id);

              return (
                <div
                  key={img.id}
                  className={`group relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-300 ${selectMode
                    ? 'cursor-pointer ' + (isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-white/10 hover:border-indigo-500/50')
                    : 'border-white/5 hover:border-indigo-500/30'
                    } bg-white/5`}
                  onClick={() => selectMode && toggleImageSelection(img.id)}
                >
                  <img
                    src={img.thumbnail || img.url}
                    alt={img.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                      isSelected ? 'brightness-75' : ''
                    }`}
                    loading="lazy"
                  />

                  {/* Delete button - Always visible on mobile, visible on hover on desktop */}
                  {!selectMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(img.id);
                      }}
                      className="absolute top-2 right-2 md:top-3 md:right-3 p-2 md:p-2.5 bg-black/70 backdrop-blur-sm rounded-lg text-red-400 hover:text-red-300 hover:bg-black/90 transition-all touch-target active:scale-95 z-10 shadow-lg"
                      aria-label="Delete image"
                    >
                      <FiTrash2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  )}

                  {/* Selection checkbox */}
                  {selectMode && (
                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'bg-black/50 border-white/30'
                      }`}>
                      {isSelected && <FiCheckSquare size={14} className="text-white" />}
                    </div>
                  )}

                  {/* Hover overlay with info - only on desktop, always visible info on mobile */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity p-3 md:p-4 flex flex-col justify-between ${
                    !selectMode ? 'md:opacity-0 md:group-hover:opacity-100 opacity-100' : ''
                  }`}>
                    <div className="flex justify-end">
                      {/* Empty div to balance the layout */}
                      <div></div>
                    </div>
                    <div>
                      <p className="text-xs md:text-xs font-bold text-white truncate">{img.name}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 mt-1">
                        {img.sizeFormatted} • {formatDate(img.uploadedAt)}
                      </p>
                      {img.dimensions?.width && img.dimensions?.height && (
                        <p className="hidden md:block text-[8px] md:text-[9px] text-gray-500 mt-0.5">
                          {img.dimensions.width} × {img.dimensions.height}
                        </p>
                      )}
                    </div>
                  </div>

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
          
          {/* Pagination Controls */}
          {totalPages > 1 && <PaginationControls />}
        </>
      ) : (
        /* List View - Already has visible delete button */
        <>
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

                  {/* Actions - always visible on mobile */}
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
                        className="p-2 text-red-400 hover:text-red-300 transition-colors active:scale-95 touch-target"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && <PaginationControls />}
        </>
      )}
    </div>
  );
};

export default RecentUploads;