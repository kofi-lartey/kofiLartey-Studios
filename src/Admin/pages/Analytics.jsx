import { useMemo } from 'react';
import { FiUsers, FiDollarSign, FiHeart, FiTrendingUp } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ChartCard from '../components/ChartCard';
import StatsCard from '../components/StatsCard';
import { mockEngagementStats, mockGrowthStats, mockRevenue, mockUsageStats } from '../data/mockAdminData';
import { formatCurrency, formatPercent } from '../utils/formatters';

const SimpleBarChart = ({ data, color = 'bg-blue-500' }) => {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-56 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-40 w-full items-end rounded-t-xl bg-white/[0.04]">
            <div style={{ height: `${Math.max(8, (item.value / max) * 100)}%` }} className={`w-full rounded-t-xl ${color} opacity-90`} />
          </div>
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-56 w-full overflow-visible" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / (max - min || 1)) * 100;
        return <circle key={index} cx={x} cy={y} r="1.8" fill="#60a5fa" vectorEffect="non-scaling-stroke" />;
      })}
    </svg>
  );
};

const Analytics = () => {
  const usageData = useMemo(() => mockUsageStats.map((item) => ({ label: item.label, value: item.value })), []);

  return (
    <AdminLayout title="Analytics">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
            <p className="mt-2 text-sm text-gray-400">Monitor growth, revenue, engagement, and storage adoption across the studio.</p>
          </div>
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">Mock dashboard</span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Monthly revenue" value={formatCurrency(mockRevenue.mrr)} icon={FiDollarSign} trend="+12.5% from last month" tone="emerald" detail="Recurring subscription revenue" />
        <StatsCard title="Active users" value="1,284" icon={FiUsers} trend="+8.2% new signups" tone="blue" detail="Across all client tiers" />
        <StatsCard title="Engagement rate" value={formatPercent(68, 0)} icon={FiHeart} trend="+5.1% this week" tone="purple" detail="Gallery views, likes, and shares" />
        <StatsCard title="Growth index" value="41" icon={FiTrendingUp} trend="+14 points" tone="amber" detail="Composite growth score" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue trend" subtitle="Last six months of recurring revenue">
          <LineChart data={mockRevenue.revenueSeries} />
        </ChartCard>
        <ChartCard title="Operational usage" subtitle="Normalized usage by category">
          <SimpleBarChart data={usageData} />
        </ChartCard>
        <ChartCard title="User growth" subtitle="New user acquisition trend">
          <LineChart data={mockGrowthStats} />
        </ChartCard>
        <ChartCard title="Engagement trend" subtitle="Client interaction score over time">
          <LineChart data={mockEngagementStats} />
        </ChartCard>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
