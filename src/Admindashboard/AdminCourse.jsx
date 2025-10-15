import React, { useEffect, useState, useMemo } from "react";

import { Plus, Search, ChevronLeft, ChevronRight, X, Trash2, Edit } from "lucide-react";
import config from "../pages/config";
import { toast } from "react-hot-toast"
import Swal from "sweetalert2";
// import { X, Plus } from "lucide-react";

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
  const [errors, setErrors] = useState({}); // ✅ error state

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

    // ✅ Real-time validation
    if (!value || (Array.isArray(formData[name]) && formData[name].length === 0)) {
      setErrors((prev) => ({ ...prev, [name]: "This field is required" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        newErrors[field] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const url = editCourseId
        ? `${BASE_URL}courses/${editCourseId}`
        : `${BASE_URL}courses/createCrouses`;

      const method = editCourseId ? "PUT" : "POST";
      const form = new FormData();
      form.append("itemType", "course");

      for (let key in formData) {
        if (key === "syllabus" && Array.isArray(formData[key])) {
          form.append(key, JSON.stringify(formData[key]));
        } else {
          form.append(key, formData[key]);
        }
      }

      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
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
      rating: course.rating || "",
      studentsCount: course.studentsCount || "",
      description: course.description || "",
      youtubeVideoId: course.youtubeVideoId || "",
    });
    setEditCourseId(course.id || course._id);
    setShowForm(true);
  };

  // const handleDelete = async (courseId) => {
  //   if (!window.confirm("Are you sure you want to delete this course?")) return;
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${BASE_URL}courses/${courseId}`, { method: "DELETE" });
  //     if (res.ok) {
  //       setCourses((prev) => prev.filter((c) => c.id !== courseId && c._id !== courseId));
  //     }
  //   } catch (err) {
  //     console.error("Error deleting course:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   const handleDelete = async (courseId) => {
  //   if (!window.confirm("Are you sure you want to delete this course?")) return;
  //   setLoading(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken");
  //     const res = await fetch(`${BASE_URL}courses/${courseId}`, {
  //       method: "DELETE",
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });

  //     if (res.ok) {
  //       setCourses((prev) => prev.filter((c) => c.id !== courseId && c._id !== courseId));
  //       toast.success("Course deleted successfully ✅"); // ✅ success notification
  //     } else {
  //       const data = await res.json();
  //       toast.error(data.message || "Failed to delete course ❌"); // ❌ error notification
  //     }
  //   } catch (err) {
  //     console.error("Error deleting course:", err);
  //     toast.error("Something went wrong ❌"); // ❌ error notification
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (courseId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      width: 350,
      customClass: {
        title: "text-sm font-semibold",
        content: "text-xs",
        confirmButton: "px-3 py-1 text-xs",
        cancelButton: "px-3 py-1 text-xs",
      },
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_URL}courses/${courseId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          setCourses((prev) => prev.filter((c) => c.id !== courseId && c._id !== courseId));

          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Course deleted successfully!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              title: "text-xs",
            },
          });
        } else {
          const data = await res.json();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: data.message || "Failed to delete course",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              title: "text-xs",
            },
          });
        }
      } catch (err) {
        console.error("Error deleting course:", err);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Something went wrong",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            title: "text-xs",
          },
        });
      } finally {
        setLoading(false);
      }
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
      rating: "",
      studentsCount: "",
      description: "",
      youtubeVideoId: "",
    });
    setEditCourseId(null);
    setErrors({});
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
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
        >
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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="px-4 py-3 text-left border-b">#</th>
                <th className="px-4 py-3 text-left border-b">Course Name</th>
                <th className="px-4 py-3 text-left border-b">Instructor</th>
                <th className="px-4 py-3 text-left border-b">Price</th>
                <th className="px-4 py-3 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.length > 0 ? (
                currentCourses.map((course, index) => (
                  <tr
                    key={course._id}
                    className="border-b border-gray-200 hover:bg-gray-50/50 transition-all text-sm whitespace-nowrap"                  >
                    <td className="px-4 py-3">{indexOfFirst + index + 1}</td>
                    <td className="px-4 py-3">{course.title}</td>
                    <td className="px-4 py-3">{course.instructor}</td>
                    <td className="px-4 py-3">₹{course.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center items-center gap-2 flex-nowrap">
                        <button
                          onClick={() => handleEdit(course)}
                          className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
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
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-500 border-t"
                  >
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editCourseId ? "Edit Course" : "Add Course"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Instructor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.instructor && (
                    <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>
                  )}
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>

              {/* Rating & Students Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.rating && (
                    <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Students Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="studentsCount"
                    value={formData.studentsCount}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.studentsCount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.studentsCount}
                    </p>
                  )}
                </div>
              </div>

              {/* YouTube Video ID & Syllabus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700">
                    YouTube Video ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="youtubeVideoId"
                    value={formData.youtubeVideoId}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.youtubeVideoId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.youtubeVideoId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-700">
                    Syllabus (comma separated)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="syllabus"
                    value={formData.syllabus.join(", ")}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded-xl"
                  />
                  {errors.syllabus && (
                    <p className="text-red-500 text-sm mt-1">{errors.syllabus}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border px-3 py-2 rounded-xl"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Plus size={16} />
                  {editCourseId ? "Update" : "Save"}
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