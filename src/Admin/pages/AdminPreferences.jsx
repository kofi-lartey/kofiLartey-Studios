import { useState } from 'react';
import { FiGrid, FiList, FiMoon, FiSave, FiSun } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const AdminPreferences = () => {
  const admin = useAdmin();
  const [layout, setLayout] = useState('grid');
  const [theme, setTheme] = useState(admin.theme);
  const [notifications, setNotifications] = useState({ activity: true, payments: true, content: true, security: true });
  const [quickActions, setQuickActions] = useState([
    { label: 'New Coupon', visible: true },
    { label: 'Send Announcement', visible: true },
    { label: 'Generate Report', visible: true },
    { label: 'Upload Image', visible: false },
    { label: 'Feature Content', visible: true }
  ]);

  const toggleAction = (label) => setQuickActions((current) => current.map((action) => action.label === label ? { ...action, visible: !action.visible } : action));
  const moveAction = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= quickActions.length) return;
    const next = [...quickActions];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    setQuickActions(next);
  };

  const save = () => {
    admin.setTheme(theme);
    admin.showToast('Admin preferences saved.');
  };

  return (
    <AdminLayout title="Admin Preferences">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Preferences</h1>
            <p className="mt-2 text-sm text-gray-400">Customize dashboard layout, theme, notifications, and quick actions.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save preferences</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Dashboard layout</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <button onClick={() => setLayout('grid')} className={`rounded-2xl border p-5 text-left ${layout === 'grid' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/[0.04]'}`}><FiGrid className="mb-3 text-blue-300" size={28} /><p className="font-semibold text-white">Grid</p><p className="text-xs text-gray-500">Card-heavy overview</p></button>
              <button onClick={() => setLayout('list')} className={`rounded-2xl border p-5 text-left ${layout === 'list' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/[0.04]'}`}><FiList className="mb-3 text-blue-300" size={28} /><p className="font-semibold text-white">List</p><p className="text-xs text-gray-500">Dense table view</p></button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Theme</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button onClick={() => setTheme('dark')} className={`rounded-xl border p-4 ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/[0.04]'}`}><FiMoon className="mx-auto mb-2 text-blue-300" />Dark</button>
              <button onClick={() => setTheme('light')} className={`rounded-xl border p-4 ${theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/[0.04]'}`}><FiSun className="mx-auto mb-2 text-amber-300" />Light</button>
              <button onClick={() => setTheme('system')} className={`rounded-xl border p-4 ${theme === 'system' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/[0.04]'}`}>System</button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Notifications</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {Object.entries(notifications).map(([key, value]) => <ToggleSwitch key={key} checked={value} onChange={(next) => setNotifications((current) => ({ ...current, [key]: next }))} label={key} />)}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Quick actions customization</h2>
          <div className="mt-4 space-y-3">
            {quickActions.map((action, index) => (
              <div key={action.label} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3">
                <div>
                  <p className="font-semibold text-white">{action.label}</p>
                  <p className="text-xs text-gray-500">Order {index + 1}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={index === 0} onClick={() => moveAction(index, -1)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white disabled:opacity-40">Up</button>
                  <button disabled={index === quickActions.length - 1} onClick={() => moveAction(index, 1)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white disabled:opacity-40">Down</button>
                  <button onClick={() => toggleAction(action.label)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${action.visible ? 'bg-emerald-500/10 text-emerald-300' : 'bg-gray-500/10 text-gray-300'}`}>{action.visible ? 'Visible' : 'Hidden'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default AdminPreferences;
