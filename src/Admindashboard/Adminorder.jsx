// src/components/AdminOrder.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../pages/config";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Orders from API
  const fetchOrders = async () => {
    
    try {
      setLoading(true);
      const res = await axios.get(`${config.BASE_URL}orders`);
   
      if (res.data?.statusCode === 200) {
        setOrders(res.data.result.orders || []);
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

  // ✅ Update payment status
  const handleMarkPaid = async (id) => {
    try {
      await axios.patch(`${config.BASE_URL}orders/${id}`, {
        status: "paid",
      });
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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Item Type</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Currency</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Created At</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-3 border">{order.orderId || "N/A"}</td>
                <td className="p-3 border capitalize">{order.itemType}</td>
                <td className="p-3 border">₹{(order.amount ).toFixed(2)}</td>
                <td className="p-3 border">{order.currency}</td>
                <td
                  className={`p-3 border font-medium capitalize ${
                    order.status === "paid"
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
                <td className="p-3 border">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="p-3 border flex gap-2">
                  {order.status !== "paid" && order.status !== "cancelled" && (
                    <button
                      onClick={() => handleMarkPaid(order._id)}
                      className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark as Paid
                    </button>
                  )}
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
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
