const ExportPanel = ({ onCSV, onJSON, onPDF }) => (
  <div className="flex flex-wrap gap-2">
    {onCSV && <button onClick={onCSV} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Export CSV</button>}
    {onJSON && <button onClick={onJSON} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Export JSON</button>}
    {onPDF && <button onClick={onPDF} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Generate PDF</button>}
  </div>
);

export default ExportPanel;
