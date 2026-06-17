import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

const LOGO_URL =
  'https://res.cloudinary.com/djjgkezui/image/upload/v1778486731/ChatGPT_Image_May_11__2026__08_03_25_AM-removebg-preview_v3odik.png';

const LOADER_WHITELIST = new Set([
  '/',
  '/coming-soon',
  '/login',
  '/register',
  '/forgot-password',
  '/email-confirmation',
  '/clientGallery',
  '/dashboard',
  '/galleries',
  '/clients',
  '/settings',
  '/privacy',
  '/terms',
  '/api-docs',
  '/press',
  '/view-demo',
]);

const normalizePath = (path) => {
  const hashIndex = path.indexOf('#');
  if (hashIndex !== -1) {
    return path.substring(0, hashIndex);
  }
  const queryIndex = path.indexOf('?');
  if (queryIndex !== -1) {
    return path.substring(0, queryIndex);
  }
  return path;
};

const isWhitelistedNavigation = (href) => {
  if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return false;
  }
  const normalizedPath = normalizePath(href);
  return LOADER_WHITELIST.has(normalizedPath);
};

const LoadingContext = createContext({
  isLoading: false,
  progress: 0,
  startLoading: () => {},
  finishLoading: () => {},
  setProgress: () => {},
  incrementProgress: () => {},
  autoStartOnInteraction: true,
});

export const useLoading = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }

  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef(null);
  const finishTimeoutRef = useRef(null);
  const activeLoadersRef = useRef(0);

  const startProgressSimulation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        if (prev >= 75) return prev + 1;
        return prev + Math.random() * 8;
      });
    }, 120);
  }, []);

  const startLoading = useCallback(() => {
    activeLoadersRef.current += 1;

    if (activeLoadersRef.current === 1) {
      setIsLoading(true);
      setProgress(5);
      startProgressSimulation();
    }
  }, [startProgressSimulation]);

  const finishLoading = useCallback(() => {
    activeLoadersRef.current = Math.max(0, activeLoadersRef.current - 1);

    if (activeLoadersRef.current > 0) return;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setProgress(100);

    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
    }

    finishTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 350);
  }, []);

  const handleNavigationClick = useCallback((e) => {
    const target = e.target.closest('a[href]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (isWhitelistedNavigation(href)) {
      startLoading();
    }
  }, [startLoading]);

  const handlePopState = useCallback(() => {
    const currentPath = normalizePath(window.location.pathname + window.location.search);
    if (LOADER_WHITELIST.has(currentPath)) {
      startLoading();
    }
  }, [startLoading]);

  useEffect(() => {
    document.addEventListener('click', handleNavigationClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleNavigationClick, true);
      window.removeEventListener('popstate', handlePopState);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
      }
    };
  }, [handleNavigationClick, handlePopState]);

  const value = {
    isLoading,
    progress,
    startLoading,
    finishLoading,
    setProgress,
    incrementProgress: () =>
      setProgress((prev) => Math.min(prev + 10, 95)),
    autoStartOnInteraction: true,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}

      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]/92 backdrop-blur-md transition-all duration-300 ${
          isLoading
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />

            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="6"
              />

              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#loaderGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={327}
                strokeDashoffset={327 - (327 * progress) / 100}
                className="transition-all duration-150 ease-linear"
              />

              <defs>
                <linearGradient
                  id="loaderGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={LOGO_URL}
                alt="Loading"
                className="w-12 h-12 object-contain animate-pulse"
              />
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-white/90 text-sm tracking-[0.25em] uppercase font-medium">
              Loading
            </p>

            <div className="w-52 h-[5px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 transition-all duration-150"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="text-white/50 text-xs">
              {Math.floor(progress)}%
            </p>
          </div>
        </div>
      </div>
    </LoadingContext.Provider>
  );
};

export default LoadingContext;