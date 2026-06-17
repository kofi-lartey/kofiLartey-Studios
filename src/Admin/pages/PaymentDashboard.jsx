import { FiCreditCard, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ChartCard from '../components/ChartCard';
import StatsCard from '../components/StatsCard';
import { formatCurrency } from '../utils/formatters';

const PaymentDashboard = () => {
  const payments = [
    { id: 'pay_001', user: 'Amara Osei', amount: 450, method: 'Card', status: 'paid', description: 'Premium wedding package', createdAt: '2026-06-01T10:00:00' },
    { id: 'pay_002', user: 'Malik Johnson', amount: 280, method: 'PayPal', status: 'pending', description: 'Corporate event gallery', createdAt: '2026-06-10T12:15:00' },
    { id: 'pay_003', user: 'Daniel Mensah', amount: 90, method: 'Card', status: 'paid', description: 'Storage upgrade', createdAt: '2026-06-05T18:20:00' }
  ];
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const grouped = payments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {});
  const methodBreakdown = Object.entries(grouped).map(([name, value]) => ({ name, value: Math.round((value / total) * 100) }));

  return (
    <AdminLayout title="Payment Dashboard">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Payment Dashboard</h1>
          <p className="mt-2 text-sm text-gray-400">Revenue overview, payment methods, and recent transactions.</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Today" value={formatCurrency(120)} icon={FiDollarSign} tone="emerald" />
        <StatsCard title="This week" value={formatCurrency(840)} icon={FiTrendingUp} tone="blue" />
        <StatsCard title="This month" value={formatCurrency(total)} icon={FiTrendingUp} tone="purple" />
        <StatsCard title="Total collected" value={formatCurrency(paid)} icon={FiCreditCard} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <ChartCard title="Payment method breakdown" subtitle="Percentage of collected revenue">
          <div className="space-y-4">
            {methodBreakdown.map((method) => (
              <div key={method.name}>
                <div className="mb-1 flex justify-between text-sm text-gray-300"><span>{method.name}</span><span>{method.value}%</span></div>
                <div className="h-3 rounded-full bg-white/[0.06]"><div style={{ width: `${method.value}%` }} className="h-3 rounded-full bg-blue-500" /></div>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Recent transactions" subtitle="Latest payment activity">
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3">
                <div>
                  <p className="text-sm font-semibold text-white">{payment.user}</p>
                  <p className="text-xs text-gray-500">{payment.description}</p>
                </div>
                <span className="font-semibold text-white">{formatCurrency(payment.amount)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </AdminLayout>
  );
};

export default PaymentDashboard;
