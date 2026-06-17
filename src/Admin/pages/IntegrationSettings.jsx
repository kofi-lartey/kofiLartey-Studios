import { useState } from 'react';
import { FiGlobe, FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const IntegrationSettings = () => {
  const admin = useAdmin();
  const [integrations, setIntegrations] = useState(admin.data.integrations);

  const updateSocial = (provider, key, value) => setIntegrations((current) => ({ ...current, social: { ...current.social, [provider]: { ...current.social[provider], [key]: value } } }));
  const updatePayment = (provider, key, value) => setIntegrations((current) => ({ ...current, payments: { ...current.payments, [provider]: { ...current.payments[provider], [key]: value } } }));

  const save = () => {
    admin.updateData('integrations', integrations);
    admin.showToast('Integration settings saved.');
  };

  return (
    <AdminLayout title="Integration Settings">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Integration Settings</h1>
            <p className="mt-2 text-sm text-gray-400">Social login, payment gateways, analytics, and CDN integrations.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save integrations</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Social login providers</h2>
          <div className="mt-5 space-y-5">
            {Object.entries(integrations.social).map(([provider, config]) => (
              <div key={provider} className="rounded-2xl border border-white/5 bg-white/[0.04] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold capitalize text-white">{provider}</h3>
                  <ToggleSwitch checked={config.enabled} onChange={(value) => updateSocial(provider, 'enabled', value)} label={`${provider} enabled`} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={config.clientId} onChange={(event) => updateSocial(provider, 'clientId', event.target.value)} placeholder="Client ID" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
                  <input value={config.clientSecret} onChange={(event) => updateSocial(provider, 'clientSecret', event.target.value)} type="password" placeholder="Client secret" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Payment gateways</h2>
            <div className="mt-5 space-y-5">
              {Object.entries(integrations.payments).map(([provider, config]) => (
                <div key={provider} className="rounded-2xl border border-white/5 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold capitalize text-white">{provider}</h3>
                    <ToggleSwitch checked={config.enabled} onChange={(value) => updatePayment(provider, 'enabled', value)} label={`${provider} enabled`} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={provider === 'stripe' ? config.publishableKey : config.clientId} onChange={(event) => updatePayment(provider, provider === 'stripe' ? 'publishableKey' : 'clientId', event.target.value)} placeholder="Public key" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
                    <input value={provider === 'stripe' ? config.secretKey : config.secret} onChange={(event) => updatePayment(provider, provider === 'stripe' ? 'secretKey' : 'secret', event.target.value)} type="password" placeholder="Secret key" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiGlobe /> <h2 className="text-lg font-bold">Analytics & CDN</h2></div>
            <div className="mt-4 space-y-3">
              <label className="block space-y-2 text-sm font-semibold text-white">GA4 tracking ID<input value={integrations.analytics.ga4TrackingId} onChange={(event) => setIntegrations((current) => ({ ...current, analytics: { ...current.analytics, ga4TrackingId: event.target.value } }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <ToggleSwitch checked={integrations.analytics.enabled} onChange={(value) => setIntegrations((current) => ({ ...current, analytics: { ...current.analytics, enabled: value } }))} label="Enable GA4" />
              <ToggleSwitch checked={integrations.cdn.enabled} onChange={(value) => setIntegrations((current) => ({ ...current, cdn: { ...current.cdn, enabled: value } }))} label="Enable CDN" />
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default IntegrationSettings;
