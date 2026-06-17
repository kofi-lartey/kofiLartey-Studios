import { FiActivity, FiAlertCircle, FiCheckCircle, FiLock, FiUserX, FiDownload, FiEye } from 'react-icons/fi';

const severityIcon = {
  info: FiActivity,
  success: FiCheckCircle,
  warning: FiAlertCircle,
  critical: FiLock
};

const severityClasses = {
  info: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  success: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  warning: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  critical: 'text-red-300 bg-red-500/10 border-red-500/20'
};

const actionIcon = {
  Download: FiDownload,
  deleted: FiUserX,
  viewed: FiEye,
  blocked: FiLock
};

const getActionIcon = (action) => {
  const match = Object.keys(actionIcon).find((key) => action.toLowerCase().includes(key.toLowerCase()));
  return match ? actionIcon[match] : FiActivity;
};

const ActivityLog = ({ logs }) => (
  <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 md:p-5">
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-bold text-white">Activity Monitor</h2>
        <p className="text-sm text-gray-500 mt-1">General user actions and administrative events.</p>
      </div>
      <span className="rounded-full bg-white/[0.06] border border-white/5 px-3 py-1 text-xs text-gray-300">
        {logs.length} recent
      </span>
    </div>

    <div className="space-y-3">
      {logs.map((log) => {
        const Icon = severityIcon[log.severity] || FiActivity;
        const ActionIcon = getActionIcon(log.action);

        return (
          <article
            key={log.id}
            className="rounded-xl border border-white/5 bg-white/[0.025] p-3 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 h-9 w-9 rounded-lg border flex items-center justify-center ${severityClasses[log.severity]}`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{log.action}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {log.actor} · {log.target}
                    </p>
                  </div>
                  <ActionIcon size={15} className="text-gray-500 shrink-0" />
                </div>
                <p className="text-xs text-gray-600 mt-2">{log.timestamp}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default ActivityLog;
