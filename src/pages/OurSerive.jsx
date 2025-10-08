import React from 'react'
import { RiGroupLine, RiBookOpenLine, RiVideoLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

const OurSerive = () => {
  return (
    <div>
      <div className="py-12 bg-gray-50">
  {/* Heading */}
  <div className="text-center mb-10">
    <h2 className="text-2xl  text-gray-800">Our Services</h2>
    <p className="text-gray-500 mt-2">
      Comprehensive solutions for your trading and investment education
    </p>
  </div>

  {/* Cards Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
    
    {/* Card 1 */}
    <Link to="/consultancy">
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center flex flex-col items-center gap-6 h-full">
        <div className="bg-yellow-100 p-5 rounded-full flex items-center justify-center mb-4">
          <RiGroupLine className="text-3xl text-yellow-600" />
        </div>
        <h3 className="text-lg  text-gray-800 mb-2">Consulting</h3>
        <p className="text-gray-600 text-sm mb-4">
          Get personalized guidance from expert CAs for your trading and investment decisions
        </p>
        <button className="bg-yellow-400 text-black px-5 py-2 rounded-md hover:bg-yellow-500 transition text-sm font-medium">
          Book Consultation
        </button>
      </div>
    </Link>

    {/* Card 2 */}
    <Link to="/courses">
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center flex flex-col items-center h-full gap-6">
        <div className="bg-yellow-100 p-5 rounded-full flex items-center justify-center mb-4">
          <RiBookOpenLine className="text-3xl text-yellow-600" />
        </div>
        <h3 className="text-lg  text-gray-800 mb-2">Courses</h3>
        <p className="text-gray-600 text-sm mb-4">
          Comprehensive courses designed by qualified CAs covering all aspects of stock market
        </p>
        <button className="bg-yellow-400 text-black px-5 py-2 rounded-md hover:bg-yellow-500 transition text-sm font-medium">
          Explore Courses
        </button>
      </div>
    </Link>

    {/* Card 3 */}
    <Link to="/webinars">
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center flex flex-col items-center gap-6 h-full">
        <div className="bg-yellow-100 p-5 rounded-full flex items-center justify-center mb-4">
          <RiVideoLine className="text-3xl text-yellow-600" />
        </div>
        <h3 className="text-lg  text-gray-800 mb-2">Webinars</h3>
        <p className="text-gray-600 text-sm mb-4">
          Live and recorded webinars on market trends, strategies, and regulatory updates
        </p>
        <button className="bg-yellow-400 text-black px-5 py-2 rounded-md hover:bg-yellow-500 transition text-sm font-medium">
          Join Webinars
        </button>
      </div>
    </Link>

  </div>
</div>
    </div>
  )
}

export default OurSerive
