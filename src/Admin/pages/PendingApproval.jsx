import { useState } from 'react';
import { FiCheck, FiDownload, FiX } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import BulkActions from '../components/BulkActions';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';
import { formatDate } from '../utils/formatters';

const PendingApproval = () => {
  const admin = useAdmin();
  const { exportJSON } = useExport('pending-approval');
  const [selectedIds, setSelectedIds] = useState([]);
  const [reason, setReason] = useState('');

  const toggleSelect = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const approve = (id) => {
    const item = admin.data.pendingApprovals.find((approval) => approval.id === id);
    if (!item) return;
    admin.updateData('images', (images) => images.map((image) => image.id === item.imageId ? { ...image, status: 'approved' } : image));
    admin.updateData('pendingApprovals', (items) => items.filter((approval) => approval.id !== id));
    admin.addActivityLog({ actor: 'Admin', action: 'Approved content', target: item.title, severity: 'success' });
    admin.showToast('Content approved.');
  };

  const reject = (id) => {
    const item = admin.data.pendingApprovals.find((approval) => approval.id === id);
    if (!item) return;
    admin.updateData('images', (images) => images.map((image) => image.id === item.imageId ? { ...image, status: 'rejected' } : image));
    admin.updateData('pendingApprovals', (items) => items.filter((approval) => approval.id !== id));
    admin.addActivityLog({ actor: 'Admin', action: 'Rejected content', target: `${item.title} · ${reason || 'No reason provided'}`, severity: 'warning' });
    setReason('');
    admin.showToast('Content rejected.', 'warning');
  };

  const columns = [
    { key: 'title', header: 'Content', render: (item) => <span className="font-semibold text-white">{item.title}</span> },
    { key: 'user', header: 'User', render: (item) => <span className="text-sm text-gray-300">{item.user}</span> },
    { key: 'category', header: 'Category', render: (item) => <Badge tone="purple">{item.category}</Badge> },
    { key: 'submitted', header: 'Submitted', render: (item) => <span className="text-sm text-gray-500">{formatDate(item.submittedAt)}</span> },
    { key: 'reason', header: 'Reason', render: (item) => <span className="text-sm text-gray-300">{item.reason}</span> },
    { key: 'actions', header: 'Actions', render: (item) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => approve(item.id)} className="rounded-lg bg-emerald-500/10 p-2 text-emerald-300 hover:bg-emerald-500/20"><FiCheck size={17} /></button>
        <button onClick={() => reject(item.id)} className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"><FiX size={17} /></button>
      </div>
    )}
  ];

  return (
    <AdminLayout title="Pending Approval">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Pending Approval</h1>
            <p className="mt-2 text-sm text-gray-400">Approve or reject queued images with reason tracking.</p>
          </div>
          <button onClick={() => exportJSON({ approvals: admin.data.pendingApprovals })} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Export JSON</button>
        </div>
      </section>

      {selectedIds.length > 0 && <BulkActions selectedCount={selectedIds.length} actions={[{ label: 'Approve selected', onClick: () => selectedIds.forEach(approve), tone: 'success' }, { label: 'Reject selected', onClick: () => selectedIds.forEach((id) => reject(id)), tone: 'danger' }]} />}

      <DataTable columns={columns} rows={admin.data.pendingApprovals} selectable selectedIds={selectedIds} onToggleSelect={toggleSelect} emptyText="No pending approvals" />

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
        <label className="block text-sm font-semibold text-white">Rejection reason</label>
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" placeholder="Optional reason for rejection..." />
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default PendingApproval;
