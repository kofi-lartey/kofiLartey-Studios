import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const RolesPermissions = () => {
  const admin = useAdmin();
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('upload');

  const togglePermission = (roleId, permissionKey) => {
    admin.updateData('roles', (roles) => roles.map((role) => {
      if (role.id !== roleId) return role;
      const hasPermission = role.permissions.includes(permissionKey);
      return { ...role, permissions: hasPermission ? role.permissions.filter((permission) => permission !== permissionKey) : [...role.permissions, permissionKey] };
    }));
  };

  const addRole = () => {
    if (!newRoleName.trim()) return;
    admin.updateData('roles', (roles) => [...roles, { id: `role_${Date.now()}`, name: newRoleName.trim(), description: 'Custom admin role', permissions: [selectedPermission], custom: true }]);
    setNewRoleName('');
    admin.showToast('Custom role created.');
  };

  const deleteRole = (roleId) => {
    admin.updateData('roles', (roles) => roles.filter((role) => role.id !== roleId));
    admin.showToast('Role deleted.');
  };

  const permissionOptions = admin.data.rolesPermissions;

  return (
    <AdminLayout title="Roles & Permissions">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Roles & Permissions</h1>
            <p className="mt-2 text-sm text-gray-400">Manage built-in and custom role access levels.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input value={newRoleName} onChange={(event) => setNewRoleName(event.target.value)} placeholder="Custom role name" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <select value={selectedPermission} onChange={(event) => setSelectedPermission(event.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-blue-500/60 focus:outline-none">
              {permissionOptions.map((permission) => <option key={permission.key} value={permission.key} className="bg-gray-900">{permission.label}</option>)}
            </select>
            <button onClick={addRole} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add role</button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        {admin.data.roles.map((role) => (
          <div key={role.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{role.name}</h3>
                  {role.custom && <Badge tone="purple">Custom</Badge>}
                </div>
                <p className="mt-1 text-sm text-gray-500">{role.description}</p>
              </div>
              {role.custom && <button onClick={() => deleteRole(role.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-300"><FiTrash2 size={17} /></button>}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {permissionOptions.map((permission) => (
                <label key={permission.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300">
                  <input checked={role.permissions.includes(permission.key)} onChange={() => togglePermission(role.id, permission.key)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />
                  {permission.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default RolesPermissions;
