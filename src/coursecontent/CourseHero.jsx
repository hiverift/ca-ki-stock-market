import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock, FaLock } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { CiSearch, CiFilter } from "react-icons/ci";
import cardImage from "../assets/image/card.jpg";
import config from "../pages/config";

export default function CourseHero() {
  const [activeTab, setActiveTab] = useState("live");
  const [coursesData, setCoursesData] = useState({ live: [], recorded: [] });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const navigate = useNavigate();

  // Mock user enrollment/subscription status (replace with actual logic)
  const [user] = useState({
    isEnrolled: false, // Replace with actual enrollment check
    isSubscribed: false, // Replace with actual subscription check
  });

  function extractYoutubeID(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // API to fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${config.BASE_URL}courses/getAllCourses`);
        const data = await res.json();
        const liveCourses = data.result.filter(
          (course) => course.mode === "Live"
        );
        const recordedCourses = data.result.filter(
          (course) => course.mode === "Recorded"
        );

        setCoursesData({
          live: liveCourses,
          recorded: recordedCourses,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    const courses = coursesData[activeTab];
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, activeTab, coursesData]);

  // Handle enroll button
  const handleEnroll = (course) => {
    navigate("/checkout", { state: { course, coursetype: "course" } });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-6">
      {/* Search & Filter Section */}
      {/* <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-gray-400">
          <CiSearch className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800"
          />
        </div>
        <button
          onClick={() => setSearchTerm("")}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow transition w-full sm:w-auto"
        >
          <CiFilter size={20} />
          <span className="text-sm font-medium">Clear Filter</span>
        </button>
      </div> */}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveTab("live")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "live"
              ? "bg-yellow-400 text-black"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Courses
        </button>
        {/* <button
          onClick={() => setActiveTab("recorded")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "recorded"
              ? "bg-yellow-400 text-black"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Recorded Courses
        </button> */}
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => {
          // Debug image path
          console.log("Course Image:", course.image);

          return (
            <div
              key={course._id}
              className="rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* Video Embed */}
              <div className="relative">
                <div className="relative w-full h-36 sm:h-44">
                  <img
                    src={
                      course.image
                        ? course.image.startsWith("http")
                          ? encodeURI(course.image)
                          : encodeURI(
                              `${config.IMAGE_URL}${course.image.replace(
                                /^\//,
                                ""
                              )}`
                            )
                        : course.youtubeVideoId
                        ? `https://img.youtube.com/vi/${course.youtubeVideoId}/hqdefault.jpg`
                        : cardImage
                    }
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                    {activeTab === "recorded" ? "Self-Paced" : "Live Course"}
                  </span>

                  <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                    {course.level || "Beginner"}
                  </span>
                </div>

                <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                  {activeTab === "recorded" ? "Self-Paced" : "Live Course"}
                </span>
                <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                  {course.level || "Beginner"}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="mt-3 px-3">
                    <h3 className="text-lg text-gray-900 leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      by {course.instructor || "Unknown"}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm mt-2 px-3 leading-snug">
                    {expanded[course._id]
                      ? course.description
                      : course.description?.slice(0, 80) +
                        (course.description?.length > 80 ? "..." : "")}

                    {course.description?.length > 80 && (
                      <button
                        className="text-blue-600 ml-2 text-xs underline"
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [course._id]: !prev[course._id],
                          }))
                        }
                      >
                        {expanded[course._id] ? "Show less" : "Read more"}
                      </button>
                    )}
                  </p>

                  <div className="flex gap-4 flex-wrap items-center text-xs text-gray-500 mt-2 px-3">
                    <span className="flex items-center gap-1">
                      <FaRegClock /> {course.duration || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdGroup /> {course.studentsCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />{" "}
                      {course.rating || 0}
                    </span>
                  </div>
                </div>

                {/* Enroll Button */}
                <div className="mt-4 px-3 pb-4 flex items-center justify-between">
                  <p className="text-gray-900 font-medium">₹{course.price}</p>
                  <button
                    onClick={() => handleEnroll(course)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-lg text-sm text-black"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
