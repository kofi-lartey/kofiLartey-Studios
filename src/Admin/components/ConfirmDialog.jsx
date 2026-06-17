import Modal from './Modal';

const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'red', onConfirm, onClose }) => (
  <Modal
    isOpen={isOpen}
    title={title}
    onClose={onClose}
    size="sm"
    footer={
      <>
        <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">
          {cancelLabel}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${tone === 'red' ? 'bg-red-600 hover:bg-red-500' : tone === 'green' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm leading-6 text-gray-300">{message}</p>
  </Modal>
);

export default ConfirmDialog;
