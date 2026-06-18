import { useState, useEffect, useRef, useCallback } from "react";
import {
    FiDownload,
    FiMaximize2,
    FiX,
    FiPlay,
    FiHeart,
    FiShare2,
    FiInfo,
    FiCamera,
    FiClock,
    FiKey,
    FiLogIn,
    FiAlertCircle,
    FiChevronLeft,
    FiChevronRight,
    FiPause
} from "react-icons/fi";
import NavBar from "../componets/NavBar";
import Footer from "../componets/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { post } from "../utils/apiCall";

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
console.log('🌐 API_BASE_URL:', API_BASE_URL);

const isDevEnvironment = () => {
    return window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'http:';
};

// URL constructor that prevents duplicate API prefixes
const getApiUrl = (path) => {
    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    const apiPrefixes = ['/api/V1/', '/api/v1/', '/api/', '/V1/', '/v1/'];
    for (const prefix of apiPrefixes) {
        if (cleanPath.startsWith(prefix)) {
            cleanPath = cleanPath.substring(prefix.length - 1);
            break;
        }
    }

    if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
    }

    if (isDevEnvironment()) {
        const baseUrl = API_BASE_URL || '';
        if (baseUrl) {
            const cleanBase = baseUrl.replace(/\/$/, '');
            const url = `${cleanBase}${cleanPath}`;
            console.log('🔗 Dev URL:', url);
            return url;
        }
        const url = `http://localhost:5000/api/V1${cleanPath}`;
        console.log('🔗 Dev fallback URL:', url);
        return url;
    }

    const cleanBase = API_BASE_URL.replace(/\/$/, '');
    const url = `${cleanBase}${cleanPath}`;
    console.log('🔗 Prod URL:', url);
    return url;
};

// Helper: detect mobile device and iOS
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const useImagePreloader = (images) => {
    const cacheRef = useRef(new Map());

    useEffect(() => {
        if (!images?.length) return;
        const timeoutId = setTimeout(() => {
            images.forEach((img) => {
                const url = img.imageUrl;
                if (!url || cacheRef.current.has(url)) return;
                const image = new Image();
                image.src = url;
                image.onload = () => cacheRef.current.set(url, image);
                image.decode?.().catch(() => { });
            });
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [images]);

    const getCached = (url) => cacheRef.current.get(url) || null;
    return { getCached };
};

// Slideshow Modal Component - WITHOUT download button
const SlideshowModal = ({ images, galleryName, onClose, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const controlsTimeout = useRef(null);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsPlaying(false);
    }, [images.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsPlaying(false);
    }, [images.length]);

    useEffect(() => {
        if (!isPlaying || images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPlaying, images.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrevious, handleNext, onClose]);

    const preloadAdjacent = useCallback((idx) => {
        [-1, 0, 1].forEach(offset => {
            const i = (idx + offset + images.length) % images.length;
            const img = images[i];
            if (img?.imageUrl) new Image().src = img.imageUrl;
        });
    }, [images]);

    useEffect(() => {
        preloadAdjacent(currentIndex);
    }, [currentIndex, preloadAdjacent]);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrevious();
    };

    const currentImage = images[currentIndex];
    if (!currentImage) return null;

    return (
        <div
            className="fixed inset-0 bg-black z-[200] flex flex-col"
            onMouseMove={() => {
                setShowControls(true);
                clearTimeout(controlsTimeout.current);
                controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className={`absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-between items-center">
                    <div className="text-white px-2">
                        <p className="text-sm md:text-base font-medium">Slideshow Mode</p>
                        <p className="text-xs md:text-sm text-gray-400">{currentIndex + 1} of {images.length}</p>
                        {galleryName && <p className="text-xs md:text-sm text-indigo-400 mt-1">{galleryName}</p>}
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/10 p-2 md:p-3 rounded-full">
                        <FiX size={24} />
                    </button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
                <img src={currentImage.imageUrl} alt={`Slide ${currentIndex + 1}`} className="max-w-full max-h-[85vh] object-contain" />
            </div>
            <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-4 md:gap-6">
                    <button onClick={handlePrevious} className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full">
                        <FiChevronLeft size={24} />
                    </button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 md:p-5 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-xl">
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                    </button>
                    <button onClick={handleNext} className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full">
                        <FiChevronRight size={24} />
                    </button>
                </div>
                <div className="mt-4 md:mt-6 max-w-2xl mx-auto">
                    <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientGallery = () => {
    const [searchParams] = useSearchParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [accessKey, setAccessKey] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [galleryData, setGalleryData] = useState(null);
    const [images, setImages] = useState([]);
    const [isFindingGallery, setIsFindingGallery] = useState(true);
    const [requiresAccessKey, setRequiresAccessKey] = useState(true);
    const [showSlideshow, setShowSlideshow] = useState(false);
    const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ percentage: 0, currentImage: '' });
    const [galleryId, setGalleryId] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    // FIX: Add a ref to track if component is mounted
    const isMounted = useRef(true);
    // FIX: Add a ref to track if initialization is in progress
    const isInitializing = useRef(false);
    const { getCached } = useImagePreloader(images);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    // FIX: Completely rewrite the initialization useEffect
    useEffect(() => {
        // Prevent multiple initializations
        if (isInitializing.current) return;
        
        const urlAccessKey = searchParams.get('accessKey');
        
        // Only run if we haven't initialized and there's an access key
        if (!hasInitialized && urlAccessKey) {
            isInitializing.current = true;
            setAccessKey(urlAccessKey);
            validateAndLoadGallery(urlAccessKey);
            setHasInitialized(true);
        } else if (!hasInitialized && !urlAccessKey) {
            // No access key in URL
            setIsFindingGallery(false);
            setRequiresAccessKey(true);
            setHasInitialized(true);
        }
        
        // FIX: Cleanup function to reset initialization flag if component unmounts
        return () => {
            isInitializing.current = false;
        };
    }, [searchParams]); // Only depends on searchParams

    const validateAndLoadGallery = async (key) => {
        // Prevent multiple simultaneous calls
        if (isLoading || isInitializing.current) return;
        
        isInitializing.current = true;
        setIsLoading(true);
        setError("");
        
        try {
            const response = await post('/gallery/public', { accessKey: key });
            console.log('🎨 Gallery access response:', response);

            if (response.success && response.data) {
                const gallery = response.data;
                setGalleryData(gallery);

                const customGalleryId = gallery.galleryId || gallery.galleryID;

                console.log("✅ Using custom gallery ID:", customGalleryId);

                const processedImages = (gallery.images || []).map((img, idx) => ({
                    ...img,
                    imageId: img.imageId || img._id || img.id || `temp_${idx}`,
                    imageUrl: img.imageUrl || img.url,
                    originalName: img.originalName || img.imageName || `image-${idx + 1}.jpg`
                }));

                setImages(processedImages);
                setGalleryId(customGalleryId);
                setIsAuthenticated(true);
                setRequiresAccessKey(false);
            } else {
                throw new Error(response.message || "Failed to access gallery");
            }
        } catch (error) {
            console.error('Gallery access error:', error);
            setError(error.response?.data?.message || "Failed to load gallery");
            setRequiresAccessKey(true);
        } finally {
            setIsLoading(false);
            setIsFindingGallery(false);
            isInitializing.current = false;
        }
    };

    const handleAccessKeySubmit = async (e) => {
        e.preventDefault();
        if (!accessKey.trim()) {
            setError("Please enter your access key");
            return;
        }
        await validateAndLoadGallery(accessKey.trim());
    };

    // Mobile-friendly ZIP download
    const handleDownloadAll = async () => {
        if (!isDownloadAllowed) {
            setError("Download permission not granted");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (images.length === 0 || !galleryId) {
            setError("No images or missing gallery info");
            return;
        }

        console.log("📦 Starting ZIP download for gallery:", galleryId);
        console.log("📱 Mobile device:", isMobileDevice());

        // Clear any existing polling interval
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }

        setDownloadingAll(true);
        setDownloadProgress({ percentage: 0, currentImage: 'Starting download...' });

        try {
            const startUrl = getApiUrl(`/gallery/${galleryId}/public-download-all`);
            console.log("📥 Start URL:", startUrl);

            const response = await fetch(startUrl, {
                method: "GET"
            });

            const data = await response.json();
            console.log("Response:", data);

            if (data.status === 'completed') {
                console.log("✅ ZIP ready, downloading...");
                setDownloadProgress({ percentage: 100, currentImage: 'Downloading ZIP...' });

                const downloadFullUrl = getApiUrl(data.downloadUrl);
                console.log("📥 Download URL:", downloadFullUrl);

                // FIX: Better mobile download handling
                if (isMobileDevice()) {
                    // For mobile: Use a more reliable approach
                    setError("Your download will start shortly. Check your Downloads folder.");
                    // Create a temporary anchor and trigger download
                    const link = document.createElement('a');
                    link.href = downloadFullUrl;
                    link.download = data.filename || 'gallery.zip';
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    setTimeout(() => {
                        document.body.removeChild(link);
                    }, 1000);
                } else {
                    const link = document.createElement('a');
                    link.href = downloadFullUrl;
                    link.download = data.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                const sizeMB = data.size ? (data.size / 1024 / 1024).toFixed(1) : '';
                setError(`Download complete! ${sizeMB}MB`);
                setTimeout(() => setError(""), 4000);
                setDownloadingAll(false);
                setDownloadProgress({ percentage: 0, currentImage: '' });
                return;
            }

            if (data.status === 'processing') {
                setDownloadProgress({ percentage: 0, currentImage: 'Creating ZIP file... 0%' });

                const interval = setInterval(async () => {
                    try {
                        const statusUrl = getApiUrl(`/gallery/${galleryId}/zip-status`);
                        const statusResponse = await fetch(statusUrl);
                        const statusData = await statusResponse.json();

                        console.log("Status update:", statusData);

                        if (statusData.status === 'completed') {
                            clearInterval(interval);
                            setPollingInterval(null);

                            setDownloadProgress({ percentage: 100, currentImage: 'Downloading ZIP...' });

                            const downloadFullUrl = getApiUrl(statusData.downloadUrl);
                            console.log("📥 Download URL:", downloadFullUrl);

                            // FIX: Better mobile download handling
                            if (isMobileDevice()) {
                                setError("Your download will start shortly. Check your Downloads folder.");
                                const link = document.createElement('a');
                                link.href = downloadFullUrl;
                                link.download = statusData.filename || 'gallery.zip';
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                setTimeout(() => {
                                    document.body.removeChild(link);
                                }, 1000);
                            } else {
                                const link = document.createElement('a');
                                link.href = downloadFullUrl;
                                link.download = statusData.filename;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }

                            const sizeMB = statusData.size ? (statusData.size / 1024 / 1024).toFixed(1) : '';
                            setError(`Download complete! ${sizeMB}MB`);
                            setTimeout(() => setError(""), 4000);
                            setDownloadingAll(false);
                            setDownloadProgress({ percentage: 0, currentImage: '' });

                        } else if (statusData.status === 'failed') {
                            clearInterval(interval);
                            setPollingInterval(null);
                            throw new Error(statusData.error || "ZIP creation failed");

                        } else if (statusData.status === 'processing') {
                            const percent = statusData.progress || 0;
                            setDownloadProgress({
                                percentage: percent,
                                currentImage: `Creating ZIP file... ${percent}%`
                            });
                        }
                    } catch (err) {
                        clearInterval(interval);
                        setPollingInterval(null);
                        console.error("Polling error:", err);
                        setError("Error checking ZIP status");
                        setDownloadingAll(false);
                    }
                }, 2000);

                setPollingInterval(interval);
            }

        } catch (error) {
            console.error('Download all error:', error);
            setError("Failed to download gallery: " + error.message);
            setTimeout(() => setError(""), 4000);
            setDownloadingAll(false);
            setDownloadProgress({ percentage: 0, currentImage: '' });

            if (pollingInterval) {
                clearInterval(pollingInterval);
                setPollingInterval(null);
            }
        }
    };

    const handleSlideshow = () => {
        if (images.length === 0) return;
        images.slice(0, 5).forEach(img => { if (img?.imageUrl) new Image().src = img.imageUrl; });
        setSlideshowStartIndex(0);
        setShowSlideshow(true);
    };

    const isDownloadAllowed = galleryData?.downloadPermission === true || galleryData?.gallerySettings?.allowDownloads === true;

    if (isFindingGallery || isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white">
                <NavBar />
                <main className="flex-1 flex items-center justify-center pt-32 px-6">
                    <div className="text-center"><Loader size={40} variant="minimal" /><p className="text-gray-500 text-sm mt-4">Loading gallery...</p></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (requiresAccessKey && !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white">
                <NavBar />
                <main className="flex-1 flex items-center justify-center px-6 py-12 pt-32">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl"><FiKey size={34} className="text-white" /></div>
                            <h1 className="text-4xl font-bold text-white mb-3">Enter Access Key</h1>
                            <p className="text-gray-400 text-sm">Enter the access key provided to view your gallery</p>
                        </div>
                        <form onSubmit={handleAccessKeySubmit} className="space-y-6">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] uppercase text-gray-500 font-bold tracking-wider mb-2">ACCESS KEY</label>
                                        <div className="relative">
                                            <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input type="text" value={accessKey} onChange={(e) => setAccessKey(e.target.value.toUpperCase())} placeholder="Enter your access key" className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" autoFocus />
                                        </div>
                                    </div>
                                    {error && <div className="p-3.5 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center gap-2"><FiAlertCircle className="text-red-400 flex-shrink-0" size={14} /><span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">{error}</span></div>}
                                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"><FiLogIn size={14} /> ACCESS GALLERY</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white selection:bg-indigo-500/30">
            <NavBar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-32 pb-12 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">✨ Private Collection</span></div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white">{galleryData?.galleryName || "Client Gallery"}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><FiCamera className="text-indigo-500" /> {galleryData?.studioName || "Studio"}</span>
                            <span className="flex items-center gap-2"><FiClock className="text-indigo-500" /> {images.length} High-Resolution Captures</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        {isDownloadAllowed && (
                            <button onClick={handleDownloadAll} disabled={images.length === 0 || downloadingAll} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 w-full md:w-auto disabled:opacity-50">
                                {downloadingAll ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>{downloadProgress.percentage > 0 ? `${downloadProgress.percentage}%` : 'Preparing...'}</span></> : <><FiDownload className="text-sm" /> Download All Gallery ({images.length} images)</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* Download Instructions Banner - Shows for both mobile and desktop */}
                {isDownloadAllowed && (
                    <div className="bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/30 rounded-xl p-4">
                        <div className="text-center">
                            <p className="text-indigo-300 text-xs uppercase tracking-wider font-bold mb-2">📸 How to Download</p>
                            <div className="flex flex-col md:flex-row justify-center gap-4 text-gray-400 text-xs">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-6 h-6 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold">1</span>
                                    <span>Click <FiDownload className="inline mx-1" size={12} /> "Download All Gallery" button above</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-6 h-6 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold">2</span>
                                    <span>Wait for ZIP file to be created (may take a few seconds)</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-6 h-6 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold">3</span>
                                    <span>{isMobileDevice() ? "Tap and hold, then select 'Save to Files'" : "File will save automatically to Downloads"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Single Image Instructions */}
                {!isMobileDevice() && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                        <p className="text-gray-500 text-[11px]">💡 <span className="text-gray-400">Tip:</span> Click any image to view fullscreen. To save individual images, right-click and select "Save image as..."</p>
                    </div>
                )}

                {isMobileDevice() && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                        <p className="text-gray-500 text-[11px]">💡 <span className="text-gray-400">Tip:</span> Tap any image to view fullscreen. To save individual images, tap and hold, then select "Save to Photos" or "Download Image".</p>
                    </div>
                )}

                {error && <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-lg border border-indigo-500/30 rounded-xl p-3 shadow-2xl max-w-md"><p className="text-[11px] text-indigo-400">{error}</p></div>}

                <div className="flex justify-center gap-4">
                    <button onClick={handleSlideshow} disabled={images.length === 0} className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-gray-300 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all disabled:opacity-50">
                        <FiPlay size={12} className="text-indigo-400" /> Slideshow Mode
                    </button>
                </div>

                {images.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center"><FiCamera size={32} className="text-gray-600" /></div>
                        <p className="text-gray-500 text-sm">No images in this gallery yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {images.map((img, idx) => (
                            <div
                                key={img.imageId || img._id || idx}
                                className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.imageUrl || "/placeholder.jpg"}
                                    alt={img.imageName || img.originalName || `Image ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="1"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-medium text-xs tracking-tight truncate flex-1 mr-2">{img.imageName || img.originalName || `Image ${idx + 1}`}</p>
                                        <div className="flex items-center gap-1 text-white/60">
                                            <FiMaximize2 size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
            {showSlideshow && (
                <SlideshowModal
                    images={images}
                    galleryName={galleryData?.galleryName}
                    onClose={() => setShowSlideshow(false)}
                    initialIndex={slideshowStartIndex}
                />
            )}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md border-b border-white/5">
                        <button onClick={() => setSelectedImage(null)} className="text-white hover:bg-white/10 p-2 rounded-full transition-all"><FiX size={20} /></button>
                        <div className="flex items-center gap-2">
                            <button onClick={() => console.log('favorite')} className="p-2 rounded-lg text-white/60 hover:text-white transition-colors"><FiHeart size={18} /></button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4">
                        <img src={selectedImage.imageUrl} className="max-w-full max-h-[80vh] object-contain" alt={selectedImage.imageName} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-black border-t border-white/5 z-10 gap-3 sm:gap-0">
                        <div className="flex flex-wrap gap-4 sm:gap-12">
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Filename</p>
                                <p className="text-[9px] sm:text-[10px] text-white font-mono truncate max-w-[150px] sm:max-w-none">
                                    {selectedImage.originalName || selectedImage.imageName || "Unknown"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">To Save</p>
                                <p className="text-[9px] sm:text-[10px] text-white font-mono">
                                    {isMobileDevice() ? "Tap & hold → Save to Photos" : "Right-click → Save image as..."}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white transition-colors"><FiShare2 size={16} /></button>
                            <button className="text-gray-400 hover:text-white transition-colors"><FiInfo size={16} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientGallery;