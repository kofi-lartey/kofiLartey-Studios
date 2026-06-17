import { useState } from 'react';
import { FiMail, FiSend } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const UserMessaging = () => {
  const admin = useAdmin();
  const [form, setForm] = useState({ target: admin.data.users[0]?.id || '', subject: '', body: '', template: '' });

  const sendMessage = () => {
    if (!form.subject || !form.body) return;
    const user = admin.data.users.find((item) => item.id === form.target);
    admin.updateData('messages', (messages) => [{ id: `msg_${Date.now()}`, target: user?.name || 'Selected users', subject: form.subject, sentAt: new Date().toISOString(), status: 'sent' }, ...messages]);
    admin.addActivityLog({ userId: user?.id, actor: 'Admin', action: 'Message sent', target: form.subject, severity: 'info' });
    setForm({ target: admin.data.users[0]?.id || '', subject: '', body: '', template: '' });
    admin.showToast('Message sent.');
  };

  return (
    <AdminLayout title="User Messaging">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">User Messaging</h1>
            <p className="mt-2 text-sm text-gray-400">Compose messages, select templates, and review message history.</p>
          </div>
          <Badge tone="blue">{admin.data.messages.length} messages</Badge>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiMail /> <h2 className="text-lg font-bold">Compose message</h2></div>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-white">Target<select value={form.target} onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none">{admin.data.users.map((user) => <option key={user.id} value={user.id} className="bg-gray-900">{user.name}</option>)}</select></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Template<select value={form.template} onChange={(event) => setForm((current) => ({ ...current, template: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="">No template</option><option value="gallery-ready">Gallery ready</option><option value="invoice-reminder">Invoice reminder</option><option value="support-followup">Support follow-up</option></select></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Subject<input value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Body<textarea value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} rows={8} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <button onClick={sendMessage} className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSend className="inline mr-2" size={16} />Send message</button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Message history</h2>
          <div className="mt-4 space-y-3">
            {admin.data.messages.map((message) => (
              <div key={message.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-4">
                <div>
                  <p className="font-semibold text-white">{message.subject}</p>
                  <p className="text-xs text-gray-500">{message.target} · {formatDate(message.sentAt)}</p>
                </div>
                <Badge tone={message.status === 'sent' ? 'green' : 'gray'}>{message.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default UserMessaging;
