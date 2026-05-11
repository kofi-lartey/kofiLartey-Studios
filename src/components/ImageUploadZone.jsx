import React, { useState, useEffect, useCallback } from 'react';
import { FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiFolder } from 'react-icons/fi';
import Loader from './Loader';
import imageCompression from 'browser-image-compression';
import axios from 'axios';

const ImageUploadZone = ({ onUploadComplete, galleryName, galleryId, onGalleryChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [localGalleryName, setLocalGalleryName] = useState(galleryName || '');
  const [showGalleryInput, setShowGalleryInput] = useState(!galleryName && !galleryId);
  const [galleries, setGalleries] = useState([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState(galleryId || '');

  // Load existing galleries
  useEffect(() => {
    const existingGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
    setGalleries(existingGalleries);
  }, []);

  // Sync with props
  useEffect(() => {
    if (galleryName) {
      setLocalGalleryName(galleryName);
      setShowGalleryInput(false);
    }
    if (galleryId) {
      setSelectedGalleryId(galleryId);
    }
  }, [galleryName, galleryId]);

  const handleGallerySelect = (e) => {
    const selectedName = e.target.value;
    setLocalGalleryName(selectedName);
    
    const selected = galleries.find(g => g.name === selectedName);
    if (selected) {
      setSelectedGalleryId(selected.id);
      onGalleryChange?.(selected);
    }
    setShowGalleryInput(false);
  };

  const handleCreateNewGallery = () => {
    if (!localGalleryName.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter a gallery name' });
      return;
    }
    
    const newGalleryId = `gallery_${Date.now()}`;
    const newGallery = {
      id: newGalleryId,
      name: localGalleryName,
      createdAt: new Date().toISOString(),
      imageCount: 0,
      accessKey: localStorage.getItem('currentAccessKey') || '7H2K-XP91'
    };
    
    const updatedGalleries = [...galleries, newGallery];
    setGalleries(updatedGalleries);
    localStorage.setItem('galleries', JSON.stringify(updatedGalleries));
    
    setSelectedGalleryId(newGalleryId);
    setShowGalleryInput(false);
    onGalleryChange?.(newGallery);
    
    setUploadStatus({ type: 'success', message: `Gallery "${localGalleryName}" created!` });
    setTimeout(() => setUploadStatus(null), 2000);
  };

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

  const processFiles = useCallback(async (files) => {
    const activeGalleryName = galleryName || localGalleryName;
    const activeGalleryId = galleryId || selectedGalleryId;

    if (!activeGalleryName && !activeGalleryId) {
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

      for (const file of files) {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
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

      setUploadStatus({ type: 'info', message: 'Uploading to Studio...' });

      compressedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus({ type: 'success', message: `${response.data.uploadedCount} image(s) uploaded successfully!` });
      onUploadComplete?.(response.data.uploadedImages);
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Image upload failed. Please try again.' });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  }, [galleryName, galleryId, localGalleryName, selectedGalleryId, onUploadComplete]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFiles(files);
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
            <div>
              <label className="block text-[10px] uppercase text-gray-500 tracking-wider mb-2">
                Select Existing Gallery
              </label>
              <select 
                onChange={handleGallerySelect}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-indigo-500 transition-all"
              >
                <option value="">-- Choose a gallery --</option>
                {galleries.map(gallery => (
                  <option key={gallery.id} value={gallery.name}>
                    {gallery.name} ({gallery.imageCount} images)
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
                  className="px-6 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-500 transition-all"
                >
                  Create
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
                Active Gallery: <span className="text-indigo-400">{galleryName || localGalleryName}</span>
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                {galleryId || selectedGalleryId ? `ID: ${galleryId || selectedGalleryId}` : 'New gallery ready for uploads'}
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
          {galleryName || localGalleryName ? `Uploading to: ${galleryName || localGalleryName}` : 'Select or create a gallery first'} • Supported formats: JPG, PNG, WebP, GIF
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
                Processing images...
              </p>
              <p className="text-xs text-indigo-400/70 mt-0.5">
                Preparing your uploads
              </p>
            </div>
          </div>
          {/* Progress bar */}
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

      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${
          uploadStatus.type === 'success' ? 'bg-green-600/20 border-green-500/30' : 'bg-red-600/20 border-red-500/30'
        }`}>
          {uploadStatus.type === 'success' ? <FiCheckCircle className="text-green-500" /> : <FiAlertCircle className="text-red-500" />}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {uploadStatus.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;