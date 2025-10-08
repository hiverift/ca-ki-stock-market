import React, { useEffect, useState } from "react";
import moment from "moment";
import { getMyBookings } from "../Api/bookings/bookings"; // backend call
import cardImage from "../assets/image/card.jpg";
import config from "../pages/config";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
    const [enrolledItems, setEnrolledItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledItems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        console.log("token after login", token);
        const userId = "68b1a01074ad0c19f272b438"; // FIXED ID

        const res = await fetch(`${config.BASE_URL}users/${userId}/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (data.statusCode === 200 && data.result) {
          const allItems = [
            ...data.result.appointments.map((c) => ({
              ...c.details,
              paid: c.paid,
              latestOrder: c.latestOrder,
              itemType: "appointment",
            })),
          
          ];
          setEnrolledItems(allItems);
        } else {
          setEnrolledItems([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled items:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load your enrolled items!",
        });
        setEnrolledItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledItems();
  }, []);

  const handleItemClick = (item) => {
    navigate("/course-details", { state: { item } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading your courses...</p>
      </div>
    );
  }

  if (enrolledItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <p className="text-gray-700 text-lg bg-yellow-100 font-sans px-6 py-4 flex justify-center items-center rounded shadow-md">
          You haven’t enrolled in any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {enrolledItems.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg bg-yellow-100 font-sans h-100 w-100 flex justify-center items-center rounded shadow-2xl">
            You haven’t enrolled in any Appointment yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledItems.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-300 flex flex-col"
            >
              {/* Video replaces Image if available */}
              <div className="relative mb-4">
                {booking.youtubeVideoId ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${booking.youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-36 sm:h-44 object-cover rounded"
                  ></iframe>
                ) : booking.image ? (
                  <img
                    src={booking.image}
                    alt={booking.serviceName}
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

              {/* Appointment Details */}
              <h2 className="font-semibold text-lg">{booking.serviceName}</h2>
              <p className="text-gray-600">
                <strong>Date:</strong>{" "}
                {moment(booking.date).format("DD MMM YYYY")}
              </p>
              <p className="text-gray-600">
                <strong>Slot:</strong> {booking.slotLabel}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
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
