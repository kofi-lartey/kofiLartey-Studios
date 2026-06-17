import { useState } from 'react';
import Modal from './Modal';

const CouponForm = ({ initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialData || {
    code: '',
    type: 'percentage',
    value: 10,
    currency: 'USD',
    validFrom: '',
    validUntil: '',
    maxUses: 100,
    minOrder: 0,
    plans: ['Premium'],
    description: '',
    active: true,
    firstTimeOnly: false,
    referralOnly: false
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal isOpen title="Coupon editor" onClose={onClose} size="lg" footer={
      <>
        <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
        <button onClick={() => onSubmit(form)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Save coupon</button>
      </>
    }>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-white">Code<input value={form.code} onChange={(event) => update('code', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Type<select value={form.type} onChange={(event) => update('type', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-white">Value<input value={form.value} onChange={(event) => update('value', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Valid until<input value={form.validUntil} onChange={(event) => update('validUntil', event.target.value)} type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Max uses<input value={form.maxUses} onChange={(event) => update('maxUses', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Min order<input value={form.minOrder} onChange={(event) => update('minOrder', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="col-span-full space-y-2 text-sm font-semibold text-white">Description<textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={form.active} onChange={(event) => update('active', event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />Active</label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={form.firstTimeOnly} onChange={(event) => update('firstTimeOnly', event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />First-time only</label>
      </div>
    </Modal>
  );
};

export default CouponForm;
