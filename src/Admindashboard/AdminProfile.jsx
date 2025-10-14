import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";
import config from "../pages/config"; // ✅ BASE_URL from config.js

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const token = localStorage.getItem("token"); // ✅ Token from localStorage
  const userId= localStorage.getItem('user');

  // ✅ Profile GET API call
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}users/${userId._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         console.log('hii',res)
        // ✅ assume response.data.result me user data aata h
        setAdminProfile(res.data.result);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  

  // ✅ Input change handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Profile Update API call
  const handleProfileSave = async () => {
    try {
      const res = await axios.patch(
        `${config.BASE_URL}users/${adminProfile._id}`, // ✅ userId dynamic
        {
          name: adminProfile.name,
          email: adminProfile.email,
          phone: adminProfile.phone,
          password: adminProfile.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Updated Admin Profile:", res.data);
      alert("✅ Admin Profile Updated!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 container">
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
        <User size={20} /> Admin Profile
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Update or edit admin details below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={adminProfile.name}
            onChange={handleProfileChange}
            placeholder="Enter full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={adminProfile.email}
            onChange={handleProfileChange}
            placeholder="Enter email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={adminProfile.phone}
            onChange={handleProfileChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={adminProfile.password}
            onChange={handleProfileChange}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleProfileSave}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium shadow-md transition-all"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
