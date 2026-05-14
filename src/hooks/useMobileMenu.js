import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage mobile menu state with escape key support
 * @param {boolean} initialOpen - Initial menu state
 * @returns {Object} - { isOpen, open, close, toggle }
 */
export const useMobileMenu = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export default useMobileMenu;
