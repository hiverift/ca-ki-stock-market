import React, { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Plus, X } from "lucide-react";
import axios from "axios";
import config from "../pages/config";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Edit, Trash2 } from "lucide-react";

// Centralized constants for pagination
const CONST = {
  ITEMS_PER_PAGE: 10, // Number of users per page
  PAGINATION_MAX_BUTTONS: 5, // Max page buttons to show
  ACTIVE_PAGE_CLASS: "bg-yellow-400 text-black shadow-md scale-105",
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [searchTerm, setSearchTerm] = useState(""); // Search state

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    password: "",
    mobile: "",
  });

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken"); // 🔑 Get token from session
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${config.BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(Array.isArray(res.data.result) ? res.data.result : res.data);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit User
// ✅ Edit User
const handleEditUser = async (user) => {
  Swal.fire({
    title: "Edit User",
    html: `
      <input id="name" class="swal2-input" placeholder="Name" value="${user.name}" />
      <input id="email" class="swal2-input" placeholder="Email" value="${user.email}" />
      <input id="mobile" class="swal2-input" placeholder="Mobile" value="${user.mobile}" />
      <select id="role" class="swal2-input">
        <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
        <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
      </select>
      <select id="status" class="swal2-input">
        <option value="active" ${user.status === "active" ? "selected" : ""}>Active</option>
        <option value="inactive" ${user.status === "inactive" ? "selected" : ""}>Inactive</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Update",
    confirmButtonColor: "#facc15",
    preConfirm: () => {
      return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          Swal.fire("Error", "No token found. Please login again.", "error");
          return;
        }

        const url = `${config.BASE_URL.replace(/\/$/, "")}/users/${user._id}`;

        await axios.put(url, result.value, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire("Updated!", "User details updated successfully.", "success");

        // ✅ Update the users state immediately
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id ? { ...u, ...result.value } : u
          )
        );
      } catch (err) {
        console.error("Error updating user:", err.response?.data || err);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to update user details.",
          "error"
        );
      }
    }
  });
};



  // ✅ Delete User
  const handleDeleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            Swal.fire("Error", "No token found. Please login again.", "error");
            return;
          }

          await axios.delete(`${config.BASE_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
        } catch (err) {
          console.error("Error deleting user:", err);
          Swal.fire("Error", "Failed to delete user.", "error");
        }
      }
    });
  };


  // ✅ Add User
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.password || !newUser.mobile) {
      alert("Please fill in all required fields ❌");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); // 🔑 from session
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      const payload = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role.toLowerCase(),
        status: newUser.status.toLowerCase(),
        mobile: newUser.mobile.trim(),
      };

      await axios.post(`${config.BASE_URL}/users`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("User added successfully ✅");
      setIsAddModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "user",
        status: "active",
        password: "",
        mobile: "",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add user ❌");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Search + Filter
  // ✅ Search + Filter
  const filteredUsers = useMemo(() => {
    const normalize = (str) =>
      (str || "").toLowerCase().replace(/\s+/g, " ").trim();

    const query = normalize(searchTerm);

    return users.filter(
      (user) =>
        normalize(user.name).includes(query) ||
        normalize(user.email).includes(query) ||
        normalize(user.mobile).includes(query)
    );
  }, [users, searchTerm]);


  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CONST.ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));
  const paginatedUsers = useMemo(() => {
    const start = (clampedPage - 1) * CONST.ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + CONST.ITEMS_PER_PAGE);
  }, [filteredUsers, clampedPage]);

  const goTo = (p) => {
    const page = Math.max(1, Math.min(totalPages, p));
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const renderPageButtons = () => {
    const pages = [];
    const maxButtons = CONST.PAGINATION_MAX_BUTTONS;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let left = Math.max(1, currentPage - 2);
      let right = Math.min(totalPages, left + maxButtons - 1);
      if (right - left < maxButtons - 1) {
        const diff = maxButtons - (right - left + 1);
        left = Math.max(1, left - diff);
        right = Math.min(totalPages, left + maxButtons - 1);
      }
      for (let i = left; i <= right; i++) pages.push(i);
      if (!pages.includes(1)) pages.unshift(1, "left-ellipsis");
      if (!pages.includes(totalPages)) pages.push("right-ellipsis", totalPages);
    }

    return pages.map((p, idx) => {
      if (p === "left-ellipsis" || p === "right-ellipsis") {
        return (
          <span key={`${p}-${idx}`} className="px-3 py-1 text-sm text-gray-500">
            …
          </span>
        );
      }
      return (
        <button
          key={p}
          aria-current={p === currentPage ? "page" : undefined}
          onClick={() => goTo(p)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition transform ${p === currentPage
            ? CONST.ACTIVE_PAGE_CLASS
            : "bg-white text-gray-700 hover:bg-yellow-100"
            }`}
        >
          {p}
        </button>
      );
    });
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 px-4 text-center">
        <X size={50} className="text-red-500" />
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
        <p className="text-gray-600">
          Please check your internet connection or login again.
        </p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* 🔍 Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300  rounded-lg w-1/3 focus:ring-2 focus:ring-yellow-400"
        />
        {/* <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-yellow-600 transition"
        >
          <Plus size={16} /> Add User
        </button> */}

        <button
          onClick={() => {
            const id = toast.custom((t) => (
              <div
                className={`${t.visible ? "animate-enter" : "animate-leave"
                  } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        You are not allowed to add users ❌
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ));
          }}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-yellow-600 transition"
        >
          <Plus size={16} /> Add User
        </button>




      </div>

      {/* 📋 Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left border border-gray-300">
          <thead className="bg-yellow-100 text-gray-700">
            <tr>
              <th className="p-3 border border-gray-300">Name</th>
              <th className="p-3 border border-gray-300">Email</th>
              <th className="p-3 border border-gray-300">Mobile</th>
              <th className="p-3 border border-gray-300">Role</th>
              <th className="p-3 border border-gray-300">Status</th>
              <th className="p-3 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{user.name}</td>
                <td className="p-3 border border-gray-300">{user.email}</td>
                <td className="p-3 border border-gray-300">{user.mobile}</td>
                <td className="p-3 border border-gray-300 capitalize">{user.role}</td>
                <td className="p-3 border border-gray-300 capitalize">{user.status}</td>
                <td className="p-3 border border-gray-300">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>



              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-yellow-100 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        {renderPageButtons()}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-yellow-100 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* 👁 View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ Add User Modal */}
      {/* {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={newUser.mobile}
                onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} Toggle Password
              </button>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UserManagement;
