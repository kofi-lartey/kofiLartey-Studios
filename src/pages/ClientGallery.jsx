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
    // Ensure path starts with /
    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Remove any API prefix that might cause duplication
    const apiPrefixes = ['/api/V1/', '/api/v1/', '/api/', '/V1/', '/v1/'];
    for (const prefix of apiPrefixes) {
        if (cleanPath.startsWith(prefix)) {
            cleanPath = cleanPath.substring(prefix.length - 1);
            break;
        }
    }

    // Ensure path starts with slash
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

export const downloadImageFromServer = async (galleryID, imageId, filename = "image.jpg") => {
    const safeName = filename.includes(".") ? filename : `${filename}.jpg`;

    if (!galleryID || !imageId) {
        throw new Error("Missing gallery ID or image ID");
    }

    const downloadUrl = getApiUrl(`/gallery/${galleryID}/public-download/${imageId}`);
    const cacheBusterUrl = `${downloadUrl}${downloadUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;

    const response = await fetch(cacheBusterUrl, {
        method: "GET",
        credentials: isDevEnvironment() ? "omit" : "include"
    });

    if (!response.ok) {
        let errorMessage = `Download failed (${response.status})`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            const errorText = await response.text().catch(() => '');
            errorMessage = `${errorMessage}: ${errorText.slice(0, 100)}`;
        }
        throw new Error(errorMessage);
    }

    const blob = await response.blob();
    if (blob.size < 100) {
        throw new Error(`Invalid data (${blob.size} bytes)`);
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return true;
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

// Slideshow Modal Component
const SlideshowModal = ({ images, galleryName, galleryID, onClose, initialIndex = 0, allowDownload = false, onDownload }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [downloading, setDownloading] = useState(false);
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

    const handleDownloadCurrent = async () => {
        if (!allowDownload || !galleryID || !onDownload) return;
        setDownloading(true);
        const currentImage = images[currentIndex];
        if (currentImage) {
            await onDownload(currentImage);
        }
        setDownloading(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
            if (e.key === 'd' && allowDownload) handleDownloadCurrent();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrevious, handleNext, onClose, allowDownload, handleDownloadCurrent]);

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
                    <div className="flex items-center gap-2">
                        {allowDownload && (
                            <button onClick={handleDownloadCurrent} disabled={downloading} className="text-white hover:bg-white/10 p-2 md:p-3 rounded-full">
                                {downloading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiDownload size={20} />}
                            </button>
                        )}
                        <button onClick={onClose} className="text-white hover:bg-white/10 p-2 md:p-3 rounded-full"><FiX size={24} /></button>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
                <img src={currentImage.imageUrl} alt={`Slide ${currentIndex + 1}`} className="max-w-full max-h-[85vh] object-contain" />
            </div>
            <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-4 md:gap-6">
                    <button onClick={handlePrevious} className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full"><FiChevronLeft size={24} /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 md:p-5 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-xl">
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                    </button>
                    <button onClick={handleNext} className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full"><FiChevronRight size={24} /></button>
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
    const [downloadingImageId, setDownloadingImageId] = useState(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ percentage: 0, currentImage: '' });
    const [galleryId, setGalleryId] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const { getCached } = useImagePreloader(images);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    useEffect(() => {
        const urlAccessKey = searchParams.get('accessKey');
        if (urlAccessKey) {
            setAccessKey(urlAccessKey);
            validateAndLoadGallery(urlAccessKey);
        } else {
            setIsFindingGallery(false);
            setRequiresAccessKey(true);
        }
    }, []);

    const validateAndLoadGallery = async (key) => {
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
                console.log("❌ NOT using MongoDB ID:", gallery._id);

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

    const handleDownload = async (image) => {
        if (!isDownloadAllowed) {
            setError("Download permission not granted");
            setTimeout(() => setError(""), 3000);
            return;
        }

        const filename = image.originalName || image.imageName || 'image.jpg';
        const isMobile = isMobileDevice();
        const iOS = isIOS();

        setDownloadingImageId(image.imageId);

        try {
            if (isMobile) {
                if (navigator.share && navigator.canShare) {
                    try {
                        const response = await fetch(image.imageUrl);
                        const blob = await response.blob();
                        const file = new File([blob], filename, { type: blob.type });
                        if (navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                files: [file],
                                title: 'Save Image',
                                text: 'Save this image to your device'
                            });
                            setError("Image saved successfully!");
                            setTimeout(() => setError(""), 2000);
                            setDownloadingImageId(null);
                            return;
                        }
                    } catch (err) {
                        console.log("Share failed, using fallback");
                    }
                }

                window.open(image.imageUrl, '_blank', 'noopener,noreferrer');
                setError(iOS
                    ? "Image opened in new tab. Tap and hold, then 'Add to Photos'."
                    : "Image opened in new tab. Long press and select 'Save image'."
                );
                setTimeout(() => setError(""), 5000);
                setDownloadingImageId(null);
                return;
            }

            const link = document.createElement('a');
            link.href = image.imageUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setError("Download started!");
            setTimeout(() => setError(""), 2000);

        } catch (error) {
            console.error("Download error:", error);
            setError("Download failed. Please try again.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setDownloadingImageId(null);
        }
    };

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

                const link = document.createElement('a');
                link.href = downloadFullUrl;
                link.download = data.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

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

                            const link = document.createElement('a');
                            link.href = downloadFullUrl;
                            link.download = statusData.filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

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

    useEffect(() => {
        if (galleryId) {
            console.log("🔍 Current galleryId in state:", galleryId);
        }
    }, [galleryId]);

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
                            {!isDownloadAllowed && <span className="flex items-center gap-2 text-amber-500/70"><FiDownload size={12} /> Download Disabled</span>}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        {isDownloadAllowed && (
                            <button onClick={handleDownloadAll} disabled={images.length === 0 || downloadingAll} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition-all w-full md:w-auto disabled:opacity-50">
                                {downloadingAll ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>{downloadProgress.percentage > 0 ? `${downloadProgress.percentage}%` : 'Preparing...'}</span></> : <><FiDownload className="text-sm" /> Download All ({images.length} images)</>}
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-lg border border-indigo-500/30 rounded-xl p-3 shadow-2xl max-w-md"><p className="text-[11px] text-indigo-400">{error}</p></div>}

                <div className="flex justify-center gap-4">
                    <button onClick={handleSlideshow} disabled={images.length === 0} className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-gray-300 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all disabled:opacity-50"><FiPlay size={12} className="text-indigo-400" /> Slideshow Mode</button>
                </div>

                {images.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]"><div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center"><FiCamera size={32} className="text-gray-600" /></div><p className="text-gray-500 text-sm">No images in this gallery yet.</p></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {images.map((img, idx) => (
                            <div key={img.imageId || img._id || idx} className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden cursor-zoom-in border border-white/5 hover:border-indigo-500/30 transition-all" onClick={() => setSelectedImage(img)}>
                                <img src={img.imageUrl || "/placeholder.jpg"} alt={img.imageName || img.originalName || `Image ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="1"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E'} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                                    <div className="flex justify-end">
                                        {isDownloadAllowed && (
                                            <button onClick={(e) => { e.stopPropagation(); handleDownload(img); }} disabled={downloadingImageId !== null} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50">
                                                {downloadingImageId === (img.imageId || img._id || img.id) ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiDownload size={16} />}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between"><p className="text-white font-bold text-xs tracking-tight truncate flex-1 mr-2">{img.imageName || img.originalName || `Image ${idx + 1}`}</p><FiMaximize2 className="text-white/70 w-4 h-4 flex-shrink-0" /></div>
                                </div>
                                {isDownloadAllowed && (
                                    <div className="absolute bottom-2 right-2 sm:hidden">
                                        <button onClick={(e) => { e.stopPropagation(); handleDownload(img); }} disabled={downloadingImageId !== null} className="p-2.5 bg-indigo-600/95 backdrop-blur-md rounded-full text-white active:scale-95 shadow-lg disabled:opacity-50">
                                            {downloadingImageId === (img.imageId || img._id || img.id) ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiDownload size={14} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
            {showSlideshow && <SlideshowModal images={images} galleryName={galleryData?.galleryName} galleryID={galleryId} onClose={() => setShowSlideshow(false)} initialIndex={slideshowStartIndex} allowDownload={isDownloadAllowed} onDownload={handleDownload} />}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md border-b border-white/5">
                        <button onClick={() => setSelectedImage(null)} className="text-white hover:bg-white/10 p-2 rounded-full"><FiX size={20} /></button>
                        <div className="flex items-center gap-2">
                            {isDownloadAllowed && <button onClick={() => handleDownload(selectedImage)} disabled={downloadingImageId !== null} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm disabled:opacity-50"><FiDownload size={14} /> Download</button>}
                            <button onClick={() => console.log('favorite')} className="p-2 rounded-lg text-white"><FiHeart size={20} /></button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4"><img src={selectedImage.imageUrl} className="max-w-full max-h-[80vh] object-contain" alt={selectedImage.imageName} /></div>
                </div>
            )}
        </div>
    );
};

export default ClientGallery;