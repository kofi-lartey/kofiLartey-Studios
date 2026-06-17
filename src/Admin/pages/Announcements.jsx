import { useState } from 'react';
import { FiBell, FiPlus } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const Announcements = () => {
  const admin = useAdmin();
  const [form, setForm] = useState({ title: '', message: '', target: 'all', schedule: '' });

  const createAnnouncement = () => {
    if (!form.title || !form.message) return;
    admin.updateData('announcements', (announcements) => [{ id: `ann_${Date.now()}`, ...form, views: 0, clicks: 0, active: true }, ...announcements]);
    setForm({ title: '', message: '', target: 'all', schedule: '' });
    admin.showToast('Announcement created.');
  };

  return (
    <AdminLayout title="Announcements">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Announcements</h1>
            <p className="mt-2 text-sm text-gray-400">Create targeted announcements and review views, clicks, and schedules.</p>
          </div>
          <Badge tone="blue">{admin.data.announcements.length} announcements</Badge>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-white"><FiBell /> <h2 className="text-lg font-bold">Create announcement</h2></div>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2 text-sm font-semibold text-white">Title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Message<textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} rows={6} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Target<select value={form.target} onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="all">All users</option><option value="clients">Clients</option><option value="admins">Admins</option><option value="photographers">Photographers</option></select></label>
            <label className="block space-y-2 text-sm font-semibold text-white">Schedule<input value={form.schedule} onChange={(event) => setForm((current) => ({ ...current, schedule: event.target.value }))} type="datetime-local" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <button onClick={createAnnouncement} className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Publish announcement</button>
          </div>
        </div>

        <div className="space-y-4">
          {admin.data.announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{announcement.message}</p>
                  <p className="mt-3 text-xs text-gray-500">Target: {announcement.target} · {announcement.schedule ? formatDate(announcement.schedule) : 'Immediate'}</p>
                </div>
                <Badge tone={announcement.active ? 'green' : 'gray'}>{announcement.active ? 'active' : 'draft'}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/[0.04] p-3 text-center"><p className="text-xl font-bold text-white">{announcement.views}</p><p className="text-xs text-gray-500">Views</p></div>
                <div className="rounded-xl bg-white/[0.04] p-3 text-center"><p className="text-xl font-bold text-white">{announcement.clicks}</p><p className="text-xs text-gray-500">Clicks</p></div>
                <div className="rounded-xl bg-white/[0.04] p-3 text-center"><p className="text-xl font-bold text-white">{announcement.views ? `${Math.round((announcement.clicks / announcement.views) * 100)}%` : '0%'}</p><p className="text-xs text-gray-500">CTR</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default Announcements;
