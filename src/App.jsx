import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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

function App() {
  return (
    <AuthProvider>
      <div className="antialiased selection:bg-indigo-500/30 selection:text-white bg-[#050505] min-h-screen">
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />

          {/* Studio Core (Protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/galleries" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Gallery & Interactive */}
          <Route path="/clientGallery" element={<ProtectedRoute><ClientGallery /></ProtectedRoute>} />
          // Add this route to your router
          <Route path="/gallery/:galleryName/:galleryId" element={<ClientGallery />} />
          <Route path="/gallery/:galleryName/:galleryId/slideshow" element={<Slideshow />} />
          <Route path="/slideshow" element={<ProtectedRoute><Slideshow isOpen={true} onClose={() => window.history.back()} /></ProtectedRoute>} />

          {/* Misc */}
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/view-demo" element={<ViewDemo />} />

          {/* Legal & Utility Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/api-docs" element={<APIDocumentation />} />
          <Route path="/press" element={<PressKit />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;