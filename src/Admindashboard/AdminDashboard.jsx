import React from "react";
import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
