import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UsersIcon,
  FolderIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  Bars3Icon,
  XMarkIcon,

  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import PremiumAppointments from "./PremiumAppointments";
import PremiumWebinars from "./PremiumWebinars";
const AdminSideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="h-5 w-5" />, path: "/admin-dashboard" },
    { name: "Courses", icon: <BookOpenIcon className="h-5 w-5" />, path: "/admin-dashboard/courses" },
    { name: "Webinars", icon: <PresentationChartLineIcon className="h-5 w-5" />, path: "/admin-dashboard/webinars" },
    { name: "Appointments", icon: <CalendarDaysIcon className="h-5 w-5" />, path: "/admin-dashboard/appointments" },
    { name: "Services", icon: <CreditCardIcon className="h-5 w-5" />, path: "/admin-dashboard/services" },
    // { name: "Payments", icon: <CreditCardIcon className="h-5 w-5" />, path: "/admin-dashboard/payments" },
    { name: "order", icon: <UsersIcon className="h-5 w-5" />, path: "/admin-dashboard/Adminorder" },
    { name: "User Management", icon: <UsersIcon className="h-5 w-5" />, path: "/admin-dashboard/user-management" },
    { name: "KYC", icon: <UsersIcon className="h-5 w-5" />, path: "/admin-dashboard/kyc-verification" },

    { name: "Premium Webinars", icon: <PresentationChartLineIcon className="h-5 w-5" />, path: "/admin-dashboard/premium-webinars" },
    { name: "Premium Courses", icon: <BookOpenIcon className="h-5 w-5" />, path: "/admin-dashboard/premium-courses" },
    { name: "Premium Appointments", icon: <CalendarDaysIcon className="h-5 w-5" />, path: "/admin-dashboard/premium-appointments" },

  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/admin-dashboard/adminProfile");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-yellow-400 rounded-md text-white shadow-md"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:w-64 w-64 flex flex-col py-6 px-4`}
      >
        <div className="flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Admin Panel</h1>

          <nav className="flex flex-col gap-2">
            {/* Main Menu */}
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-3 rounded-md transition font-medium ${isActive ? " text-black" : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}

            {/* Categories Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center justify-between w-full gap-3 py-2 px-3 rounded-md text-gray-700 hover:bg-yellow-100 font-medium transition"
              >
                <span className="flex items-center gap-3">
                  <FolderIcon className="h-5 w-5" />
                  Categories
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                />
              </button>

              {categoryOpen && (
                <div className="ml-6 mt-1 flex flex-col gap-1 bg-gray-50 rounded-md shadow-inner p-2">
                  <NavLink
                    to="/admin-dashboard/CategorySection"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `py-1.5 px-3 rounded-md text-sm transition ${
                        isActive ? "bg-yellow-200 text-black" : "text-gray-600 hover:bg-yellow-100"
                      }`
                    }
                  >
                    Add Category 
                  </NavLink>
                  <NavLink
                    to="/admin-dashboard/SubcategorySection"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `py-1.5 px-3 rounded-md text-sm transition ${
                        isActive ? "bg-yellow-200 text-black" : "text-gray-600 hover:bg-yellow-100"
                      }`
                    }
                  >
                  AddSubcategory
                  </NavLink>
                </div>
              )}
            </div> */}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => {
              handleEditProfile();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-yellow-100 transition text-gray-700 font-medium"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-red-100 transition text-red-600 font-medium"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSideBar;
