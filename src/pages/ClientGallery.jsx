import { useState, useEffect, useRef } from "react";
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

// Helper function to download single image using server API
export const downloadImageFromServer = async (galleryId, imageId, filename = "image.jpg") => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/gallery/${galleryId}/public-download/${imageId}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        const blob = await response.blob();

        // FORCE extension (VERY IMPORTANT for iOS)
        const safeName = filename.includes(".")
            ? filename
            : `${filename}.jpg`;

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = safeName;

        // REQUIRED for iOS PWA reliability
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // ⚡ IMPORTANT: delayed cleanup (iOS/Android fix)
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
        }, 8000);

        return true;
    } catch (error) {
        console.error("Download error:", error);
        throw error;
    }
};

// Helper to download all images as ZIP using server API
export const downloadAllAsZip = async (galleryId, galleryName, onProgress) => {
    try {
        onProgress?.({
            percentage: 10,
            currentImage: "Preparing download..."
        });

        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/gallery/${galleryId}/public-download-all`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        onProgress?.({
            percentage: 50,
            currentImage: "Creating ZIP file..."
        });

        const blob = await response.blob();

        let filename = `${galleryName || "gallery"}_gallery.zip`;

        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match) filename = match[1];
        }

        // FORCE .zip extension (iOS fix)
        if (!filename.endsWith(".zip")) {
            filename += ".zip";
        }

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;

        link.setAttribute("target", "_blank");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // ⚡ longer delay for large ZIPs
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
        }, 10000);

        onProgress?.({
            percentage: 100,
            currentImage: "Complete!"
        });

        return true;
    } catch (error) {
        console.error("ZIP download error:", error);
        throw error;
    }
};

// Slideshow Modal Component
const SlideshowModal = ({ images, galleryName, galleryId, onClose, initialIndex = 0, allowDownload = false }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const controlsTimeout = useRef(null);

    useEffect(() => {
        let interval;
        if (isPlaying && images.length > 0) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, images.length]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsPlaying(false);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsPlaying(false);
    };

    const handleDownloadCurrent = async () => {
        if (!allowDownload || !galleryId) return;
        setIsDownloading(true);
        const currentImage = images[currentIndex];
        try {
            await downloadImageFromServer(
                galleryId,
                currentImage.imageId,
                currentImage.originalName || `image-${currentIndex + 1}.jpg`
            );
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setIsDownloading(false);
        }
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
    }, [handlePrevious, handleNext, onClose, handleDownloadCurrent, allowDownload]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrevious();
            }
        }
    };

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
            role="dialog"
            aria-label="Image slideshow"
        >
            <div className={`absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-between items-center">
                    <div className="text-white px-2">
                        <p className="text-sm md:text-base font-medium">Slideshow Mode</p>
                        <p className="text-xs md:text-sm text-gray-400">
                            {currentIndex + 1} of {images.length}
                        </p>
                        {galleryName && (
                            <p className="text-xs md:text-sm text-indigo-400 mt-1 line-clamp-1">
                                {galleryName}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {allowDownload && (
                            <button
                                onClick={handleDownloadCurrent}
                                disabled={isDownloading}
                                className="text-white hover:bg-white/10 p-2 md:p-3 rounded-full transition-all active:scale-95 disabled:opacity-50"
                                aria-label="Download current image"
                            >
                                <FiDownload size={20} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/10 p-2 md:p-3 rounded-full transition-all active:scale-95"
                            aria-label="Close slideshow"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <img
                    src={images[currentIndex].imageUrl}
                    alt={`Slide ${currentIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                    loading="lazy"
                />
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-4 md:gap-6">
                    <button
                        onClick={handlePrevious}
                        className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
                        aria-label="Previous image"
                    >
                        <FiChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 md:p-5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all shadow-xl active:scale-95"
                        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
                        aria-label="Next image"
                    >
                        <FiChevronRight size={24} />
                    </button>
                </div>

                <div className="mt-4 md:mt-6 max-w-2xl mx-auto">
                    <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientGallery = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0, percentage: 0, currentImage: '' });
    const [galleryId, setGalleryId] = useState(null);

    // Check URL for accessKey on mount
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
                setImages(gallery.images || []);
                setGalleryId(gallery.galleryId || gallery._id);
                setIsAuthenticated(true);
                setRequiresAccessKey(false);
            } else {
                throw new Error(response.message || "Failed to access gallery");
            }
        } catch (error) {
            console.error('Gallery access error:', error);

            if (error.response?.status === 404) {
                setError("No gallery found with this access key. Please check and try again.");
            } else if (error.response?.status === 403) {
                setError(error.response?.data?.message || "This gallery link has expired");
            } else {
                setError(error.response?.data?.message || "Failed to load gallery");
            }
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

    // Download single image using server API
    const handleDownload = async (e, image) => {
        if (e) {
            e.stopPropagation();
        }

        if (!isDownloadAllowed) {
            setError("Download permission not granted for this gallery");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (!galleryId || !image.imageId) {
            setError("Unable to download: Missing gallery or image information");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setIsDownloading(true);
        setError("");

        try {
            await downloadImageFromServer(
                galleryId,
                image.imageId,
                image.originalName || image.imageName || 'image.jpg'
            );
            setError("Download started successfully!");
            setTimeout(() => setError(""), 2000);
        } catch (error) {
            console.error('Download error:', error);
            setError("Failed to download image. Please try again.");
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsDownloading(false);
        }
    };

    // Download all images as ZIP using server API
    const handleDownloadAll = async () => {
        if (!isDownloadAllowed) {
            setError("Download permission not granted for this gallery");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (images.length === 0) {
            setError("No images to download");
            return;
        }

        if (!galleryId) {
            setError("Unable to download: Gallery information missing");
            setTimeout(() => setError(""), 3000);
            return;
        }

        setIsDownloading(true);
        setDownloadProgress({ current: 0, total: images.length, percentage: 0, currentImage: 'Preparing download...' });

        try {
            await downloadAllAsZip(galleryId, galleryData?.galleryName, (progress) => {
                setDownloadProgress(progress);
                setError(progress.currentImage);
            });
            
            setError("Download completed successfully!");
            setTimeout(() => setError(""), 3000);
        } catch (error) {
            console.error('Download all error:', error);
            setError("Failed to download gallery. Please try again.");
            setTimeout(() => setError(""), 4000);
        } finally {
            setIsDownloading(false);
            setTimeout(() => {
                setDownloadProgress({ current: 0, total: 0, percentage: 0, currentImage: '' });
            }, 2000);
        }
    };

    const handleSlideshow = () => {
        if (images.length === 0) return;
        setSlideshowStartIndex(0);
        setShowSlideshow(true);
    };

    // Check if download is allowed
    const isDownloadAllowed = galleryData?.downloadPermission === true || galleryData?.gallerySettings?.allowDownloads === true;

    // Loading state
    if (isFindingGallery || isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white">
                <NavBar />
                <main className="flex-1 flex items-center justify-center pt-32 px-6">
                    <div className="text-center">
                        <Loader size={40} variant="minimal" />
                        <p className="text-gray-500 text-sm mt-4">Loading gallery...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Invalid access key error
    if (error && !isAuthenticated && requiresAccessKey) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white">
                <NavBar />
                <main className="flex-1 flex items-center justify-center pt-32 px-6">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <FiAlertCircle size={40} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Invalid Access Key</h2>
                        <p className="text-gray-500 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Access Key Input Screen
    if (requiresAccessKey && !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white">
                <NavBar />

                <main className="flex-1 flex items-center justify-center px-6 py-12 pt-32">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                                <FiKey size={34} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-3">Enter Access Key</h1>
                            <p className="text-gray-400 text-sm">
                                Enter the access key provided to you to view your gallery
                            </p>
                        </div>

                        <form onSubmit={handleAccessKeySubmit} className="space-y-6">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] uppercase text-gray-500 font-bold tracking-wider mb-2">
                                            ACCESS KEY
                                        </label>
                                        <div className="relative">
                                            <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="text"
                                                value={accessKey}
                                                onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                                                placeholder="Enter your access key"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-2">
                                            Your access key was provided when the gallery was shared with you.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3.5 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                                            <FiAlertCircle className="text-red-400 flex-shrink-0" size={14} />
                                            <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider">{error}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FiLogIn size={14} />
                                        ACCESS GALLERY
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    // Authenticated Gallery View
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col font-urbanist font-sans text-white selection:bg-indigo-500/30">
            <NavBar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-32 pb-12 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">✨ Private Collection</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white">
                            {galleryData?.galleryName || "Client Gallery"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><FiCamera className="text-indigo-500" /> {galleryData?.studioName || "Studio"}</span>
                            <span className="flex items-center gap-2"><FiClock className="text-indigo-500" /> {images.length} High-Resolution Captures</span>
                            {!isDownloadAllowed && (
                                <span className="flex items-center gap-2 text-amber-500/70">
                                    <FiDownload size={12} /> Download Disabled
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        {isDownloadAllowed && (
                            <button
                                onClick={handleDownloadAll}
                                disabled={images.length === 0 || isDownloading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{downloadProgress.percentage > 0 ? `${downloadProgress.percentage}%` : 'Preparing...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <FiDownload className="text-sm" />
                                        Download All ({images.length} images)
                                    </>
                                )}
                            </button>
                        )}
                        {galleryData?.expirationPeriod && galleryData.expirationPeriod !== "Never Expire" && galleryData.expiresAt && (
                            <span className="text-[9px] text-amber-500/70 font-bold uppercase tracking-widest">
                                Access expires: {new Date(galleryData.expiresAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Download Progress Bar */}
                {isDownloading && downloadProgress.percentage > 0 && downloadProgress.percentage < 100 && (
                    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 bg-black/90 backdrop-blur-lg border border-indigo-500/30 rounded-xl p-3 shadow-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Downloading</span>
                            <span className="text-[10px] text-white font-mono">{downloadProgress.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                                style={{ width: `${downloadProgress.percentage}%` }}
                            />
                        </div>
                        <p className="text-[9px] text-gray-400 mt-2 truncate">
                            {downloadProgress.currentImage || `Processing...`}
                        </p>
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleSlideshow}
                        disabled={images.length === 0}
                        className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-gray-300 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiPlay size={12} className="text-indigo-400" /> Slideshow Mode
                    </button>
                </div>

                {/* Image Grid */}
                {images.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <FiCamera size={32} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-sm">No images in this gallery yet.</p>
                        <p className="text-gray-600 text-xs mt-2">Check back later for updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {images.map((img, index) => (
                            <div
                                key={img.imageId || index}
                                className="group relative aspect-square bg-white/5 rounded-2xl overflow-hidden cursor-zoom-in border border-white/5 transition-all duration-500 hover:border-indigo-500/30"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={img.imageName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Desktop Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6">
                                    <div className="flex justify-end">
                                        {isDownloadAllowed && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(e, img);
                                                }}
                                                disabled={isDownloading}
                                                className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-indigo-600 transition-all border border-white/10 shadow-xl active:scale-95 disabled:opacity-50"
                                                aria-label="Download image"
                                            >
                                                <FiDownload size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold text-xs sm:text-sm tracking-tight truncate flex-1 mr-2">
                                            {img.imageName || "Image"}
                                        </p>
                                        <FiMaximize2 className="text-white/70 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    </div>
                                </div>
                                
                                {/* Mobile Download Button */}
                                {isDownloadAllowed && (
                                    <div className="absolute bottom-2 right-2 sm:hidden">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(e, img);
                                            }}
                                            disabled={isDownloading}
                                            className="p-2.5 bg-indigo-600/95 backdrop-blur-md rounded-full text-white active:scale-95 shadow-lg disabled:opacity-50"
                                            aria-label="Download image"
                                        >
                                            {isDownloading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <FiDownload size={14} />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            {/* Slideshow Modal */}
            {showSlideshow && (
                <SlideshowModal
                    images={images}
                    galleryName={galleryData?.galleryName}
                    galleryId={galleryId}
                    onClose={() => setShowSlideshow(false)}
                    initialIndex={slideshowStartIndex}
                    allowDownload={isDownloadAllowed}
                />
            )}

            {/* Image Viewer Overlay */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col transition-opacity duration-300">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black/50 backdrop-blur-md z-10 border-b border-white/5">
                        <button 
                            onClick={() => setSelectedImage(null)} 
                            className="text-white hover:bg-white/10 p-2 rounded-full transition-all active:scale-95"
                            aria-label="Close viewer"
                        >
                            <FiX size={20} className="sm:w-6 sm:h-6" />
                        </button>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                            {isDownloadAllowed && (
                                <button
                                    onClick={(e) => handleDownload(e, selectedImage)}
                                    disabled={isDownloading}
                                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all active:scale-95 disabled:opacity-50"
                                    aria-label="Download image"
                                >
                                    {isDownloading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FiDownload size={14} className="sm:w-4 sm:h-4" />
                                    )}
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">Download</span>
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setIsFavorite(!isFavorite)} 
                                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg border transition-all ${
                                    isFavorite 
                                        ? 'bg-red-600 border-red-600 text-white' 
                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                }`}
                                aria-label="Favorite"
                            >
                                <FiHeart size={14} className="sm:w-4 sm:h-4" fill={isFavorite ? "currentColor" : "none"} />
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">Favorite</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center p-4">
                        <img 
                            src={selectedImage.imageUrl} 
                            className="max-w-full max-h-[80vh] object-contain shadow-2xl" 
                            alt={selectedImage.imageName} 
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-black border-t border-white/5 z-10 gap-3 sm:gap-0">
                        <div className="flex flex-wrap gap-4 sm:gap-12">
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Filename</p>
                                <p className="text-[9px] sm:text-[10px] text-white font-mono truncate max-w-[150px] sm:max-w-none">
                                    {selectedImage.originalName || selectedImage.imageName}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Size</p>
                                <p className="text-[9px] sm:text-[10px] text-white font-mono">{selectedImage.sizeFormatted || "N/A"}</p>
                            </div>
                            {selectedImage.dimensions && (
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Dimensions</p>
                                    <p className="text-[9px] sm:text-[10px] text-white font-mono">
                                        {selectedImage.dimensions.width} × {selectedImage.dimensions.height}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {isDownloadAllowed && (
                                <button
                                    onClick={(e) => handleDownload(e, selectedImage)}
                                    disabled={isDownloading}
                                    className="sm:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-white text-xs font-bold active:scale-95 disabled:opacity-50"
                                >
                                    {isDownloading ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FiDownload size={14} />
                                    )}
                                    Download
                                </button>
                            )}
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <FiShare2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <FiInfo size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientGallery;