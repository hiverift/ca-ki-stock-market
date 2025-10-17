import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../pages/config";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
  search: "",
  date: "", // 🔹 only one date now
});



  // Fetch Orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.BASE_URL}orders`);
      if (res.data?.statusCode === 200) {
        setOrders(res.data.result.orders || []);
        setFilteredOrders(res.data.result.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders when filters change
  useEffect(() => {
    let tempOrders = [...orders];

    // Filter by status
    if (filters.status !== "all") {
      tempOrders = tempOrders.filter(
        (order) => order.status === filters.status
      );
    }

    // Filter by search (Order ID or Name)
    if (filters.search.trim() !== "") {
      const query = filters.search.toLowerCase();
      tempOrders = tempOrders.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(query) ||
          order.user?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(tempOrders);
  }, [filters, orders]);

  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Update payment status
  const handleMarkPaid = async (id) => {
    try {
      await axios.patch(`${config.BASE_URL}orders/${id}`, { status: "paid" });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "paid" } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status");
    }
  };

  // ✅ Cancel Order
  const handleCancelOrder = async (id) => {
    try {
      await axios.patch(`${config.BASE_URL}orders/${id}`, {
        status: "cancelled",
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order");
    }
  };

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders</h2>

      {/* Filter bar: search left, filter right */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <input
          type="text"
          name="search"
          placeholder="Search by Order ID or Name"
          value={filters.search}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded-lg flex-1 sm:max-w-xs"
        />
        
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded-lg sm:max-w-xs"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left border-b">Order ID</th>
              <th className="px-4 py-3 text-left border-b">Item Type</th>
              <th className="px-4 py-3 text-left border-b">Amount</th>
              <th className="px-4 py-3 text-left border-b">Currency</th>
              <th className="px-4 py-3 text-left border-b">Status</th>
              <th className="px-4 py-3 text-left border-b">Created At</th>
              <th className="px-4 py-3 text-left border-b">Name</th>
              <th className="px-4 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-200 hover:bg-gray-50/50 transition-all text-sm whitespace-nowrap"          >
                <td className="px-4 py-3">{order.orderId || "N/A"}</td>
                <td className="px-4 py-3 capitalize">{order.itemType}</td>
                <td className="px-4 py-3">₹{order.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{order.currency}</td>
                <td
                  className={`px-4 py-3 font-medium capitalize ${order.status === "paid"
                      ? "text-green-700"
                      : order.status === "created" ||
                        order.status === "processing" ||
                        order.status === "pending"
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                >
                  {order.status}
                </td>
                <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center items-center gap-2">
                    {order.status !== "paid" && order.status !== "cancelled" && (
                      <button
                        onClick={() => handleMarkPaid(order._id)}
                        className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                        title="Mark as Paid"
                      >
                        ✅
                      </button>
                    )}
                    {order.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                        title="Cancel Order"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default AdminOrder;
