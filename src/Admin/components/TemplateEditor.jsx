import { useState } from 'react';
import Modal from './Modal';

const TemplateEditor = ({ initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState(initialData || { name: '', subject: '', message: '' });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal isOpen title="Template editor" onClose={onClose} size="lg" footer={
      <>
        <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
        <button onClick={() => onSubmit(form)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Save template</button>
      </>
    }>
      <div className="space-y-4">
        <label className="block space-y-2 text-sm font-semibold text-white">Name<input value={form.name} onChange={(event) => update('name', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="block space-y-2 text-sm font-semibold text-white">Subject<input value={form.subject} onChange={(event) => update('subject', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
        <label className="block space-y-2 text-sm font-semibold text-white">Message<textarea value={form.message} onChange={(event) => update('message', event.target.value)} rows={8} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
      </div>
    </Modal>
  );
};

export default TemplateEditor;
