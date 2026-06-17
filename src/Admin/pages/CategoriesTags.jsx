import { useState } from 'react';
import { FiPlus, FiTag, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const CategoriesTags = () => {
  const admin = useAdmin();
  const [categoryName, setCategoryName] = useState('');
  const [categoryParent, setCategoryParent] = useState('');
  const [tagName, setTagName] = useState('');

  const addCategory = () => {
    if (!categoryName.trim()) return;
    admin.updateData('categories', (categories) => [...categories, { id: `cat_${Date.now()}`, name: categoryName.trim(), parent: categoryParent || null, color: '#3b82f6' }]);
    setCategoryName('');
    setCategoryParent('');
    admin.showToast('Category created.');
  };

  const deleteCategory = (id) => {
    admin.updateData('categories', (categories) => categories.filter((category) => category.id !== id));
    admin.showToast('Category deleted.', 'warning');
  };

  const addTag = () => {
    if (!tagName.trim()) return;
    admin.updateData('tags', (tags) => [...tags, { id: `tag_${Date.now()}`, name: tagName.trim(), count: 0 }]);
    setTagName('');
    admin.showToast('Tag created.');
  };

  const deleteTag = (id) => {
    admin.updateData('tags', (tags) => tags.filter((tag) => tag.id !== id));
    admin.showToast('Tag deleted.', 'warning');
  };

  return (
    <AdminLayout title="Categories & Tags">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories & Tags</h1>
          <p className="mt-2 text-sm text-gray-400">Organize posts and images with categories, tags, and assignments.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Categories</h2>
            <Badge tone="purple">{admin.data.categories.length} categories</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="New category" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <select value={categoryParent} onChange={(event) => setCategoryParent(event.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none">
              <option value="" className="bg-gray-900">No parent</option>
              {admin.data.categories.map((category) => <option key={category.id} value={category.id} className="bg-gray-900">{category.name}</option>)}
            </select>
          </div>
          <button onClick={addCategory} className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add category</button>
          <div className="mt-5 space-y-3">
            {admin.data.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] p-3">
                <div>
                  <p className="font-semibold text-white">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.parent ? `Parent: ${admin.data.categories.find((item) => item.id === category.parent)?.name || category.parent}` : 'Top level'}</p>
                </div>
                <button onClick={() => deleteCategory(category.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-300"><FiTrash2 size={17} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Tags</h2>
            <Badge tone="blue">{admin.data.tags.length} tags</Badge>
          </div>
          <div className="mt-5 flex gap-3">
            <input value={tagName} onChange={(event) => setTagName(event.target.value)} placeholder="New tag" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
            <button onClick={addTag} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus size={18} /></button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {admin.data.tags.map((tag) => (
              <span key={tag.id} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-gray-300">
                <FiTag size={14} />
                {tag.name}
                <button onClick={() => deleteTag(tag.id)} className="rounded-full p-1 hover:bg-white/10"><FiTrash2 size={13} /></button>
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.04] p-4">
            <h3 className="font-semibold text-white">Assignment preview</h3>
            <p className="mt-2 text-sm text-gray-500">Categories and tags are available for blog posts, images, and gallery collections. Mock assignments are shown in each content editor.</p>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default CategoriesTags;
