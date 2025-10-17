import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import axios from "axios";
import config from "../pages/config";

const AdminProfile = () => {
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user")); 
  const userId = storedUser?._id;

  const [adminProfile, setAdminProfile] = useState({
    _id: userId || "",
    name: storedUser?.name || "",     
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    password: "",
  });

  // ✅ Fetch the latest admin data from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminProfile(res.data.result);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    if (token && userId) fetchProfile();
  }, [token, userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    try {
      const res = await axios.patch(
        `${config.BASE_URL}users/${adminProfile._id}`,
        {
          name: adminProfile.name,
          email: adminProfile.email,
          phone: adminProfile.phone,
          password: adminProfile.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Admin Profile Updated!");

      // 👇 Update localStorage instantly after saving
      localStorage.setItem("user", JSON.stringify(res.data.result));
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 container">
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
        <User size={20} /> Admin Profile
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Update or edit admin details below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={adminProfile.name}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={adminProfile.email}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={adminProfile.phone}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={adminProfile.password}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleProfileSave}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-yellow-500 text-white font-semibold shadow-lg transition-all"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
