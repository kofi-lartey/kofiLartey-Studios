import { useState } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import RichTextEditor from '../components/RichTextEditor';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';

const statusTone = { published: 'green', draft: 'gray', scheduled: 'amber' };

const BlogManagement = () => {
  const admin = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categories: 'Tips',
    tags: 'studio',
    status: 'draft',
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: '', slug: '', content: '', excerpt: '', categories: '', tags: '', status: 'draft', publishDate: '', seoTitle: '', seoDescription: '', seoKeywords: '' });
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setForm({ ...post, categories: post.categories.join(', '), tags: post.tags.join(', ') });
    setModalOpen(true);
  };

  const savePost = () => {
    const payload = {
      ...form,
      id: editingPost?.id || `post_${Date.now()}`,
      categories: form.categories.split(',').map((item) => item.trim()).filter(Boolean),
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean)
    };

    if (editingPost) {
      admin.updateData('blogPosts', (posts) => posts.map((post) => post.id === editingPost.id ? payload : post));
      admin.showToast('Blog post updated.');
    } else {
      admin.updateData('blogPosts', (posts) => [payload, ...posts]);
      admin.showToast('Blog post created.');
    }
    setModalOpen(false);
  };

  const deletePost = (id) => {
    admin.updateData('blogPosts', (posts) => posts.filter((post) => post.id !== id));
    admin.showToast('Blog post deleted.', 'warning');
  };

  return (
    <AdminLayout title="Blog Management">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Blog Management</h1>
            <p className="mt-2 text-sm text-gray-400">Create, edit, preview, schedule, and optimize blog posts.</p>
          </div>
          <button onClick={openCreate} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />New post</button>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-4 font-semibold">Post</th>
                <th className="px-4 py-4 font-semibold hidden md:table-cell">Categories</th>
                <th className="px-4 py-4 font-semibold hidden sm:table-cell">Status</th>
                <th className="px-4 py-4 font-semibold hidden lg:table-cell">Publish date</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {admin.data.blogPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.excerpt}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell"><span className="text-sm text-gray-300">{post.categories.join(', ')}</span></td>
                  <td className="px-4 py-4 hidden sm:table-cell"><Badge tone={statusTone[post.status] || 'gray'}>{post.status}</Badge></td>
                  <td className="px-4 py-4 hidden lg:table-cell text-sm text-gray-400">{post.publishDate || 'Unscheduled'}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300"><FiEye size={17} /></button>
                      <button onClick={() => openEdit(post)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-300"><FiEdit size={17} /></button>
                      <button onClick={() => deletePost(post.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-300"><FiTrash2 size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} title={editingPost ? 'Edit blog post' : 'Create blog post'} onClose={() => setModalOpen(false)} size="xl" footer={
        <>
          <button onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]">Cancel</button>
          <button onClick={savePost} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Save post</button>
        </>
      }>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-white">Title<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="space-y-2 text-sm font-semibold text-white">Slug<input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="space-y-2 text-sm font-semibold text-white">Excerpt<textarea value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="space-y-2 text-sm font-semibold text-white">Status<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></label>
          <label className="space-y-2 text-sm font-semibold text-white">Publish date<input value={form.publishDate} onChange={(event) => setForm((current) => ({ ...current, publishDate: event.target.value }))} type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="space-y-2 text-sm font-semibold text-white">Categories<input value={form.categories} onChange={(event) => setForm((current) => ({ ...current, categories: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="space-y-2 text-sm font-semibold text-white">Tags<input value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="space-y-2 text-sm font-semibold text-white">SEO title<input value={form.seoTitle} onChange={(event) => setForm((current) => ({ ...current, seoTitle: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="col-span-full space-y-2 text-sm font-semibold text-white">SEO description<textarea value={form.seoDescription} onChange={(event) => setForm((current) => ({ ...current, seoDescription: event.target.value }))} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <label className="col-span-full space-y-2 text-sm font-semibold text-white">SEO keywords<input value={form.seoKeywords} onChange={(event) => setForm((current) => ({ ...current, seoKeywords: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
          <div className="col-span-full"><RichTextEditor value={form.content} onChange={(content) => setForm((current) => ({ ...current, content }))} /></div>
        </div>
      </Modal>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default BlogManagement;
