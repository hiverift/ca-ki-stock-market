import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaCogs,
  FaWallet,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaLightbulb,
  FaSearch,
  FaBalanceScale,
} from "react-icons/fa";
import { Calendar, Clock, Users, Video } from "lucide-react";
import Footer from "./Footer";

const API_BASE = "https://www.cakistockmarket.com/api/v1";

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const specializations = [
    { name: "Market Analysis", icon: <FaChartLine />, active: true },
    { name: "Option Trading", icon: <FaCogs /> },
    { name: "Technical Analysis", icon: <FaWallet /> },
    { name: "Investment Strategy", icon: <FaShieldAlt /> },
    { name: "Risk Management", icon: <FaFileInvoiceDollar /> },
    { name: "Sector Analysis", icon: <FaLightbulb /> },
    { name: "Cryptocurrency", icon: <FaSearch /> },
    { name: "Portfolio Review", icon: <FaBalanceScale /> },
  ];

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const res = await fetch(`${API_BASE}/webinars`);
        const data = await res.json();

        if (data?.statusCode === 200 && Array.isArray(data.result)) {
          // TODAY + FUTURE WEBINARS ONLY
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcoming = data.result.filter((webinar) => {
            const wDate = new Date(webinar.startDate);
            wDate.setHours(0, 0, 0, 0);
            return wDate >= today;
          });

          setWebinars(upcoming);
        }
      } catch (err) {
        console.error("Failed to fetch webinars", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  const handleRegister = (webinar) => {
    navigate("/checkout", { state: { webinar, webinartype: "webinar" } });
  };

  return (
    <div className="pt-24">
      <div className="text-white text-center text-lg mx-auto px-4 sm:px-6 lg:px-8 space-y-4 max-w-7xl">
        {/* Loading State */}
        {loading && <p className="text-gray-600">Loading webinars...</p>}
        {!loading && webinars.length === 0 && (
          <p className="text-gray-600">No webinars found.</p>
        )}

        {/* Webinars List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {webinars.map((webinar) => (
            <div
              key={webinar._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-transform hover:shadow-lg hover:-translate-y-1 duration-200 h-full"
            >
              {/* Dynamic Image */}
              <div className="w-full h-40 overflow-hidden rounded-t-lg">
                <img
                  src={
                    webinar.thumbnail
                      ? webinar.thumbnail
                      : webinar.youtubeVideoId
                      ? `https://img.youtube.com/vi/${webinar.youtubeVideoId}/hqdefault.jpg`
                      : "https://via.placeholder.com/600x400?text=Webinar+Image"
                  }
                  alt={webinar.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                {/* <div className="flex items-center justify-start mb-3 space-x-2">
                  <span className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {webinar.price > 0 ? "Paid" : "Free"}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {webinar.categoryId?.name || "All Levels"}
                  </span>
                </div> */}
                <h3 className="text-md text-gray-600 mb-1 text-left">
                  {webinar.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 text-left">
                  {webinar.presenter}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2 text-left">
                  {webinar.description}
                </p>

                <div className="flex flex-col space-y-1 mb-3 text-[11px] text-gray-600">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {webinar.startDate
                          ? new Date(webinar.startDate).toLocaleDateString()
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{webinar.durationMinutes} minutes</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{webinar.attendeesCount} registered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="w-3 h-3" />
                      <span>{webinar.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3 text-left">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Agenda:
                  </h4>
                  <ol className="space-y-0.5">
                    {webinar.agenda?.map((item, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-gray-700 flex items-start"
                      >
                        <span className="text-yellow-600 font-medium mr-1">
                          {i + 1}.
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <hr className="border" />
              <div className="bg-gray-50 px-4 py-4 flex items-center justify-between mt-auto border-t">
                <div className="text-xl text-gray-600">
                  {webinar.price > 0 ? `₹${webinar.price}` : "Free"}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleRegister(webinar)}
                    className="px-4 py-2 rounded-md text-xs font-medium flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors"
                  >
                    {webinar.price > 0 ? "Register Now" : "Register Free"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse by specialization */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16">
          <h2 className="text-md font-bold text-gray-800 mb-8 text-left">
            Browse by Specialization
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {specializations.map((item, idx) => (
              <button
                key={idx}
                className={`flex flex-col items-center gap-3 px-4 py-3 rounded-lg shadow-sm border transition text-sm font-medium ${
                  item.active
                    ? "text-black"
                    : "bg-white text-gray-700 hover:bg-yellow-400"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Webinars;
