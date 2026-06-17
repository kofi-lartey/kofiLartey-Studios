import { useState } from 'react';
import { FiMail, FiSave, FiSend } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import TemplateEditor from '../components/TemplateEditor';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const EmailSettings = () => {
  const admin = useAdmin();
  const [settings, setSettings] = useState(admin.data.emailSettings);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const updateToggle = (key, value) => setSettings((current) => ({ ...current, notificationToggles: { ...current.notificationToggles, [key]: value } }));

  const save = () => {
    admin.updateData('emailSettings', settings);
    admin.showToast('Email settings saved.');
  };

  const saveTemplate = (template) => {
    const payload = { ...template, id: editingTemplate?.id || `tpl_email_${Date.now()}` };
    if (editingTemplate) {
      setSettings((current) => ({ ...current, templates: current.templates.map((item) => item.id === editingTemplate.id ? payload : item) }));
      admin.showToast('Email template updated.');
    } else {
      setSettings((current) => ({ ...current, templates: [payload, ...current.templates] }));
      admin.showToast('Email template created.');
    }
    setEditingTemplate(null);
  };

  return (
    <AdminLayout title="Email Settings">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Email Settings</h1>
            <p className="mt-2 text-sm text-gray-400">SMTP, sender identity, templates, notification toggles, and email logs.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => admin.showToast('SMTP connection test successful.', 'success')} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiSend className="inline mr-2" size={16} />Test connection</button>
            <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save email</button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiMail /> <h2 className="text-lg font-bold">SMTP configuration</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-white">SMTP host<input value={settings.smtpHost} onChange={(event) => update('smtpHost', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">SMTP port<input value={settings.smtpPort} onChange={(event) => update('smtpPort', event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">SMTP user<input value={settings.smtpUser} onChange={(event) => update('smtpUser', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">SMTP password<input value={settings.smtpPassword} onChange={(event) => update('smtpPassword', event.target.value)} type="password" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">From name<input value={settings.fromName} onChange={(event) => update('fromName', event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="space-y-2 text-sm font-semibold text-white">From address<input value={settings.fromAddress} onChange={(event) => update('fromAddress', event.target.value)} type="email" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Notification toggles</h2>
            <div className="mt-4 space-y-3">
              {Object.entries(settings.notificationToggles).map(([key, value]) => <ToggleSwitch key={key} checked={value} onChange={(next) => updateToggle(key, next)} label={key.replace(/([A-Z])/g, ' $1')} />)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Email templates</h2>
              <button onClick={() => setEditingTemplate(null)} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500">New</button>
            </div>
            <div className="mt-4 space-y-3">
              {settings.templates.map((template) => (
                <button key={template.id} onClick={() => setEditingTemplate(template)} className="w-full rounded-xl border border-white/5 bg-white/[0.04] p-3 text-left hover:bg-white/[0.06]">
                  <p className="font-semibold text-white">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.subject}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Email logs</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">Welcome email delivered to Amara Osei</div>
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-3">Payment receipt delivered to Malik Johnson</div>
            </div>
          </div>
        </div>
      </div>
      <TemplateEditor isOpen={Boolean(editingTemplate)} initialData={editingTemplate} onClose={() => setEditingTemplate(null)} onSubmit={saveTemplate} />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default EmailSettings;
