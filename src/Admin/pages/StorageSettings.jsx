import { useState } from 'react';
import { FiCloud, FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const StorageSettings = () => {
  const admin = useAdmin();
  const [settings, setSettings] = useState(admin.data.storageSettings);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const save = () => {
    admin.updateData('storageSettings', settings);
    admin.showToast('Storage settings saved.');
  };

  return (
    <AdminLayout title="Storage Settings">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Storage Settings</h1>
            <p className="mt-2 text-sm text-gray-400">Configure provider, paths, file limits, extensions, CDN, and backup options.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save storage</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiCloud /> <h2 className="text-lg font-bold">Provider configuration</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-white">Provider<select value={settings.provider} onChange={(event) => update('provider', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="S3">S3</option><option value="Local">Local</option><option value="Cloudinary">Cloudinary</option></select></label>
            <label className="space-y-2 text-sm font-semibold text-white">Max file size (MB)<input value={settings.maxFileSize} onChange={(event) => update('maxFileSize', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="col-span-full space-y-2 text-sm font-semibold text-white">Bucket/path<input value={settings.bucketPath} onChange={(event) => update('bucketPath', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="col-span-full space-y-2 text-sm font-semibold text-white">Allowed extensions<input value={settings.allowedExtensions} onChange={(event) => update('allowedExtensions', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="col-span-full space-y-2 text-sm font-semibold text-white">CDN URL<input value={settings.cdnUrl} onChange={(event) => update('cdnUrl', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Backup config</h2>
            <div className="mt-4"><ToggleSwitch checked={settings.backupEnabled} onChange={(value) => update('backupEnabled', value)} label="Enable automated backups" /></div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Storage notes</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">These settings are stored locally for the admin dashboard mock. Real provider credentials should never be committed or exposed in frontend code.</p>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default StorageSettings;
