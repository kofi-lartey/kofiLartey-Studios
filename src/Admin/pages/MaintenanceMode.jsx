import { useState } from 'react';
import { FiSave, FiTool } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import ToggleSwitch from '../components/ToggleSwitch';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const MaintenanceMode = () => {
  const admin = useAdmin();
  const [maintenance, setMaintenance] = useState(admin.data.maintenance);

  const update = (key, value) => setMaintenance((current) => ({ ...current, [key]: value }));

  const save = () => {
    admin.updateData('maintenance', maintenance);
    admin.showToast(maintenance.enabled ? 'Maintenance mode enabled.' : 'Maintenance mode disabled.', maintenance.enabled ? 'warning' : 'success');
  };

  return (
    <AdminLayout title="Maintenance Mode">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Maintenance Mode</h1>
            <p className="mt-2 text-sm text-gray-400">Toggle maintenance, schedule downtime, preview messages, and whitelist IPs.</p>
          </div>
          <button onClick={save} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiSave className="inline mr-2" size={16} />Save maintenance</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiTool /> <h2 className="text-lg font-bold">Maintenance controls</h2></div>
          <div className="mt-5 space-y-4">
            <ToggleSwitch checked={maintenance.enabled} onChange={(value) => update('enabled', value)} label="Enable maintenance mode" />
            <ToggleSwitch checked={maintenance.scheduled} onChange={(value) => update('scheduled', value)} label="Schedule downtime" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm font-semibold text-white">Start<input value={maintenance.startAt} onChange={(event) => update('startAt', event.target.value)} type="datetime-local" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <label className="block space-y-2 text-sm font-semibold text-white">End<input value={maintenance.endAt} onChange={(event) => update('endAt', event.target.value)} type="datetime-local" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            </div>
            <label className="block space-y-2 text-sm font-semibold text-white">Message<textarea value={maintenance.message} onChange={(event) => update('message', event.target.value)} rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Whitelist IPs<textarea value={maintenance.whitelistIps} onChange={(event) => update('whitelistIps', event.target.value)} rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Message preview</h2>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
              <FiTool className="mx-auto text-amber-300" size={32} />
              <h3 className="mt-3 text-xl font-bold text-white">Scheduled maintenance</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">{maintenance.message}</p>
              {maintenance.scheduled && <p className="mt-4 text-xs text-gray-500">{formatDate(maintenance.startAt)} → {formatDate(maintenance.endAt)}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Current status</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-white/[0.04] p-4"><p className="text-sm text-gray-500">Mode</p><p className="mt-1 font-semibold text-white">{maintenance.enabled ? 'Enabled' : 'Disabled'}</p></div>
              <div className="rounded-xl bg-white/[0.04] p-4"><p className="text-sm text-gray-500">Scheduled</p><p className="mt-1 font-semibold text-white">{maintenance.scheduled ? 'Yes' : 'No'}</p></div>
              <div className="rounded-xl bg-white/[0.04] p-4"><p className="text-sm text-gray-500">Whitelist</p><p className="mt-1 font-semibold text-white">{maintenance.whitelistIps.split(',').length} IPs</p></div>
              <div className="rounded-xl bg-white/[0.04] p-4"><p className="text-sm text-gray-500">Start</p><p className="mt-1 font-semibold text-white">{formatDate(maintenance.startAt)}</p></div>
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default MaintenanceMode;
