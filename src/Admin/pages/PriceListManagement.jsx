import { useState } from 'react';
import { FiDollarSign, FiEdit, FiPlus, FiStar } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import PlanEditor from '../components/PlanEditor';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatCurrency } from '../utils/formatters';

const PriceListManagement = () => {
  const admin = useAdmin();
  const [currency, setCurrency] = useState('USD');
  const [editingPlan, setEditingPlan] = useState(null);

  const savePlan = (plan) => {
    const payload = { ...plan, id: editingPlan?.id || `plan_${Date.now()}` };
    if (editingPlan) {
      admin.updateData('plans', (plans) => plans.map((item) => item.id === editingPlan.id ? payload : item));
      admin.showToast('Plan updated.');
    } else {
      admin.updateData('plans', (plans) => [...plans, payload]);
      admin.showToast('Plan created.');
    }
    setEditingPlan(null);
  };

  const togglePopular = (id) => {
    admin.updateData('plans', (plans) => plans.map((plan) => ({ ...plan, popular: plan.id === id ? !plan.popular : false })));
  };

  return (
    <AdminLayout title="Price List Management">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Price List Management</h1>
            <p className="mt-2 text-sm text-gray-400">Manage plans, currency, discounts, and A/B test variants.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="USD">USD</option><option value="GHS">GHS</option><option value="EUR">EUR</option></select>
            <button onClick={() => setEditingPlan({ name: '', price: 0, cycle: 'monthly', features: ['New feature'], active: true, popular: false, order: admin.data.plans.length + 1 })} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add plan</button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {admin.data.plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.popular && <Badge tone="amber"><FiStar className="inline mr-1" size={12} />Popular</Badge>}
                </div>
                <p className="mt-1 text-3xl font-bold text-white">{formatCurrency(plan.price, currency)}/{plan.cycle}</p>
              </div>
              <button onClick={() => setEditingPlan(plan)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300"><FiEdit size={17} /></button>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              {plan.features.map((feature) => <li key={feature} className="rounded-xl bg-white/[0.04] px-3 py-2">{feature}</li>)}
            </ul>
            <div className="mt-5 flex items-center justify-between gap-3">
              <ToggleSwitch checked={plan.active} onChange={(active) => admin.updateData('plans', (plans) => plans.map((item) => item.id === plan.id ? { ...item, active } : item))} label="Active" />
              <button onClick={() => togglePopular(plan.id)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.06]">Toggle popular</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiDollarSign /> <h3 className="text-base font-bold">Discount rules</h3></div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><span>First-time client discount</span><ToggleSwitch checked onChange={() => {}} label="Enabled" /></label>
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><span>Seasonal promotion</span><ToggleSwitch checked={false} onChange={() => {}} label="Enabled" /></label>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiStar /> <h3 className="text-base font-bold">A/B test section</h3></div>
          <p className="mt-3 text-sm text-gray-400">Test plan ordering, discount copy, and checkout button labels. Mock variants can be created from the plan editor.</p>
          <div className="mt-4 grid gap-3">
            {['Variant A: Standard checkout', 'Variant B: Discount-first checkout'].map((variant) => <div key={variant} className="rounded-xl border border-white/5 bg-white/[0.04] p-3 text-sm text-gray-300">{variant}</div>)}
          </div>
        </div>
      </div>

      {editingPlan && <PlanEditor initialData={editingPlan} onClose={() => setEditingPlan(null)} onSubmit={savePlan} />}
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default PriceListManagement;
