import { FiUsers, FiCheckCircle, FiLock, FiAlertTriangle, FiDatabase, FiActivity } from 'react-icons/fi';

const statConfig = [
  { label: 'Total Users', valueKey: 'totalUsers', icon: FiUsers, tone: 'from-blue-500 to-indigo-500' },
  { label: 'Active Now', valueKey: 'activeUsers', icon: FiCheckCircle, tone: 'from-emerald-500 to-teal-500' },
  { label: 'Downloads Enabled', valueKey: 'downloadEnabled', icon: FiLock, tone: 'from-sky-500 to-cyan-500' },
  { label: 'High Risk', valueKey: 'highRiskUsers', icon: FiAlertTriangle, tone: 'from-orange-500 to-red-500' },
  { label: 'Storage Used', valueKey: 'totalStorage', icon: FiDatabase, tone: 'from-violet-500 to-purple-500', format: 'storage' },
  { label: 'Activity Logs', valueKey: 'activityCount', icon: FiActivity, tone: 'from-indigo-500 to-cyan-500' }
];

const formatValue = (value, format) => {
  if (format === 'storage') return `${value.toFixed(1)} GB`;
  return value;
};

const AdminStatsCards = ({ stats }) => (
  <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4" aria-label="Admin statistics">
    {statConfig.map((stat) => {
      const Icon = stat.icon;
      const value = formatValue(stats[stat.valueKey], stat.format);

      return (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-4 md:p-5"
        >
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.tone}`} />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold">{stat.label}</p>
              <p className="mt-2 text-2xl md:text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/5 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors">
              <Icon size={18} />
            </div>
          </div>
        </div>
      );
    })}
  </section>
);

export default AdminStatsCards;
