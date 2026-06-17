const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/[0.06]">Previous</button>
      <div className="flex gap-2">
        {pages.map((pageNumber) => (
          <button key={pageNumber} onClick={() => onPageChange(pageNumber)} className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold ${pageNumber === page ? 'bg-blue-600 text-white' : 'border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]'}`}>{pageNumber}</button>
        ))}
      </div>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/[0.06]">Next</button>
    </div>
  );
};

export default Pagination;
