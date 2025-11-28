import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterIcon,
  PresentationChartLineIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("admin");
    setIsLoggedIn(!!token);
    setIsAdmin(!!adminToken);
  }, []);

  const handleLogout = () => {
    [
      "accessToken",
      "refreshToken",
      "user",
      "userId",
      "admin",
      "adminId",
    ].forEach((key) => localStorage.removeItem(key));

    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
    setIsOpen(false);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
      path: "/user-dashboard",
    },
    {
      name: "My Courses",
      icon: <BookOpenIcon className="h-5 w-5" />,
      path: "/user-dashboard/my-courses",
    },
    {
      name: "My Appointment",
      icon: <ChatBubbleBottomCenterIcon className="h-5 w-5" />,
      path: "/user-dashboard/my-consultations",
    },
    {
      name: "My Webinars",
      icon: <PresentationChartLineIcon className="h-5 w-5" />,
      path: "/user-dashboard/my-webinars",
    },
    {
      name: "KYC Submit",
      icon: <PresentationChartLineIcon className="h-5 w-5" />,
      path: "/user-dashboard/profile-kyc",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-yellow-400 rounded-md text-white shadow-md"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-md z-40 
        w-64 flex flex-col py-6 px-4
        transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        md:transform-none
        transition-transform duration-300 md:duration-0`}
      >
        <div className="flex-1 overflow-y-auto">
          <h1
            className="text-xl mb-8 cursor-pointer font-bold"
            onClick={() => navigate("/user-dashboard")}
          >
            CA ki Stock Market
          </h1>

          <nav className="flex flex-col gap-4">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsOpen(false); // close only on mobile
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-3 rounded-md transition font-medium ${
                    isActive
                      ? "bg-yellow-200 text-black"
                      : "text-gray-700 hover:bg-yellow-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-blue-100 transition text-blue-600 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-red-100 transition text-red-600 font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
