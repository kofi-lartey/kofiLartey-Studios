import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
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