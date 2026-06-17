import { useState } from 'react';
import { FiClipboard, FiDownload, FiLink } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import ExportPanel from '../components/ExportPanel';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';

const CustomReports = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('custom-reports');
  const [metrics, setMetrics] = useState(['Revenue', 'New users']);
  const [dateRange, setDateRange] = useState('30');
  const [grouping, setGrouping] = useState('month');
  const [format, setFormat] = useState('CSV');

  const toggleMetric = (metric) => setMetrics((current) => current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric]);

  const rows = metrics.map((metric) => ({ metric, dateRange, grouping, value: metric === 'Revenue' ? '$12,480' : '1,284' }));

  const createScheduled = () => {
    admin.updateData('reports', (reports) => [{ id: `rep_custom_${Date.now()}`, title: `${metrics.join(', ')} report`, metrics, grouping, schedule: grouping, active: true }, ...reports]);
    admin.showToast('Scheduled report created.');
  };

  return (
    <AdminLayout title="Custom Reports">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Custom Reports</h1>
            <p className="mt-2 text-sm text-gray-400">Build reports with selected metrics, filters, grouping, exports, and share links.</p>
          </div>
          <ExportPanel onCSV={() => exportCSV(rows)} onJSON={() => exportJSON({ metrics, dateRange, grouping, rows })} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiClipboard /> <h2 className="text-lg font-bold">Report builder</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Metrics</p>
              {['Revenue', 'New users', 'Engagement', 'Churn', 'Storage'].map((metric) => (
                <label key={metric} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={metrics.includes(metric)} onChange={() => toggleMetric(metric)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />{metric}</label>
              ))}
            </div>
            <div className="space-y-4">
              <label className="block space-y-2 text-sm font-semibold text-white">Date range<select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option></select></label>
              <label className="block space-y-2 text-sm font-semibold text-white">Grouping<select value={grouping} onChange={(event) => setGrouping(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="day">Day</option><option value="week">Week</option><option value="month">Month</option></select></label>
              <label className="block space-y-2 text-sm font-semibold text-white">Export format<select value={format} onChange={(event) => setFormat(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="CSV">CSV</option><option value="JSON">JSON</option><option value="PDF">PDF</option></select></label>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={createScheduled} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">Schedule report</button>
            <button onClick={() => admin.showToast('Share link copied.', 'success')} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiLink className="inline mr-2" size={16} />Share link</button>
            <button className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Download {format}</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Report preview</h2>
            <div className="mt-4 space-y-3">
              {rows.map((row) => <div key={row.metric} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-3"><span className="text-sm text-gray-300">{row.metric}</span><Badge tone="blue">{row.value}</Badge></div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Scheduled reports</h2>
            <div className="mt-4 space-y-3">
              {admin.data.reports.map((report) => <div key={report.id} className="rounded-xl border border-white/5 bg-white/[0.04] p-3"><p className="font-semibold text-white">{report.title}</p><p className="text-xs text-gray-500">{report.grouping} · {report.active ? 'active' : 'paused'}</p></div>)}
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default CustomReports;
