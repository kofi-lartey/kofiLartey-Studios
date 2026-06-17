import { useState } from 'react';
import Modal from './Modal';

const StorageReassignmentModal = ({ isOpen, users = [], selectedUsers = [], onClose, onSubmit }) => {
  const firstUser = users[0];
  const selectedUserId = selectedUsers[0] || firstUser?.id || '';
  const [userId, setUserId] = useState(selectedUserId);
  const [newAllocation, setNewAllocation] = useState(10);
  const [reason, setReason] = useState('');
  const [notify, setNotify] = useState(true);

  const handleSubmit = () => {
    const user = users.find((item) => item.id === userId);
    onSubmit({ userId, user, newAllocation: Number(newAllocation), reason, notify });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Storage reassignment"
      onClose={onClose}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
          <button onClick={handleSubmit} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Apply allocation</button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">User</label>
        <select value={userId} onChange={(event) => setUserId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none">
          {users.map((user) => (
            <option key={user.id} value={user.id} className="bg-gray-900">{user.name} — {user.storageUsed.toFixed(1)} GB used</option>
          ))}
        </select>
        <label className="block text-sm font-semibold text-white">New allocation (GB)</label>
        <input value={newAllocation} onChange={(event) => setNewAllocation(event.target.value)} type="number" min="1" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
        <label className="block text-sm font-semibold text-white">Reason</label>
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" placeholder="Explain why this allocation is changing..." />
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-gray-300">
          <input checked={notify} onChange={(event) => setNotify(event.target.checked)} type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-blue-600" />
          Notify user by email
        </label>
        {selectedUsers.length > 1 && <p className="text-xs text-amber-300">Bulk selection detected. This form applies to the first selected user; use the page bulk panel for all selected users.</p>}
      </div>
    </Modal>
  );
};

export default StorageReassignmentModal;
