import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import cardImage from "../assets/image/card.jpg";
import config from "../pages/config";

const MyCourses = () => {
  const [enrolledItems, setEnrolledItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        console.log("token after login", token);
        const userId = "68b1a01074ad0c19f272b438"; // FIXED ID

        const res = await fetch(`${config.BASE_URL}users/${userId}/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (data.statusCode === 200 && data.result) {
          const allItems = [
            ...data.result.courses.map((c) => ({
              ...c.details,
              paid: c.paid,
              latestOrder: c.latestOrder,
              itemType: "course",
            })),
          
          ];
          setEnrolledItems(allItems);
        } else {
          setEnrolledItems([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled items:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load your enrolled items!",
        });
        setEnrolledItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledItems();
  }, []);

  const handleItemClick = (item) => {
    navigate("/course-details", { state: { item } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading your courses...</p>
      </div>
    );
  }

  if (enrolledItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <p className="text-gray-700 text-lg bg-yellow-100 font-sans px-6 py-4 flex justify-center items-center rounded shadow-md">
          You haven’t enrolled in any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
        My Enrolled Items
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledItems.map((item) => (
          <div
            key={item._id}
            className="rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Video replaces Image if available */}
            <div className="relative">
              {item.youtubeVideoId ? (
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-36 sm:h-44 object-cover"
                ></iframe>
              ) : (
                <img
                  src={item.image || cardImage}
                  alt={item.title}
                  onError={(e) => (e.target.src = cardImage)}
                  className="w-full h-36 sm:h-44 object-cover"
                />
              )}

              <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-medium">
                {item.itemType === "course" || item.itemType === "webinar"
                  ? item.mode === "Recorded"
                    ? "Self-Paced"
                    : "Live"
                  : "Appointment"}
              </span>
              <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded font-medium">
                {item.level || ""}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-3">
              <div>
                <h3 className="text-lg text-gray-900 font-semibold leading-tight">
                  {item.title || item.serviceId || "No Title"}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.instructor || item.presenter || "Unknown"}
                </p>
                <p className="text-gray-700 text-sm leading-snug line-clamp-2 mb-3">
                  {item.description || "No description available."}
                </p>

                <div className="flex gap-4 flex-wrap items-center text-xs text-gray-500 mb-3">
                  {item.duration && (
                    <span className="flex items-center gap-1">
                      <FaRegClock size={12} /> {item.duration}
                    </span>
                  )}
                  {item.studentsCount && (
                    <span className="flex items-center gap-1">
                      <MdGroup size={12} /> {item.studentsCount}
                    </span>
                  )}
                  {item.rating && (
                    <span className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          size={12}
                          className={`text-xs ${
                            idx < Math.round(item.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-gray-500">
                        {item.rating || 0}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between mt-2">
                {item.price && (
                  <p className="text-gray-900 font-medium">₹{item.price}</p>
                )}
                <button
                  onClick={() => handleItemClick(item)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
