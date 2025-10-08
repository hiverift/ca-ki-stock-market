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

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in");

        const res = await fetch(`${config.BASE_URL}courses/enrolled/${userId}`);
        const data = await res.json();

        if (data.statusCode === 200) {
          setEnrolledCourses(data.result);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load your courses!",
        });
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleCourseClick = (course) => {
    navigate("/course-details", { state: { course } });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
        My Courses
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            className="rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={course.image || cardImage}
                alt={course.title}
                onError={(e) => (e.target.src = cardImage)}
                className="w-full h-36 sm:h-44 object-cover"
              />
              <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-medium">
                {course.mode === "Recorded" ? "Self-Paced" : "Live Course"}
              </span>
              <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded font-medium">
                {course.level || "Beginner"}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-3">
              <div>
                <h3 className="text-lg text-gray-900 font-semibold leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  by {course.instructor || "Unknown"}
                </p>
                <p className="text-gray-700 text-sm leading-snug line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="flex gap-4 flex-wrap items-center text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FaRegClock /> {course.duration || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdGroup /> {course.studentsCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FaStar
                        key={idx}
                        className={`text-xs ${
                          idx < Math.round(course.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-gray-500">
                      {course.rating || 0}
                    </span>
                  </span>
                </div>
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-900 font-medium">₹{course.price}</p>
                <button
                  onClick={() => handleCourseClick(course)}
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
