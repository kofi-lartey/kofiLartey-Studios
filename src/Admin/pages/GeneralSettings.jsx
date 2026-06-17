import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const GeneralSettings = () => {
  const admin = useAdmin();
  const [settings, setSettings] = useState(admin.data.settings);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const save = () => {
    admin.updateData('settings', settings);
    admin.showToast('General settings saved.');
  };

  return (
    <AdminLayout title="General Settings">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">General Settings</h1>
            <p className="mt-2 text-sm text-gray-400">Site identity, contact details, branding, timezone, language, and SEO metadata.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save settings</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Site information</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-white">Site name<input value={settings.siteName} onChange={(event) => update('siteName', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Language<select value={settings.language} onChange={(event) => update('language', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="en">English</option><option value="fr">French</option><option value="ar">Arabic</option></select></label>
            <label className="col-span-full space-y-2 text-sm font-semibold text-white">Description<textarea value={settings.description} onChange={(event) => update('description', event.target.value)} rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Contact email<input value={settings.contactEmail} onChange={(event) => update('contactEmail', event.target.value)} type="email" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Contact phone<input value={settings.contactPhone} onChange={(event) => update('contactPhone', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Timezone<input value={settings.timezone} onChange={(event) => update('timezone', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">Primary color<input value={settings.primaryColor} onChange={(event) => update('primaryColor', event.target.value)} type="color" className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">SEO metadata</h2>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-white">Meta title<input value={settings.metaTitle} onChange={(event) => update('metaTitle', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Meta description<textarea value={settings.metaDescription} onChange={(event) => update('metaDescription', event.target.value)} rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Logo URL<input value={settings.logoUrl} onChange={(event) => update('logoUrl', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default GeneralSettings;
