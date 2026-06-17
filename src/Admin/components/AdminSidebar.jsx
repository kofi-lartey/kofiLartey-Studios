import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiActivity,
  FiAlertCircle,
  FiAlertTriangle,
  FiBarChart2,
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClipboard,
  FiClock,
  FiCloud,
  FiCode,
  FiCreditCard,
  FiDatabase,
  FiDollarSign,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiHeart,
  FiImage,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiMonitor,
  FiPhone,
  FiPieChart,
  FiPlus,
  FiRefreshCw,
  FiLogOut,
  FiSave,
  FiSettings,
  FiShield,
  FiSliders,
  FiStar,
  FiTag,
  FiTool,
  FiTrendingUp,
  FiUsers,
  FiX,
  FiZap
} from 'react-icons/fi';
import { logoutMockAdmin } from '../utils/mockAdminAuth';

const sections = [
  {
    title: 'DASHBOARD',
    items: [
      { label: 'Dashboard', path: '/admin', icon: FiGrid },
      { label: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
      { label: 'Quick Actions', path: '/admin/quick-actions', icon: FiZap, badge: 'New' }
    ]
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { label: 'All Users', path: '/admin/all-users', icon: FiUsers },
      { label: 'Roles & Permissions', path: '/admin/roles-permissions', icon: FiShield },
      { label: 'Activity Logs', path: '/admin/activity-logs', icon: FiClock },
      { label: 'Storage Management', path: '/admin/storage-management', icon: FiDatabase },
      { label: 'User Reports', path: '/admin/user-reports', icon: FiFileText }
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Image Gallery', path: '/admin/image-gallery', icon: FiImage },
      { label: 'Featured Images', path: '/admin/featured-images', icon: FiStar },
      { label: 'Blog', path: '/admin/blog-management', icon: FiBookOpen },
      { label: 'Categories & Tags', path: '/admin/categories-tags', icon: FiTag },
      { label: 'Pending Approval', path: '/admin/pending-approval', icon: FiCheckCircle },
      { label: 'Reported Content', path: '/admin/reported-content', icon: FiAlertTriangle }
    ]
  },
  {
    title: 'PAYMENTS',
    items: [
      { label: 'Payment Dashboard', path: '/admin/payment-dashboard', icon: FiDollarSign },
      { label: 'Payment History', path: '/admin/payment-history', icon: FiCreditCard },
      { label: 'Payment Generation', path: '/admin/payment-generation', icon: FiPlus },
      { label: 'Price List', path: '/admin/price-list-management', icon: FiPieChart },
      { label: 'Coupons', path: '/admin/coupon-generation', icon: FiTag },
      { label: 'Revenue Analytics', path: '/admin/revenue-analytics', icon: FiTrendingUp }
    ]
  },
  {
    title: 'MONITORING',
    items: [
      { label: 'Activity Monitor', path: '/admin/realtime-activity', icon: FiMonitor },
      { label: 'System Alerts', path: '/admin/system-alerts', icon: FiBell },
      { label: 'Performance', path: '/admin/performance-monitor', icon: FiActivity },
      { label: 'Error Logs', path: '/admin/error-logs', icon: FiAlertCircle }
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { label: 'General', path: '/admin/general-settings', icon: FiSettings },
      { label: 'Security', path: '/admin/security-settings', icon: FiLock },
      { label: 'Storage', path: '/admin/storage-settings', icon: FiCloud },
      { label: 'API', path: '/admin/api-settings', icon: FiCode },
      { label: 'Email', path: '/admin/email-settings', icon: FiMail },
      { label: 'Integrations', path: '/admin/integration-settings', icon: FiCode },
      { label: 'Backup', path: '/admin/backup-restore', icon: FiSave },
      { label: 'Preferences', path: '/admin/admin-preferences', icon: FiSliders }
    ]
  },
  {
    title: 'COMMUNICATION',
    items: [
      { label: 'Announcements', path: '/admin/announcements', icon: FiBell },
      { label: 'Messages', path: '/admin/user-messaging', icon: FiMessageCircle },
      { label: 'Feedback', path: '/admin/feedback-support', icon: FiHeart }
    ]
  },
  {
    title: 'MORE',
    items: [
      { label: 'Mobile', path: '/admin/mobile-app-management', icon: FiPhone },
      { label: 'Language', path: '/admin/multi-language', icon: FiGlobe },
      { label: 'Reports', path: '/admin/custom-reports', icon: FiClipboard },
      { label: 'Migration', path: '/admin/data-migration', icon: FiRefreshCw },
      { label: 'Maintenance', path: '/admin/maintenance-mode', icon: FiTool }
    ]
  }
];

const SidebarSection = ({ section, activePath, compact, closeMobileMenu }) => {
  const [open, setOpen] = useState(true);
  const Icon = section.items[0]?.icon || FiChevronDown;

  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 hover:text-gray-300"
      >
        <span className="flex items-center gap-2">
          <Icon size={13} />
          <span>{section.title}</span>
        </span>
        {compact ? <FiChevronUp size={13} /> : open ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
      </button>
      {open && (
        <div className="space-y-1">
          {section.items.map((item) => {
            const IconItem = item.icon;
            const isActive = activePath === item.path || (item.path !== '/admin' && activePath.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'}`}
              >
                <span className="flex items-center gap-3">
                  <IconItem size={17} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                  {item.label}
                </span>
                {item.badge && <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-300">{item.badge}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = ({ isMobileMenuOpen, closeMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [compact, setCompact] = useState(false);

  const handleLogout = () => {
    logoutMockAdmin();
    navigate('/admin-login', { replace: true });
  };

  const sidebar = (
    <aside className={`flex h-screen flex-col border-r border-white/5 bg-gray-900 text-gray-300 ${compact ? 'w-64' : 'w-64'}`}>
      <div className="flex items-center justify-between border-b border-white/5 p-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Admin Console</h2>
          <p className="mt-1 text-xs text-gray-500">Studio operations</p>
        </div>
        <button
          onClick={() => setCompact((current) => !current)}
          className="rounded-lg p-2 text-gray-500 hover:bg-white/[0.04] hover:text-white lg:hidden"
          aria-label="Collapse sidebar"
        >
          <FiX size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <SidebarSection key={section.title} section={section} activePath={location.pathname} compact={compact} closeMobileMenu={closeMobileMenu} />
        ))}
      </nav>

      <div className="border-t border-white/5 p-4 space-y-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20"
        >
          <span className="flex items-center gap-3">
            <FiLogOut size={17} />
            Sign Out
          </span>
          <FiChevronDown size={16} />
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-50 hidden lg:flex">{sidebar}</div>
      <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={closeMobileMenu} />
      <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>{sidebar}</div>
    </>
  );
};

export default AdminSidebar;
