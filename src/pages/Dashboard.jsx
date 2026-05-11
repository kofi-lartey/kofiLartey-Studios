import React, { useState } from 'react';
import { FiUpload, FiGrid, FiList } from "react-icons/fi";
import Sidebar from "../componets/Sidebar";
import DashboardNavbar from "../componets/DashboardNavbar";
import Footer from "../componets/Footer";
import ImageUploadZone from "../components/ImageUploadZone";
import RecentUploads from "../components/RecentUploads";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <DashboardNavbar />
        
        <div className="p-8 max-w-7xl w-full mx-auto space-y-12">
          {/* Upload Zone */}
          <section>
            <ImageUploadZone onUploadComplete={handleUploadComplete} />
          </section>

          {/* Recent Uploads Section */}
          <section>
            <RecentUploads refreshTrigger={refreshKey} />
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;