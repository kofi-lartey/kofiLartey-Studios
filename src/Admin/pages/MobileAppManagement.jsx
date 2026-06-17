import { useState } from 'react';
import { FiPhone, FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const MobileAppManagement = () => {
  const admin = useAdmin();
  const [config, setConfig] = useState(admin.data.appConfig);
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }));

  const save = () => {
    admin.updateData('appConfig', config);
    admin.showToast('Mobile app settings saved.');
  };

  return (
    <AdminLayout title="Mobile App Management">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Mobile App Management</h1>
            <p className="mt-2 text-sm text-gray-400">Manage app version, changelog, push notifications, and deep links.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save app settings</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiPhone /> <h2 className="text-lg font-bold">App configuration</h2></div>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-white">Version<input value={config.version} onChange={(event) => update('version', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Minimum version<input value={config.minVersion} onChange={(event) => update('minVersion', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Changelog<textarea value={config.changelog} onChange={(event) => update('changelog', event.target.value)} rows={6} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Deep link config<input value={config.deepLinks} onChange={(event) => update('deepLinks', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Push notifications</h2>
            <div className="mt-4 space-y-3">
              <ToggleSwitch checked={config.pushEnabled} onChange={(value) => update('pushEnabled', value)} label="Enable push notifications" />
              <ToggleSwitch checked onChange={() => {}} label="Gallery ready alerts" />
              <ToggleSwitch checked={false} onChange={() => {}} label="Payment reminders" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Release preview</h2>
            <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-white">Version {config.version}</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">{config.changelog}</p>
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default MobileAppManagement;
