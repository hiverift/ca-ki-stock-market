import React from "react";
import { RiStarSFill } from "react-icons/ri";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaBullseye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Menpic from "../assets/image/men.jpg"

const MentorCard = () => {
  return (
    <div className="bg-gray-50 py-10">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl  text-gray-900">Our Mentors</h2>
        <p className="text-gray-600 mt-2">
          Learn from experienced professionals who are committed to your success
        </p>
      </div>

      {/* Card Container */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Left: Image + Stars */}
        <div className="flex flex-col items-center md:w-1/3">
          <img
            src={Menpic}
            alt="Mentor"
            className="w-36 h-36 rounded-full object-cover shadow-md"
          />
          <div className="flex mt-3 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <RiStarSFill key={i} size={22} />
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 md:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl  text-gray-900">CA Paras Muradia</h3>
            <div className="flex items-center text-gray-600 text-sm mt-1 gap-1">
              <HiOutlineBadgeCheck className="text-yellow-500" /> Chartered Accountant
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            Chartered Accountant with 12+ years of comprehensive experience in
            Financial Planning, Accounts Management & Taxation. As the founder
            of this initiative, CA Paras Muradia is on a mission to counter
            fraudulent advisory services in the market.
          </p>

          {/* Mission Section */}
          <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-700 flex items-start gap-2">
            <FaBullseye className="text-yellow-500 mt-1" />
            <p>
              <span className="font-semibold">Mission: </span>
              Provide affordable, transparent & authentic financial education to help
              individuals make informed investment decisions and achieve financial
              independence through legal and secure trading practices.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-between mt-5 gap-5 text-center">
            <div className="flex-1 min-w-[100px]">
              <h4 className="text-xl  text-gray-900">12+</h4>
              <p className="text-gray-500 text-sm">Years Experience</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <h4 className="text-xl text-gray-900">50,000+</h4>
              <p className="text-gray-500 text-sm">Students Guided</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <h4 className="text-xl  text-gray-900">100%</h4>
              <p className="text-gray-500 text-sm">Transparency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
