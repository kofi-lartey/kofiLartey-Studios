import { useState } from 'react';
import { FiDownload, FiRefreshCw, FiUpload } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import FileUploader from '../components/FileUploader';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const DataMigration = () => {
  const admin = useAdmin();
  const [exportTypes, setExportTypes] = useState(['users', 'galleries']);
  const [exportFormat, setExportFormat] = useState('JSON');
  const [previewRows, setPreviewRows] = useState([]);

  const toggleExportType = (type) => setExportTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);

  const previewImport = (file) => {
    if (!file) return;
    setPreviewRows([
      { field: 'name', sample: 'Sample Client' },
      { field: 'email', sample: 'client@example.com' },
      { field: 'plan', sample: 'Premium' },
      { field: 'status', sample: 'active' }
    ]);
    admin.showToast('Import preview generated.');
  };

  const runExport = () => {
    admin.updateData('migrationStatus', (items) => [{ id: `mig_${Date.now()}`, name: `${exportTypes.join(', ')} export`, type: exportFormat, status: 'completed', createdAt: new Date().toISOString() }, ...items]);
    admin.showToast('Export generated.');
  };

  return (
    <AdminLayout title="Data Migration">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Data Migration</h1>
            <p className="mt-2 text-sm text-gray-400">Import CSV/JSON files, preview data, export selected types, and monitor migration status.</p>
          </div>
          <Badge tone="blue">{admin.data.migrationStatus.length} migrations</Badge>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiUpload /> <h2 className="text-lg font-bold">Import</h2></div>
            <div className="mt-5"><FileUploader onChange={previewImport} label="Import CSV or JSON" /></div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500"><th className="px-3 py-3">Field</th><th className="px-3 py-3">Sample</th></tr></thead>
                <tbody>{previewRows.map((row) => <tr key={row.field}><td className="px-3 py-3 text-sm text-white">{row.field}</td><td className="px-3 py-3 text-sm text-gray-300">{row.sample}</td></tr>)}</tbody>
              </table>
              {!previewRows.length && <p className="mt-4 text-sm text-gray-500">No data available</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiDownload /> <h2 className="text-lg font-bold">Export</h2></div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {['users', 'galleries', 'payments', 'reports', 'settings'].map((type) => <label key={type} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={exportTypes.includes(type)} onChange={() => toggleExportType(type)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />{type}</label>)}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <select value={exportFormat} onChange={(event) => setExportFormat(event.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="CSV">CSV</option><option value="JSON">JSON</option><option value="PDF">PDF</option></select>
              <button onClick={runExport} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">Run export</button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiRefreshCw /> <h2 className="text-lg font-bold">Migration status</h2></div>
          <div className="mt-5 space-y-3">
            {admin.data.migrationStatus.map((migration) => <div key={migration.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-3"><div><p className="font-semibold text-white">{migration.name}</p><p className="text-xs text-gray-500">{migration.type} · {formatDate(migration.createdAt)}</p></div><Badge tone={migration.status === 'completed' ? 'green' : 'amber'}>{migration.status}</Badge></div>)}
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default DataMigration;
