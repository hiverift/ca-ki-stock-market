import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserIcon, CalendarIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import config from '../pages/config';

function PremiumAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.BASE_URL}orders/admin/paid/courses`);

        if (response.data.result?.items) {
          setAppointments(response.data.result.items);
        } else {
          setError("No appointments found");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Something went wrong while fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
        📅 Premium Appointments
      </h1>

      {loading && <p className="text-center text-gray-500 text-lg">Loading appointments...</p>}
      {error && <p className="text-center text-red-500 text-lg font-medium mt-4">{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No premium appointments found.</p>
      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {appointments.map((appointmentData, index) => {
          const order = appointmentData.order;
          const user = appointmentData.user?.result;
          const item = appointmentData.item?.result;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 border border-gray-200 transform hover:-translate-y-1"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-500">Order ID: #{order?.orderId || "N/A"}</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order?.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order?.status || "N/A"}
                </span>
              </div>

              {/* Appointment Title */}
              {item && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">{item?.title || "Appointment"}</h2>
                  <p className="text-gray-500 text-sm mt-1">Mode: {item?.mode || "N/A"}</p>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-center bg-indigo-50 p-3 rounded-xl mb-4">
                <UserIcon className="h-8 w-8 text-indigo-700 mr-3" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">{user?.name || "Unknown user"}</p>
                  <p>{user?.email || "No email"}</p>
                  <p>{user?.mobile || "No mobile"}</p>
                </div>
              </div>

              {/* Appointment Details */}
              {item && (
                <div className="bg-green-50 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-gray-700 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-5 w-5 text-green-700" />
                      <span>{item?.date || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CurrencyRupeeIcon className="h-5 w-5 text-green-700" />
                      <span>{item?.price || 0}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Instructor/Doctor:</span> {item?.instructor || "N/A"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PremiumAppointments;
