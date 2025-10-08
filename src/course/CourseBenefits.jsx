import React from "react";
import { FaBook, FaUserAlt, FaTrophy } from "react-icons/fa";

const CourseBenefits = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
      <h2 className="text-3xl  text-gray-800 mb-10 text-center ">
        Why Choose Our Courses?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border border-gray-300 py-10 shadow-md rounded">
        {/* Expert Instructors */}
        <div className="flex flex-col items-center text-gray-700 gap-4  rounded-lg p-6  transition text-center">
          <FaBook className="text-5xl text-yellow-500" />
          <h3 className="text-xl ">Expert Instructors</h3>
          <p className="text-sm text-gray-600">
            Learn from qualified CAs with years of market experience.
          </p>
        </div>

        {/* Interactive Learning */}
        <div className="flex flex-col items-center text-gray-700 gap-4  rounded-lg p-6   transition text-center">
          <FaUserAlt className="text-5xl text-yellow-500" />
          <h3 className="text-xl ">Interactive Learning</h3>
          <p className="text-sm text-gray-600">
            Engage with live sessions, Q&As, and practical exercises.
          </p>
        </div>

        {/* Proven Results */}
        <div className="flex flex-col items-center text-gray-700 gap-4  rounded-lg p-6   transition text-center">
          <FaTrophy className="text-5xl text-yellow-500" />
          <h3 className="text-xl ">Proven Results</h3>
          <p className="text-sm text-gray-600">
            Join thousands of successful traders who learned with us.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CourseBenefits;
