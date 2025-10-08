import React from 'react';
import { useNavigate } from "react-router-dom";

const Subfooter = () => {
 const  navigate = useNavigate();
  
  return (
    <div className="bg-yellow-400 py-10 px-6 md:px-12 lg:px-20 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-2xl  text-gray-900 mb-4">
        Ready to Start Your Trading Journey?
      </h2>
      <p className="text-base sm:text-lg md:text-md text-gray-800 mb-6 mx-auto">
        Join thousands of successful traders who trust Chat Stock Market for transparent, legal, and secure trading satisfaction.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* <button className="w-full sm:w-auto bg-gray-900 text-white px-6 py-1 rounded-md hover:bg-gray-800 transition">
          Start Learning Today
        </button> */}

           <button
      onClick={() => navigate("/courses")}
      className="w-full sm:w-auto bg-gray-900 text-white px-6 py-1 rounded-md hover:bg-gray-800 transition"
    >
      Start Learning Today
    </button>
        {/* <button className="w-full sm:w-auto bg-white  text-gray-900 border border-gray-900 px-6 py-1 rounded-md md:hover:bg-gray-900 md:hover:text-white
         transition">
          Learn How Much $ Is
        </button> */}
      </div>
    </div>
  );
};

export default Subfooter;
