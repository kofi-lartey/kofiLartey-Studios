import { useState } from 'react';
import Modal from './Modal';

const PlanEditor = ({ initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialData || {
    name: '',
    price: 0,
    cycle: 'monthly',
    features: ['Basic support'],
    active: true,
    popular: false,
    order: 1
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal isOpen title="Plan editor" onClose={onClose} size="lg" footer={
      <>
        <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
        <button onClick={() => onSubmit(form)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Save plan</button>
      </>
    }>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-white">Name<input value={form.name} onChange={(event) => update('name', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Price<input value={form.price} onChange={(event) => update('price', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Billing cycle<select value={form.cycle} onChange={(event) => update('cycle', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-white">Display order<input value={form.order} onChange={(event) => update('order', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="col-span-full space-y-2 text-sm font-semibold text-white">Features<textarea value={form.features.join('\n')} onChange={(event) => update('features', event.target.value.split('\n').filter(Boolean))} rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={form.active} onChange={(event) => update('active', event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />Active</label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={form.popular} onChange={(event) => update('popular', event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />Popular</label>
      </div>
    </Modal>
  );
};

export default PlanEditor;
