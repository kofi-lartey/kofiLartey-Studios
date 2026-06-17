import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
    <input value={value} onChange={(event) => onChange(event.target.value)} type="search" placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none focus:bg-white/[0.06]" />
  </div>
);

export default SearchBar;
