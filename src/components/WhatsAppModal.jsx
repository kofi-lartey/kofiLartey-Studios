import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiKey } from "react-icons/fi";

const REGEX_INTL_PHONE = /^\+?[1-9]\d{1,14}$/;

const WhatsAppModal = ({ selectedGallery, showWhatsAppModal, onClose, onSend, whatsAppData, onWhatsAppChange, whatsAppSending }) => {
  const [phoneError, setPhoneError] = useState("");

  if (!showWhatsAppModal || !selectedGallery) return null;

  const validatePhone = (raw) => {
    const stripped = raw.replace(/[\s\-\(\)]/g, "");
    if (!stripped) return false;
    if (!REGEX_INTL_PHONE.test(stripped)) {
      return false;
    }
    return true;
  };

  const handleNumberChange = (e) => {
    onWhatsAppChange({ ...whatsAppData, clientNumber: e.target.value });
    const stripped = e.target.value.replace(/[\s\-\(\)]/g, "");
    if (e.target.value && !REGEX_INTL_PHONE.test(stripped)) {
      setPhoneError("Please enter a valid international phone number (e.g. +233 50 …)");
    } else {
      setPhoneError("");
    }
  };

  const isPhoneValid = validatePhone(whatsAppData.clientNumber);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Share gallery via WhatsApp"
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full" aria-hidden="true">
              <FaWhatsapp className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Share via WhatsApp</h3>
              <p className="text-xs text-gray-500">Send gallery link to your client</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close WhatsApp modal"
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Gallery Info Card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] uppercase text-gray-500 tracking-wider">Gallery</p>
                <p className="text-sm text-white font-medium mt-0.5 break-words">{selectedGallery.galleryName}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-500 tracking-wider">Client</p>
                <p className="text-sm text-white font-medium mt-0.5 break-words">{selectedGallery.name}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 overflow-hidden">
              <FiKey size={12} className="text-gray-500 shrink-0" />
              <code className="text-xs text-indigo-400 font-mono truncate">{selectedGallery.accessKey}</code>
            </div>
          </div>

          {/* Client Number Input */}
          <div>
            <label htmlFor="wa-client-number" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Client's WhatsApp Number <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <FaWhatsapp className="text-green-500" size={16} aria-hidden="true" />
                <span className="text-gray-600" aria-hidden="true">|</span>
              </div>
              <input
                id="wa-client-number"
                type="tel"
                value={whatsAppData.clientNumber}
                onChange={handleNumberChange}
                placeholder="+233 50 987 6543"
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? "wa-phone-error" : undefined}
                className={`w-full bg-black/40 border rounded-xl pl-[72px] pr-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-gray-600 ${phoneError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/10 focus:border-green-500'
                  }`}
                autoFocus
              />
            </div>
            {phoneError && (
              <p id="wa-phone-error" className="text-red-400 text-[10px] mt-1.5" role="alert">
                {phoneError}
              </p>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="wa-message" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              id="wa-message"
              value={whatsAppData.customMessage}
              onChange={(e) => onWhatsAppChange({ ...whatsAppData, customMessage: e.target.value })}
              rows={5}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-green-500 outline-none transition-all resize-none placeholder:text-gray-600"
              placeholder="Customize your message..."
            />
            <p className="text-[10px] text-gray-600 mt-1">
              Gallery link and access key will be included automatically
            </p>
          </div>

          {/* Preview */}
          <div className="bg-green-500/[0.03] border border-green-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaWhatsapp size={12} className="text-green-500" aria-hidden="true" />
              <p className="text-[10px] uppercase text-green-400 font-bold tracking-wider">Preview</p>
            </div>
            <p className="text-xs text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
              {whatsAppData.customMessage}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={whatsAppSending || !whatsAppData.clientNumber}
            className="flex-[2] px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/20"
          >
            {whatsAppSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Opening WhatsApp...
              </>
            ) : (
              <>
                <FaWhatsapp size={16} aria-hidden="true" />
                Share via WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
