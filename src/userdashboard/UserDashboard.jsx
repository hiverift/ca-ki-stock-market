import React from "react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet /> {/* Nested routes render here */}
      </div>
    </div>
  );
};

export default UserDashboard;
