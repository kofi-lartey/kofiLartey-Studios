import { useState } from 'react';
import { FiActivity, FiCpu, FiDatabase, FiRefreshCw, FiServer, FiZap } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ChartCard from '../components/ChartCard';
import StatsCard from '../components/StatsCard';
import { mockPerformance } from '../data/mockAdminData';
import { formatPercent } from '../utils/formatters';

const PerformanceMonitor = () => {
  const [performance, setPerformance] = useState(mockPerformance);

  const refresh = () => {
    setPerformance({
      apiResponse: performance.apiResponse.map((value) => Math.max(20, Math.min(90, value + Math.round(Math.random() * 18 - 9)))),
      serverLoad: Math.max(10, Math.min(98, Math.round(performance.serverLoad + Math.random() * 16 - 8))),
      dbLatency: Math.max(8, Math.round(performance.dbLatency + Math.random() * 12 - 6)),
      cacheHitRate: Math.max(70, Math.min(99, Math.round(performance.cacheHitRate + Math.random() * 6 - 3))),
      errorRate: Number(Math.max(0.1, Math.min(3, performance.errorRate + Math.random() * 0.8 - 0.4)).toFixed(1)),
      requestsPerMinute: Math.max(800, Math.round(performance.requestsPerMinute + Math.random() * 260 - 130))
    });
  };

  return (
    <AdminLayout title="Performance Monitor">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Performance Monitor</h1>
            <p className="mt-2 text-sm text-gray-400">API response times, server load, database performance, cache, and error rate.</p>
          </div>
          <button onClick={refresh} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiRefreshCw className="inline mr-2" size={16} />Refresh metrics</button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="API response" value={`${Math.round(performance.apiResponse.reduce((sum, value) => sum + value, 0) / performance.apiResponse.length)} ms`} icon={FiZap} tone="blue" />
        <StatsCard title="Server load" value={`${performance.serverLoad}%`} icon={FiCpu} tone={performance.serverLoad > 80 ? 'red' : 'amber'} />
        <StatsCard title="Cache hit rate" value={formatPercent(performance.cacheHitRate, 0)} icon={FiServer} tone="emerald" />
        <StatsCard title="Error rate" value={`${performance.errorRate}%`} icon={FiActivity} tone={performance.errorRate > 1 ? 'red' : 'green'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="API response times" subtitle="Average response time by sample">
          <div className="flex h-64 items-end gap-3">
            {performance.apiResponse.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-48 w-full items-end rounded-t-xl bg-white/[0.04]"><div style={{ height: `${(value / 100) * 100}%` }} className="w-full rounded-t-xl bg-blue-500" /></div>
                <span className="text-xs text-gray-500">S{index + 1}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <div className="space-y-6">
          <ChartCard title="Database performance" subtitle="Query latency">
            <div className="flex items-center justify-center">
              <div className="relative h-56 w-56 rounded-full border-[18px] border-white/[0.06]" style={{ background: `conic-gradient(#8b5cf6 ${Math.min(100, performance.dbLatency / 80 * 100)}%, rgba(255,255,255,0.06) 0)` }}>
                <div className="absolute inset-6 rounded-full bg-[#0a0a0a]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FiDatabase className="mx-auto text-violet-300" size={24} />
                    <p className="mt-2 text-2xl font-bold text-white">{performance.dbLatency} ms</p>
                    <p className="text-xs text-gray-500">DB latency</p>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h3 className="text-base font-bold text-white">Traffic</h3>
            <p className="mt-3 text-3xl font-bold text-white">{performance.requestsPerMinute.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Requests per minute</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PerformanceMonitor;
