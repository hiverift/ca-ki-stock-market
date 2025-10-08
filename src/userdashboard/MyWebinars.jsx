import React, { useState, useEffect } from "react";
import {
  FaLock,
  FaPause,
  FaChartLine,
  FaCogs,
  FaWallet,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaLightbulb,
  FaSearch,
  FaBalanceScale,
} from "react-icons/fa";
import {
  Calendar,
  Clock,
  Users,
  Video,
  ChevronDown,
  Play,
  Eye,
  Star,
} from "lucide-react";
import config from "../pages/config";

const MyWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.BASE_URL}webinars`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("All Webinars:", data.result || []);
        setWebinars(data.result || []);
      } catch (err) {
        console.error("Error fetching webinars:", err);
        setWebinars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold">Loading webinars...</h1>
      </div>
    );
  }

  // Paid webinars filter
  const paidWebinars = webinars.filter(
    (webinar) => webinar.price && Number(webinar.price) > 0
  );

  console.log("Paid Webinars:", paidWebinars);

  return (
    <div className="md:ml-64">
      <div className="text-white text-center text-lg font-semibold mx-auto px-4 sm:px-6 lg:px-8 space-y-4 w-full">
        {/* Webinars */}
        <div className="mt-6">
          {paidWebinars.length === 0 ? (
            <p className="text-gray-600 text-center">No paid webinars available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paidWebinars.map((webinar, index) => (
                <div
                  key={webinar._id || index}
                  className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-transform hover:shadow-lg hover:-translate-y-1 duration-200 h-full"
                >
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-start mb-5 space-x-2">
                      <span className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        {webinar.type}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        {webinar.level}
                      </span>
                    </div>
                    <h3 className="text-md font-semibold text-gray-600 mb-1 text-left">
                      {webinar.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 text-left">
                      {webinar.presenter || webinar.instructor}
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2 text-left">
                      {webinar.description}
                    </p>
                    <div className="flex flex-col space-y-1 mb-3 text-[11px] text-gray-600">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{webinar.startDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{webinar.durationMinutes} mins</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{webinar.attendeesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Video className="w-3 h-3" />
                          <span>{webinar.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border" />
                  <div className="bg-gray-50 px-4 py-4 flex items-center justify-between mt-auto border-t">
                    <div className="text-xl text-gray-600">
                      ₹{webinar.price || "Free"}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 rounded-md text-xs font-medium flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default MyWebinars;
