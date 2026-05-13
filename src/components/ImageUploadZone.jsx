import React, { useState, useEffect, useCallback } from 'react';
import { FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiFolder, FiPlus } from 'react-icons/fi';
import Loader from './Loader';
import imageCompression from 'browser-image-compression';
import { get, post } from '../utils/apiCall';

const ImageUploadZone = ({ onUploadComplete, galleryName, galleryId, onGalleryChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [localGalleryName, setLocalGalleryName] = useState(galleryName || '');
  const [showGalleryInput, setShowGalleryInput] = useState(!galleryName && !galleryId);
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loadingGalleries, setLoadingGalleries] = useState(false);
  const [creatingGallery, setCreatingGallery] = useState(false);

  // Load existing galleries from API
  useEffect(() => {
    fetchGalleries();
  }, []);

  // Sync with props
  useEffect(() => {
    if (galleryName && galleryId) {
      setLocalGalleryName(galleryName);
      setSelectedGallery({ id: galleryId, name: galleryName, galleryID: galleryId });
      setShowGalleryInput(false);
    }
  }, [galleryName, galleryId]);

  const fetchGalleries = async () => {
    setLoadingGalleries(true);
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
          imageCount: gallery.totalImages || 0  // This field might not exist here
        }));
        setGalleries(formattedGalleries);
        localStorage.setItem('galleries', JSON.stringify(formattedGalleries));
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoadingGalleries(false);
    }
  };

  // When selecting a gallery
  // When selecting a gallery
  const handleGallerySelect = (e) => {
    const selectedId = e.target.value;
    const selected = galleries.find(g => g.id === selectedId);

    if (selected) {
      console.log('📁 Gallery selected:', selected);
      setSelectedGallery(selected);
      setLocalGalleryName(selected.name);
      onGalleryChange?.(selected); // ✅ This will trigger parent update
      setShowGalleryInput(false);
    }
  };

  // When creating a new gallery
  const handleCreateNewGallery = async () => {
    if (!localGalleryName.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter a gallery name' });
      return;
    }

    setCreatingGallery(true);
    setUploadStatus({ type: 'info', message: 'Creating gallery...' });

    try {
      const response = await post('/create/galleryName', {
        galleryName: localGalleryName.trim()
      });

      if (response.success && response.data) {
        const newGallery = {
          id: response.data.id,
          name: response.data.galleryName,
          galleryID: response.data.galleryID,
          status: response.data.galleryStatus,
          createdAt: response.data.galleryDateCreated,
          imageCount: 0
        };

        const updatedGalleries = [newGallery, ...galleries];
        setGalleries(updatedGalleries);
        localStorage.setItem('galleries', JSON.stringify(updatedGalleries));

        setSelectedGallery(newGallery);
        setShowGalleryInput(false);
        onGalleryChange?.(newGallery); // ✅ This will trigger parent update

        setUploadStatus({ type: 'success', message: `Gallery "${localGalleryName}" created successfully!` });
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        throw new Error(response.message || 'Failed to create gallery');
      }
    } catch (error) {
      console.error('Error creating gallery:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to create gallery';
      setUploadStatus({ type: 'error', message: msg });
    } finally {
      setCreatingGallery(false);
    }
  };

  const processFiles = useCallback(async (files) => {
    // Check if a gallery is selected
    if (!selectedGallery) {
      setUploadStatus({ type: 'error', message: 'Please create or select a gallery first' });
      setShowGalleryInput(true);
      return;
    }

    if (files.length > 10) {
      setUploadStatus({ type: 'error', message: 'You can upload a maximum of 10 images at a time' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    const compressedFiles = [];

    try {
      setUploadStatus({ type: 'info', message: 'Optimizing images...' });

      // Compress images if needed
      for (const file of files) {
        if (file.size <= 10 * 1024 * 1024) {
          compressedFiles.push(file);
        } else {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 9,
            maxWidthOrHeight: 2500,
            useWebWorker: true,
            initialQuality: 0.8,
          });
          compressedFiles.push(compressedFile);
        }
      }

      setUploadStatus({ type: 'info', message: `Uploading ${compressedFiles.length} image(s) to ${selectedGallery.name}...` });

      // Append all images to FormData with field name 'images'
      compressedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // ✅ Use the correct endpoint: gallery/:galleryID/images/upload
      const uploadUrl = `gallery/${selectedGallery.galleryID}/images/upload`;
      console.log('🚀 Uploading to:', uploadUrl);
      console.log('📸 Files:', compressedFiles.length);
      console.log('📁 Gallery:', selectedGallery.name, selectedGallery.galleryID);

      const response = await post(uploadUrl, formData);
      console.log('✅ Upload response:', response);

      if (response.success) {
        setUploadStatus({
          type: 'success',
          message: response.message || `${compressedFiles.length} image(s) uploaded successfully to "${selectedGallery.name}"!`
        });

        // Call the callback with uploaded images
        onUploadComplete?.(response.imageDetails || []);

        // Refresh galleries to update counts
        await fetchGalleries();

        // Update the selected gallery's image count
        const updatedGallery = {
          ...selectedGallery,
          imageCount: (selectedGallery.imageCount || 0) + compressedFiles.length
        };
        setSelectedGallery(updatedGallery);
        onGalleryChange?.(updatedGallery);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const msg = error.response?.data?.message || error.message || 'Image upload failed. Please try again.';
      setUploadStatus({ type: 'error', message: msg });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(null), 5000);
    }
  }, [selectedGallery, onUploadComplete, fetchGalleries]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      processFiles(files);
    } else {
      setUploadStatus({ type: 'error', message: 'Please drop image files only' });
      setTimeout(() => setUploadStatus(null), 3000);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      processFiles(files);
    } else {
      setUploadStatus({ type: 'error', message: 'Please select image files only' });
      setTimeout(() => setUploadStatus(null), 3000);
    }
  }, [processFiles]);

  return (
    <div className="w-full">
      {/* Gallery Selection Section */}
      <div className="mb-6 p-5 bg-white/[0.02] border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <FiFolder className="text-indigo-400" size={18} />
          <h4 className="text-[11px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Gallery Selection</h4>
        </div>

        {showGalleryInput ? (
          <div className="space-y-4">
            {galleries.length > 0 && (
              <>
                <div>
                  <label className="block text-[10px] uppercase text-gray-500 tracking-wider mb-2">
                    Select Existing Gallery
                  </label>
                  <select
                    onChange={handleGallerySelect}
                    value=""
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500 transition-all"
                    disabled={loadingGalleries}
                  >
                    <option value="">-- Choose a gallery --</option>
                    {galleries.map(gallery => (
                      <option key={gallery.id} value={gallery.id}>
                        {gallery.name} ({gallery.imageCount || 0} images) {gallery.galleryID ? `- ${gallery.galleryID}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#050505] px-3 text-gray-500">OR</span>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] uppercase text-gray-500 tracking-wider mb-2">
                Create New Gallery
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={localGalleryName}
                  onChange={(e) => setLocalGalleryName(e.target.value)}
                  placeholder="e.g., Summer Collection 2024"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 outline-none transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNewGallery()}
                />
                <button
                  onClick={handleCreateNewGallery}
                  disabled={creatingGallery}
                  className="px-6 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingGallery ? 'Creating...' : <FiPlus size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowGalleryInput(false)}
              className="text-[10px] text-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Active Gallery: <span className="text-indigo-400">{selectedGallery?.name || localGalleryName}</span>
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {selectedGallery?.galleryID ? `ID: ${selectedGallery.galleryID}` : 'Ready to upload'}
                {selectedGallery?.imageCount !== undefined && ` • ${selectedGallery.imageCount} images`}
              </p>
            </div>
            <button
              onClick={() => setShowGalleryInput(true)}
              className="text-[10px] px-3 py-1.5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              Change Gallery
            </button>
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-3xl bg-white/[0.01] p-16 flex flex-col items-center justify-center text-center group hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10'} ${showGalleryInput ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform shadow-xl">
          <FiUpload size={28} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Drag & Drop Images Here</h2>
        <p className="text-gray-500 text-sm mb-8">
          {selectedGallery?.name ? `Uploading to: ${selectedGallery.name}` : 'Select or create a gallery first'} • Supported formats: JPG, PNG, WebP, GIF
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={showGalleryInput}
        />
        <label
          htmlFor="file-upload"
          className={`px-8 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer inline-block ${showGalleryInput ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Or Browse Files
        </label>
      </div>

      {uploading && (
        <div className="mt-6 p-5 bg-gradient-to-br from-indigo-600/15 to-purple-600/15 border border-indigo-500/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Loader size={32} variant="minimal" />
              <div className="absolute inset-0 blur-md bg-indigo-400/20 rounded-full animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                {uploadStatus?.message || 'Processing images...'}
              </p>
              <p className="text-xs text-indigo-400/70 mt-0.5">
                Please wait while we upload your images
              </p>
            </div>
          </div>
          <div className="mt-4 h-1 bg-indigo-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"
              style={{
                width: '70%',
                animation: 'shimmer-slide 2s infinite linear'
              }}
            />
          </div>
        </div>
      )}

      {uploadStatus && uploadStatus.type !== 'info' && (
        <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${uploadStatus.type === 'success' ? 'bg-green-600/20 border-green-500/30' : 'bg-red-600/20 border-red-500/30'
          }`}>
          {uploadStatus.type === 'success' ? <FiCheckCircle className="text-green-500" /> : <FiAlertCircle className="text-red-500" />}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
            {uploadStatus.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;