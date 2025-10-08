import React from "react";
import { IoTrophyOutline } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { CiStar } from "react-icons/ci";

const Category = () => {
  const categories = [
    { id: 1, title: "Options Trading", courses: 12, icon: <IoTrophyOutline className="text-yellow-500 text-3xl" /> },
    { id: 2, title: "Technical Analysis", courses: 8, icon: <FaBookOpen className="text-yellow-500 text-3xl" /> },
    { id: 3, title: "Stock Market Basics", courses: 15, icon: <MdGroup className="text-yellow-500 text-3xl" /> },
    { id: 4, title: "Portfolio Management", courses: 10, icon: <CiStar className="text-yellow-500 text-3xl" /> },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* Heading */}
      <h2 className="text-2xl  text-gray-900 text-center mb-6">
        Browse by Category
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-200 gap-y-4"  
          >
            {/* Icon */}
            <div className="bg-yellow-100 p-3 rounded-full">
              {cat.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-medium text-gray-900">{cat.title}</h3>

            {/* Courses Count */}
            <p className="text-sm text-gray-600">{cat.courses} Courses</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
