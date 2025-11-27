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
        const response = await axios.get(
          `${config.BASE_URL}orders/admin/paid/webinars`
        );

        if (response.data.result?.items) {
          setWebinars(response.data.result.items);
        } else {
          setError("No webinars found");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error fetching webinars");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

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

  // detect link
  const getLink = (item, keys) => {
    if (!item) return null;
    for (let key of keys) {
      if (item[key]) return item[key];
    }
    return null;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link Copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        🌐 Premium Webinars (All)
      </h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {webinars.map((webinarData, index) => {
          const order = webinarData.order || {};
          const user = webinarData.user?.result || {};
          const item = webinarData.item?.result || {}; // <-- backend must return item

          // Meet Link
          const googleMeetLink = getLink(item, [
            "googleMeetLink",
            "meetLink",
            "google_link",
            "gmeet",
            "meetingLink",
            "link",
          ]);

          // same logic as MyAppointment
          const isPaid =
            order?.status === "paid" &&
            order?.payment?.status === "captured";

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 border border-gray-100"
            >
              <div className="flex justify-between mb-3">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  Webinar
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(order?.createdAt)}
                </span>
              </div>

              <h2 className="text-lg font-semibold mb-2">
                {item?.title || "Untitled Webinar"}
              </h2>

              {/* DETAILS */}
              <div className="bg-yellow-50 p-3 rounded-lg mb-3 text-sm">
                <p>
                  <strong>Date:</strong> {formatDate(item?.startDate)}
                </p>
                <p>
                  <strong>Presenter:</strong> {item?.presenter}
                </p>
                <p>
                  <strong>Duration:</strong> {item?.durationMinutes} mins
                </p>
                <p>
                  <strong>Price:</strong> ₹{item?.price}
                </p>
              </div>

              {/* ⭐ JOIN MEET BUTTON - SAME AS MYAPPOINTMENT */}
              {isPaid  ? (
                <div className="flex items-center gap-3 my-3">
                  <a
                    href={googleMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                  >
                    Join Meet
                  </a>

                  <button
                    onClick={() => handleCopy(googleMeetLink)}
                    className="px-3 py-2 border rounded text-sm"
                  >
                    Copy
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {googleMeetLink
                    ? "Payment required to view the link"
                    : "Meet link not added"}
                </p>
              )}

              {/* ORDER INFO */}
              <div className="border-t pt-3 text-sm">
                <p>
                  <strong>Order ID:</strong> {order.orderId}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{order.amount}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    {order.status}
                  </span>
                </p>
              </div>

              {/* USER */}
              <div className="mt-3 bg-indigo-50 p-3 rounded text-xs">
                <p className="font-semibold text-indigo-700">👤 User:</p>
                <p>{user?.name}</p>
                <p>{user?.email}</p>
                <p>{user?.mobile}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PremiumWebinars;
