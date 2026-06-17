import AdminSidebar from './AdminSidebar';
import DashboardNavbar from '../../componets/DashboardNavbar';
import Footer from '../../componets/Footer';
import { useMobileMenu } from '../../hooks/useMobileMenu';
import SkipLink from '../../components/SkipLink';

const AdminLayout = ({ children, title = 'Admin' }) => {
  const mobileMenu = useMobileMenu();

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <SkipLink />
      <AdminSidebar
        isMobileMenuOpen={mobileMenu.isOpen}
        closeMobileMenu={mobileMenu.close}
      />

      <main
        id="main-content"
        className={`flex-1 flex flex-col transition-all duration-300 ${mobileMenu.isOpen ? 'ml-0' : ''} lg:ml-64`}
        tabIndex={-1}
      >
        <DashboardNavbar
          onMenuToggle={mobileMenu.toggle}
          isMobileMenuOpen={mobileMenu.isOpen}
          title={title}
        />

        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 md:space-y-8 pb-safe">
          {children}
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;
