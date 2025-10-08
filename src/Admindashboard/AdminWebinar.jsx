import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  X
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import config from "../pages/config"; // ✅ BASE_URL from config



const AdminWebinarTable = () => {
  const [webinars, setWebinars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [categories, setCategories] = useState([]);
const [subCategories, setSubCategories] = useState([]);
  const [newWebinar, setNewWebinar] = useState({
    title: "",
    presenter: "",
    description: "",
    startDate: new Date(),
    durationMinutes: 0,
    price: 0,
    status: "upcoming",
    agenda: [],
    newAgenda: "",
    categoryId: "",    // ✅ added
  subCategoryId: ""
  });

  // Fetch webinars from API
  useEffect(() => {
    fetch(`${config.BASE_URL}webinars`)
      .then((res) => res.json())
      .then((data) => setWebinars(data.result  || []))
      
      .catch((err) => console.error("Error fetching webinars:", err));
      
      
  }, []);

  // Save or Update Webinar
  const handleSaveWebinar = async () => {
    if (!newWebinar.title) return alert("Please enter webinar title");
    if (!newWebinar.presenter) return alert("Please enter presenter name");

    try {
      const url = editId
        ? `${config.BASE_URL}webinars/${editId}`
        : `${config.BASE_URL}webinars`;
      const method = editId ? "PUT" : "POST";

      const bodyData = {
        title: newWebinar.title,
        presenter: newWebinar.presenter,
        description: newWebinar.description,
        startDate: newWebinar.startDate,
        durationMinutes: Number(newWebinar.durationMinutes),
        price: Number(newWebinar.price),
        status: newWebinar.status,
        agenda: newWebinar.agenda,
        categoryId: newWebinar.categoryId,     // ✅ added
  subCategoryId: newWebinar.subCategoryId, // ✅ added
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify(bodyData),
        
      });


      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error saving webinar");

      if (editId) {
        setWebinars(webinars.map((w) => (w._id === editId ? data.result : w)));
        setEditId(null);
      } else {
        setWebinars([...webinars, data.result]);
      }

      setNewWebinar({
        title: "",
        presenter: "",
        description: "",
        startDate: new Date(),
        durationMinutes: 0,
        price: 0,
        status: "upcoming",
        agenda: [],
        newAgenda: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  // Edit webinar
  const handleEditWebinar = (webinar) => {
    setNewWebinar({
      title: webinar.title,
      presenter: webinar.presenter,
      description: webinar.description,
      startDate: new Date(webinar.startDate),
      durationMinutes: webinar.durationMinutes,
      price: webinar.price,
      status: webinar.status,
      agenda: webinar.agenda || [],
      newAgenda: "",
    });
    setEditId(webinar._id);
    setShowForm(true);
  };

  // Delete webinar
  const handleDeleteWebinar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this webinar?")) return;
    try {
      const res = await fetch(`${config.BASE_URL}webinars/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setWebinars(webinars.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting webinar");
    }
  };


// Categories fetch 
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${config.BASE_URL}categories`);
      const data = await res.json();
      setCategories(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  fetchCategories();
}, []);

// SubCategories fetch 


useEffect(() => {
  if (!newWebinar.categoryId) return;
  const fetchSubCategories = async () => {
    try {
      const res = await fetch(
        `${config.BASE_URL}categories/${newWebinar.categoryId}/subcategories`
      );
      const data = await res.json();
      setSubCategories(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };
  fetchSubCategories();
}, [newWebinar.categoryId]);


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
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
          Manage Webinars
        </h2>
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
            {webinars.map((w, idx) => (
              <tr key={w._id} className="hover:bg-yellow-50 transition-all duration-200">
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{w.title}</td>
                <td className="px-4 py-3">{w.presenter}</td>
                <td className="px-4 py-3">{new Date(w.startDate).toLocaleString()}</td>
                <td className="px-4 py-3">{w.durationMinutes} mins</td>
                <td className="px-4 py-3">{w.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    w.status === "live" ? "bg-green-500 text-white" :
                    w.status === "upcoming" ? "bg-blue-500 text-white" :
                    "bg-gray-400 text-white"
                  }`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button onClick={() => setShowDetail(w)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" title="View">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleEditWebinar(w)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteWebinar(w._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{editId ? "Edit Webinar" : "Add Webinar"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Form Fields */}
    {/* Form Fields */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Title */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Title
    </label>
    <input
      type="text"
      aria-label="Title"
      placeholder="Enter webinar title"
      value={newWebinar.title}
      onChange={(e) =>
        setNewWebinar({ ...newWebinar, title: e.target.value })
      }
      className="border px-3 py-2 rounded w-full"
    />
  </div>





  {/* Presenter */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Presenter
    </label>
    <input
      type="text"
      placeholder="Enter presenter name"
      value={newWebinar.presenter}
      onChange={(e) =>
        setNewWebinar({ ...newWebinar, presenter: e.target.value })
      }
      className="border px-3 py-2 rounded w-full"
    />
  </div>

  {/* Date & Time */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Start Date & Time
    </label>
    <DatePicker
      selected={newWebinar.startDate}
      onChange={(date) => setNewWebinar({ ...newWebinar, startDate: date })}
      showTimeSelect
      dateFormat="Pp"
      className="border px-3 py-2 rounded w-full"
    />
  </div>

  {/* Duration */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Duration (minutes)
    </label>
    <input
      type="number"
      min="0"
      placeholder="Enter duration"
      value={newWebinar.durationMinutes}
      onChange={(e) =>
        setNewWebinar({ ...newWebinar, durationMinutes: e.target.value })
      }
      className="border px-3 py-2 rounded w-full"
    />
  </div>

  {/* Price */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Price
    </label>
    <input
     min="0"
      type="number"
      placeholder="Enter price"
      value={newWebinar.price}
      onChange={(e) =>
        setNewWebinar({ ...newWebinar, price: e.target.value })
      }
      className="border px-3 py-2 rounded w-full"
    />
  </div>

  {/* Status */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Status
    </label>
    <select
      value={newWebinar.status}
      onChange={(e) =>
        setNewWebinar({ ...newWebinar, status: e.target.value })
      }
      className="border px-3 py-2 rounded w-full"
    >
      <option value="upcoming">Upcoming</option>
      <option value="live">Live</option>
      <option value="recorded">Recorded</option>
    </select>
  </div>



    {/* Category */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Category
  </label>
  <select
    value={newWebinar.categoryId}
    onChange={(e) =>
      setNewWebinar({ ...newWebinar, categoryId: e.target.value })
    }
    className="border px-3 py-2 rounded w-full"
  >
    <option value="">Select Category</option>
    {categories.map((cat) => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

{/* SubCategory */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    SubCategory
  </label>
  <select
    value={newWebinar.subCategoryId}
    onChange={(e) =>
      setNewWebinar({ ...newWebinar, subCategoryId: e.target.value })
    }
    className="border px-3 py-2 rounded w-full"
  >
    <option value="">Select SubCategory</option>
    {subCategories.map((sub) => (
      <option key={sub._id} value={sub._id}>
        {sub.name}
      </option>
    ))}
  </select>
</div>

  {/* Description */}
  <div className="sm:col-span-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Description
    </label>
    <textarea
      placeholder="Enter description"
      value={newWebinar.description}
      onChange={(e) =>
        setNewWebinar({ ...newWebinar, description: e.target.value })
      }
      className="border px-3 py-2 rounded w-full"
    />
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
                <button onClick={addAgenda} className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">Add</button>
              </div>
              <ul className="list-disc pl-5">
                {newWebinar.agenda.map((a, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    {a} <button onClick={() => removeAgenda(idx)} className="text-red-500 hover:text-red-700">Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button onClick={handleSaveWebinar} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold">{showDetail.title}</h3>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <p><strong>Presenter:</strong> {showDetail.presenter}</p>
            <p><strong>Date & Time:</strong> {new Date(showDetail.startDate).toLocaleString()}</p>
            <p><strong>Duration:</strong> {showDetail.durationMinutes} minutes</p>
            <p><strong>Price:</strong> {showDetail.price}</p>
            <p><strong>Status:</strong> {showDetail.status}</p>
            <p><strong>Description:</strong> {showDetail.description}</p>
            {showDetail.agenda?.length > 0 && (
              <div>
                <strong>Agenda:</strong>
                <ul className="list-disc pl-5">
                  {showDetail.agenda.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebinarTable;
