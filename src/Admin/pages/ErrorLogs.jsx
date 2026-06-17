import { useMemo, useState } from 'react';
import { FiCheck, FiDownload, FiSearch } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';
import { formatDate } from '../utils/formatters';

const severityTone = { info: 'blue', warning: 'amber', error: 'red', critical: 'red' };

const ErrorLogs = () => {
  const admin = useAdmin();
  const { exportJSON } = useExport('error-logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredErrors = useMemo(() => {
    return admin.data.errorLogs.filter((error) => {
      const matchesSearch = [error.message, error.source, error.stack].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || error.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [admin.data.errorLogs, searchTerm, severityFilter]);

  const columns = [
    { key: 'message', header: 'Message', render: (error) => <span className="font-semibold text-white">{error.message}</span> },
    { key: 'source', header: 'Source', render: (error) => <span className="text-sm text-gray-300">{error.source}</span> },
    { key: 'severity', header: 'Severity', render: (error) => <Badge tone={severityTone[error.severity] || 'gray'}>{error.severity}</Badge> },
    { key: 'count', header: 'Count', render: (error) => <span className="text-sm text-gray-300">{error.count}</span> },
    { key: 'timestamp', header: 'Timestamp', render: (error) => <span className="text-sm text-gray-500">{formatDate(error.timestamp)}</span> },
    { key: 'actions', header: 'Actions', render: (error) => (
      <button disabled={error.resolved} onClick={() => { admin.updateData('errorLogs', (logs) => logs.map((item) => item.id === error.id ? { ...item, resolved: true } : item)); admin.showToast('Error marked resolved.'); }} className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40"><FiCheck size={17} /></button>
    )}
  ];

  return (
    <AdminLayout title="Error Logs">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Error Logs</h1>
            <p className="mt-2 text-sm text-gray-400">Review grouped errors, stack traces, severity, and resolution status.</p>
          </div>
          <button onClick={() => exportJSON({ errorLogs: filteredErrors })} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Export JSON</button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search message, source, or stack trace..." />
          </div>
          <FilterDropdown label="Severity" value={severityFilter} onChange={setSeverityFilter} options={[{ value: 'all', label: 'All severities' }, { value: 'info', label: 'Info' }, { value: 'warning', label: 'Warning' }, { value: 'error', label: 'Error' }, { value: 'critical', label: 'Critical' }]} />
        </div>
      </section>

      <DataTable columns={columns} rows={filteredErrors} emptyText="No error logs found" />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default ErrorLogs;
