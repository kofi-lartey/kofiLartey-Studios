import { FiDownload, FiUserX, FiShield, FiEye, FiCheck, FiX } from 'react-icons/fi';

const statusClasses = {
  active: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  inactive: 'bg-gray-500/10 text-gray-300 border-gray-500/20'
};

const riskClasses = {
  low: 'bg-emerald-500/10 text-emerald-300',
  medium: 'bg-amber-500/10 text-amber-300',
  high: 'bg-red-500/10 text-red-300'
};

const UserManagementTable = ({
  users,
  onTogglePermission,
  onSelectUser,
  onRequestDelete
}) => {
  if (!users.length) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 text-center">
        <FiUserX className="mx-auto text-gray-500 mb-3" size={32} />
        <h3 className="text-white font-semibold">No users found</h3>
        <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-4 py-4 font-semibold">User</th>
              <th className="px-4 py-4 font-semibold hidden md:table-cell">Role</th>
              <th className="px-4 py-4 font-semibold hidden sm:table-cell">Status</th>
              <th className="px-4 py-4 font-semibold hidden lg:table-cell">Downloads</th>
              <th className="px-4 py-4 font-semibold hidden xl:table-cell">Risk</th>
              <th className="px-4 py-4 font-semibold hidden xl:table-cell">Last Active</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-gray-300">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[user.status]}`}>
                    {user.status === 'active' ? <FiCheck size={12} /> : <FiX size={12} />}
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.downloadPermission ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {user.downloadPermission ? <FiDownload size={14} /> : <FiShield size={14} />}
                    {user.downloadPermission ? 'Enabled' : 'Restricted'}
                  </span>
                </td>
                <td className="px-4 py-4 hidden xl:table-cell">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${riskClasses[user.risk]}`}>
                    {user.risk}
                  </span>
                </td>
                <td className="px-4 py-4 hidden xl:table-cell text-sm text-gray-400">
                  {user.lastActive}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelectUser(user)}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-target"
                      aria-label={`Manage ${user.name}`}
                    >
                      <FiEye size={17} />
                    </button>
                    <button
                      onClick={() => onTogglePermission(user.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors touch-target"
                      aria-label={`Toggle download permission for ${user.name}`}
                    >
                      <FiDownload size={17} />
                    </button>
                    <button
                      onClick={() => onRequestDelete(user.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-300 hover:bg-red-500/10 transition-colors touch-target"
                      aria-label={`Delete ${user.name}`}
                    >
                      <FiUserX size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
