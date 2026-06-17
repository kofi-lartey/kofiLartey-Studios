const toneClasses = {
  blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  red: 'border-red-500/20 bg-red-500/10 text-red-300',
  gray: 'border-white/10 bg-white/[0.04] text-gray-300',
  purple: 'border-violet-500/20 bg-violet-500/10 text-violet-300'
};

const Badge = ({ children, tone = 'gray', className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.gray} ${className}`}>
    {children}
  </span>
);

export default Badge;
