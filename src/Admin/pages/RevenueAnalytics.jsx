import AdminLayout from '../components/AdminLayout';
import ChartCard from '../components/ChartCard';
import StatsCard from '../components/StatsCard';
import { mockRevenue } from '../data/mockAdminData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { FiDollarSign, FiTrendingDown, FiUsers } from 'react-icons/fi';

const RevenueAnalytics = () => (
  <AdminLayout title="Revenue Analytics">
    <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Revenue Analytics</h1>
        <p className="mt-2 text-sm text-gray-400">Track MRR, ARR, churn, customer LTV, and revenue composition.</p>
      </div>
    </section>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="MRR" value={formatCurrency(mockRevenue.mrr)} icon={FiDollarSign} tone="emerald" />
      <StatsCard title="ARR" value={formatCurrency(mockRevenue.arr)} icon={FiDollarSign} tone="blue" />
      <StatsCard title="Churn rate" value={formatPercent(mockRevenue.churnRate, 1)} icon={FiTrendingDown} tone="red" />
      <StatsCard title="Customer LTV" value={formatCurrency(mockRevenue.ltv)} icon={FiUsers} tone="purple" />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <ChartCard title="Revenue chart" subtitle="Monthly recurring revenue trend">
        <div className="flex h-64 items-end gap-3">
          {mockRevenue.revenueSeries.map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex h-48 w-full items-end rounded-t-xl bg-white/[0.04]"><div style={{ height: `${(value / Math.max(...mockRevenue.revenueSeries)) * 100}%` }} className="w-full rounded-t-xl bg-emerald-500" /></div>
              <span className="text-xs text-gray-500">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span>
            </div>
          ))}
        </div>
      </ChartCard>
      <ChartCard title="Payment method breakdown" subtitle="Revenue share by method">
        <div className="space-y-4">
          {mockRevenue.methodBreakdown.map((method) => (
            <div key={method.name}>
              <div className="mb-1 flex justify-between text-sm text-gray-300"><span>{method.name}</span><span>{method.value}%</span></div>
              <div className="h-3 rounded-full bg-white/[0.06]"><div style={{ width: `${method.value}%` }} className="h-3 rounded-full bg-blue-500" /></div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  </AdminLayout>
);

export default RevenueAnalytics;
