import {
  FiX, FiTrash2, FiAlertCircle, FiImage, FiFolder, FiKey,
  FiLink, FiUser, FiCalendar, FiMail, FiAtSign
} from "react-icons/fi";

const DeleteModal = ({ selectedGallery, showDeleteModal, deleteConfirmText, deleteLoading, onClose, onConfirm, onConfirmTextChange, getStatusColor, formatDate }) => {
  if (!showDeleteModal || !selectedGallery) return null;

  const isConfirmValid = deleteConfirmText === "DELETE";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Delete gallery confirmation"
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-full">
                <FiTrash2 className="text-red-500" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Gallery</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close delete modal"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <FiAlertCircle size={18} />
              <span className="font-bold text-sm uppercase tracking-wider">Permanent Deletion</span>
            </div>
            <p className="text-red-400/80 text-xs leading-relaxed">
              This action cannot be undone. Everything associated with this gallery will be permanently deleted.
            </p>
          </div>

          {/* Gallery Details */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] uppercase text-gray-600">Gallery Name</p>
                <p className="text-sm text-white font-medium">{selectedGallery.galleryName}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-600">Gallery ID</p>
                <p className="text-xs text-indigo-400 font-mono">{selectedGallery.galleryID}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-600">Client</p>
                <p className="text-sm text-white">{selectedGallery.name}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-600">Email</p>
                <p className="text-xs text-gray-400 truncate">{selectedGallery.email}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-600">Images</p>
                <p className="text-sm text-white font-bold">{selectedGallery.imageCount || 0}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-600">Status</p>
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(selectedGallery.status)}`}>
                  {selectedGallery.status}
                </span>
              </div>
            </div>
            <div className="border-t border-white/5 pt-3">
              <p className="text-[9px] uppercase text-gray-600 mb-1">Gallery URL</p>
              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-white/5">
                <FiLink size={12} className="text-gray-500 flex-shrink-0" />
                <p className="text-[10px] text-gray-400 truncate">{selectedGallery.link}</p>
              </div>
            </div>
          </div>

          {/* What Will Be Lost */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">What Will Be Lost</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiImage size={12} className="text-red-400/60" />
                <span>{selectedGallery.imageCount || 0} images from Cloudinary</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiFolder size={12} className="text-red-400/60" />
                <span>Gallery and all metadata</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiKey size={12} className="text-red-400/60" />
                <span>Access keys and permissions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiLink size={12} className="text-red-400/60" />
                <span>Gallery share link</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiUser size={12} className="text-red-400/60" />
                <span>Client access for {selectedGallery.name}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-3">
              Type <span className="text-white font-bold bg-red-500/20 px-2 py-0.5 rounded">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => onConfirmTextChange(e.target.value)}
              placeholder="Type DELETE to confirm"
              aria-label="Type DELETE to confirm deletion"
              className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none transition-all ${deleteConfirmText === "DELETE"
                ? 'border-red-500 text-red-400'
                : 'border-white/10 text-gray-400'
                }`}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/10 p-6 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmValid || deleteLoading}
              className={`flex-1 px-4 py-3 rounded-xl transition-all text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isConfirmValid && !deleteLoading
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-red-600/20 text-red-400/50 cursor-not-allowed'
                }`}
            >
              {deleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={16} />
                  Delete Permanently
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
