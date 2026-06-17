import { useState } from 'react';
import { FiAlertTriangle, FiCheck, FiTrash2, FiUserX } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const statusTone = { open: 'red', reviewing: 'amber', resolved: 'green', dismissed: 'gray' };

const ReportedContent = () => {
  const admin = useAdmin();
  const [resolution, setResolution] = useState('');

  const resolve = (id, status) => {
    const item = admin.data.reportedContent.find((report) => report.id === id);
    if (!item) return;

    admin.updateData('reportedContent', (items) => items.map((report) => report.id === id ? { ...report, status, resolution: resolution || 'Resolved by admin' } : report));
    admin.addActivityLog({ actor: 'Admin', action: status === 'dismissed' ? 'Dismissed report' : status === 'removed' ? 'Removed reported content' : 'Warned user', target: item.title, severity: status === 'resolved' ? 'success' : 'warning' });
    setResolution('');
    admin.showToast(status === 'dismissed' ? 'Report dismissed.' : 'Report resolved.');
  };

  const columns = [
    { key: 'title', header: 'Content', render: (item) => <span className="font-semibold text-white">{item.title}</span> },
    { key: 'reason', header: 'Reason', render: (item) => <span className="text-sm text-gray-300">{item.reason}</span> },
    { key: 'reporter', header: 'Reporter', render: (item) => <span className="text-sm text-gray-300">{item.reporter}</span> },
    { key: 'date', header: 'Date', render: (item) => <span className="text-sm text-gray-500">{formatDate(item.date)}</span> },
    { key: 'status', header: 'Status', render: (item) => <Badge tone={statusTone[item.status] || 'gray'}>{item.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (item) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => resolve(item.id, 'dismissed')} className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-gray-300 hover:bg-white/[0.06]"><FiCheck size={17} /></button>
        <button onClick={() => resolve(item.id, 'removed')} className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"><FiTrash2 size={17} /></button>
        <button onClick={() => resolve(item.id, 'warned')} className="rounded-lg bg-amber-500/10 p-2 text-amber-300 hover:bg-amber-500/20"><FiUserX size={17} /></button>
      </div>
    )}
  ];

  return (
    <AdminLayout title="Reported Content">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Reported Content</h1>
            <p className="mt-2 text-sm text-gray-400">Review flagged media, dismiss reports, remove content, or warn users.</p>
          </div>
          <Badge tone="red">{admin.data.reportedContent.filter((item) => item.status === 'open').length} open reports</Badge>
        </div>
      </section>

      <DataTable columns={columns} rows={admin.data.reportedContent} emptyText="No reported content" />

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 text-white"><FiAlertTriangle /> <h3 className="text-base font-bold">Resolution note</h3></div>
        <textarea value={resolution} onChange={(event) => setResolution(event.target.value)} rows={3} className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" placeholder="Add a resolution note..." />
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default ReportedContent;
