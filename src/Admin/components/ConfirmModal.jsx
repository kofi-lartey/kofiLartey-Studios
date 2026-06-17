import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ user, isOpen, onClose, onConfirm, actionTitle = 'Confirm action' }) => {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/5 p-5">
          <div>
            <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-300 mb-3">
              <FiAlertTriangle size={20} />
            </div>
            <h2 id="confirm-modal-title" className="text-lg font-bold text-white">{actionTitle}</h2>
            <p className="text-sm text-gray-400 mt-1">
              This action will update the local admin state only. Backend integration can be connected later.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors touch-target"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-300">
            Are you sure you want to continue with <span className="font-semibold text-white">{user.name}</span>?
          </p>
          <p className="text-xs text-gray-500 mt-2">{user.email}</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 border-t border-white/5 p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06] transition-colors touch-target"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500 hover:bg-red-400 px-4 py-2.5 text-sm font-bold text-white transition-colors touch-target"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
