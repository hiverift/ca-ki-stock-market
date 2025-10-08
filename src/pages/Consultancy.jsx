// src/pages/Consultancy.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch, CiFilter } from "react-icons/ci";
import { Star, Clock, MessageCircle, Phone } from "lucide-react";
import {
  FaChartLine,
  FaCogs,
  FaWallet,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaLightbulb,
  FaSearch,
  FaBalanceScale,
  FaBook,
  FaUserAlt,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import config from "../pages/config";

/**
 * Centralized constants object — edit here to change behavior/site-wide
 * - ITEMS_PER_PAGE: number of consultants shown per page
 * - PAGINATION_MAX_BUTTONS: how many numbered page buttons to show
 * - PLACEHOLDER_IMG: fallback avatar
 * - ACTIVE_PAGE_CLASS: tailwind class for active page button
 */
const CONST = {
  ITEMS_PER_PAGE: 3,
  PAGINATION_MAX_BUTTONS: 5,
  PLACEHOLDER_IMG: "https://via.placeholder.com/64",
  ACTIVE_PAGE_CLASS: "bg-yellow-400 text-black shadow-md scale-105",
};

const specializations = [
  { name: "Options Trading", icon: <FaChartLine />, active: true },
  { name: "Technical Analysis", icon: <FaCogs /> },
  { name: "Portfolio Management", icon: <FaWallet /> },
  { name: "Risk Assessment", icon: <FaShieldAlt /> },
  { name: "Tax Planning", icon: <FaFileInvoiceDollar /> },
  { name: "Investment Strategy", icon: <FaLightbulb /> },
  { name: "Market Research", icon: <FaSearch /> },
  { name: "Compliance/Legal", icon: <FaBalanceScale /> },
];

const Consultancy = ({ showFooter = true, fullWidth = false }) => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${config.BASE_URL}consultancies/getAllConsultancy`);
        const data = await res.json();
        console.log("fetchConsultants response:", data);

        let items = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data?.result?.items)) items = data.result.items;
        else if (Array.isArray(data?.items)) items = data.items;
        else if (Array.isArray(data?.data)) items = data.data;
        else {
          const possible = Object.values(data || {}).find((v) => Array.isArray(v));
          if (Array.isArray(possible)) items = possible;
        }

        setConsultants(items);
      } catch (err) {
        console.error("Error fetching consultants:", err);
        setConsultants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  const consultantsArray = Array.isArray(consultants) ? consultants : [];
  const filteredConsultants = consultantsArray.filter((c) =>
    (c.fullName || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // compute pagination
  const totalItems = filteredConsultants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CONST.ITEMS_PER_PAGE));

  // clamp currentPage when filtered results change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // Use a clamped page for slicing so we never slice with an out-of-range page
  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));

  const paginated = useMemo(() => {
    const start = (clampedPage - 1) * CONST.ITEMS_PER_PAGE;
    return filteredConsultants.slice(start, start + CONST.ITEMS_PER_PAGE);
  }, [filteredConsultants, clampedPage]);

  // helpers for page controls
  const goTo = (p) => {
    const page = Math.max(1, Math.min(totalPages, p));
    setCurrentPage(page);
    // small UX nicety
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleBook = (consultancy) => {
    navigate("/checkout", { state: { consultancy } });
  };

  const renderPageButtons = () => {
    // show up to PAGINATION_MAX_BUTTONS page buttons with truncation
    const pages = [];
    const maxButtons = CONST.PAGINATION_MAX_BUTTONS;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let left = Math.max(1, currentPage - 2);
      let right = Math.min(totalPages, left + maxButtons - 1);
      if (right - left < maxButtons - 1) {
        const diff = maxButtons - (right - left + 1);
        left = Math.max(1, left - diff);
        right = Math.min(totalPages, left + maxButtons - 1);
      }
      for (let i = left; i <= right; i++) pages.push(i);
      // ensure first/last visible when needed
      if (!pages.includes(1)) pages.unshift(1, "left-ellipsis");
      if (!pages.includes(totalPages)) pages.push("right-ellipsis", totalPages);
    }

    return pages.map((p, idx) => {
      if (p === "left-ellipsis" || p === "right-ellipsis") {
        return (
          <span key={`${p}-${idx}`} className="px-3 py-1 text-sm text-gray-500">
            …
          </span>
        );
      }
      return (
        <button
          key={p}
          aria-current={p === currentPage ? "page" : undefined}
          onClick={() => goTo(p)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition transform ${
            p === currentPage ? CONST.ACTIVE_PAGE_CLASS : "bg-white text-gray-700 hover:bg-yellow-100"
          }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className={`${fullWidth ? "md:ml-64" : "max-w-7xl mx-auto"} px-4 sm:px-6 lg:px-8 pt-20 mb-16 font-sans`}>
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-5">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-2xl text-gray-900 font-sans">Expert Consultancy</h2>
            <p className="text-gray-700 text-sm">Get personalized guidance from qualified CAs</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm px-3 py-2 bg-white">
              <CiSearch className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search consultants..."
                className="w-full bg-transparent outline-none text-sm text-gray-800"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow transition w-full sm:w-auto">
              <CiFilter size={20} />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Specializations */}
        <section className="w-full py-5">
          <h2 className="text-xl text-gray-800 mb-8 text-left">Browse by Specialization</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {specializations.map((item, idx) => (
              <button
                key={idx}
                className={`flex flex-col items-center gap-3 px-4 py-3 rounded-lg shadow-sm border transition text-sm font-medium ${
                  item.active ? "text-black bg-yellow-100" : "bg-white text-gray-700 hover:bg-yellow-50"
                }`}
                aria-pressed={item.active ? "true" : "false"}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </section>

        {/* Consultants List (paginated) */}
        <div className="py-5">
          <h1 className="text-2xl text-gray-800 mb-6 ml-5">Available Consultants</h1>

          {loading ? (
            <p className="text-gray-500 text-center">Loading consultants...</p>
          ) : totalItems === 0 ? (
            <p className="text-gray-500 text-center">No consultants found.</p>
          ) : (
            <>
              <div className="space-y-6">
                {paginated.map((c) => (
                  <div key={c._id || c.id || Math.random()} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={c.icon || CONST.PLACEHOLDER_IMG}
                            alt={c.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {c.status === "Available" && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>}
                        </div>

                        <div>
                          <h2 className="text-xl text-gray-900">{c.fullName}</h2>
                          {c.specialization && <p className="text-gray-600 mb-1">{c.specialization}</p>}
                          {c.experience && <p className="text-gray-500 text-sm">{c.experience}</p>}
                          {c.rating && (
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{c.rating}</span>
                                {c.reviews && <span className="text-gray-500 text-sm">({c.reviews} reviews)</span>}
                              </div>
                              {c.duration && (
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{c.duration} mins</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {c.status && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.status === "Available" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                          {c.status}
                        </span>
                      )}
                    </div>

                    {c.bio && <p className="text-gray-700 text-sm leading-relaxed mb-4">{c.bio}</p>}

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex-1">
                        {c.languages && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Languages:</span></p>
                            <p className="text-sm text-gray-700">{c.languages.join(", ")}</p>
                          </div>
                        )}
                        {c.meetingOptions && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Meeting Options:</span></p>
                            <div className="flex space-x-2">
                              {c.meetingOptions.includes("Video Call") && <MessageCircle className="w-4 h-4 text-gray-600" />}
                              {c.meetingOptions.includes("Phone Call") && <Phone className="w-4 h-4 text-gray-600" />}
                            </div>
                          </div>
                        )}
                        {c.nextAvailable && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Next Available:</span></p>
                            <p className="text-sm text-gray-700">{c.nextAvailable}</p>
                          </div>
                        )}
                      </div>

                      {c.pricePerSession && (
                        <div className="flex flex-col items-end space-y-1">
                          <div className="text-2xl text-gray-900">₹{c.pricePerSession}</div>
                          <div className="text-sm text-gray-500">per session</div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 text-xs font-medium">View Profile</button>
                      <button onClick={() => handleBook(c)} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-xs font-medium flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{Math.min((clampedPage - 1) * CONST.ITEMS_PER_PAGE + 1, totalItems)}</span> to{" "}
                  <span className="font-medium">{Math.min(clampedPage * CONST.ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                </div>

                <nav aria-label="Pagination" className="flex items-center gap-2">
                  <button
                    onClick={() => goTo(1)}
                    disabled={clampedPage === 1}
                    className="p-2 rounded-md bg-white border hover:bg-yellow-50 disabled:opacity-50"
                    title="First page"
                    aria-disabled={clampedPage === 1}
                  >
                    <FaChevronLeft className="transform -rotate-180" />
                  </button>

                  <button
                    onClick={() => goTo(clampedPage - 1)}
                    disabled={clampedPage === 1}
                    className="px-3 py-1 rounded-md bg-white border hover:bg-yellow-50 disabled:opacity-50"
                    title="Previous page"
                    aria-disabled={clampedPage === 1}
                  >
                    Prev
                  </button>

                  {/* numbered buttons */}
                  <div className="inline-flex items-center gap-1 bg-transparent px-1">{renderPageButtons()}</div>

                  <button
                    onClick={() => goTo(clampedPage + 1)}
                    disabled={clampedPage === totalPages}
                    className="px-3 py-1 rounded-md bg-white border hover:bg-yellow-50 disabled:opacity-50"
                    title="Next page"
                    aria-disabled={clampedPage === totalPages}
                  >
                    Next
                  </button>

                  <button
                    onClick={() => goTo(totalPages)}
                    disabled={clampedPage === totalPages}
                    className="p-2 rounded-md bg-white border hover:bg-yellow-50 disabled:opacity-50"
                    title="Last page"
                    aria-disabled={clampedPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>

      {showFooter && <Footer />}
    </>
  );
};

export default Consultancy;
