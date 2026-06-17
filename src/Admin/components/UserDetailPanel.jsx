import { useState } from 'react';
import { FiX, FiDownload, FiUserCheck, FiShield, FiClock, FiActivity, FiSave } from 'react-icons/fi';

const UserDetailPanel = ({ user, isOpen, onClose, onToggleStatus, onTogglePermission, onAddNote }) => {
  const [note, setNote] = useState(user?.notes || '');

  if (!isOpen || !user) return null;

  const handleSaveNote = () => {
    onAddNote(user.id, note);
  };

  return (
    <div
      className="fixed inset-0 z-[75] flex justify-end bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-detail-title"
    >
      <aside className="w-full max-w-lg h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur p-5">
          <div>
            <h2 id="user-detail-title" className="text-lg font-bold text-white">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">Frontend-only administrative controls.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors touch-target"
            aria-label="Close user details"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-white truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-sm font-semibold text-white mt-1">{user.role}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-semibold text-white mt-1 capitalize">{user.status}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Storage</p>
                <p className="text-sm font-semibold text-white mt-1">{user.storageUsed.toFixed(1)} GB</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Uploads</p>
                <p className="text-sm font-semibold text-white mt-1">{user.uploads}</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <button
              onClick={() => onToggleStatus(user.id)}
              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left hover:bg-white/[0.06] transition-colors touch-target"
            >
              <span>
                <span className="block text-sm font-semibold text-white">
                  {user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                </span>
                <span className="block text-xs text-gray-500 mt-1">
                  Toggle local account status for this user.
                </span>
              </span>
              <FiUserCheck className="text-blue-300" size={18} />
            </button>

            <button
              onClick={() => onTogglePermission(user.id)}
              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left hover:bg-white/[0.06] transition-colors touch-target"
            >
              <span>
                <span className="block text-sm font-semibold text-white">
                  {user.downloadPermission ? 'Restrict Downloads' : 'Enable Downloads'}
                </span>
                <span className="block text-xs text-gray-500 mt-1">
                  Manage download permissions without backend calls.
                </span>
              </span>
              {user.downloadPermission ? <FiDownload className="text-emerald-300" size={18} /> : <FiShield className="text-amber-300" size={18} />}
            </button>
          </section>

          <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold">
              <FiClock size={17} />
              <span>Activity Snapshot</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Last active</p>
                <p className="text-sm font-semibold text-white mt-1">{user.lastActive}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Risk level</p>
                <p className="text-sm font-semibold text-white mt-1 capitalize">{user.risk}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Downloads</p>
                <p className="text-sm font-semibold text-white mt-1">{user.downloadPermission ? 'Enabled' : 'Restricted'}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] border border-white/5 p-3">
                <p className="text-xs text-gray-500">Database</p>
                <p className="text-sm font-semibold text-white mt-1">{user.storageUsed.toFixed(1)} GB</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <FiActivity size={17} />
              <span>Admin Note</span>
            </div>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60"
              placeholder="Add an internal note for this user..."
            />
            <button
              onClick={handleSaveNote}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-bold text-white transition-colors touch-target"
            >
              <FiSave size={16} />
              Save Note
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default UserDetailPanel;
