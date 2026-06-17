import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminProtectedRoute from './Admin/AdminProtectedRoute';
import AdminAnalytics from './Admin/pages/Analytics';
import AdminQuickActions from './Admin/pages/QuickActions';
import AdminAllUsers from './Admin/pages/AllUsers';
import AdminRolesPermissions from './Admin/pages/RolesPermissions';
import AdminActivityLogs from './Admin/pages/ActivityLogs';
import AdminStorageManagement from './Admin/pages/StorageManagement';
import AdminUserReports from './Admin/pages/UserReports';
import AdminImageGallery from './Admin/pages/ImageGallery';
import AdminFeaturedImages from './Admin/pages/FeaturedImages';
import AdminBlogManagement from './Admin/pages/BlogManagement';
import AdminCategoriesTags from './Admin/pages/CategoriesTags';
import AdminPendingApproval from './Admin/pages/PendingApproval';
import AdminReportedContent from './Admin/pages/ReportedContent';
import AdminPaymentDashboard from './Admin/pages/PaymentDashboard';
import AdminPaymentHistory from './Admin/pages/PaymentHistory';
import AdminPaymentGeneration from './Admin/pages/PaymentGeneration';
import AdminPriceListManagement from './Admin/pages/PriceListManagement';
import AdminCouponGeneration from './Admin/pages/CouponGeneration';
import AdminRevenueAnalytics from './Admin/pages/RevenueAnalytics';
import AdminRealtimeActivity from './Admin/pages/RealtimeActivity';
import AdminSystemAlerts from './Admin/pages/SystemAlerts';
import AdminPerformanceMonitor from './Admin/pages/PerformanceMonitor';
import AdminErrorLogs from './Admin/pages/ErrorLogs';
import AdminGeneralSettings from './Admin/pages/GeneralSettings';
import AdminSecuritySettings from './Admin/pages/SecuritySettings';
import AdminStorageSettings from './Admin/pages/StorageSettings';
import AdminAPISettings from './Admin/pages/APISettings';
import AdminEmailSettings from './Admin/pages/EmailSettings';
import AdminIntegrationSettings from './Admin/pages/IntegrationSettings';
import AdminBackupRestore from './Admin/pages/BackupRestore';
import AdminPreferences from './Admin/pages/AdminPreferences';
import AdminAnnouncements from './Admin/pages/Announcements';
import AdminUserMessaging from './Admin/pages/UserMessaging';
import AdminFeedbackSupport from './Admin/pages/FeedbackSupport';
import AdminMobileAppManagement from './Admin/pages/MobileAppManagement';
import AdminMultiLanguage from './Admin/pages/MultiLanguage';
import AdminCustomReports from './Admin/pages/CustomReports';
import AdminDataMigration from './Admin/pages/DataMigration';
import AdminMaintenanceMode from './Admin/pages/MaintenanceMode';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import Clients from './pages/Client';
import ClientGallery from './pages/ClientGallery';
import Registration from './pages/Registration';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import ComingSoon from './pages/ComingSoon';
import ViewDemo from './pages/ViewDemo';
import Slideshow from './pages/Slideshow';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import APIDocumentation from './pages/APIDocumentation';
import PressKit from './pages/PressKit';
import { useEffect } from 'react';
import { useLoading } from './context/LoadingContext';
import ResendVerification from './pages/ResendVerification';
import InstallButton from './components/InstallButton';
import ClientInstallPrompt from './components/ClientInstallPrompt';

const NavigationListener = () => {
  const location = useLocation();
  const { finishLoading, isLoading } = useLoading();

  useEffect(() => {
    if (!isLoading) return;

    finishLoading();
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <NavigationListener />
      <div className="antialiased selection:bg-indigo-500/30 selection:text-white bg-[#050505] min-h-screen">
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          {/* Studio Core (Protected) */}
          <Route 
            path="/dashboard" 
            element={
              <ErrorBoundary>
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              </ErrorBoundary>
            } 
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ErrorBoundary>
                <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
              </ErrorBoundary>
            } 
          />
          <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
          <Route path="/admin/quick-actions" element={<AdminProtectedRoute><AdminQuickActions /></AdminProtectedRoute>} />
          <Route path="/admin/all-users" element={<AdminProtectedRoute><AdminAllUsers /></AdminProtectedRoute>} />
          <Route path="/admin/roles-permissions" element={<AdminProtectedRoute><AdminRolesPermissions /></AdminProtectedRoute>} />
          <Route path="/admin/activity-logs" element={<AdminProtectedRoute><AdminActivityLogs /></AdminProtectedRoute>} />
          <Route path="/admin/storage-management" element={<AdminProtectedRoute><AdminStorageManagement /></AdminProtectedRoute>} />
          <Route path="/admin/user-reports" element={<AdminProtectedRoute><AdminUserReports /></AdminProtectedRoute>} />
          <Route path="/admin/image-gallery" element={<AdminProtectedRoute><AdminImageGallery /></AdminProtectedRoute>} />
          <Route path="/admin/featured-images" element={<AdminProtectedRoute><AdminFeaturedImages /></AdminProtectedRoute>} />
          <Route path="/admin/blog-management" element={<AdminProtectedRoute><AdminBlogManagement /></AdminProtectedRoute>} />
          <Route path="/admin/categories-tags" element={<AdminProtectedRoute><AdminCategoriesTags /></AdminProtectedRoute>} />
          <Route path="/admin/pending-approval" element={<AdminProtectedRoute><AdminPendingApproval /></AdminProtectedRoute>} />
          <Route path="/admin/reported-content" element={<AdminProtectedRoute><AdminReportedContent /></AdminProtectedRoute>} />
          <Route path="/admin/payment-dashboard" element={<AdminProtectedRoute><AdminPaymentDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/payment-history" element={<AdminProtectedRoute><AdminPaymentHistory /></AdminProtectedRoute>} />
          <Route path="/admin/payment-generation" element={<AdminProtectedRoute><AdminPaymentGeneration /></AdminProtectedRoute>} />
          <Route path="/admin/price-list-management" element={<AdminProtectedRoute><AdminPriceListManagement /></AdminProtectedRoute>} />
          <Route path="/admin/coupon-generation" element={<AdminProtectedRoute><AdminCouponGeneration /></AdminProtectedRoute>} />
          <Route path="/admin/revenue-analytics" element={<AdminProtectedRoute><AdminRevenueAnalytics /></AdminProtectedRoute>} />
          <Route path="/admin/realtime-activity" element={<AdminProtectedRoute><AdminRealtimeActivity /></AdminProtectedRoute>} />
          <Route path="/admin/system-alerts" element={<AdminProtectedRoute><AdminSystemAlerts /></AdminProtectedRoute>} />
          <Route path="/admin/performance-monitor" element={<AdminProtectedRoute><AdminPerformanceMonitor /></AdminProtectedRoute>} />
          <Route path="/admin/error-logs" element={<AdminProtectedRoute><AdminErrorLogs /></AdminProtectedRoute>} />
          <Route path="/admin/general-settings" element={<AdminProtectedRoute><AdminGeneralSettings /></AdminProtectedRoute>} />
          <Route path="/admin/security-settings" element={<AdminProtectedRoute><AdminSecuritySettings /></AdminProtectedRoute>} />
          <Route path="/admin/storage-settings" element={<AdminProtectedRoute><AdminStorageSettings /></AdminProtectedRoute>} />
          <Route path="/admin/api-settings" element={<AdminProtectedRoute><AdminAPISettings /></AdminProtectedRoute>} />
          <Route path="/admin/email-settings" element={<AdminProtectedRoute><AdminEmailSettings /></AdminProtectedRoute>} />
          <Route path="/admin/integration-settings" element={<AdminProtectedRoute><AdminIntegrationSettings /></AdminProtectedRoute>} />
          <Route path="/admin/backup-restore" element={<AdminProtectedRoute><AdminBackupRestore /></AdminProtectedRoute>} />
          <Route path="/admin/admin-preferences" element={<AdminProtectedRoute><AdminPreferences /></AdminProtectedRoute>} />
          <Route path="/admin/announcements" element={<AdminProtectedRoute><AdminAnnouncements /></AdminProtectedRoute>} />
          <Route path="/admin/user-messaging" element={<AdminProtectedRoute><AdminUserMessaging /></AdminProtectedRoute>} />
          <Route path="/admin/feedback-support" element={<AdminProtectedRoute><AdminFeedbackSupport /></AdminProtectedRoute>} />
          <Route path="/admin/mobile-app-management" element={<AdminProtectedRoute><AdminMobileAppManagement /></AdminProtectedRoute>} />
          <Route path="/admin/multi-language" element={<AdminProtectedRoute><AdminMultiLanguage /></AdminProtectedRoute>} />
          <Route path="/admin/custom-reports" element={<AdminProtectedRoute><AdminCustomReports /></AdminProtectedRoute>} />
          <Route path="/admin/data-migration" element={<AdminProtectedRoute><AdminDataMigration /></AdminProtectedRoute>} />
          <Route path="/admin/maintenance-mode" element={<AdminProtectedRoute><AdminMaintenanceMode /></AdminProtectedRoute>} />
          <Route 
            path="/galleries" 
            element={
              <ErrorBoundary>
                <ProtectedRoute><Gallery /></ProtectedRoute>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <ErrorBoundary>
                <ProtectedRoute><Clients /></ProtectedRoute>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ErrorBoundary>
                <ProtectedRoute><Settings /></ProtectedRoute>
              </ErrorBoundary>
            } 
          />

          {/* Client Gallery Access - NOT PROTECTED - Public accessible with access key */}
          <Route path="/clientGallery" element={<ClientGallery />} />
          <Route path="/clientGallery/slideshow" element={<Slideshow />} />

          {/* Legacy routes - keep for backward compatibility */}
          <Route path="/clientGallery/:galleryName/:galleryId" element={<ClientGallery />} />
          <Route path="/clientGallery/:galleryName/:galleryId/slideshow" element={<Slideshow />} />
          <Route path="/clientGallery/:galleryID" element={<ClientGallery />} />
          <Route path="/clientGallery/:galleryID/slideshow" element={<Slideshow />} />

          {/* Protected Slideshow for authenticated users */}
          <Route 
            path="/slideshow" 
            element={
              <ErrorBoundary>
                <ProtectedRoute><Slideshow isOpen={true} onClose={() => window.history.back()} /></ProtectedRoute>
              </ErrorBoundary>
            } 
          />

          {/* Misc */}
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/view-demo" element={<ViewDemo />} />

          {/* Legal & Utility Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/api-docs" element={<APIDocumentation />} />
          <Route path="/press" element={<PressKit />} />
        </Routes>
        <InstallButton />
        <ClientInstallPrompt />
      </div>
    </AuthProvider>
  );
}

export default App;