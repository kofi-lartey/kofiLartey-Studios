const FilterDropdown = ({ label, value, onChange, options }) => (
  <label className="block min-w-[180px]">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none">
      {options.map((option) => <option key={option.value} value={option.value} className="bg-gray-900">{option.label}</option>)}
    </select>
  </label>
);

export default FilterDropdown;
