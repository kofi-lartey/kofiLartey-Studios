import { useMemo } from 'react';
import { FiSearch, FiRefreshCw, FiDownload, FiShield, FiFilter, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminStatsCards from './components/AdminStatsCards';
import ActivityLog from './components/ActivityLog';
import AdminAlerts from './components/AdminAlerts';
import ConfirmModal from './components/ConfirmModal';
import UserDetailPanel from './components/UserDetailPanel';
import UserManagementTable from './components/UserManagementTable';
import useAdminDashboard from './hooks/useAdminDashboard';
import { logoutMockAdmin } from './utils/mockAdminAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dashboard = useAdminDashboard();
  const {
    snapshot,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    permissionFilter,
    setPermissionFilter,
    filteredUsers,
    recentActivity,
    selectedUser,
    setSelectedUser,
    pendingDeleteUser,
    setPendingDeleteUser,
    toast,
    toggleUserStatus,
    toggleDownloadPermission,
    deleteUser,
    addAdminNote,
    resetDemoData,
    exportReport
  } = dashboard;

  const handleLogout = () => {
    logoutMockAdmin();
    navigate('/admin-login', { replace: true });
  };

  const selectedPendingUser = useMemo(() => {
    return snapshot.users.find((user) => user.id === pendingDeleteUser) || null;
  }, [snapshot.users, pendingDeleteUser]);

  return (
    <AdminLayout title="Admin Dashboard">
      {/* Header Section - Full width with proper padding */}
      <section className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
              <FiShield size={14} className="flex-shrink-0" />
              <span>Frontend admin workspace</span>
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm md:text-base text-gray-400 leading-relaxed">
              Manage user accounts, download permissions, profile deletion workflows, 
              and activity monitoring from one responsive interface.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto lg:flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200 whitespace-nowrap"
            >
              <FiLogOut size={16} className="flex-shrink-0" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={resetDemoData}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 whitespace-nowrap"
            >
              <FiRefreshCw size={16} className="flex-shrink-0" />
              <span>Reset Demo</span>
            </button>
            <button
              onClick={exportReport}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 whitespace-nowrap"
            >
              <FiDownload size={16} className="flex-shrink-0" />
              <span>Export Summary</span>
            </button>
          </div>
        </div>

        {/* Search and Filters - Full width */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto] w-full">
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
              placeholder="Search users by name, email, role, or notes..."
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all duration-200"
            />
          </div>

          <div className="relative min-w-[160px]">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="all" className="bg-gray-900">All statuses</option>
              <option value="active" className="bg-gray-900">Active</option>
              <option value="inactive" className="bg-gray-900">Inactive</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative min-w-[160px]">
            <FiDownload className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={permissionFilter}
              onChange={(event) => setPermissionFilter(event.target.value)}
              className="w-full appearance-none rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              aria-label="Filter by download permission"
            >
              <option value="all" className="bg-gray-900">All permissions</option>
              <option value="enabled" className="bg-gray-900">Downloads enabled</option>
              <option value="restricted" className="bg-gray-900">Downloads restricted</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards - Full width with proper grid */}
      <div className="w-full">
        <AdminStatsCards stats={stats} />
      </div>

      {/* Main Content Grid - Full width */}
      <section className="grid gap-6 w-full xl:grid-cols-[1.55fr_0.95fr]">
        <div className="space-y-6 w-full min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredUsers.length} of {snapshot.users.length} users
              </p>
            </div>
            <span className="inline-flex rounded-full bg-white/[0.06] border border-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-300 whitespace-nowrap">
              Local state
            </span>
          </div>

          <div className="w-full overflow-hidden">
            <UserManagementTable
              users={filteredUsers}
              onTogglePermission={toggleDownloadPermission}
              onSelectUser={setSelectedUser}
              onRequestDelete={setPendingDeleteUser}
            />
          </div>
        </div>

        <div className="space-y-6 w-full min-w-0">
          <AdminAlerts alerts={snapshot.alerts} />
          <ActivityLog logs={recentActivity} />
        </div>
      </section>

      {/* Modals and Panels */}
      <UserDetailPanel
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onToggleStatus={toggleUserStatus}
        onTogglePermission={toggleDownloadPermission}
        onAddNote={addAdminNote}
      />

      <ConfirmModal
        user={selectedPendingUser}
        isOpen={Boolean(pendingDeleteUser)}
        onClose={() => setPendingDeleteUser(null)}
        onConfirm={() => pendingDeleteUser && deleteUser(pendingDeleteUser)}
        actionTitle="Delete user profile"
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[90] w-full max-w-md -translate-x-1/2">
          <div className={`rounded-2xl border p-5 shadow-2xl backdrop-blur-sm ${
            toast.tone === 'warning' 
              ? 'border-amber-500/20 bg-amber-500/10' 
              : 'border-blue-500/20 bg-blue-500/10'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                toast.tone === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{toast.message}</p>
                <p className="text-xs text-gray-400 mt-1">No backend request was sent.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;