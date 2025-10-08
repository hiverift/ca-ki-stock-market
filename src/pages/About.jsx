import React from "react";
import { FaBookOpen } from "react-icons/fa";
import Human1 from"../assets/image/Human1.jpg"
import { Star, Award, CheckCircle, Heart } from 'lucide-react';
import { ShieldCheck, BookOpen, Circle,  } from "lucide-react";
// import { PiMedalLight } from "react-icons/pi";
import { PiMedalLight } from "react-icons/pi";
import {  FaUsers, FaUserGraduate } from "react-icons/fa";
import Footer from './Footer'
import { FaArrowTrendUp } from "react-icons/fa6";
import { BsFilterCircle } from "react-icons/bs";
import { AiOutlineSecurityScan,  } from "react-icons/ai";
import { RiGroupLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";







 const values = [
    {
      title: "Transparency",
      description:
        "Complete openness in all our operations, pricing, and educational content. No hidden fees, no misleading promises – just honest, authentic guidance.",
      icon: <Circle className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Ethics",
      description:
        "Strict adherence to professional standards and regulatory compliance. We prioritize our students' financial well-being over profits.",
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Authentic Education",
      description:
        "Evidence-based learning materials created by qualified professionals. Real-world application with practical insights and proven methodologies.",
      icon: <BookOpen className="w-6 h-6 text-yellow-500" />,
      color: "bg-yellow-50",
    },
  ];



  
// Removed duplicate About component declaration and logic.
// Navigation logic can be added to the main About component below if needed.














const About = () => {




  const navigate = useNavigate();

  const handleExploreCourses = () => {
  navigate("/courses");  // ✅ Course page pe le jaega
};

const handleGetInTouch = () => {
  navigate("/contact"); // ✅ Contact page pe le jaega
};


  return (








    

    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 mb-16 space-y-8 font-sans ">
   <div className="text-center py-8">
  <h1 className="text-2xl sm:text-3xl md:text-4xl  text-gray-900 mb-3">
    About CA ki Stock Market
  </h1>
  <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
    Your trusted partner in legal, secure, and transparent financial education
  </p>
  {/* Divider Line */}
  <div className="mt-4 w-16 h-1 bg-yellow-500 mx-auto rounded-full"></div>
</div>


      {/* hero section   */}

     <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-12 lg:px-20 py-12 bg-white">
  {/* Left Section */}
  <div className="md:w-1/2 space-y-6">
    <h1 className="text-xl sm:text-2xl md:text-3xl  text-gray-900">
      Who We Are
    </h1>
    <p className="text-gray-600 leading-relaxed">
      CA ki Stock Market is a comprehensive educational and consultancy
      platform founded with a clear mission: <span className=" text-gray-800">Learn</span> | <span className=" text-gray-800">Earn</span> | <span className=" text-gray-800">Grow </span>
      with complete transparency and authenticity.
    </p>
    <p className="text-gray-600 leading-relaxed">
      We are dedicated to providing high-quality financial education that
      empowers individuals to make informed investment decisions. Our
      platform serves as a beacon of trust in an industry often plagued by
      fraudulent advisory services.
    </p>

    {/* Icons Section */}
   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
  <div className="flex flex-col items-center text-center space-y-2">
    <div className="bg-yellow-100   p-4 rounded-full flex items-center justify-center">
      <FaBookOpen className=" text-2xl text-amber-500" />
    </div>
    <h1 className="text-lg ">Learn</h1>
    <p className="text-sm text-gray-500">Expert Education</p>
  </div>
  
  <div className="flex flex-col items-center text-center space-y-2">
    <div className="bg-yellow-100  p-4 rounded-full flex items-center justify-center">
      <FaArrowTrendUp className=" text-2xl text-amber-500" />
    </div>
    <h1 className="text-lg ">Earn</h1>
    <p className="text-sm text-gray-500">Financial Growth</p>
  </div>
  
  <div className="flex flex-col items-center text-center space-y-2">
    <div className="bg-yellow-100  p-4 rounded-full flex items-center justify-center">
      <BsFilterCircle className=" text-2xl text-amber-500" />
    </div>
    <h1 className="text-lg ">Grow</h1>
    <p className="text-sm text-gray-500">With Transparency</p>
  </div>
</div>


    
  </div>

  {/* Right Section */}
  <div className="md:w-1/2 flex justify-center">
    <img src={Human1} alt="Who We Are" className="w-full max-w-md rounded-lg shadow-md" />
  </div>
</div>






        <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl  text-gray-900 mb-3 sm:mb-4">
            Our Mentor
          </h1>
          <div className="inline-block bg-gray-300 px-4 sm:px-6 py-2 rounded-md">
            <p className="text-sm sm:text-base text-gray-700">
              Leading the mission to provide authentic financial education
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            
            {/* Left Section - Profile Image and Basic Info */}
            <div className="flex-shrink-0 text-center lg:text-left">
              {/* Profile Image */}
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format" 
                  alt="CA Paras Muradia"
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover mx-auto lg:mx-0 shadow-md"
                />
              </div>
              
              {/* Name and Title */}
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl  text-gray-900 mb-2">
                  CA Paras Muradia
                </h2>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-yellow-600">
                  <Award className="w-4 h-4" />
                  <span className="text-sm sm:text-base font-medium">
                    Chartered Accountant & Founder
                  </span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-center lg:justify-start space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            
            {/* Right Section - Description and Details */}
            <div className="flex-1">
              {/* Description */}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 text-center lg:text-left">
                CA Paras Muradia is a distinguished Chartered Accountant with over 12 years of 
                comprehensive experience in Financial Planning, Accounts Management & Taxation. As 
                the visionary founder of CA ki Stock Market, he has dedicated his career to combating 
                fraudulent advisory services and promoting ethical financial practices.
              </p>
              
              {/* Two Column Layout for Expertise and Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Expertise Areas */}
                <div>
                  <h3 className="text-lg  text-gray-900 mb-4">Expertise Areas:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Financial Planning & Analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Accounts Management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Taxation & Compliance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Investment Strategy</span>
                    </div>
                  </div>
                </div>
                
                {/* Achievements */}
                <div>
                  <h3 className="text-lg  text-gray-900 mb-4">Achievements:</h3>
                  
                  {/* Years Experience */}
                  <div className="text-center bg-yellow-50 rounded-lg p-4 mb-4">
                    <div className="text-3xl sm:text-4xl  text-yellow-600 mb-1">
                      12+
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      Years Experience
                    </p>
                  </div>
                  
                  {/* Students Guided */}
                  <div className="text-center bg-yellow-50 rounded-lg p-4 p">
                    <div className="text-3xl sm:text-4xl  text-yellow-600 mb-1">
                      50,000+
                    </div>
                    <p className="text-gray-700 text-sm font-medium">
                      Students Guided
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mission Statement Section */}
          <div className="bg-yellow-100 mx-6 sm:mx-8 lg:mx-10 mb-6 sm:mb-8 lg:mb-10 rounded-lg p-4 sm:p-6 mt-10">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg  text-gray-900 mb-3">
                  Mission Statement
                </h3>
                <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed italic">
                  "To provide affordable, transparent & authentic financial education that empowers 
                  individuals to make informed investment decisions. My goal is to create a platform 
                  where ethical practices prevail and students can learn without the fear of fraudulent 
                  advice."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl  text-gray-900">Our Vision & Values</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          The principles that guide our mission and define our commitment.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center gap-4 ${value.color}`}
          >
            <div className="p-3 rounded-full bg-white border">{value.icon}</div>
            <h3 className="text-lg  text-gray-800">{value.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>
    </section>

{/* Why Choose CA ki Stock Market?  */}
<div className="border-t-2  py-12 px-6 md:px-12 lg:px-20 bg-white border md:border-gray-200 rounded-md">
  {/* Title Section */}
  <div className="text-center mb-10">
    <h1 className="text-2xl md:text-3xl  text-gray-900">
      Why Choose CA ki Stock Market?
    </h1>
    <p className="text-gray-600 text-sm md:text-base mt-2">
      We stand apart from other platforms through our commitment to authenticity
    </p>
  </div>

  {/* 4 Feature Boxes */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
    {/* Box 1 */}
    <div className="bg-white p-6 rounded-xl    flex flex-col items-center text-center ">
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <PiMedalLight className="text-yellow-600 text-3xl" />
      </div>
      <h2 className="text-lg  text-gray-900 mb-2">
        CA Certified
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        All courses designed and led by qualified Chartered Accountants
      </p>
    </div>

    {/* Box 2 */}
    <div className="bg-white p-6 rounded-xl   flex flex-col items-center text-center ">
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <AiOutlineSecurityScan  className="text-yellow-600 text-3xl" />
      </div>
      <h2 className="text-lg d text-gray-900 mb-2">
        SEBI Compliant
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        Full compliance with regulatory standards and legal requirements
      </p>
    </div>

    {/* Box 3 */}
    <div className="bg-white p-6 rounded-xl    flex flex-col items-center text-center ">
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <RiGroupLine  className="text-yellow-600 text-3xl" />
      </div>
      <h2 className="text-lg  text-gray-900 mb-2">
        Community Focus
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        Building a community of informed, ethical traders and investors
      </p>
    </div>

    {/* Box 4 */}
    <div className="bg-white p-6 rounded-xl   flex flex-col items-center text-center">
      <div className="bg-yellow-100 p-4 rounded-full mb-4">
        <CiHeart  className="text-yellow-600 text-3xl" />
      </div>
      <h2 className="text-lg  text-gray-900 mb-2">
        Student First
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        Your success is our priority - affordable, accessible education for all
      </p>
    </div>
  </div>
</div>





 <div className="bg-yellow-400 py-10 px-6 md:px-12 lg:px-20 text-center rounded-md">
      <h2 className="text-2xl sm:text-3xl md:text-2xl  text-gray-900 mb-4">
        Ready to Join Our Mission?
      </h2>
      <p className="text-base sm:text-lg md:text-md text-gray-800 mb-6 mx-auto">
      Be part of the change towards transparent and authentic financial education
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button  onClick={handleExploreCourses} className="w-full sm:w-auto bg-gray-900 text-white px-6 py-1 rounded-md hover:bg-gray-800 transition">
         Explore Our Courses
        </button>
        <button onClick={handleGetInTouch} className="w-full sm:w-auto bg-white  text-gray-900 border border-gray-900 px-6 py-1 rounded-md md:hover:bg-gray-900 md:hover:text-white
         transition">
         Get in Touch
        </button>
      </div>
    </div>



    </div>

    <Footer/>
  

</>
  );
};

export default About;
