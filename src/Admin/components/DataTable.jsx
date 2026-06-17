const DataTable = ({ columns, rows, emptyText = 'No data available', selectable = false, selectedIds = [], onToggleSelect }) => {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center">
        <p className="text-sm font-semibold text-white">{emptyText}</p>
        <p className="mt-1 text-sm text-gray-500">Adjust filters or add new records.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
              {selectable && <th className="px-4 py-4 w-12">Select</th>}
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-4 font-semibold ${column.hiddenClass || ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.02]">
                {selectable && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                      className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-4 align-middle ${column.hiddenClass || ''}`}>
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
