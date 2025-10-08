
// import { Link } from 'react-router-dom'

// import { User, Video, Phone, Plus , Star, Clock,  CheckCircle } from 'lucide-react';

// import { CiSearch, CiFilter } from "react-icons/ci";
// import { FaChartLine, FaCogs, FaWallet, FaShieldAlt, FaFileInvoiceDollar, FaLightbulb, FaSearch, FaBalanceScale } from 'react-icons/fa';




// const MyConsultations = () => {



  

//    const sessions = [
//     {
//       id: 1,
//       name: "CA Rajesh Kumar",
//       sessionType: "Options Strategy Review",
//       time: "Tomorrow at 2:00 PM",
//       status: "Confirmed",
//       callType: "video"
//     },
//     {
//       id: 2,
//       name: "CA Priya Sharma", 
//       sessionType: "Technical Analysis Session",
//       time: "Friday at 11:00 AM",
//       status: "Confirmed",
//       callType: "phone"
//     }
//   ];


//   const specializations = [
//     { name: "Options Trading", icon: <FaChartLine />, active: true },
//     { name: "Technical Analysis", icon: <FaCogs /> },
//     { name: "Portfolio Management", icon: <FaWallet /> },
//     { name: "Risk Assessment", icon: <FaShieldAlt /> },
//     { name: "Tax Planning", icon: <FaFileInvoiceDollar /> },
//     { name: "Investment Strategy", icon: <FaLightbulb /> },
//     { name: "Market Research", icon: <FaSearch /> },
//     { name: "Compliance/Legal", icon: <FaBalanceScale /> },
//   ];




//    const consultants = [
//     {
//       id: 1,
//       name: "CA Rajesh Kumar",
//       specialty: "Options Trading & Risk Management",
//       experience: "12 years experience",
//       rating: 4.9,
//       reviewCount: 156,
//       duration: "60 mins",
//       nextAvailable: "Today 3:00 PM",
//       price: "₹2,999",
//       priceLabel: "per session",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150",
//       isAvailable: true
//     },
//     {
//       id: 2,
//       name: "CA Priya Sharma",
//       specialty: "Technical Analysis & Market Research",
//       experience: "8 years experience",
//       rating: 4.7,
//       reviewCount: 89,
//       duration: "45 mins",
//       nextAvailable: "Tomorrow 10:00 AM",
//       price: "₹2,499",
//       priceLabel: "per session",
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150",
//       isAvailable: true
//     },
//     {
//       id: 3,
//       name: "CA Amit Patel",
//       specialty: "Portfolio Management & Taxation",
//       experience: "15 years experience",
//       rating: 4.8,
//       reviewCount: 203,
//       duration: "60 mins",
//       nextAvailable: "Friday 2:30 PM",
//       price: "₹3,499",
//       priceLabel: "per session",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150",
//       isAvailable: false
//     }
//   ]; 

//   return (

//     <>

//     <div className='w-full'>
//       Header + Search
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-5">
//         {/* Left Section */}
//         <div className="space-y-2 text-center md:text-left">
//           <h2 className="text-3xl md:text-2xl text-gray-900 font-sans">
//            Consultancy
//           </h2>
//           <p className="text-gray-700 text-sm">
//             Get personalized guidance from expert CAs
//           </p>
//           <Link
//             to="/courses"
//             className="text-yellow-600 text-xs font-medium hover:underline"
//           >
//             {/* Login required to enroll in courses */}
//           </Link>
//         </div>

//         {/* Search + Filter */}
//         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
//           {/* Search Box */}
//           <div className="flex items-center w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-gray-400">
//             <CiSearch className="text-gray-500 mr-2" size={20} />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               className="w-full bg-transparent outline-none text-sm text-gray-800"
//             />
//           </div>
//           {/* Filter Button */}
//           <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow transition w-full sm:w-auto">
//             <CiFilter size={20} />
//             <span className="text-sm font-medium">Filter</span>
//           </button>
//         </div>
//       </div>


      
   

//      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 ">
//       <h2 className="text-xl font-semibold text-gray-900 mb-6">My Upcoming Sessions</h2>
      
//       <div className="space-y-4">
//         {sessions.map((session) => (
//           <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//             {/* Left Section - User Info */}
//             <div className="flex items-start sm:items-center space-x-3 mb-4 sm:mb-0">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//                   <User className="w-5 h-5 text-yellow-600" />
//                 </div>
//               </div>
              
//               <div className="min-w-0 flex-1">
//                 <h3 className="text-sm font-medium text-gray-900 truncate">
//                   {session.name}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-1">
//                   {session.sessionType}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {session.time}
//                 </p>
//               </div>
//             </div>

//             {/* Right Section - Status and Actions */}
//             <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ml-13 sm:ml-0">
//               {/* Status Badge */}
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start sm:self-auto">
//                 {session.status}
//               </span>

//               {/* Call Type Button */}
//               <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors self-start sm:self-auto">
//                 {session.callType === 'video' ? (
//                   <>
//                     <Video className="w-3 h-3 mr-1" />
//                     Video Call
//                   </>
//                 ) : (
//                   <>
//                     <Phone className="w-3 h-3 mr-1" />
//                     Phone Call
//                   </>
//                 )}
//               </button>

//               {/* Join Button */}
//               <button className="inline-flex items-center px-4 py-1.5 text-xs font-medium text-white bg-gray-800 rounded hover:bg-gray-900 transition-colors self-start sm:self-auto">
//                 <Plus className="w-3 h-3 mr-1" />
//                 Join
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>

// Browse by Specialization 
//         <section className="w-full  px-4 sm:px-6 lg:px-8 py-5 ">
//   <h2 className="text-md font-bold text-gray-800 mb-8 text-left">
//     Browse by Specialization
//   </h2>
//   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//     {specializations.map((item, idx) => (
//       <button
//         key={idx}
//         className={`flex flex-col items-center gap-3 px-4 py-3 rounded-lg shadow-sm border transition text-sm font-medium ${
//           item.active
//             ? "text-black"
//             : "bg-white text-gray-700 hover:bg-yellow-400"
//         }`}
//       >
//         <span className="text-lg">{item.icon}</span>
//         {item.name}
//       </button>
//     ))}
//   </div>
// </section>
//      </div>

//         </>
//   )
// }

// export default MyConsultations


// import Consultancy from '../pages/Consultancy'


// import React from 'react'

// const MyConsultations = () => {
//   return (
//     <div className='p-b-10'>
//       <Consultancy showFooter={false} fullWidth={true} />

//     </div>
//   )
// }

// export default MyConsultations




// import Consultancy from '../pages/Consultancy'
// import React from 'react'

// const MyConsultations = () => {
//   return (
//     <div className="pb-10">
//       <Consultancy showFooter={false} fullWidth={true} compact={true} />
//     </div>
//   )
// }

// export default MyConsultations


// import React from 'react'

// const MyAppointment = () => {
//   return (
//     <div className='justify-center items-center flex h-screen font-sans'>

//       <h1 className='text-2xl font-semibold'>My MyAppointment comming  Page Coming Soon...</h1>
      
//     </div>
//   )
// }

// export default MyAppointment
// src/pages/MyAppointment.jsx
import React, { useEffect, useState } from "react";
import moment from "moment";
import { getMyBookings } from "../Api/bookings/bookings"; // backend call for user bookings

const MyAppointment = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMyBookings([]);
          setLoading(false);
          return;
        }

        const res = await getMyBookings(token); // API call
        const bookings = res.result ?? [];
        setMyBookings(bookings);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setMyBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-sans">
        <h1 className="text-xl font-semibold">Loading appointments...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {myBookings.length === 0 ? (
         <div className="flex items-center justify-center h-screen ">
        <p className="text-gray-600 text-lg bg-yellow-100 font-sans h-100 w-100 flex justify-center items-center rounded shadow-2xl">You haven’t enrolled in any Appointment yet.</p>
      </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
              <h2 className="font-semibold text-lg">{booking.serviceName}</h2>
              <p className="text-gray-600">
                <strong>Date:</strong> {moment(booking.date).format("DD MMM YYYY")}
              </p>
              <p className="text-gray-600">
                <strong>Slot:</strong> {booking.slotLabel}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span className={booking.status === "confirmed" ? "text-green-600" : "text-red-600"}>
                  {booking.status}
                </span>
              </p>
              {booking.amount && (
                <p className="text-gray-600">
                  <strong>Amount:</strong> ₹{booking.amount}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;
