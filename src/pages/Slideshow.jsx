import { useState, useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiPlay, FiPause } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Slideshow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { images, galleryName, returnPath } = location.state || { 
        images: [], 
        galleryName: '', 
        returnPath: '/clientGallery' 
    };
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);

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

    const handleClose = () => {
        // Navigate back without reloading the page
        navigate(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') handleClose();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (images.length === 0) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white">No images to display</p>
                    <button onClick={handleClose} className="mt-4 text-indigo-400">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black z-[200] flex flex-col"
            onMouseMove={() => {
                setShowControls(true);
                clearTimeout(window.controlsTimeout);
                window.controlsTimeout = setTimeout(() => setShowControls(false), 3000);
            }}
        >
            {/* Header Controls */}
            <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-between items-center">
                    <div className="text-white">
                        <p className="text-sm font-medium">Slideshow Mode</p>
                        <p className="text-xs text-gray-400">
                            {currentIndex + 1} of {images.length}
                        </p>
                        {galleryName && (
                            <p className="text-xs text-indigo-400 mt-1">
                                {galleryName}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/10 p-2 rounded-full transition-all"
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
                />
            </div>

            {/* Bottom Controls */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={handlePrevious}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <FiChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-all shadow-xl"
                    >
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <FiChevronRight size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 max-w-2xl mx-auto">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
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

export default Slideshow;