import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Edit2, Eye, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const API_BASE = "https://www.cakistockmarket.com/api/v1";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;
  const [showDetail, setShowDetail] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      if (res.data.statusCode === 200) {
        setCategories(res.data.result || []); // Ensure array
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to fetch categories!" });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories safely
  const filteredCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add / Edit category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData,'serach id ');
    try {
      let res;
      if (editCategoryId) {
        res = await axios.put(`${API_BASE}/categories/updateCategory/${editCategoryId}`, formData);
      } else {
        res = await axios.post(`${API_BASE}/categories/addcategory`, formData);
      }
      if (res.data.statusCode === 201 || res.status === 201 || res.status === 200) {
        if (editCategoryId) {
          setCategories((prev) =>
            prev.map((cat) => (cat._id === editCategoryId ? res.data.result : cat))
          );
        } else {
          setCategories((prev) => [...prev, res.data.result]);
        }
        resetForm();
        Swal.fire({
          icon: "success",
          title: editCategoryId ? "Category Updated!" : "Category Added!",
          text: `"${res.data.result.name}" saved successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error!", text: "Failed to save category" });
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (cat) => {
    setFormData({ name: cat.name, description: cat.description });
    setEditCategoryId(cat._id);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (id, name) => {
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
        await axios.delete(`${API_BASE}/categories/deleteCategory/${id}`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `"${name}" has been deleted.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: "error", title: "Error!", text: "Failed to delete category" });
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditCategoryId(null);
    setShowForm(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowDetail(null);
      resetForm();
    }
  };

  if (loading && categories.length === 0)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-600">Category Management</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage and monitor all your categories efficiently
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 hidden sm:table-header-group">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No.</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-gray-300" />
                        <p className="text-sm sm:text-base">No categories found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentCategories.map((c, idx) => (
                    <tr key={c._id} className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200">
                      {/* Mobile View */}
                      <td colSpan={5} className="sm:hidden px-4 py-4 border-b border-gray-200">
                        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                            
                              <h4 className="font-semibold text-gray-900 truncate">{c.name}</h4>
                              <p className="text-sm text-gray-600">{c.description}</p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <button onClick={() => setShowDetail(c)} className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200" title="View Details"><Eye size={16} /></button>
                              <button onClick={() => handleEdit(c,)} className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200" title="Edit Category"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(c._id, c.name)} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200" title="Delete Category"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Desktop Table */}
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4">{indexOfFirst + idx + 1}</td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setShowDetail(c)} className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200"><Eye size={14} /></button>
                          <button onClick={() => handleEdit(c)} className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(c._id, c.name)} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200"><Trash2 size={14} /></button>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">{c.name}</td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{c.description}</td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                Showing <span className="font-medium">{indexOfFirst + 1}</span> to <span className="font-medium">{Math.min(indexOfLast, filteredCategories.length)}</span> of <span className="font-medium">{filteredCategories.length}</span> results
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"><ChevronLeft size={16} /></button>
                <span className="px-2 sm:px-3 py-1 sm:py-2 text-sm font-medium text-gray-700">Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span></span>
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={handleOverlayClick}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{showDetail.name}</h3>
                <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">{showDetail.description}</p>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={handleOverlayClick}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{editCategoryId ? "Edit Category" : "Add Category"}</h3>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-sm"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none text-sm"/>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200">
                  <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto">Cancel</button>
                  <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full sm:w-auto">
                    {loading ? "Saving..." : editCategoryId ? "Update Category" : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategorySection;
