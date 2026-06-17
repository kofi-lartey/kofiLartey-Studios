import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const toneConfig = {
  success: { icon: FiCheckCircle, className: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' },
  warning: { icon: FiAlertTriangle, className: 'border-amber-500/20 bg-amber-500/10 text-amber-300' },
  error: { icon: FiXCircle, className: 'border-red-500/20 bg-red-500/10 text-red-300' },
  info: { icon: FiCheckCircle, className: 'border-blue-500/20 bg-blue-500/10 text-blue-300' }
};

const Toast = ({ message, tone = 'info', onClose }) => {
  const config = toneConfig[tone] || toneConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 left-1/2 z-[90] w-full max-w-md -translate-x-1/2">
      <div className={`flex items-start gap-4 rounded-2xl border p-5 shadow-2xl backdrop-blur-sm ${config.className}`}>
        <Icon className="mt-0.5 shrink-0" size={18} />
        <div className="flex-1">
          <p className="text-sm font-semibold">{message}</p>
          <p className="mt-1 text-xs opacity-80">No backend request was sent.</p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-white/10" aria-label="Close notification">×</button>
      </div>
    </div>
  );
};

export default Toast;
