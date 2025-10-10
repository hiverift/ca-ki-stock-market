import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import cardImage from "../assets/image/card.jpg";
import config from "../pages/config";

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") || "";

        const res = await fetch(`${config.BASE_URL}users/${userId}/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("Appointments Data:", data);

        if (data.statusCode === 200 && data.result) {
          // ✅ Extract appointments list
          const allAppointments = data.result.appointments.map((a) => ({
            ...a.details,
            paid: a.paid,
            latestOrder: a.orders?.[a.orders.length - 1] || null,
            itemType: "appointment",
          }));

          setAppointments(allAppointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleItemClick = (appointment) => {
    navigate("/appointment-details", { state: { appointment } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading your appointments...</p>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <p className="text-gray-700 text-lg bg-yellow-100 font-sans px-6 py-4 flex justify-center items-center rounded shadow-md">
          You haven’t booked any appointments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            onClick={() => handleItemClick(appointment)}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg transition"
          >
            {/* ✅ Thumbnail / Video placeholder */}
            <div className="relative mb-4">
              {appointment.youtubeVideoId ? (
                <img
                  src={`https://img.youtube.com/vi/${appointment.youtubeVideoId}/hqdefault.jpg`}
                  alt="Appointment Thumbnail"
                  onError={(e) => (e.target.src = cardImage)}
                  className="w-full h-36 sm:h-44 object-cover rounded"
                />
              ) : (
                <img
                  src={cardImage}
                  alt="Appointment"
                  className="w-full h-36 sm:h-44 object-cover rounded"
                />
              )}
            </div>

            {/* ✅ Appointment Info */}
            <h2 className="font-semibold text-lg">Appointment ID: {appointment._id.slice(-6)}</h2>

            <p className="text-gray-600 mt-1">
              <strong>Status:</strong>{" "}
              <span
                className={
                  appointment.status === "paid" || appointment.paid
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {appointment.status || (appointment.paid ? "paid" : "unpaid")}
              </span>
            </p>

            {appointment.amount && (
              <p className="text-gray-600 mt-1">
                <strong>Amount:</strong> ₹{appointment.amount / 100}
              </p>
            )}

            {appointment.createdAt && (
              <p className="text-gray-600 mt-1">
                <strong>Booked On:</strong>{" "}
                {moment(appointment.createdAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            )}

            {appointment.updatedAt && (
              <p className="text-gray-500 text-sm">
                <strong>Last Update:</strong>{" "}
                {moment(appointment.updatedAt).fromNow()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
