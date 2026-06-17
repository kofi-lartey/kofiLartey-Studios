import { useMemo, useState } from 'react';
import { FiDownload, FiUpload } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import BulkActions from '../components/BulkActions';
import FilterDropdown from '../components/FilterDropdown';
import MasonryGrid from '../components/MasonryGrid';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';

const ImageGallery = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('image-gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  const categories = ['all', ...Array.from(new Set(admin.data.images.map((image) => image.category)))];
  const filteredImages = useMemo(() => {
    return admin.data.images.filter((image) => {
      const matchesSearch = [image.title, image.category, image.user].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [admin.data.images, searchTerm, categoryFilter]);

  const toggleSelect = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const featureSelected = () => {
    admin.updateData('featuredImages', (featured) => [
      ...selectedIds.map((imageId) => {
        const image = admin.data.images.find((item) => item.id === imageId);
        return image ? { id: `feat_${Date.now()}`, imageId, title: image.title, url: image.url, startDate: new Date().toISOString().slice(0, 10), endDate: '2026-07-31', views: 0, engagements: 0, ctr: 0 } : null;
      }).filter(Boolean),
      ...featured
    ]);
    admin.showToast('Selected images featured.');
    setSelectedIds([]);
  };

  return (
    <AdminLayout title="Image Gallery">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Image Gallery</h1>
            <p className="mt-2 text-sm text-gray-400">Filter, select, feature, delete, and export gallery media.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => exportCSV(filteredImages)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />CSV</button>
            <button onClick={() => exportJSON({ images: filteredImages })} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiUpload className="inline mr-2" size={16} />Upload mock image</button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search images by title, category, or owner..." />
          <FilterDropdown label="Category" value={categoryFilter} onChange={setCategoryFilter} options={categories.map((category) => ({ value: category, label: category === 'all' ? 'All categories' : category }))} />
        </div>
      </section>

      {selectedIds.length > 0 && <BulkActions selectedCount={selectedIds.length} actions={[{ label: 'Feature selected', onClick: featureSelected, tone: 'blue' }, { label: 'Delete selected', onClick: () => { admin.updateData('images', (images) => images.filter((image) => !selectedIds.includes(image.id))); setSelectedIds([]); admin.showToast('Selected images deleted.'); }, tone: 'danger' }]} />}

      <MasonryGrid images={filteredImages} selectedIds={selectedIds} onToggleSelect={toggleSelect} onFeature={(id) => { const image = admin.data.images.find((item) => item.id === id); if (!image) return; admin.updateData('featuredImages', (featured) => [{ id: `feat_${Date.now()}`, imageId: id, title: image.title, url: image.url, startDate: new Date().toISOString().slice(0, 10), endDate: '2026-07-31', views: 0, engagements: 0, ctr: 0 }, ...featured]); admin.showToast('Image featured.'); }} onDelete={(id) => { admin.updateData('images', (images) => images.filter((image) => image.id !== id)); admin.showToast('Image deleted.', 'warning'); }} />
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default ImageGallery;
