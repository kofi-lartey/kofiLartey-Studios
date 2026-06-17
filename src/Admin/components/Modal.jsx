import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, title, onClose, children, footer, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className={`w-full ${sizeClasses[size] || sizeClasses.lg} max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/5 bg-[#0a0a0a]/95 p-5 backdrop-blur">
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">Local mock action.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-white/[0.06] hover:text-white" aria-label="Close modal">
            <FiX size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-white/5 p-5">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
