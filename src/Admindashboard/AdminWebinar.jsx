import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import config from "../pages/config";

const AdminWebinarTable = () => {
  const [webinars, setWebinars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [newWebinar, setNewWebinar] = useState({
    title: "",
    presenter: "",
    description: "",
    startDate: new Date(),
    durationMinutes: 0,
    price: 0,
    status: "Upcoming",
    agenda: [],
    newAgenda: "",
    youtubeVideoId: "",
    categoryId: "",
    subCategoryId: "",
  });

  // Fetch webinars from API
  const fetchWebinars = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return setWebinars([]);
      const res = await fetch(`${config.BASE_URL}webinars`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const validWebinars = Array.isArray(data.result)
        ? data.result.filter((w) => w && w._id)
        : [];
      setWebinars(validWebinars);
    } catch (err) {
      console.error("Error fetching webinars:", err);
      setWebinars([]);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return setCategories([]);
        const res = await fetch(`${config.BASE_URL}categories`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setCategories(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (!newWebinar.categoryId) return;
    const fetchSubCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return setSubCategories([]);
        const res = await fetch(
          `${config.BASE_URL}categories/${newWebinar.categoryId}/subcategories`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await res.json();
        setSubCategories(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [newWebinar.categoryId]);

  // Validation & Save
  const handleSaveWebinar = async () => {
    const newErrors = {};
    if (!newWebinar.title) newErrors.title = "Title is required";
    if (!newWebinar.presenter) newErrors.presenter = "Presenter is required";
    if (!newWebinar.youtubeVideoId)
      newErrors.youtubeVideoId = "YouTube Video ID is required";
    if (!newWebinar.startDate) newErrors.startDate = "Start Date is required";
    if (!newWebinar.durationMinutes || newWebinar.durationMinutes <= 0)
      newErrors.durationMinutes = "Duration must be greater than 0";
    if (newWebinar.price === "" || newWebinar.price < 0)
      newErrors.price = "Price cannot be negative";
    if (!newWebinar.status) newErrors.status = "Status is required";
    if (!newWebinar.description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({}); // clear errors

    try {
      const url = editId
        ? `${config.BASE_URL}webinars/${editId}`
        : `${config.BASE_URL}webinars`;
      const method = editId ? "PUT" : "POST";

      const form = new FormData();
      form.append("itemType", "webinar");
      form.append("title", newWebinar.title);
      form.append("presenter", newWebinar.presenter);
      form.append("description", newWebinar.description);
      form.append("startDate", newWebinar.startDate.toISOString());
      form.append("durationMinutes", Number(newWebinar.durationMinutes));
      form.append("price", Number(newWebinar.price));
      form.append("status", newWebinar.status);
      form.append("agenda", JSON.stringify(newWebinar.agenda));
      form.append("youtubeVideoId", newWebinar.youtubeVideoId);
      if (newWebinar.categoryId) form.append("categoryId", newWebinar.categoryId);
      if (newWebinar.subCategoryId)
        form.append("subCategoryId", newWebinar.subCategoryId);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return alert("No access token found.");

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error saving webinar");

      await fetchWebinars();
      setNewWebinar({
        title: "",
        presenter: "",
        description: "",
        startDate: new Date(),
        durationMinutes: 0,
        price: 0,
        status: "Upcoming",
        agenda: [],
        newAgenda: "",
        youtubeVideoId: "",
        categoryId: "",
        subCategoryId: "",
      });
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleEditWebinar = (webinar) => {
    setNewWebinar({
      title: webinar.title || "",
      presenter: webinar.presenter || "",
      description: webinar.description || "",
      startDate: new Date(webinar.startDate) || new Date(),
      durationMinutes: webinar.durationMinutes || 0,
      price: webinar.price || 0,
      status: webinar.status || "Upcoming",
      agenda: webinar.agenda || [],
      newAgenda: "",
      youtubeVideoId: webinar.youtubeVideoId || "",
      categoryId: webinar.categoryId || "",
      subCategoryId: webinar.subCategoryId || "",
    });
    setEditId(webinar._id);
    setShowForm(true);
    setErrors({});
  };

  const handleDeleteWebinar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this webinar?")) return;
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return alert("No access token found.");
      const res = await fetch(`${config.BASE_URL}webinars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchWebinars();
    } catch (err) {
      console.error(err);
      alert("Error deleting webinar");
    }
  };

  const addAgenda = () => {
    if (newWebinar.newAgenda.trim() !== "") {
      setNewWebinar({
        ...newWebinar,
        agenda: [...newWebinar.agenda, newWebinar.newAgenda.trim()],
        newAgenda: "",
      });
    }
  };

  const removeAgenda = (index) => {
    setNewWebinar({
      ...newWebinar,
      agenda: newWebinar.agenda.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">Manage Webinars</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition"
        >
          <Plus size={18} /> Add Webinar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No.</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Presenter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {webinars.length > 0 ? (
              webinars.map((w, idx) => (
                <tr key={w._id} className="hover:bg-yellow-50 transition-all duration-200">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{w.title || "N/A"}</td>
                  <td className="px-4 py-3">{w.presenter || "N/A"}</td>
                  <td className="px-4 py-3">{w.startDate ? new Date(w.startDate).toLocaleString() : "N/A"}</td>
                  <td className="px-4 py-3">{w.durationMinutes || 0} mins</td>
                  <td className="px-4 py-3">{w.price || 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${w.status === "Live"
                          ? "bg-green-500 text-white"
                          : w.status === "Upcoming"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                    >
                      {w.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setShowDetail(w)}
                        className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleEditWebinar(w)}
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteWebinar(w._id)}
                        className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500 border-t border-gray-200">
                  No webinars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh] p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">Webinar Details</h3>
              <button
                onClick={() => setShowDetail(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <p><strong>Title:</strong> {showDetail.title}</p>
              <p><strong>Presenter:</strong> {showDetail.presenter}</p>
              <p><strong>Description:</strong> {showDetail.description}</p>
              <p><strong>Start Date:</strong> {new Date(showDetail.startDate).toLocaleString()}</p>
              <p><strong>Duration:</strong> {showDetail.durationMinutes} mins</p>
              <p><strong>Price:</strong> {showDetail.price}</p>
              <p><strong>Status:</strong> {showDetail.status}</p>
              <p><strong>YouTube Video ID:</strong> {showDetail.youtubeVideoId}</p>
              <div>
                <strong>Agenda:</strong>
                <ul className="list-disc pl-5">
                  {showDetail.agenda.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetail(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{editId ? "Edit Webinar" : "Add Webinar"}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter webinar title"
                  value={newWebinar.title}
                  onChange={(e) => setNewWebinar({ ...newWebinar, title: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Presenter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presenter <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter presenter name"
                  value={newWebinar.presenter}
                  onChange={(e) => setNewWebinar({ ...newWebinar, presenter: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.presenter ? "border-red-500" : ""}`}
                />
                {errors.presenter && <p className="text-red-500 text-sm mt-1">{errors.presenter}</p>}
              </div>

              {/* YouTube Video ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter YouTube video ID"
                  value={newWebinar.youtubeVideoId}
                  onChange={(e) => setNewWebinar({ ...newWebinar, youtubeVideoId: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.youtubeVideoId ? "border-red-500" : ""}`}
                />
                {errors.youtubeVideoId && <p className="text-red-500 text-sm mt-1">{errors.youtubeVideoId}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={newWebinar.startDate}
                  onChange={(date) => setNewWebinar({ ...newWebinar, startDate: date })}
                  showTimeSelect
                  dateFormat="Pp"
                  className={`border px-3 py-2 rounded w-full ${errors.startDate ? "border-red-500" : ""}`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter duration"
                  value={newWebinar.durationMinutes}
                  onChange={(e) => setNewWebinar({ ...newWebinar, durationMinutes: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.durationMinutes ? "border-red-500" : ""}`}
                />
                {errors.durationMinutes && <p className="text-red-500 text-sm mt-1">{errors.durationMinutes}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={newWebinar.price}
                  onChange={(e) => setNewWebinar({ ...newWebinar, price: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.price ? "border-red-500" : ""}`}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={newWebinar.status}
                  onChange={(e) => setNewWebinar({ ...newWebinar, status: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.status ? "border-red-500" : ""}`}
                >
                  <option value="">Select Status</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live">Live</option>
                  <option value="Recorded">Recorded</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter description"
                  value={newWebinar.description}
                  onChange={(e) => setNewWebinar({ ...newWebinar, description: e.target.value })}
                  className={`border px-3 py-2 rounded w-full ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Agenda */}
            <div className="mt-2">
              <h4 className="font-semibold mb-1">Agenda</h4>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add Agenda Item"
                  value={newWebinar.newAgenda}
                  onChange={(e) => setNewWebinar({ ...newWebinar, newAgenda: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
                />
                <button
                  onClick={addAgenda}
                  className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5">
                {newWebinar.agenda.map((a, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    {a}{" "}
                    <button
                      onClick={() => removeAgenda(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWebinar}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebinarTable;
