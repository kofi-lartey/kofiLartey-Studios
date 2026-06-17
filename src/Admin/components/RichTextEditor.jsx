import { FiAlignLeft, FiBold, FiItalic, FiList } from 'react-icons/fi';

const RichTextEditor = ({ value, onChange, label = 'Content' }) => {
  const insert = (prefix, suffix = '') => {
    const textarea = document.getElementById('admin-rich-text');
    const start = textarea?.selectionStart || value.length;
    const end = textarea?.selectionEnd || value.length;
    const next = `${value.slice(0, start)}${prefix}${value.slice(start, end)}${suffix}${value.slice(end)}`;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white">{label}</label>
      <div className="flex flex-wrap gap-2 rounded-t-xl border border-white/10 border-b-0 bg-white/[0.04] p-2">
        <button type="button" onClick={() => insert('<strong>', '</strong>')} className="rounded-lg p-2 text-gray-300 hover:bg-white/[0.06]"><FiBold /></button>
        <button type="button" onClick={() => insert('<em>', '</em>')} className="rounded-lg p-2 text-gray-300 hover:bg-white/[0.06]"><FiItalic /></button>
        <button type="button" onClick={() => insert('<ul><li>', '</li></ul>')} className="rounded-lg p-2 text-gray-300 hover:bg-white/[0.06]"><FiList /></button>
        <button type="button" onClick={() => insert('<blockquote>', '</blockquote>')} className="rounded-lg p-2 text-gray-300 hover:bg-white/[0.06]"><FiAlignLeft /></button>
      </div>
      <textarea id="admin-rich-text" value={value} onChange={(event) => onChange(event.target.value)} rows={8} className="w-full resize-none rounded-b-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
    </div>
  );
};

export default RichTextEditor;
