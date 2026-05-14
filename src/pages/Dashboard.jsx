import React, { useState, useCallback } from 'react';
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import ImageUploadZone from "../components/ImageUploadZone";
import RecentUploads from "../components/RecentUploads";
import { useMobileMenu } from "../hooks/useMobileMenu";
import SkipLink from "../components/SkipLink";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const mobileMenu = useMobileMenu();

  const handleUploadComplete = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleGalleryChange = useCallback((gallery) => {
    console.log('🎯 Gallery changed in Dashboard:', gallery);
    setSelectedGallery(gallery);
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Skip to main content link for accessibility */}
      <SkipLink />

      {/* Sidebar with mobile menu props */}
      <Sidebar 
        isMobileMenuOpen={mobileMenu.isOpen} 
        closeMobileMenu={mobileMenu.close} 
      />
      
      {/* Main content area - responsive margin */}
      <main 
        id="main-content"
        className={`flex-1 flex flex-col transition-all duration-300 ${mobileMenu.isOpen ? 'ml-0' : ''} lg:ml-64`}
        tabIndex={-1}
      >
        <DashboardNavbar onMenuToggle={mobileMenu.toggle} isMobileMenuOpen={mobileMenu.isOpen} />
        
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8 md:space-y-12 pb-safe">
          <section aria-label="Upload images">
            <ImageUploadZone 
              onUploadComplete={handleUploadComplete}
              onGalleryChange={handleGalleryChange}
              galleryName={selectedGallery?.name}
              galleryId={selectedGallery?.galleryId}
            />
          </section>

          <section aria-label="Recent uploads">
            <RecentUploads 
              refreshTrigger={refreshKey}
              selectedGallery={selectedGallery}
            />
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;