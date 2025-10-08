// src/components/AdminPayments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../pages/config"; // correct path check kar lena

const AdminPayments = ({ userId = "68b1a01074ad0c19f272b438" }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch API data
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const res = await axios.get(`${config.BASE_URL}kyc/status/${userId}`);
        if (res.data?.statusCode === 200) {
          setPaymentData(res.data.result);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching KYC status");
      } finally {
        setLoading(false);
      }
    };

    fetchKycStatus();
  }, [userId]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">KYC Payment Status</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : paymentData ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">Payment Status</th>
                <th className="p-3 border">Remark</th>
                <th className="p-3 border">Uploaded Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">{paymentData.userId}</td>
                <td className="p-3 border">{paymentData._id}</td>
                <td
                  className={`p-3 border font-medium capitalize ${
                    paymentData.status === "verified"
                      ? "text-green-700"
                      : paymentData.status === "pending"
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {paymentData.status}
                </td>
                <td className="p-3 border">{paymentData.remark || "—"}</td>
                <td className="p-3 border">
                  {new Date(paymentData.uploadedDate).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No data available</p>
      )}
    </div>
  );
};

export default AdminPayments;
