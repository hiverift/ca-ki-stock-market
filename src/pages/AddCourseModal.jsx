import React from "react";
import { Plus } from "lucide-react";

const AddCourseModal = ({ isOpen, onClose, newCourse, onChange, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            name="instructor"
            placeholder="Instructor Name"
            value={newCourse.instructor}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 10 hours)"
            value={newCourse.duration}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="price"
            placeholder="Price (₹)"
            value={newCourse.price}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="level"
            placeholder="Level (Beginner/Intermediate/Advanced)"
            value={newCourse.level}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="mode"
            placeholder="Mode (Online/Offline)"
            value={newCourse.mode}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <textarea
            name="syllabus"
            placeholder="Syllabus"
            value={newCourse.syllabus}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newCourse.description}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
