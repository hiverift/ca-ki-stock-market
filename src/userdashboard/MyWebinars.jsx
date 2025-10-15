import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Video } from "lucide-react";
import config from "../pages/config"; // Verify path
import cardImage from "../assets/image/card.jpg";

const MyWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") || "";

        if (!token || !userId) {
          setError("Please log in to view your webinars.");
          setWebinars([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${config.BASE_URL}users/${userId}/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch webinars");

        const data = await res.json();

        // const webinarsData1 = (data.result?.webinars || [])
        //   .filter((webinar) => webinar.paid === true)
        //   .map((webinar) => ({
        //     ...webinar.details,
        //     paid: webinar.paid,
        //     latestOrder: webinar.orders?.[webinar.orders.length - 1] || null,
        //     itemType: webinar.itemType,
        //     itemId: webinar.itemId,
        //   }));
        console.log("Fetched webinars data:", data);

        const webinarsData = data.result.webinars.flatMap((c) =>
          c.orders.map((order) => ({
            ...c.details,       // webinar details
            itemType: "webinar",
            paid: c.paid,
            order,               // attach order info
          }))
        );

        console.log("Processed webinars:", webinarsData);

        setWebinars(webinarsData);
      } catch (err) {
        console.error("Error fetching webinars:", err);
        setError("Failed to fetch webinars. Please try again later.");
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (webinars.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-xl">No paid webinars available.</p>
      </div>
    );
  }
  console.log("Webinars:", webinars);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">My Webinars</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            <div className="relative mb-4">
              {webinar.youtubeVideoId ? (
                <img
                  src={`https://img.youtube.com/vi/${webinar.youtubeVideoId}/hqdefault.jpg`}
                  alt={webinar.title}
                  onError={(e) => (e.target.src = cardImage)}
                  className="w-full h-36 sm:h-44 object-cover rounded"
                />
              ) : (
                <img
                  src={cardImage}
                  alt="Webinar"
                  className="w-full h-36 sm:h-44 object-cover rounded"
                />
              )}
            </div>

            {/* Webinar Info */}
            <h2 className="font-semibold text-lg">{webinar.title}</h2>
            <p className="text-gray-600 mt-1">{webinar.presenter || "N/A"}</p>
            <p className="text-gray-700 text-sm mt-1 line-clamp-2">
              {webinar.description}
            </p>

            <div className="flex flex-col space-y-1 mt-3 text-[12px] text-gray-600">
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(webinar.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{webinar.durationMinutes || "N/A"} mins</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{webinar.attendeesCount || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Video className="w-3 h-3" />
                  <span>{webinar.duration || "N/A"}</span>
                </div>
              </div>
            </div>

            <hr className="border my-3" />

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl text-gray-600">
                ₹{webinar.price || "Free"}
              </span>
              <button className="px-4 py-2 rounded-md text-xs font-medium bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition-colors">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWebinars;
