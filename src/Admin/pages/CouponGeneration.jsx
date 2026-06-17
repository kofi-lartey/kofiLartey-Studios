import { useMemo, useState } from 'react';
import { FiDownload, FiPlus, FiTag } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import ChartCard from '../components/ChartCard';
import CouponForm from '../components/CouponForm';
import DataTable from '../components/DataTable';
import StatsCard from '../components/StatsCard';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';

const CouponGeneration = () => {
  const admin = useAdmin();
  const { exportCSV } = useExport('coupons');
  const [modalOpen, setModalOpen] = useState(false);
  const [batchCount, setBatchCount] = useState(10);
  const [batchTemplate, setBatchTemplate] = useState('SAVE');

  const totalIssued = admin.data.coupons.reduce((sum, coupon) => sum + coupon.maxUses, 0);
  const totalUsed = admin.data.coupons.reduce((sum, coupon) => sum + coupon.used, 0);
  const conversionRate = totalIssued ? (totalUsed / totalIssued) * 100 : 0;

  const popularCoupons = useMemo(() => [...admin.data.coupons].sort((a, b) => b.used - a.used), [admin.data.coupons]);

  const saveCoupon = (coupon) => {
    admin.updateData('coupons', (coupons) => [{ ...coupon, id: `cpn_${Date.now()}`, used: 0, currency: coupon.currency || 'USD', plans: coupon.plans || ['Premium'] }, ...coupons]);
    setModalOpen(false);
    admin.showToast('Coupon created.');
  };

  const generateBatch = () => {
    const count = Math.max(1, Number(batchCount));
    const coupons = Array.from({ length: count }).map((_, index) => ({
      id: `cpn_batch_${Date.now()}_${index}`,
      code: `${batchTemplate}${String(index + 1).padStart(3, '0')}`,
      type: 'percentage',
      value: 10,
      currency: 'USD',
      validFrom: '2026-06-17',
      validUntil: '2026-07-31',
      maxUses: 1,
      used: 0,
      minOrder: 0,
      plans: ['Premium'],
      description: 'Batch generated coupon',
      active: true,
      firstTimeOnly: false,
      userGroups: ['Client'],
      referralOnly: false
    }));
    admin.updateData('coupons', (current) => [...coupons, ...current]);
    admin.showToast(`${count} coupons generated.`);
  };

  const columns = [
    { key: 'code', header: 'Code', render: (coupon) => <span className="font-semibold text-white">{coupon.code}</span> },
    { key: 'type', header: 'Type', render: (coupon) => <Badge tone={coupon.type === 'percentage' ? 'blue' : 'purple'}>{coupon.type}</Badge> },
    { key: 'value', header: 'Value', render: (coupon) => <span className="text-sm text-gray-300">{coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.currency} ${coupon.value}`}</span> },
    { key: 'uses', header: 'Uses', render: (coupon) => <span className="text-sm text-gray-300">{coupon.used}/{coupon.maxUses}</span> },
    { key: 'active', header: 'Status', render: (coupon) => <Badge tone={coupon.active ? 'green' : 'gray'}>{coupon.active ? 'active' : 'inactive'}</Badge> }
  ];

  return (
    <AdminLayout title="Coupon Generation">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Coupon Generation</h1>
            <p className="mt-2 text-sm text-gray-400">Create single coupons, batch codes, and review redemption analytics.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />New coupon</button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Issued" value={totalIssued.toLocaleString()} icon={FiTag} tone="blue" />
        <StatsCard title="Used" value={totalUsed.toLocaleString()} icon={FiTag} tone="emerald" />
        <StatsCard title="Revenue generated" value="$8,420" icon={FiTag} tone="purple" />
        <StatsCard title="Conversion" value={`${conversionRate.toFixed(1)}%`} icon={FiTag} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Batch generate</h2>
                <p className="mt-1 text-sm text-gray-500">Template plus count creates unique coupon codes.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input value={batchTemplate} onChange={(event) => setBatchTemplate(event.target.value.toUpperCase())} placeholder="SAVE" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm uppercase text-white focus:border-blue-500/60 focus:outline-none" />
                <input value={batchCount} onChange={(event) => setBatchCount(event.target.value)} type="number" min="1" className="w-28 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
                <button onClick={generateBatch} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Generate</button>
              </div>
            </div>
          </div>

          <ChartCard title="Redemption timeline" subtitle="Mock redemption activity">
            <div className="flex h-56 items-end gap-3">
              {[12, 18, 14, 26, 22, 31, 36].map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-40 w-full items-end rounded-t-xl bg-white/[0.04]"><div style={{ height: `${value}%` }} className="w-full rounded-t-xl bg-blue-500" /></div>
                  <span className="text-xs text-gray-500">D{index + 1}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Popular coupons</h2>
              <button onClick={() => exportCSV(popularCoupons)} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.06]"><FiDownload size={15} /></button>
            </div>
            <div className="mt-4 space-y-3">
              {popularCoupons.slice(0, 5).map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <div>
                    <p className="font-semibold text-white">{coupon.code}</p>
                    <p className="text-xs text-gray-500">{coupon.used} redemptions</p>
                  </div>
                  <Badge tone="emerald">{coupon.type === 'percentage' ? `${coupon.value}%` : coupon.value}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Advanced rules</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">First-time only targeting</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">User group segmentation</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">Referral-only campaign codes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6"><DataTable columns={columns} rows={admin.data.coupons} emptyText="No coupons available" /></div>
      <CouponForm onClose={() => setModalOpen(false)} isOpen={modalOpen} onSubmit={saveCoupon} />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default CouponGeneration;
