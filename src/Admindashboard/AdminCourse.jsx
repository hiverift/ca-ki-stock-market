import React, { useEffect, useState, useMemo } from "react";
import { Eye, Plus, Search, ChevronLeft, ChevronRight, X, Edit2, Trash2 } from "lucide-react";
import config from "../pages/config";

const BASE_URL = config.BASE_URL;

const AdminCourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [loading, setLoading] = useState(false);

  const coursesPerPage = 5;
  
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    duration: "",
    price: "",
    level: "Beginner",
    mode: "Live",
    syllabus: [],
    subCategoryId: "",
    rating: 0,
    studentsCount: 0,
    categoryId: "",
    description: "",
    youtubeVideoId: "",
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_URL}courses/getAllCourses`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCourses(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_URL}categories/getAllSubcategory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
    if (!formData.categoryId) return;
    const fetchSubCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_URL}categories/getAllSubcategory`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch subcategories: ${res.status}`);
        const data = await res.json();
        setSubCategories(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubCategories([]);
      }
    };
    fetchSubCategories();
  }, [formData.categoryId]);

  const filteredCourses = useMemo(() => {
    const normalize = (str) => str?.toLowerCase().replace(/\s+/g, " ").trim() || "";
    const query = normalize(searchQuery);
    return courses.filter(
      (c) =>
        normalize(c.title).includes(query) ||
        normalize(c.instructor).includes(query)
    );
  }, [courses, searchQuery]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirst, indexOfLast);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "syllabus"
          ? value.split(",").map((item) => item.trim()).filter(Boolean)
          : value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // ✅ Required fields check
    const requiredFields = ["title", "instructor", "price", "duration","youtubeVideoId"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        console.error(`${field} is required`);
        setLoading(false);
        return;
      }
    }

    // ✅ Correct endpoint spelling
    const url = editCourseId
      ? `${BASE_URL}courses/${editCourseId}`
      : `${BASE_URL}courses/createCrouses`; // spelling fix
      console.log("POST URL:", url);


    const method = editCourseId ? "PUT" : "POST";

    const form = new FormData();
    form.append('itemType', 'course');
    for (let key in formData) {
       
      if (key === "syllabus" && Array.isArray(formData[key])) {
        form.append(key, JSON.stringify(formData[key])); // syllabus as JSON string
  
      } else {
        form.append(key, formData[key]);
      }
    }

    const accessToken = localStorage.getItem("accessToken");

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // No Content-Type here — browser handles for FormData
      },
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      if (editCourseId) {
        setCourses((prev) =>
          prev.map((c) => (c._id === editCourseId ? data.result : c))
        );
      } else {
        setCourses((prev) => [...prev, data.result]);
      }
      resetForm();
    } else {
      console.error("Error saving course:", data);
    }
  } catch (err) {
    console.error("Error submitting form:", err);
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (course) => {
    setFormData({
      title: course.title || "",
      instructor: course.instructor || "",
      duration: course.duration || "",
      price: course.price || "",
      level: course.level || "Beginner",
      mode: course.mode || "Live",
      syllabus: Array.isArray(course.syllabus) ? course.syllabus : [],
      rating: course.rating || 0,
      studentsCount: course.studentsCount || 0,
      description: course.description || "",
    });
    setEditCourseId(course.id || course._id);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId && c._id !== courseId));
      } else {
        console.error("Error deleting course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      instructor: "",
      duration: "",
      price: "",
      level: "Beginner",
      mode: "Live",
      syllabus: [],
      rating: 0,
      studentsCount: 0,
      description: "",
    });
    setEditCourseId(null);
    setShowForm(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
      resetForm();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Courses</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2">
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border rounded-lg px-3 py-2 w-72 mb-4">
        <Search size={18} className="text-gray-500 mr-2" />

        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="flex-1 outline-none"
        />
        
      </div>

      {/* Table */}
{/* Table */}
{/* Table */}
<div className="overflow-x-auto bg-white rounded-xl shadow">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100 text-left text-sm text-gray-600">
        <th className="px-4 py-3 border-b border-gray-200">#</th>
        <th className="px-4 py-3 border-b border-gray-200">Name</th>
        <th className="px-4 py-3 border-b border-gray-200">Instructor</th>
        <th className="px-4 py-3 border-b border-gray-200">Price</th>
        <th className="px-4 py-3 border-b border-gray-200">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentCourses.map((course, idx) => (
        <tr
          key={course._id}
          className="border-b border-gray-200 text-sm hover:bg-gray-50 transition"
        >
          <td className="px-4 py-3">{indexOfFirst + idx + 1}</td>
          <td className="px-4 py-3">{course.title}</td>
          <td className="px-4 py-3">{course.instructor}</td>
          <td className="px-4 py-3">₹{course.price}</td>
          <td className="px-4 py-3 flex gap-2">
            <button
              onClick={() => handleEdit(course)}
              className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(course._id)}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))}

      {currentCourses.length === 0 && (
        <tr>
          <td
            colSpan="5"
            className="px-4 py-6 text-center text-gray-500 border-t border-gray-200"
          >
            No courses found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>



      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-gray-100 rounded-lg disabled:opacity-50">
            <ChevronLeft />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-gray-100 rounded-lg disabled:opacity-50">
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={handleOverlayClick}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editCourseId ? "Edit Course" : "Add Course"}</h3>
              <button onClick={resetForm}><X size={20} /></button>
            </div>

<form onSubmit={handleSubmit} className="space-y-4">
  {/* Title & Instructor */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="font-semibold text-gray-700">Title *</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
        required
      />
    </div>
    <div>
      <label className="font-semibold text-gray-700">Instructor *</label>
      <input
        type="text"
        name="instructor"
        value={formData.instructor}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
        required
      />
    </div>
  </div>

  {/* Price & Duration */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="font-semibold text-gray-700">Price *</label>
      <input
        type="number"
        name="price"
          min="0"
        value={formData.price}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
        required
      />

    </div>
    <div>
      <label className="font-semibold text-gray-700">Duration *</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
        required
      />
    </div>
  </div>

  {/* Level & Mode */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="font-semibold text-gray-700">Level *</label>
      <select
        name="level"
        value={formData.level}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>
    <div>
      <label className="font-semibold text-gray-700">Mode *</label>
      <select
        name="mode"
        value={formData.mode}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
      >
        <option>Live</option>
        <option>Recorded</option>

      </select>
    </div>
  </div>

  {/* Category & SubCategory */}
  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="font-semibold text-gray-700">Category *</label>
      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="font-semibold text-gray-700">SubCategory *</label>
      <select
        name="subCategoryId"
        value={formData.subCategoryId}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
        required
      >
        <option value="">Select SubCategory</option>
        {subCategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>
  </div> */}

  {/* Rating & Students Count */}
  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="font-semibold text-gray-700">Rating</label>
      <input
        type="number"
        name="rating"
        min="0"
        max="5"
        value={formData.rating}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
      />
    </div>

  </div>


  {/* youtube Id & Students Count  */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="font-semibold text-gray-700">youtube Id</label>
      <input
        type="string"
        name="youtubeVideoId"
        value={formData.youtubeVideoId}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
      />
    </div>
    <div>
      <label className="font-semibold text-gray-700">Students Count</label>
      <input
        type="number"
        name="studentsCount"
        value={formData.studentsCount}
        onChange={handleInputChange}
        className="w-full border px-3 py-2 rounded-xl"
      />
    </div>
  </div>



  {/* Syllabus */}
<div>
  <label className="font-semibold text-gray-700">
    Syllabus (comma separated)
  </label>
  <input
    type="text"
    name="syllabus"
    value={formData.syllabus.join(", ")}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        syllabus: e.target.value.split(",").map((s) => s.trim()),
      }))
    }
    className="w-full border px-3 py-2 rounded-xl"
  />
</div>




  {/* Image */}
  {/* <div>
    <label className="font-semibold text-gray-700">Image</label>
    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          image: e.target.files[0],
        }))
      }
      className="w-full border px-3 py-2 rounded-xl"
    />
  </div> */}

  {/* Description */}
  <div>
    <label className="font-semibold text-gray-700">Description</label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      rows="3"
      className="w-full border px-3 py-2 rounded-xl"
    ></textarea>
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={resetForm}
      className="px-4 py-2 border rounded-xl"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
    >
      <Plus size={16} /> {editCourseId ? "Update" : "Save"}
    </button>
  </div>
</form>



          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseTable;
