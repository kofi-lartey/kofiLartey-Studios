import { useMemo, useState } from 'react';
import { FiBarChart2, FiDownload, FiUsers, FiUserMinus } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ChartCard from '../components/ChartCard';
import ExportPanel from '../components/ExportPanel';
import StatsCard from '../components/StatsCard';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';
import { formatPercent } from '../utils/formatters';

const UserReports = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('user-reports');
  const [metric, setMetric] = useState('engagement');
  const [dateRange, setDateRange] = useState('30');

  const activeUsers = admin.data.users.filter((user) => user.status === 'active').length;
  const inactiveUsers = admin.data.users.length - activeUsers;
  const churnRate = admin.data.users.length ? (inactiveUsers / admin.data.users.length) * 100 : 0;
  const averageStorage = admin.data.users.reduce((sum, user) => sum + user.storageUsed, 0) / Math.max(1, admin.data.users.length);

  const reportRows = useMemo(() => {
    if (metric === 'growth') {
      return admin.data.users.map((user) => ({ user: user.name, metric: 'Joined', value: user.joinedAt, status: user.status }));
    }
    if (metric === 'churn') {
      return admin.data.users.filter((user) => user.status !== 'active').map((user) => ({ user: user.name, metric: 'Inactive risk', value: user.risk, status: user.status }));
    }
    return admin.data.users.map((user) => ({ user: user.name, metric: 'Engagement score', value: Math.round(user.uploads / 2 + user.storageUsed * 3), status: user.status }));
  }, [admin.data.users, metric]);

  return (
    <AdminLayout title="User Reports">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">User Reports</h1>
            <p className="mt-2 text-sm text-gray-400">Build engagement, growth, and churn reports from mock data.</p>
          </div>
          <ExportPanel onCSV={() => exportCSV(reportRows)} onJSON={() => exportJSON({ metric, dateRange, rows: reportRows })} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <label className="text-sm font-semibold text-white">Metric<select value={metric} onChange={(event) => setMetric(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="engagement">Engagement</option><option value="growth">Growth</option><option value="churn">Churn</option></select></label>
          <label className="text-sm font-semibold text-white">Date range<select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
          <button onClick={() => exportJSON({ metric, dateRange, rows: reportRows })} className="self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiDownload className="inline mr-2" size={16} />Export report</button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Active users" value={activeUsers} icon={FiUsers} tone="emerald" detail={`${formatPercent((activeUsers / Math.max(1, admin.data.users.length)) * 100, 0)} of all users`} />
        <StatsCard title="Inactive users" value={inactiveUsers} icon={FiUserMinus} tone="amber" detail="Accounts needing review" />
        <StatsCard title="Churn estimate" value={formatPercent(churnRate, 1)} icon={FiUserMinus} tone="red" detail="Based on inactive status" />
        <StatsCard title="Average storage" value={`${averageStorage.toFixed(1)} GB`} icon={FiBarChart2} tone="purple" detail="Per active account" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <ChartCard title="Custom report preview" subtitle={`${metric} report for the last ${dateRange} days`}>
          <div className="space-y-3">
            {reportRows.slice(0, 10).map((row) => (
              <div key={`${row.user}-${row.metric}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3">
                <div>
                  <p className="text-sm font-semibold text-white">{row.user}</p>
                  <p className="text-xs text-gray-500">{row.metric}</p>
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-gray-300">{row.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Engagement distribution" subtitle="Uploads and storage activity">
          <div className="space-y-4">
            {admin.data.users.map((user) => {
              const score = Math.min(100, Math.round(user.uploads / 4 + user.storageUsed * 2));
              return (
                <div key={user.id}>
                  <div className="mb-1 flex justify-between text-xs text-gray-400"><span>{user.name}</span><span>{score}%</span></div>
                  <div className="h-2 rounded-full bg-white/[0.06]"><div style={{ width: `${score}%` }} className="h-2 rounded-full bg-blue-500" /></div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default UserReports;
