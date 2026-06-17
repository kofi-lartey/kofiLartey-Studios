import { useMemo, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import ExportPanel from '../components/ExportPanel';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';
import { formatDate } from '../utils/formatters';

const severityTone = { info: 'blue', success: 'green', warning: 'amber', critical: 'red' };

const ActivityLogs = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('activity-logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredLogs = useMemo(() => {
    return admin.data.activityLogs.filter((log) => {
      const matchesSearch = [log.actor, log.action, log.target, log.timestamp].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [admin.data.activityLogs, searchTerm, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const pageLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'actor', header: 'Actor', render: (log) => <span className="font-semibold text-white">{log.actor}</span> },
    { key: 'action', header: 'Action', render: (log) => <span className="text-sm text-gray-300">{log.action}</span> },
    { key: 'target', header: 'Target', render: (log) => <span className="text-sm text-gray-300">{log.target}</span> },
    { key: 'time', header: 'Time', render: (log) => <span className="text-sm text-gray-500">{formatDate(log.date)} · {log.timestamp}</span> },
    { key: 'severity', header: 'Severity', render: (log) => <Badge tone={severityTone[log.severity] || 'gray'}>{log.severity}</Badge> }
  ];

  const actionOptions = Array.from(new Set(admin.data.activityLogs.map((log) => log.action))).map((action) => ({ value: action, label: action }));

  return (
    <AdminLayout title="Activity Logs">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Activity Logs</h1>
            <p className="mt-2 text-sm text-gray-400">Filter user actions and export audit history.</p>
          </div>
          <ExportPanel onCSV={() => exportCSV(filteredLogs)} onJSON={() => exportJSON({ activityLogs: filteredLogs })} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search actor, action, or target..." />
          <FilterDropdown label="Action type" value={actionFilter} onChange={setActionFilter} options={[{ value: 'all', label: 'All actions' }, ...actionOptions]} />
        </div>
      </section>

      <DataTable columns={columns} rows={pageLogs} emptyText="No activity logs found" />
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => exportCSV(filteredLogs)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Export CSV</button>
        <button disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(current + 1, totalPages))} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-white/[0.06]">Next page</button>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default ActivityLogs;
