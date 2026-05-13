import React, { useState, useCallback } from 'react';
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import ImageUploadZone from "../components/ImageUploadZone";
import RecentUploads from "../components/RecentUploads";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedGallery, setSelectedGallery] = useState(null);

  const handleUploadComplete = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleGalleryChange = useCallback((gallery) => {
    console.log('🎯 Gallery changed in Dashboard:', gallery);
    setSelectedGallery(gallery);
    setRefreshKey(prev => prev + 1); // Force refresh of RecentUploads
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <DashboardNavbar />
        
        <div className="p-8 max-w-7xl w-full mx-auto space-y-12">
          <section>
            <ImageUploadZone 
              onUploadComplete={handleUploadComplete}
              onGalleryChange={handleGalleryChange}
              galleryName={selectedGallery?.name}
              galleryId={selectedGallery?.galleryID}
            />
          </section>

          <section>
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