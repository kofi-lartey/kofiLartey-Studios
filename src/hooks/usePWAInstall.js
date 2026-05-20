import { useState, useEffect } from 'react';

const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSInstalled = isIOS && window.navigator.standalone;

    if (isStandalone || isIOSInstalled) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  return { canInstall, isInstalled, install };
};

export default usePWAInstall;