// AddCourseForm.jsx
import React, { useState } from "react";

const AddCourseForm = ({ onAddCourse, onClose }) => {
  const [course, setCourse] = useState({
    name: "",
    students: 0,
    revenue: "₹0",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!course.name) return alert("Course name is required");
    onAddCourse(course);
    onClose();
    setCourse({ name: "", students: 0, revenue: "₹0", status: "active" });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Course Name</label>
            <input
              type="text"
              name="name"
              value={course.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Students</label>
            <input
              type="number"
              name="students"
              value={course.students}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Revenue</label>
            <input
              type="text"
              name="revenue"
              value={course.revenue}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
