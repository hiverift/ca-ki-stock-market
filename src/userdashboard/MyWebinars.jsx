import React from "react";

// import React from 'react';
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
  FaBook,
  FaUserAlt,
  FaTrophy,
} from "react-icons/fa";
import { useState } from "react";
// import React, { useState } from 'react';
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
// import { Calendar, Clock, Users,  } from 'lucide-react';
// import {  } from 'lucide-react';

// import Footer from "./Footer";

const MyWebinars = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const specializations = [
    { name: "Market Analysis", icon: <FaChartLine />, active: true },
    { name: "Option Trading", icon: <FaCogs /> },
    { name: "Technical  Analysis", icon: <FaWallet /> },
    { name: "Investment Strategy", icon: <FaShieldAlt /> },
    { name: "Risk Management", icon: <FaFileInvoiceDollar /> },
    { name: "Sector Analysis", icon: <FaLightbulb /> },
    { name: "Cryptocurrency", icon: <FaSearch /> },
    { name: "Portfolio Review", icon: <FaBalanceScale /> },
  ];

  //    const webinars = [
  //   {
  //     id: 1,
  //     type: 'Free',
  //     level: 'All Levels',
  //     title: 'Market Analysis Weekly - Q3 2024 Review',
  //     instructor: 'by CA Rajesh Kumar & CA Priya Sharma',
  //     description: 'Comprehensive analysis of Q3 market trends, sector performance, and upcoming opportunities for the next quarter.',
  //     date: 'Today',
  //     time: '7:00 PM',
  //     registered: '1240 registered',
  //     duration: '90 minutes',
  //     topics: ['Market Trends', 'Sector Analysis', 'Q&A Session', '+1 more'],
  //     agenda: [
  //       'Market Overview & Key Highlights',
  //       'Sector-wise Performance Analysis',
  //       'Upcoming IPOs and Investment Opportunities',
  //       '+2 more topics'
  //     ],
  //     price: 'Free',
  //     priceValue: null
  //   },
  //   {
  //     id: 2,
  //     type: 'Paid',
  //     level: 'Advanced',
  //     title: 'Advanced Options Strategies Masterclass',
  //     instructor: 'by CA Amit Patel',
  //     description: 'Deep dive into advanced options strategies including straddles, strangles, and iron condors with live market examples.',
  //     date: 'Tomorrow',
  //     time: '6:00 PM',
  //     registered: '89 registered',
  //     duration: '120 minutes',
  //     topics: ['Options Strategies', 'Risk Management', 'Live Trading', '+1 more'],
  //     agenda: [
  //       'Advanced Options Theory',
  //       'Complex Strategy Implementation',
  //       'Risk Assessment Techniques',
  //       '+2 more topics'
  //     ],
  //     price: '₹999',
  //     priceValue: 999
  //   },
  //   {
  //     id: 3,
  //     type: 'Free',
  //     level: 'Beginner',
  //     title: 'Introduction to Stock Market Basics',
  //     instructor: 'by CA Neha Singh',
  //     description: 'Perfect for beginners looking to understand fundamental concepts of stock market investing and trading.',
  //     date: 'Monday',
  //     time: '7:30 PM',
  //     registered: '567 registered',
  //     duration: '75 minutes',
  //     topics: ['Market Basics', 'Investment Types', 'Portfolio Building', '+1 more'],
  //     agenda: [
  //       'Stock Market Fundamentals',
  //       'Types of Investments',
  //       'Building Your First Portfolio',
  //       '+2 more topics'
  //     ],
  //     price: 'Free',
  //     priceValue: null
  //   }
  // ];

  return (
    <div className="md:ml-64 ">
      {" "}
      {/* Push below navbar */}
      <div className="text-white text-center text-lg font-semibold mx-auto px-4 sm:px-6 lg:px-8 space-y-4 w-full ">
        {/* <div className="maindiv flex justify-between items-center border border-red-600 py-6 px-4 rounded-md shadow-sm bg-red-50">
          <div className="text-black text-left">
            <p className="font-semibold">Live Now: Market Opening Analysis</p>
            <p className="text-xs text-gray-600">892 people watching</p>
          </div>

          <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md shadow-sm text-sm transition duration-200">
            <FaLock className="text-xs" />
            <FaPause className="text-xs" />
            <span>Join Live</span>
          </button>
        </div> */}

        {/* Tabs */}
        <div className="rounded-xl p-6">
          <div className="flex justify-around gap-2 bg-gray-200 py-2 px-2 rounded-full w-full mx-auto ">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full text-sm font-medium transition w-[33%] ${
                activeTab === "upcoming"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("live")}
              className={`rounded-full text-sm font-medium transition w-[33%] ${
                activeTab === "live"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setActiveTab("recorded")}
              className={`rounded-full text-sm font-medium transition w-[33%] ${
                activeTab === "recorded"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Recorded
            </button>
          </div>
        </div>

        {/* Upcoming Webinars */}
        {activeTab === "upcoming" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Upcoming Webinars
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                3 Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Webinar 1 */}

              <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-transform hover:shadow-lg hover:-translate-y-1 duration-200 h-full md:pt-5">
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-start mb-5 space-x-2">
                    <span className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Free
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      All Levels
                    </span>
                  </div>
                  <h3 className="text-md font-semibold text-gray-600 mb-1 text-left">
                    Market Analysis Weekly - Q3 2024 Review
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 text-left">
                    by CA Rajesh Kumar & CA Priya Sharma
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2 text-left">
                    Comprehensive analysis of Q3 market trends, sector
                    performance, and upcoming opportunities for the next
                    quarter.
                  </p>
                  <div className="flex flex-col space-y-1 mb-3 text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Today</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>7:00 PM</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>1240 registered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="w-3 h-3" />
                        <span>90 minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Topics Covered:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Market Trends
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Sector Analysis
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Q&A Session
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        +1 more
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 flex-1 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-1 pt-5">
                      Agenda:
                    </h4>
                    <ol className="space-y-0.5">
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          1.
                        </span>{" "}
                        Market Overview & Key Highlights
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          2.
                        </span>{" "}
                        Sector-wise Performance Analysis
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          3.
                        </span>{" "}
                        Upcoming IPOs and Investment Opportunities
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          4.
                        </span>{" "}
                        +2 more topics
                      </li>
                    </ol>
                  </div>
                </div>

                <hr className="border" />
                <div className="bg-gray-50 px-4 py-4 flex items-center justify-between mt-auto border-t">
                  <div className="text-xl  text-gray-600">Free</div>
                  <div className="flex items-center space-x-3">
                    {/* <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">View Details</button> */}
                    <button className="px-4 py-2 rounded-md text-xs font-medium flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors">
                      Register Free
                    </button>
                  </div>
                </div>
              </div>

              {/* Webinar 2 */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-transform hover:shadow-lg hover:-translate-y-1 duration-200 h-full md:pt-5">
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-start mb-3 space-x-2">
                    <span className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Paid
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Advanced
                    </span>
                  </div>
                  <h3 className="text-md font-semibold text-gray-600 mb-1 text-left">
                    Advanced Options Strategies Masterclass
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 text-left">
                    by CA Amit Patel
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2 text-left">
                    Deep dive into advanced options strategies including
                    straddles, strangles, and iron condors with live market
                    examples.
                  </p>
                  <div className="flex flex-col space-y-1 mb-3 text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Tomorrow</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>6:00 PM</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>89 registered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="w-3 h-3" />
                        <span>120 minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Topics Covered:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Options Strategies
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Risk Management s
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Live Trading
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        +1 more
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 flex-1 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-1 pt-5">
                      Agenda:
                    </h4>
                    <ol className="space-y-0.5">
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          1.
                        </span>
                        Advanced Options Theory
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          2.
                        </span>
                        Complex Strategy Implementation
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          3.
                        </span>{" "}
                        Risk Assessment Techniques
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          4.
                        </span>{" "}
                        +2 more topics
                      </li>
                    </ol>
                  </div>
                </div>

                <hr className="border" />
                <div className="bg-gray-50 px-4 py-4 flex items-center justify-between mt-auto border-t">
                  <div className="text-xl  text-gray-600">₹999</div>
                  <div className="flex items-center space-x-3">
                    {/* <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">View Details</button> */}
                    <button className="px-4 py-2 rounded-md text-xs font-medium flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Webinar 3 */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-transform hover:shadow-lg hover:-translate-y-1 duration-200 h-full md:pt-5">
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-start mb-3 space-x-2">
                    <span className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Paid
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Intermediate
                    </span>
                  </div>
                  <h3 className="text-md font-semibold text-gray-600 mb-1 text-left">
                    Technical Analysis Bootcamp
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 text-left">
                    by CA Rajesh Kumar & CA Priya Sharma
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2 text-left">
                    Master chart patterns, indicators, and technical analysis
                    tools for better trading decisions.
                  </p>
                  <div className="flex flex-col space-y-1 mb-3 text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Sep 5, 2024</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>5:30 PM</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>156 registered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="w-3 h-3" />
                        <span>2 hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      Topics Covered:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Chart Patterns
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Technical Indicators
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        Strategy Building
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                        +1 more
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 flex-1 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-1 pt-5">
                      Agenda:
                    </h4>
                    <ol className="space-y-0.5">
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          1.
                        </span>{" "}
                        Chart Pattern Recognition
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          2.
                        </span>{" "}
                        Technical Indicator Applications
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          3.
                        </span>{" "}
                        Trend Analysis Techniques
                      </li>
                      <li className="text-[11px] text-gray-700 flex">
                        <span className="text-yellow-600 font-medium mr-1">
                          4.
                        </span>{" "}
                        +2 more topics
                      </li>
                    </ol>
                  </div>
                </div>

                <hr className="border" />
                <div className="bg-gray-50 px-4 py-4 flex items-center justify-between mt-auto border-t">
                  <div className="text-xl  text-gray-600">₹1,499</div>
                  <div className="flex items-center space-x-3">
                    {/* <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">View Details</button> */}
                    <button className="px-4 py-2 rounded-md text-xs font-medium flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Webinars */}
        {activeTab === "live" && (
          <div className="mt-6">
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Live Webinars
                </h1>
                <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>1 Live
                  Now
                </span>
              </div>
              <div className="w-full rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-6 w-1/2">
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full md:w-2/3">
                    <div className="mb-4">
                      <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1 w-fit">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Live Now
                      </span>
                    </div>
                    <h2 className="text-xl text-left text-gray-900 mb-2">
                      Market Opening Analysis
                    </h2>
                    <p className="text-sm text-gray-600 mb-3 text-left">
                      by CA Rajesh Kumar
                    </p>
                    <p className="text-sm text-gray-600 mb-6 text-left">
                      Daily market opening analysis with key levels and trading
                      opportunities
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Today</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>30 min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>892 watching</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Play className="w-4 h-4" />
                        <span>Live Stream</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {/* <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">View Details</button> */}

                      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors flex items-center gap-2">
                        <Play className="w-4 h-4 fill-current" />
                        Join Live
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recorded Webinars */}
        {activeTab === "recorded" && (
          <div className="mt-6 w-full">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Recorded Webinars
                </h1>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full w-fit">
                  On-Demand Access
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded w-fit inline-block">
                      Recorded
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Fundamentals of Stock Market Investing
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    by CA Priya Sharma
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    Complete beginner's guide to stock market fundamentals and
                    investment principles
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Aug 25, 2024</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>95 minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="w-4 h-4 flex-shrink-0" />
                      <span>2340 views</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Play className="w-4 h-4 flex-shrink-0" />
                      <span>95 minutes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-6">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">
                      4.8
                    </span>
                    <span className="text-sm text-gray-600">rating</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹499
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">View Details</button> */}
                      <button className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 fill-current" />
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show More Button */}
        <div className="flex justify-center mt-6">
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
            <span>Show More Webinars</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* <section className="w-full  px-4 sm:px-6 lg:px-8">
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
                <span className="text-lg">{item.icon}</span>z
                {item.name}
              </button>
            ))}
          </div>
        </section> */}

        {/* <section className="w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 border border-gray-300 shadow-md ">
          <h2 className="text-xl  text-gray-800 mb-10 text-center pt-5">
            How Our Webinars Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border py-10  border-none">
    
            <div className="flex flex-col items-center text-gray-700 gap-4  rounded-lg p-6  transition text-center">
              <FaBook className="text-5xl text-yellow-500" />
              <h3 className="text-md font-semibold">Register</h3>
              <p className="text-sm text-gray-600">
                Sign up for free or paid webinars based on your interests and
                expertise level
              </p>
            </div>

         
            <div className="flex flex-col items-center text-gray-700 gap-4  rounded-lg p-6   transition text-center">
              <FaUserAlt className="text-5xl text-yellow-500" />
              <h3 className="text-md font-semibold">Attend Live</h3>
              <p className="text-sm text-gray-600">
                Schedule at your convenient time and choose your preferred Join
                interactive sessions with Q&A, live market analysis, and expert
                insights
              </p>
            </div>

    
            <div className="flex flex-col items-center text-gray-700 gap-4  rounded-lg p-6   transition text-center">
              <FaTrophy className="text-5xl text-yellow-500" />
              <h3 className="text-md font-semibold">Access Recording</h3>
              <p className="text-sm text-gray-600">
                Download recordings and materials for future reference and
                continued learning
              </p>
            </div>
          </div>
        </section> */}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default MyWebinars;
