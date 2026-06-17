import { useState } from 'react';
import { FiCode, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const APISettings = () => {
  const admin = useAdmin();
  const [webhookUrl, setWebhookUrl] = useState('https://api.example.com/webhooks/studio');
  const [events, setEvents] = useState(['payment.paid', 'gallery.created', 'user.suspended']);
  const [rateLimit, setRateLimit] = useState(1200);

  const createKey = () => {
    admin.updateData('apiKeys', (keys) => [{ id: `api_${Date.now()}`, name: 'New integration key', key: `sk_live_••••••••${Math.random().toString(16).slice(2, 6).toUpperCase()}`, rateLimit, active: true, createdAt: new Date().toISOString().slice(0, 10) }, ...keys]);
    admin.showToast('API key created.');
  };

  const revokeKey = (id) => {
    admin.updateData('apiKeys', (keys) => keys.filter((key) => key.id !== id));
    admin.showToast('API key revoked.', 'warning');
  };

  const toggleEvent = (event) => setEvents((current) => current.includes(event) ? current.filter((item) => item !== event) : [...current, event]);

  return (
    <AdminLayout title="API Settings">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">API Settings</h1>
            <p className="mt-2 text-sm text-gray-400">Manage API keys, rate limits, webhooks, and third-party integration toggles.</p>
          </div>
          <button onClick={createKey} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Create key</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white"><FiCode /> <h2 className="text-lg font-bold">API keys</h2></div>
              <Badge tone="blue">{admin.data.apiKeys.length} keys</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {admin.data.apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-4">
                  <div>
                    <p className="font-semibold text-white">{key.name}</p>
                    <p className="text-xs text-gray-500">{key.key} · {key.rateLimit} req/min · {key.createdAt}</p>
                  </div>
                  <button onClick={() => revokeKey(key.id)} className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"><FiTrash2 size={17} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Rate limits</h2>
            <input value={rateLimit} onChange={(event) => setRateLimit(event.target.value)} type="number" className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Webhook URL</h2>
            <input value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
            <div className="mt-4 grid gap-3">
              {['payment.paid', 'gallery.created', 'user.suspended', 'content.reported'].map((event) => (
                <label key={event} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300"><span>{event}</span><ToggleSwitch checked={events.includes(event)} onChange={() => toggleEvent(event)} label={event} /></label>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Third-party integrations</h2>
            <div className="mt-4 space-y-3">
              <ToggleSwitch checked onChange={() => {}} label="Analytics connector" />
              <ToggleSwitch checked={false} onChange={() => {}} label="CRM sync" />
              <ToggleSwitch checked={false} onChange={() => {}} label="Backup provider" />
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default APISettings;
