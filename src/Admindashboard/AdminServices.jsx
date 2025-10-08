import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import config from "../pages/config";

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
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${BASE_URL}/services/${id}`);
      alert("🗑️ Service deleted successfully!");
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
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
                min= "1"
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
                   min= "1"
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
                className="px-8 py-3 bg-yellow-500 text-white font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition transform hover:scale-105 disabled:opacity-50"
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

        {/* Services List */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl  text-gray-700 mb-6 border-b border-gray-300 pb-3">
            📋 All Services
          </h3>
          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No services added yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className=" text-gray-700">
                  <th className="p-3 border border-gray-300">Name</th>
                  <th className="p-3 border border-gray-300">Duration (mins)</th>
                  <th className="p-3 border border-gray-300">Price (₹)</th>
                  <th className="p-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service._id}
                    className="hover:bg-yellow-50 text-center transition"
                  >
                    <td className="p-3 border border-gray-300">{service.name}</td>
                    <td className="p-3 border border-gray-300">{service.durationMinutes}</td>
                    <td className="p-3 border border-gray-300 ">₹{service.price}</td>
                    <td className="p-3 border border-gray-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(service)}
                        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 bg-green-100 rounded hover:bg-green-200"
                      >
                        <Edit size={16} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 bg-red-100 rounded hover:bg-red-200"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminService;
