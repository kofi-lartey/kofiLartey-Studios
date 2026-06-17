import { useMemo, useState } from 'react';
import { FiDownload, FiEdit, FiShield, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import BulkActions from '../components/BulkActions';
import DataTable from '../components/DataTable';
import FilterDropdown from '../components/FilterDropdown';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';

const statusTone = { active: 'green', inactive: 'gray', suspended: 'red' };
const riskTone = { low: 'green', medium: 'amber', high: 'red' };

const AllUsers = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('all-users');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredUsers = useMemo(() => {
    return admin.data.users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.role, user.plan, user.notes].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [admin.data.users, searchTerm, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pageUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const columns = [
    { key: 'user', header: 'User', render: (user) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
        <div>
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    )},
    { key: 'role', header: 'Role', render: (user) => <Badge tone="purple">{user.role}</Badge> },
    { key: 'status', header: 'Status', render: (user) => <Badge tone={statusTone[user.status] || 'gray'}>{user.status}</Badge> },
    { key: 'storage', header: 'Storage', render: (user) => <span className="text-sm text-gray-300">{user.storageUsed.toFixed(1)} / {user.storageLimit} GB</span> },
    { key: 'risk', header: 'Risk', render: (user) => <Badge tone={riskTone[user.risk] || 'gray'}>{user.risk}</Badge> },
    { key: 'actions', header: 'Actions', render: (user) => (
      <div className="flex justify-end gap-2">
        <button className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300"><FiEdit size={17} /></button>
        <button onClick={() => admin.updateData('users', (users) => users.map((item) => item.id === user.id ? { ...item, status: item.status === 'active' ? 'suspended' : 'active' } : item))} className="rounded-lg p-2 text-gray-400 hover:bg-amber-500/10 hover:text-amber-300"><FiShield size={17} /></button>
        <button onClick={() => admin.updateData('users', (users) => users.filter((item) => item.id !== user.id))} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-300"><FiTrash2 size={17} /></button>
      </div>
    )}
  ];

  const suspendSelected = () => {
    admin.updateData('users', (users) => users.map((user) => selectedIds.includes(user.id) ? { ...user, status: 'suspended' } : user));
    setSelectedIds([]);
    admin.showToast('Selected users suspended.');
  };

  return (
    <AdminLayout title="All Users">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">All Users</h1>
            <p className="mt-2 text-sm text-gray-400">Search, filter, export, suspend, and manage user accounts.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => exportCSV(filteredUsers)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />CSV</button>
            <button onClick={() => exportJSON({ users: filteredUsers })} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiDownload className="inline mr-2" size={16} />JSON</button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search users by name, email, role, or plan..." />
          <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'suspended', label: 'Suspended' }]} />
          <FilterDropdown label="Role" value={roleFilter} onChange={setRoleFilter} options={[{ value: 'all', label: 'All roles' }, ...Array.from(new Set(admin.data.users.map((user) => user.role))).map((role) => ({ value: role, label: role }))]} />
        </div>
      </section>

      {selectedIds.length > 0 && <BulkActions selectedCount={selectedIds.length} actions={[{ label: 'Suspend selected', onClick: suspendSelected, tone: 'danger' }, { label: 'Activate selected', onClick: () => { admin.updateData('users', (users) => users.map((user) => selectedIds.includes(user.id) ? { ...user, status: 'active' } : user)); setSelectedIds([]); admin.showToast('Selected users activated.'); }, tone: 'success' }]} />}

      <DataTable columns={columns} rows={pageUsers} selectable selectedIds={selectedIds} onToggleSelect={toggleSelect} emptyText="No users found" />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default AllUsers;
