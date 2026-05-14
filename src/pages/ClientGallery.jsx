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

// Slideshow Modal Component
const SlideshowModal = ({ images, galleryName, onClose, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrevious, handleNext, onClose]);

    // Touch swipe handlers
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
                handleNext(); // Swipe left -> next
            } else {
                handlePrevious(); // Swipe right -> previous
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
            {/* Header Controls */}
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
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/10 p-2 md:p-3 rounded-full transition-all active:scale-95 touch-target"
                        aria-label="Close slideshow"
                    >
                        <FiX size={24} />
                    </button>
                </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-4">
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                    loading="lazy"
                />
            </div>

            {/* Bottom Controls */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-4 md:gap-6">
                    <button
                        onClick={handlePrevious}
                        className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95 touch-target"
                        aria-label="Previous image"
                    >
                        <FiChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 md:p-5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all shadow-xl active:scale-95 touch-target"
                        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95 touch-target"
                        aria-label="Next image"
                    >
                        <FiChevronRight size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
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

    const handleDownload = (e, url, filename) => {
        e.stopPropagation();
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "kofiLartey-capture.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAll = () => {
        if (!galleryData?.downloadPermission && !galleryData?.gallerySettings?.allowDownloads) {
            setError("Download permission not granted for this gallery");
            setTimeout(() => setError(""), 3000);
            return;
        }

        images.forEach((img, index) => {
            setTimeout(() => {
                const link = document.createElement("a");
                link.href = img.imageUrl;
                link.download = img.originalName || `image_${index + 1}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, index * 500);
        });
    };

    const handleSlideshow = () => {
        if (images.length === 0) return;
        setSlideshowStartIndex(0);
        setShowSlideshow(true);
    };

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

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-32 pb-12 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">✨ Private Collection</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                            {galleryData?.galleryName || "Client Gallery"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><FiCamera className="text-indigo-500" /> {galleryData?.studioName || "kofiLartey Studio"}</span>
                            <span className="flex items-center gap-2"><FiClock className="text-indigo-500" /> {images.length} High-Resolution Captures</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {(galleryData?.downloadPermission || galleryData?.gallerySettings?.allowDownloads) && (
                            <button
                                onClick={handleDownloadAll}
                                disabled={images.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiDownload className="text-sm" /> Download All Gallery
                            </button>
                        )}
                        {galleryData?.expirationPeriod && galleryData.expirationPeriod !== "Never Expire" && galleryData.expiresAt && (
                            <span className="text-[9px] text-amber-500/70 font-bold uppercase tracking-widest">
                                Access expires: {new Date(galleryData.expiresAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                                    <div className="flex justify-end">
                                        {(galleryData?.downloadPermission || galleryData?.gallerySettings?.allowDownloads) && (
                                            <button
                                                onClick={(e) => handleDownload(e, img.imageUrl, img.originalName)}
                                                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-indigo-600 transition-all border border-white/10 shadow-xl"
                                            >
                                                <FiDownload size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold text-sm tracking-tight">{img.imageName || "Image"}</p>
                                        <FiMaximize2 className="text-white/70" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            {/* Slideshow Modal */}
            {showSlideshow && (
                <SlideshowModal
                    images={images.map(img => img.imageUrl)}
                    galleryName={galleryData?.galleryName}
                    onClose={() => setShowSlideshow(false)}
                    initialIndex={slideshowStartIndex}
                />
            )}

            {/* VIEWER OVERLAY */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col transition-opacity duration-300">
                    <div className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md z-10 border-b border-white/5">
                        <div className="flex items-center gap-6">
                            <button onClick={() => setSelectedImage(null)} className="text-white hover:bg-white/10 p-2 rounded-full transition-all">
                                <FiX size={24} />
                            </button>
                            <div className="hidden md:block">
                                <h2 className="text-white font-bold text-sm">{galleryData?.galleryName || "kofiLartey Studio"}</h2>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Client Gallery Access</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-lg px-4 py-2 divide-x divide-white/10">
                                <div className="pr-4 text-center">
                                    <p className="text-[8px] text-gray-500 uppercase font-black">Size</p>
                                    <p className="text-[10px] text-white font-mono">{selectedImage.sizeFormatted || "N/A"}</p>
                                </div>
                                <div className="pl-4 text-center">
                                    <p className="text-[8px] text-gray-500 uppercase font-black">Dimensions</p>
                                    <p className="text-[10px] text-white font-mono">
                                        {selectedImage.dimensions?.width || "?"} × {selectedImage.dimensions?.height || "?"}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsFavorite(!isFavorite)} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all ${isFavorite ? 'bg-red-600 border-red-600 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                <FiHeart size={14} fill={isFavorite ? "currentColor" : "none"} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Favorite</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center p-4">
                        <img src={selectedImage.imageUrl} className="max-w-full max-h-[80vh] object-contain shadow-2xl" alt={selectedImage.imageName} />
                    </div>

                    <div className="flex items-center justify-between px-8 py-6 bg-black border-t border-white/5 z-10">
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Filename</p>
                                <p className="text-[10px] text-white font-mono">{selectedImage.originalName || selectedImage.imageName}</p>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Size</p>
                                <p className="text-[10px] text-white font-mono">{selectedImage.sizeFormatted}</p>
                            </div>
                            {selectedImage.dimensions && (
                                <div>
                                    <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Dimensions</p>
                                    <p className="text-[10px] text-white font-mono">{selectedImage.dimensions.width} × {selectedImage.dimensions.height}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white"><FiShare2 size={18} /></button>
                            <button className="text-gray-400 hover:text-white"><FiInfo size={18} /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientGallery;