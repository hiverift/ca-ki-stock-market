import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import MyCourses from "./MyCourses";

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hide sidebar on full-width pages
  useEffect(() => {
    const fullWidthRoutes = ["/user-dashboard/my-courses"]; // Add more full-width routes if needed
    setSidebarOpen(!fullWidthRoutes.includes(location.pathname));
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

      {/* Main content */}
      <div
        className="flex-1 flex flex-col overflow-auto transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? (window.innerWidth >= 768 ? "16rem" : 0) : 0,
        }}
      >
        <main className="flex-1 p-4 md:p-6">
          <MyCourses />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
