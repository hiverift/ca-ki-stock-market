import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../pages/config";

function PremiumWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.BASE_URL}orders/admin/paid/webinars`);

        if (response.data.result?.items) {
          console.log("Webinars data:", response.data.result.items);
          setWebinars(response.data.result.items);
        } else {
          setError("No webinars found");
        }
      } catch (err) {
        console.error("Error fetching webinars:", err);
        setError("Something went wrong while fetching webinars");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  // ✅ Helper function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        🌐 Premium Webinars (All)
      </h1>

      {loading && <p className="text-center text-gray-500">Loading webinars...</p>}
      {error && <p className="text-center text-red-500 text-sm font-medium mt-4">{error}</p>}
      {!loading && !error && webinars.length === 0 && (
        <p className="text-center text-gray-500">No premium webinars found.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {webinars.map((webinarData, index) => {
          console.log('websinar ', webinarData)
          const order = webinarData.order || {};
          const user = webinarData.user?.result || {};
          const item = webinarData.item?.result || {};

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100 relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                  Webinar
                </span>
                <span className="text-xs text-gray-500">
                  Purchased: {formatDate(order?.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title || "Untitled Webinar"}
              </h2>


              <div className="text-sm text-gray-600 space-y-3">
                {/* Webinar Details (always visible) */}
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="font-semibold text-yellow-700 mb-1">
                    📘 Webinar Details:
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDate(item.date)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <a
                      href={item.googleMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {item.googleMeetLink || "No link"}
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.googleMeetLink)}
                      className="text-sm text-gray-500 hover:text-gray-800"
                    >
                      Copy
                    </button>
                  </div>

                  <p>
                    <span className="font-semibold">Mode:</span>{" "}
                    {item.mode || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Instructor:</span>{" "}
                    {item.instructor || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> ₹
                    {item.price || "0"}
                  </p>
                </div>

                {/* Order Info */}
                <div className="border-t pt-3 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Order ID:</span>{" "}
                    {order.orderId || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ₹
                    {order.amount || "0"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`${order.status === "paid"
                        ? "text-green-600 font-semibold"
                        : "text-red-500"
                        }`}
                    >
                      {order.status || "N/A"}
                    </span>
                  </p>
                </div>

                {/* User Info */}
                <div className="bg-indigo-50 rounded-lg p-3 text-xs text-gray-700">
                  <p className="font-semibold text-indigo-700">👤 Booked by:</p>
                  <p>{user.name || "Unknown user"}</p>
                  <p>{user.email || "No email"}</p>
                  <p>{user.mobile || "No mobile"}</p>
                </div>


              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PremiumWebinars;
