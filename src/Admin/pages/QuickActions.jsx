import { FiTag, FiBell, FiClipboard, FiUpload, FiStar, FiPlus, FiDownload } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import CalendarWidget from '../components/CalendarWidget';

const toneClasses = {
  blue: 'bg-blue-500/10 text-blue-300 group-hover:bg-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-300 group-hover:bg-purple-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-300 group-hover:bg-cyan-500/20',
  amber: 'bg-amber-500/10 text-amber-300 group-hover:bg-amber-500/20'
};

const actions = [
  { label: 'New Coupon', icon: FiTag, description: 'Create a percentage or fixed discount.', tone: 'blue' },
  { label: 'Send Announcement', icon: FiBell, description: 'Notify all users or a targeted segment.', tone: 'purple' },
  { label: 'Generate Report', icon: FiClipboard, description: 'Export users, payments, or activity.', tone: 'emerald' },
  { label: 'Upload Image', icon: FiUpload, description: 'Add media to the gallery queue.', tone: 'cyan' },
  { label: 'Feature Content', icon: FiStar, description: 'Promote images on the homepage.', tone: 'amber' }
];

const QuickActions = () => (
  <AdminLayout title="Quick Actions">
    <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Quick Actions</h1>
          <p className="mt-2 text-sm text-gray-400">Start common administrative workflows from one place.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
          <FiPlus size={17} />
          Create workflow
        </button>
      </div>
    </section>

    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-white/[0.06]">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClasses[action.tone]}`}>
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-white">{action.label}</h3>
              <p className="mt-2 text-sm text-gray-500">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        <CalendarWidget events={[
          { id: 'evt_001', title: 'Coupon campaign review', date: '2026-06-18', label: 'Finance' },
          { id: 'evt_002', title: 'Featured gallery rotation', date: '2026-06-20', label: 'Content' },
          { id: 'evt_003', title: 'Monthly revenue export', date: '2026-06-30', label: 'Reports' }
        ]} />
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
          <h3 className="text-base font-bold text-white">Export shortcuts</h3>
          <div className="mt-4 grid gap-3">
            <button className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]">User growth report <FiDownload /></button>
            <button className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]">Revenue summary <FiDownload /></button>
            <button className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]">Content inventory <FiDownload /></button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default QuickActions;
