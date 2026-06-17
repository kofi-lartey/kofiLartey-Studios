import { useState } from 'react';
import { FiCheckCircle, FiRefreshCw, FiSave } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const BackupRestore = () => {
  const admin = useAdmin();
  const [schedule, setSchedule] = useState('daily');
  const [retentionDays, setRetentionDays] = useState(30);
  const [storagePath, setStoragePath] = useState('/backups/studio');

  const createBackup = () => {
    admin.updateData('backups', (backups) => [{ id: `bk_${Date.now()}`, name: 'Manual backup', type: 'Database + Media manifest', createdAt: new Date().toISOString(), size: 2.1, status: 'pending' }, ...backups]);
    admin.showToast('Manual backup queued.');
  };

  const verifyBackup = (id) => {
    admin.updateData('backups', (backups) => backups.map((backup) => backup.id === id ? { ...backup, status: 'verified' } : backup));
    admin.showToast('Backup verified.', 'success');
  };

  const save = () => {
    admin.addActivityLog({ actor: 'Admin', action: 'Backup settings updated', target: `${schedule} · ${retentionDays} days`, severity: 'info' });
    admin.showToast('Backup settings saved.');
  };

  return (
    <AdminLayout title="Backup & Restore">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Backup & Restore</h1>
            <p className="mt-2 text-sm text-gray-400">Schedule backups, retain restore points, verify integrity, and restore data.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={createBackup} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiRefreshCw className="inline mr-2" size={16} />Manual backup</button>
            <button onClick={save} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiSave className="inline mr-2" size={16} />Save schedule</button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold text-white">Backup schedule</h2>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-white">Frequency<select value={schedule} onChange={(event) => setSchedule(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Retention days<input value={retentionDays} onChange={(event) => setRetentionDays(event.target.value)} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Storage path<input value={storagePath} onChange={(event) => setStoragePath(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Restore points</h2>
            <Badge tone="green">{admin.data.backups.filter((backup) => backup.status === 'verified').length} verified</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {admin.data.backups.map((backup) => (
              <div key={backup.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-4">
                <div>
                  <p className="font-semibold text-white">{backup.name}</p>
                  <p className="text-xs text-gray-500">{backup.type} · {backup.size} GB · {formatDate(backup.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone={backup.status === 'verified' ? 'green' : 'amber'}>{backup.status}</Badge>
                  <button onClick={() => verifyBackup(backup.id)} className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300 hover:bg-emerald-500/20"><FiCheckCircle size={17} /></button>
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

export default BackupRestore;
