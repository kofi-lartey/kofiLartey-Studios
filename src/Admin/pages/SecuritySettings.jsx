import { useState } from 'react';
import { FiLock, FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const SecuritySettings = () => {
  const admin = useAdmin();
  const [settings, setSettings] = useState(admin.data.securitySettings);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const save = () => {
    admin.updateData('securitySettings', settings);
    admin.showToast('Security settings saved.');
  };

  return (
    <AdminLayout title="Security Settings">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Security Settings</h1>
            <p className="mt-2 text-sm text-gray-400">Password policy, 2FA, sessions, IP whitelist, and login attempt limits.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save security</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiLock /> <h2 className="text-lg font-bold">Password policy</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-white">Minimum length<input value={settings.minLength} onChange={(event) => update('minLength', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Expiry days<input value={settings.expiryDays} onChange={(event) => update('expiryDays', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Login attempt limit<input value={settings.loginAttemptLimit} onChange={(event) => update('loginAttemptLimit', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Session timeout (minutes)<input value={settings.sessionTimeout} onChange={(event) => update('sessionTimeout', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="col-span-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-white"><span>Require special characters</span><ToggleSwitch checked={settings.requireSpecialChars} onChange={(value) => update('requireSpecialChars', value)} label="Require special characters" /></label>
            <label className="col-span-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-white"><span>Enforce two-factor authentication</span><ToggleSwitch checked={settings.twoFactor} onChange={(value) => update('twoFactor', value)} label="Two-factor authentication" /></label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">IP whitelist</h2>
            <textarea value={settings.ipWhitelist} onChange={(event) => update('ipWhitelist', event.target.value)} rows={8} className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Security summary</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">2FA is {settings.twoFactor ? 'enabled' : 'disabled'}.</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">Sessions expire after {settings.sessionTimeout} minutes.</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">Passwords expire every {settings.expiryDays} days.</div>
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default SecuritySettings;
