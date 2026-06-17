import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiArrowUp, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import StatsCard from '../components/StatsCard';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatPercent } from '../utils/formatters';

const FeaturedImages = () => {
  const admin = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', startDate: '', endDate: '' });

  const totalViews = admin.data.featuredImages.reduce((sum, item) => sum + item.views, 0);
  const totalEngagements = admin.data.featuredImages.reduce((sum, item) => sum + item.engagements, 0);
  const averageCtr = admin.data.featuredImages.length ? admin.data.featuredImages.reduce((sum, item) => sum + item.ctr, 0) / admin.data.featuredImages.length : 0;

  const move = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= admin.data.featuredImages.length) return;
    const next = [...admin.data.featuredImages];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    admin.updateData('featuredImages', next);
  };

  const addFeatured = () => {
    if (!form.title || !form.url) return;
    admin.updateData('featuredImages', (current) => [{ id: `feat_${Date.now()}`, imageId: `img_${Date.now()}`, title: form.title, url: form.url, startDate: form.startDate || new Date().toISOString().slice(0, 10), endDate: form.endDate || '2026-07-31', views: 0, engagements: 0, ctr: 0 }, ...current]);
    setForm({ title: '', url: '', startDate: '', endDate: '' });
    setModalOpen(false);
    admin.showToast('Featured image added.');
  };

  return (
    <AdminLayout title="Featured Images">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Featured Images</h1>
            <p className="mt-2 text-sm text-gray-400">Reorder featured content, schedule feature windows, and review performance.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add image</button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Featured views" value={totalViews.toLocaleString()} icon={FiStar} tone="blue" />
        <StatsCard title="Engagements" value={totalEngagements.toLocaleString()} icon={FiStar} tone="purple" />
        <StatsCard title="Average CTR" value={formatPercent(averageCtr, 1)} icon={FiStar} tone="emerald" />
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {admin.data.featuredImages.map((image, index) => (
          <motion.div key={image.id} layout className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
            <img src={image.url} alt={image.title} className="h-auto w-full object-cover" />
            <div className="space-y-4 p-4">
              <div>
                <h3 className="font-semibold text-white">{image.title}</h3>
                <p className="text-xs text-gray-500">{image.startDate} → {image.endDate}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-lg font-bold text-white">{image.views}</p><p className="text-xs text-gray-500">Views</p></div>
                <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-lg font-bold text-white">{image.engagements}</p><p className="text-xs text-gray-500">Clicks</p></div>
                <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-lg font-bold text-white">{formatPercent(image.ctr, 1)}</p><p className="text-xs text-gray-500">CTR</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button disabled={index === 0} onClick={() => move(index, -1)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-white/[0.06]"><FiArrowUp className="inline mr-1" size={14} />Up</button>
                <button disabled={index === admin.data.featuredImages.length - 1} onClick={() => move(index, 1)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-white/[0.06]"><FiArrowDown className="inline mr-1" size={14} />Down</button>
                <button onClick={() => { admin.updateData('featuredImages', (items) => items.filter((item) => item.id !== image.id)); admin.showToast('Featured image removed.', 'warning'); }} className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"><FiTrash2 className="inline mr-1" size={14} />Remove</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} title="Add featured image" onClose={() => setModalOpen(false)} size="md" footer={
        <>
          <button onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
          <button onClick={addFeatured} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Add featured image</button>
        </>
      }>
        <div className="space-y-4">
          <label className="block space-y-2 text-sm font-semibold text-white">Title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="block space-y-2 text-sm font-semibold text-white">Image URL<input value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm font-semibold text-white">Start date<input value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            <label className="block space-y-2 text-sm font-semibold text-white">End date<input value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          </div>
        </div>
      </Modal>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default FeaturedImages;
