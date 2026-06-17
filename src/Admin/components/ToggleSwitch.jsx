const ToggleSwitch = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:bg-white/[0.06]"
  >
    <span className="text-sm font-semibold text-white">{label}</span>
    <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-700'}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </span>
  </button>
);

export default ToggleSwitch;
