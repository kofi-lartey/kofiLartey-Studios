import { useState } from 'react';
import { FiBell, FiPlus, FiSend } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import AlertRuleForm from '../components/AlertRuleForm';
import Badge from '../components/Badge';
import TemplateEditor from '../components/TemplateEditor';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const typeTone = { info: 'blue', success: 'green', warning: 'amber', error: 'red', critical: 'red' };

const SystemAlerts = () => {
  const admin = useAdmin();
  const [ruleOpen, setRuleOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const saveRule = (rule) => {
    admin.updateData('systemAlerts', (alerts) => [{ ...rule, id: `sys_alert_${Date.now()}`, createdAt: new Date().toISOString() }, ...alerts]);
    admin.updateData('alertHistory', (history) => [{ id: `hist_${Date.now()}`, title: rule.title, target: rule.target, sentAt: new Date().toISOString(), status: rule.active ? 'sent' : 'scheduled' }, ...history]);
    setRuleOpen(false);
    admin.showToast('Alert rule created.');
  };

  const saveTemplate = (template) => {
    const payload = { ...template, id: editingTemplate?.id || `tmpl_${Date.now()}` };
    if (editingTemplate) {
      admin.updateData('alertTemplates', (templates) => templates.map((item) => item.id === editingTemplate.id ? payload : item));
      admin.showToast('Template updated.');
    } else {
      admin.updateData('alertTemplates', (templates) => [payload, ...templates]);
      admin.showToast('Template created.');
    }
    setEditingTemplate(null);
    setTemplateOpen(false);
  };

  const toggleTrigger = (id) => {
    admin.updateData('systemTriggers', (triggers) => triggers.map((trigger) => trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger));
  };

  return (
    <AdminLayout title="System Alerts">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">System Alerts</h1>
            <p className="mt-2 text-sm text-gray-400">Create alert rules, manage templates, and monitor system triggers.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setRuleOpen(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Create alert</button>
            <button onClick={() => admin.showToast('Test alert sent.', 'success')} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiSend className="inline mr-2" size={16} />Test alert</button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Alert rules</h2>
              <Badge tone="blue">{admin.data.systemAlerts.length} rules</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {admin.data.systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiBell className="text-gray-400" />
                      <p className="font-semibold text-white">{alert.title}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{alert.message}</p>
                    <p className="mt-2 text-xs text-gray-500">{alert.target} · {alert.schedule} · {formatDate(alert.createdAt)}</p>
                  </div>
                  <Badge tone={typeTone[alert.type] || 'gray'}>{alert.type}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">System triggers</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {admin.data.systemTriggers.map((trigger) => <ToggleSwitch key={trigger.id} checked={trigger.enabled} onChange={() => toggleTrigger(trigger.id)} label={trigger.label} />)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Templates</h2>
              <button onClick={() => { setEditingTemplate(null); setTemplateOpen(true); }} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus size={16} /></button>
            </div>
            <div className="mt-4 space-y-3">
              {admin.data.alertTemplates.map((template) => (
                <button key={template.id} onClick={() => { setEditingTemplate(template); setTemplateOpen(true); }} className="w-full rounded-xl border border-white/5 bg-white/[0.04] p-3 text-left hover:bg-white/[0.06]">
                  <p className="font-semibold text-white">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.subject}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Alert history</h2>
            <div className="mt-4 space-y-3">
              {admin.data.alertHistory.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.target} · {item.status} · {formatDate(item.sentAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AlertRuleForm isOpen={ruleOpen} onClose={() => setRuleOpen(false)} onSubmit={saveRule} />
      <TemplateEditor isOpen={templateOpen} initialData={editingTemplate} onClose={() => { setTemplateOpen(false); setEditingTemplate(null); }} onSubmit={saveTemplate} />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default SystemAlerts;
