import { useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const FileUploader = ({ onChange, label = 'Upload file' }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFile = (selected) => {
    const nextFile = selected?.[0];
    setFile(nextFile || null);
    onChange?.(nextFile || null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-white">{label}</label>
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
          <FiUpload size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{file ? file.name : 'Choose a file or drop it here'}</p>
          <p className="text-xs text-gray-500">CSV, JSON, PNG, JPG, and WebP are accepted in this mock uploader.</p>
        </div>
        <button onClick={() => inputRef.current?.click()} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Browse</button>
      </div>
      <input ref={inputRef} onChange={(event) => handleFile(event.target.files)} type="file" className="hidden" />
    </div>
  );
};

export default FileUploader;
