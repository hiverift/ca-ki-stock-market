import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Edit2, Trash2, Plus, X } from "lucide-react";
import config from "../pages/config";
import Swal from "sweetalert2";
const BASE_URL = config.BASE_URL;

const AdminService = () => {
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [price, setPrice] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // 🔹 Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/services`);
      setServices(res.data.result || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 Add or Update Service
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!name || !durationMinutes || !price) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
    };

    try {
      setLoading(true);

      if (editingService) {
        await axios.put(`${BASE_URL}/services/${editingService._id}`, payload);
        alert("✅ Service updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/services`, payload);
        alert("✅ Service added successfully!");
      }

      setName("");
      setDurationMinutes("");
      setPrice("");
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      alert("❌ Failed to save service.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Service
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${BASE_URL}/services/${id}`);
      await Swal.fire("Deleted!", "Service deleted successfully.", "success");
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      Swal.fire("Error", "Failed to delete service.", "error");
    }
  }
};

  // 🔹 Edit Service
  const handleEdit = (service) => {
    setEditingService(service);
    setName(service.name);
    setDurationMinutes(service.durationMinutes);
    setPrice(service.price);
  };

  // 🔹 View Service
  const handleView = (service) => {
    alert(
      `📋 Service Details:\n\nName: ${service.name}\nDuration: ${service.durationMinutes} mins\nPrice: ₹${service.price}`
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-4xl  text-gray-800 mb-10 text-center">
          🛠️ Service Management
        </h2>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-yellow-500" />
            {editingService ? "Edit Service" : "Add New Service"}
          </h3>

          <form onSubmit={handleSaveService} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Consultation (30 mins)"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="999"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-3 text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition transform hover:scale-105 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingService
                    ? "Update Service"
                    : "Save Service"}
              </button>
            </div>
          </form>
        </div>


        <div className="bg-white rounded-3xl shadow-2xl p-6 mt-6">

          <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
            📋 All Services
          </h3>

          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No services added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="px-4 py-3 text-left border-b">Name</th>
                    <th className="px-4 py-3 text-left border-b">Duration (mins)</th>
                    <th className="px-4 py-3 text-left border-b">Price (₹)</th>
                    <th className="px-4 py-3 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id} className="border-b hover:bg-gray-50 text-sm whitespace-nowrap transition">
                      <td className="px-4 py-3">{service.name}</td>
                      <td className="px-4 py-3">{service.durationMinutes}</td>
                      <td className="px-4 py-3">₹{service.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => handleView(service)}
                            className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded"
                          >
                            <Eye size={16} />
                          </button>
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEdit(service)}
                            className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default AdminService;
