import { useMemo, useState } from 'react';
import { FiDatabase, FiHardDrive, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import BulkActions from '../components/BulkActions';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import StatsCard from '../components/StatsCard';
import StorageReassignmentModal from '../components/StorageReassignmentModal';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { mockStorageHistory } from '../data/mockAdminData';
import { formatPercent } from '../utils/formatters';

const StorageManagement = () => {
  const admin = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkType, setBulkType] = useState('percent');
  const [bulkValue, setBulkValue] = useState(10);
  const pageSize = 8;

  const totalUsed = useMemo(() => admin.data.users.reduce((sum, user) => sum + user.storageUsed, 0), [admin.data.users]);
  const totalLimit = useMemo(() => admin.data.users.reduce((sum, user) => sum + user.storageLimit, 0), [admin.data.users]);
  const totalFree = Math.max(0, totalLimit - totalUsed);
  const usagePercent = totalLimit ? (totalUsed / totalLimit) * 100 : 0;

  const sortedUsers = useMemo(() => {
    return [...admin.data.users].sort((a, b) => b.storageUsed - a.storageUsed).filter((user) => [user.name, user.email, user.plan].join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [admin.data.users, searchTerm]);

  const pageUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));

  const columns = [
    { key: 'user', header: 'User', render: (user) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 font-bold text-white">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
        <div>
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    )},
    { key: 'used', header: 'Used', render: (user) => <span className="text-sm text-gray-300">{user.storageUsed.toFixed(1)} GB</span> },
    { key: 'limit', header: 'Limit', render: (user) => <span className="text-sm text-gray-300">{user.storageLimit} GB</span> },
    { key: 'percent', header: 'Usage', render: (user) => <Badge tone={user.storageUsed / user.storageLimit > 0.9 ? 'red' : user.storageUsed / user.storageLimit > 0.8 ? 'amber' : 'green'}>{formatPercent((user.storageUsed / user.storageLimit) * 100, 0)}</Badge> },
    { key: 'plan', header: 'Plan', render: (user) => <span className="text-sm text-gray-300">{user.plan}</span> }
  ];

  const toggleSelect = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const applyBulk = () => {
    const value = Number(bulkValue);
    admin.updateData('users', (users) => users.map((user) => {
      if (!selectedIds.includes(user.id)) return user;
      const nextLimit = bulkType === 'percent' ? Math.max(1, user.storageLimit * (1 + value / 100)) : Math.max(1, user.storageLimit + value);
      return { ...user, storageLimit: Number(nextLimit.toFixed(1)) };
    }));
    admin.updateData('storageHistory', (history) => history ? [...history, Math.round(usagePercent)] : [...mockStorageHistory, Math.round(usagePercent)]);
    setSelectedIds([]);
    admin.showToast('Bulk storage allocation updated.');
  };

  const applySingle = ({ user, newAllocation, reason, notify }) => {
    if (!user) return;
    const oldAllocation = user.storageLimit;
    admin.updateData('users', (users) => users.map((item) => item.id === user.id ? { ...item, storageLimit: newAllocation } : item));
    admin.updateData('storageHistory', (history) => [...(history || mockStorageHistory), Math.round((totalUsed / Math.max(1, totalLimit - oldAllocation + newAllocation)) * 100)]);
    admin.addActivityLog({ userId: user.id, actor: 'Admin', action: `Storage changed to ${newAllocation} GB`, target: `${user.name} · ${reason || 'No reason provided'}`, severity: 'info' });
    setModalOpen(false);
    admin.showToast(notify ? 'Storage allocation updated and user notified.' : 'Storage allocation updated.');
  };

  return (
    <AdminLayout title="Storage Management">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Storage Management</h1>
            <p className="mt-2 text-sm text-gray-400">Review allocations, reassign storage, and monitor threshold risk.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">Reassign storage</button>
        </div>
        <div className="mt-6 relative">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search users by name, email, or plan..." />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total storage" value={`${totalLimit.toFixed(0)} GB`} icon={FiHardDrive} detail={`${totalUsed.toFixed(1)} GB used`} tone="blue" />
        <StatsCard title="Used" value={`${totalUsed.toFixed(1)} GB`} icon={FiDatabase} detail={formatPercent(usagePercent, 0)} tone="purple" />
        <StatsCard title="Free" value={`${totalFree.toFixed(1)} GB`} icon={FiHardDrive} detail="Available capacity" tone="emerald" />
        <StatsCard title="Users tracked" value={admin.data.users.length} icon={FiUsers} detail="Across all plans" tone="amber" />
      </div>

      {selectedIds.length > 0 && <BulkActions selectedCount={selectedIds.length} actions={[{ label: 'Apply bulk change', onClick: applyBulk, tone: 'blue' }]} />}
      {selectedIds.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <label className="flex-1 text-sm font-semibold text-white">Change type<select value={bulkType} onChange={(event) => setBulkType(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="percent">Percentage</option><option value="fixed">Fixed GB</option></select></label>
            <label className="flex-1 text-sm font-semibold text-white">Value<input value={bulkValue} onChange={(event) => setBulkValue(event.target.value)} type="number" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <button onClick={applyBulk} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">Apply to selected</button>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <DataTable columns={columns} rows={pageUsers} selectable selectedIds={selectedIds} onToggleSelect={toggleSelect} emptyText="No storage records found" />
        <div className="space-y-6">
          <ChartCard title="Usage history" subtitle="Storage usage trend">
            <div className="flex h-56 items-end gap-2">
              {(admin.data.storageHistory || mockStorageHistory).map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-40 w-full items-end rounded-t-xl bg-white/[0.04]"><div style={{ height: `${Math.max(8, value)}%` }} className="w-full rounded-t-xl bg-violet-500" /></div>
                  <span className="text-xs text-gray-500">D{index + 1}</span>
                </div>
              ))}
            </div>
          </ChartCard>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h3 className="text-base font-bold text-white">Alert thresholds</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 p-3"><span className="text-sm text-amber-100">Warning</span><Badge tone="amber">80%</Badge></div>
              <div className="flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/10 p-3"><span className="text-sm text-orange-100">Critical</span><Badge tone="amber">90%</Badge></div>
              <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-3"><span className="text-sm text-red-100">Emergency</span><Badge tone="red">95%</Badge></div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiAlertTriangle /> <h3 className="text-base font-bold">High usage users</h3></div>
            <div className="mt-4 space-y-3">
              {admin.data.users.filter((user) => user.storageUsed / user.storageLimit > 0.8).slice(0, 5).map((user) => (
                <div key={user.id} className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">{formatPercent((user.storageUsed / user.storageLimit) * 100, 0)} of {user.storageLimit} GB</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <StorageReassignmentModal isOpen={modalOpen} users={admin.data.users} selectedUsers={selectedIds} onClose={() => setModalOpen(false)} onSubmit={applySingle} />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default StorageManagement;
