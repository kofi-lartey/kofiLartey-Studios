import { useMemo, useState } from 'react';
import { FiActivity, FiDownload, FiWifi } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import ExportPanel from '../components/ExportPanel';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';
import useRealtime from '../hooks/useRealtime';
import { formatDate } from '../utils/formatters';

const severityTone = { info: 'blue', success: 'green', warning: 'amber', critical: 'red' };

const RealtimeActivity = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('realtime-activity');
  const { events, connected, setConnected } = useRealtime(admin.data.activityLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = [event.actor, event.action, event.target].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'all' || event.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [events, searchTerm, actionFilter]);

  const columns = [
    { key: 'actor', header: 'Actor', render: (event) => <span className="font-semibold text-white">{event.actor}</span> },
    { key: 'action', header: 'Action', render: (event) => <span className="text-sm text-gray-300">{event.action}</span> },
    { key: 'target', header: 'Target', render: (event) => <span className="text-sm text-gray-300">{event.target}</span> },
    { key: 'time', header: 'Time', render: (event) => <span className="text-sm text-gray-500">{formatDate(event.date)} · {event.timestamp}</span> },
    { key: 'severity', header: 'Severity', render: (event) => <Badge tone={severityTone[event.severity] || 'gray'}>{event.severity}</Badge> }
  ];

  return (
    <AdminLayout title="Realtime Activity">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Realtime Activity</h1>
              <Badge tone={connected ? 'green' : 'red'}><FiWifi className="inline mr-1" size={12} />{connected ? 'Live' : 'Paused'}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-400">Mock WebSocket-style polling updates every few seconds.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setConnected((current) => !current)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiActivity className="inline mr-2" size={16} />Toggle stream</button>
            <ExportPanel onCSV={() => exportCSV(filteredEvents)} onJSON={() => exportJSON({ events: filteredEvents })} />
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search realtime events..." />
          <FilterDropdown label="Action" value={actionFilter} onChange={setActionFilter} options={[{ value: 'all', label: 'All actions' }, ...Array.from(new Set(events.map((event) => event.action))).map((action) => ({ value: action, label: action }))]} />
        </div>
      </section>

      <DataTable columns={columns} rows={filteredEvents.slice(0, 20)} emptyText="No realtime events" />
      <button onClick={() => exportCSV(filteredEvents)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Export CSV</button>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default RealtimeActivity;
