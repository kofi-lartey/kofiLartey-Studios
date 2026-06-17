const toneClasses = {
  blue: 'from-blue-500 to-indigo-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  red: 'from-red-500 to-rose-500',
  purple: 'from-violet-500 to-purple-500',
  cyan: 'from-cyan-500 to-sky-500'
};

const StatsCard = ({ title, value, icon: Icon, trend, tone = 'blue', detail }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-5">
    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneClasses[tone] || toneClasses.blue}`} />
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{title}</p>
        <p className="mt-3 text-2xl font-bold text-white">{value}</p>
        {detail && <p className="mt-2 text-xs text-gray-400">{detail}</p>}
      </div>
      <div className="rounded-xl bg-white/[0.06] p-3 text-gray-300 group-hover:text-white">
        <Icon size={20} />
      </div>
    </div>
    {trend && (
      <div className={`mt-4 text-xs font-semibold ${trend.startsWith('-') ? 'text-red-300' : 'text-emerald-300'}`}>
        {trend}
      </div>
    )}
  </div>
);

export default StatsCard;
