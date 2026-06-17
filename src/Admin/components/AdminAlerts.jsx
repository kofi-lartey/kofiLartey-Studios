import { FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const alertClasses = {
  info: { icon: FiInfo, border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-300' },
  success: { icon: FiCheckCircle, border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
  warning: { icon: FiAlertTriangle, border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-300' },
  critical: { icon: FiXCircle, border: 'border-red-500/20', bg: 'bg-red-500/10', text: 'text-red-300' }
};

const AdminAlerts = ({ alerts }) => (
  <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 md:p-5">
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-bold text-white">System Alerts</h2>
        <p className="text-sm text-gray-500 mt-1">Items that may need admin attention.</p>
      </div>
    </div>

    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = alertClasses[alert.severity] || alertClasses.info;
        const Icon = config.icon;

        return (
          <article
            key={alert.id}
            className={`rounded-xl border ${config.border} ${config.bg} p-3`}
          >
            <div className="flex gap-3">
              <Icon className={`mt-0.5 ${config.text}`} size={17} />
              <div>
                <p className="text-sm font-semibold text-white">{alert.title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default AdminAlerts;
