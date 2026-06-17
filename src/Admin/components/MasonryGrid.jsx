const MasonryGrid = ({ images = [], selectedIds = [], onToggleSelect, onFeature, onDelete, emptyText = 'No images available' }) => {
  if (!images.length) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center">
        <p className="text-sm font-semibold text-white">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((image) => (
        <div key={image.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
          <div className="relative">
            <img src={image.url} alt={image.title} className="h-auto w-full object-cover" />
            <label className="absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <input checked={selectedIds.includes(image.id)} onChange={() => onToggleSelect?.(image.id)} type="checkbox" className="mr-2 h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />
              Select
            </label>
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{image.title}</h3>
                <p className="text-xs text-gray-500">{image.user || image.category || 'Uncategorized'}</p>
              </div>
              <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-gray-300">{image.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {onFeature && <button onClick={() => onFeature(image.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">Feature</button>}
              {onDelete && <button onClick={() => onDelete(image.id)} className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20">Delete</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
