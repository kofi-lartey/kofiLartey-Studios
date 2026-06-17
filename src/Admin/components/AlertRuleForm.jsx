import { useState } from 'react';
import Modal from './Modal';

const AlertRuleForm = ({ initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialData || {
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    target: 'all',
    schedule: 'immediate',
    expiration: '',
    active: true
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal isOpen title="Create alert rule" onClose={onClose} size="lg" footer={
      <>
        <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
        <button onClick={() => onSubmit(form)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Save rule</button>
      </>
    }>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-white">Title<input value={form.title} onChange={(event) => update('title', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="space-y-2 text-sm font-semibold text-white">Type<select value={form.type} onChange={(event) => update('type', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option><option value="critical">Critical</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-white">Priority<select value={form.priority} onChange={(event) => update('priority', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-white">Target<select value={form.target} onChange={(event) => update('target', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="all">All users</option><option value="admins">Admins</option><option value="users">Users</option><option value="roles">Roles</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-white">Schedule<select value={form.schedule} onChange={(event) => update('schedule', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="immediate">Immediate</option><option value="scheduled">Scheduled</option><option value="recurring">Recurring</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-white">Expiration<input value={form.expiration} onChange={(event) => update('expiration', event.target.value)} type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="col-span-full space-y-2 text-sm font-semibold text-white">Message<textarea value={form.message} onChange={(event) => update('message', event.target.value)} rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><input checked={form.active} onChange={(event) => update('active', event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />Active</label>
      </div>
    </Modal>
  );
};

export default AlertRuleForm;
