const ChartCard = ({ title, subtitle, children, actions }) => (
  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
    <div className="mt-5">{children}</div>
  </div>
);

export default ChartCard;
