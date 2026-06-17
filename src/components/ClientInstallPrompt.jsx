import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ClientInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isPWAInstalled = isIOSDevice && window.navigator.standalone;

    if (isStandalone || isPWAInstalled) {
      return;
    }

    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl md:rounded-2xl shadow-2xl z-50 max-w-md mx-auto md:mx-0"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <FiDownload className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Save This Event</h3>
            <p className="text-sm text-white/90 mb-3">
              Add this gallery to your home screen for quick access to your photos anytime.
            </p>
            <div className="flex items-center gap-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-white text-blue-600 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  Install Now
                </button>
              )}
              {isIOS && (
                <div className="text-xs text-white/80">
                  Tap Share → "Add to Home Screen"
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClientInstallPrompt;