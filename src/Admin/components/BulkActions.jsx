const BulkActions = ({ selectedCount, actions }) => (
  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-blue-100">{selectedCount} item{selectedCount === 1 ? '' : 's'} selected</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button key={action.label} onClick={action.onClick} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${action.tone === 'danger' ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20' : action.tone === 'success' ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>{action.label}</button>
        ))}
      </div>
    </div>
  </div>
);

export default BulkActions;
