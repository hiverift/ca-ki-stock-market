import React, { useState } from "react";
import Sidebar from "../../src/userdashboard/SideBar";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // start open on desktop

  return (
   <div className="flex min-h-screen">
  <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

  <div
    className={`flex-1 transition-all duration-300 p-6 ${
      isSidebarOpen ? "md:ml-64" : "md:ml-0"
    }`}
  >
    <Outlet />
  </div>
</div>

  );
};

export default UserDashboard;
