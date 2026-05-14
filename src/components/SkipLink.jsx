import { useEffect, useRef } from 'react';

/**
 * SkipLink component - provides keyboard users a way to bypass navigation
 * Renders a hidden link that becomes visible on focus
 */
const SkipLink = ({ href = "#main-content", label = "Skip to main content" }) => {
  const linkRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus skip link on Tab press at the top of the page
      if (e.key === 'Tab' && document.activeElement === document.body) {
        linkRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      tabIndex={0}
    >
      {label}
    </a>
  );
};

export default SkipLink;
