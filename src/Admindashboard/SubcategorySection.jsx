// SubCategorySection.jsx
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const API_BASE = "https://www.cakistockmarket.com/api/v1";

const SubCategorySection = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/categories/getAllSubcategory`);
      if (res.data.statusCode === 200) {
        setSubCategories(res.data.result);
      }
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      Swal.fire("Error", "Failed to fetch subcategories!", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      if (res.data.statusCode === 200) {
        setCategories(res.data.result);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // ✅ Add subcategory
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (
      !newSubCategory.name.trim() ||
      !newSubCategory.categoryId ||
      !newSubCategory.description.trim()
    )
      return;

    try {
      const res = await axios.post(
        `${API_BASE}/categories/subcategory`,
        newSubCategory
      );

      if (res.data.statusCode === 201 || res.status === 201) {
        setSubCategories((prev) => [...prev, res.data.result]);
        setNewSubCategory({ name: "", description: "", categoryId: "" });

        Swal.fire({
          icon: "success",
          title: "SubCategory Added!",
          text: `SubCategory "${res.data.result.name}" added successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("Failed to add subcategory:", err);
      Swal.fire("Error", "Failed to add subcategory", "error");
    }
  };

  // ✅ Edit subcategory
  const handleEditSubCategory = async (sub) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit SubCategory",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${sub.name}">
        <textarea id="swal-desc" class="swal2-input" placeholder="Description">${sub.description || ""}</textarea>
        <select id="swal-category" class="swal2-input">
          ${categories
            .map(
              (cat) =>
                `<option value="${cat._id}" ${
                  sub.categoryId === cat._id ? "selected" : ""
                }>${cat.name}</option>`
            )
            .join("")}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: document.getElementById("swal-name").value,
          description: document.getElementById("swal-desc").value,
          categoryId: document.getElementById("swal-category").value,
        };
      },
    });

    if (formValues) {
      try {
        const res = await axios.put(
          `${API_BASE}/categories/updateSubCategory/${sub._id}`,
          formValues
        );

        if (res.data.statusCode === 200) {
          setSubCategories((prev) =>
            prev.map((s) => (s._id === sub._id ? res.data.result : s))
          );
          Swal.fire("Updated!", "SubCategory updated successfully.", "success");
        }
      } catch (err) {
        console.error("Failed to update subcategory:", err);
        Swal.fire("Error", "Failed to update subcategory", "error");
      }
    }
  };

  // ✅ Delete subcategory
  const handleDeleteSubCategory = async (id, name) => {
    const confirm = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/categories/deleteSubCategoy/${id}`);
        setSubCategories((prev) => prev.filter((s) => s._id !== id));

        Swal.fire(
          "Deleted!",
          `SubCategory "${name}" has been deleted.`,
          "success"
        );
      } catch (err) {
        console.error("Failed to delete subcategory:", err);
        Swal.fire("Error", "Failed to delete subcategory", "error");
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-4xl mb-6 text-gray-600">📂 SubCategories Management</h2>

      {/* Add Form */}
      <form
        onSubmit={handleAddSubCategory}
        className="flex flex-col md:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="SubCategory Name"
          value={newSubCategory.name}
          onChange={(e) =>
            setNewSubCategory({ ...newSubCategory, name: e.target.value })
          }
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Description"
          value={newSubCategory.description}
          onChange={(e) =>
            setNewSubCategory({
              ...newSubCategory,
              description: e.target.value,
            })
          }
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        />
        <select
          value={newSubCategory.categoryId}
          onChange={(e) =>
            setNewSubCategory({ ...newSubCategory, categoryId: e.target.value })
          }
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition transform hover:scale-105 shadow-md"
        >
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading subcategories...</p>
      ) : subCategories.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-900 text-sm font-semibold border-gray-200">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((sub, i) => (
                <tr
                  key={sub._id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-yellow-50 transition`}
                >
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {sub.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {sub.description || "—"}
                  </td>
                  <td className="px-6 py-3">
                    {categories.find((c) => c._id === sub.categoryId)?.name ||
                      "—"}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditSubCategory(sub)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteSubCategory(sub._id, sub.name)
                      }
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: sub.name,
                          text: sub.description || "No extra details available",
                          icon: "info",
                        })
                      }
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No subcategories found.</p>
      )}
    </div>
  );
};

export default SubCategorySection;
