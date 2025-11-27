import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import cardImage from "../assets/image/card.jpg";
import config from "../pages/config";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ⭐ Copy Link Handler
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Meeting link copied to clipboard",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") || "";

        const res = await fetch(`${config.BASE_URL}users/${userId}/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (data.statusCode === 200 && data.result) {
          // ⭐ FILTER ONLY PAID COURSES
          const paidCourses = data.result.courses.flatMap((course) => {
            const paidOrder = course.orders.find(
              (o) => o.status === "paid" || o.payment?.status === "captured"
            );

            if (!paidOrder) return []; // ❌ not paid → skip

            const meetLink =
              course.details.googleMeetLink ||
              course.details.liveLink ||
              course.details.meetLink ||
              null;

            return [
              {
                ...course.details,
                paid: true,
                order: paidOrder,
                meetLink: meetLink,
              },
            ];
          });

          console.log("Filtered Paid Courses:", paidCourses);
          setEnrolledCourses(paidCourses);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load your enrolled courses!",
        });
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleCourseClick = (course) => {
    navigate("/course-details", { state: { item: course } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading your courses...</p>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <p className="text-gray-700 text-lg bg-yellow-100 font-sans px-6 py-4 flex justify-center items-center rounded shadow-md">
          You haven’t enrolled in any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:ml-64 px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
        My Enrolled Courses
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course, idx) => (
          <div
            key={course._id + idx}
            className="rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col"
          >
            <div className="relative">
              <div className="w-full h-40 sm:h-48 overflow-hidden rounded-t-xl">
                <img
                  src={course.image || cardImage}
                  alt={course.title}
                  onError={(e) => (e.target.src = cardImage)}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-medium">
                {course.mode === "Recorded" ? "Self-Paced" : "Live"}
              </span>

              {course.level && (
                <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded font-medium">
                  {course.level}
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between p-3">
              <div>
                <h3 className="text-lg text-gray-900 font-semibold leading-tight cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {course.instructor}
                </p>

                <p className="text-gray-700 text-sm leading-snug line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="flex gap-4 flex-wrap items-center text-xs text-gray-500 mb-3">
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <FaRegClock size={12} /> {course.duration}
                    </span>
                  )}

                  {course.studentsCount && (
                    <span className="flex items-center gap-1">
                      <MdGroup size={12} /> {course.studentsCount}
                    </span>
                  )}

                  {course.rating && (
                    <span className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx2) => (
                        <FaStar
                          key={idx2}
                          size={12}
                          className={
                            idx2 < Math.round(course.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-1 text-gray-500">
                        {course.rating}
                      </span>
                    </span>
                  )}
                </div>

                {/* ⭐ ORDER DETAILS */}
                {course.order && (
                  <div className="bg-gray-50 border rounded p-2 text-xs text-gray-600 mb-2">
                    <p>
                      <strong>Order ID:</strong> {course.order.orderId}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹
                      {(course.order.amount / 100).toLocaleString("en-IN")}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-green-600 font-medium">
                        {course.order.status}
                      </span>
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(course.order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                {/* ⭐ MEETING LINK (Only When Paid) */}
                <div className="mt-3">
                  {course.meetLink ? (
                    <div className="flex items-center gap-3">
                      <a
                        href={course.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                      >
                        Join Meet
                      </a>

                      <button
                        onClick={() => handleCopy(course.meetLink)}
                        className="px-3 py-2 border rounded text-sm"
                      >
                        Copy Link
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Meeting link will show after payment
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                {course.price && (
                  <p className="text-gray-900 font-medium">
                    ₹{course.price.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
