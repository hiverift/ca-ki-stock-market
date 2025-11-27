import React, { useEffect, useState } from "react";
import axios from "axios";
import config from '../pages/config';

function PremiumCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${config.BASE_URL}orders/admin/paid/courses`
        );

        if (response.data.result?.items) {
          console.log("Courses data:", response.data.result.items);
          setCourses(response.data.result.items);
        } else {
          setError("No courses found");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Something went wrong while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Meet link copied!");
  };

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
        🎓 Premium Courses
      </h1>

      {loading && <p className="text-center text-gray-500">Loading courses...</p>}
      {error && (
        <p className="text-center text-red-500 text-sm font-medium mt-4">
          {error}
        </p>
      )}
      {!loading && !error && courses.length === 0 && (
        <p className="text-center text-gray-500">No premium courses found.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {courses.map((courseData, index) => {
          const order = courseData.order;
          const user = courseData.user?.result;
          const item = courseData.item?.result;

          // ⭐ Detect Meet Link
          const meetLink =
            item?.googleMeetLink ||
            item?.meetLink ||
            item?.liveLink ||
            null;

          // ⭐ Join button only if fully paid
          const isPaid =
            order?.status === "paid" &&
            order?.payment?.status === "captured";

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              {/* Order Info */}
              <div className="border-t pt-3 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order?.orderId || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₹
                  {order?.amount || "0"}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`${
                      isPaid ? "text-green-600 font-semibold" : "text-red-500"
                    }`}
                  >
                    {order?.status || "N/A"}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Purchased:</span>{" "}
                  {formatDate(order?.createdAt)}
                </p>
              </div>

              {/* User Info */}
              <div className="mt-4 bg-indigo-50 rounded-lg p-3 text-xs text-gray-700">
                <p className="font-semibold text-indigo-700">Purchased by:</p>
                <p>{user?.name || "Unknown user"}</p>
                <p>{user?.email || "No email"}</p>
                <p>{user?.mobile || "No mobile"}</p>
              </div>

              {/* Course Info */}
              {item && (
                <div className="mt-4 bg-green-50 rounded-lg p-3 text-xs text-gray-700">
                  <p className="font-semibold text-green-700">Course:</p>
                  <p>{item?.title || "N/A"}</p>
                  <p>Instructor: {item?.instructor || "N/A"}</p>
                  <p>Price: ₹{item?.price || "0"}</p>
                  <p>Mode: {item?.mode || "N/A"}</p>
                </div>
              )}

              {/* ⭐ JOIN MEET BUTTON (Only if Paid) */}
              <div className="mt-4">
                {isPaid ? (
                  <div className="flex items-center gap-3">
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                    >
                      Join Meet
                    </a>

                    <button
                      onClick={() => handleCopy(meetLink)}
                      className="px-3 py-2 border rounded text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {meetLink
                      ? "Payment required to view meeting link"
                      : "Meeting link not added"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PremiumCourses;
