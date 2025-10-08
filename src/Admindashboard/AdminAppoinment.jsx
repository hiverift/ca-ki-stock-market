import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import config from "../pages/config";
const BASE_URL = config.BASE_URL;

const AdminAppointment = () => {
  const defaultTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [capacity, setCapacity] = useState("");
  const [savedSlots, setSavedSlots] = useState([]);
  const [services, setServices] = useState([]);

  // 🔹 API se service list fetch karna
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);
        setServices(res.data.result || []); // API ke response ke structure ke hisaab se adjust karna
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  // time toggle
  const toggleTime = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  // save slot
 const handleSaveSlots = async () => {
  if (!serviceId || !fromDate || !toDate || selectedTimes.length === 0) {
    alert("Please select Service, From date, To date and Times");
    return;
  }

  const payload = {
    serviceId,
    from: fromDate.toISOString().split("T")[0],
    to: toDate.toISOString().split("T")[0],
    capacity,
    times: selectedTimes,
  };

  try {
    const res = await axios.post(`${BASE_URL}/admin/slots/bulk`, payload);
    if (res.status === 200 || res.status === 201) {
      alert("✅ Slots saved successfully!");
      setSavedSlots([...savedSlots, payload]);

      // reset
      setServiceId("");
      setFromDate(null);
      setToDate(null);
      setSelectedTimes([]);
      setCapacity("");
    }
  } catch (err) {
    console.error("Error saving slots:", err);
    alert("❌ Failed to save slots. Check console for details.");
  }
};

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          📅 Appointment Slot Manager
        </h2>

        {/* Card: Service + Date Range & Capacity */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
            Slot Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Service Dropdown */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Service</p>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                From Date
              </p>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                minDate={new Date()}
                placeholderText="Select from date"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">To Date</p>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                minDate={fromDate || new Date()}
                placeholderText="Select to date"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Capacity</p>
     <input
  type="number"
  value={capacity}
  min={1} // negative prevent
  onChange={(e) => {
    const val = e.target.value;
    setCapacity(val === "" ? "" : Number(val));
  }}
  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
/>

            </div>
          </div>
        </div>

        {/* Card: Time Slots */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
            Select Available Times
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {defaultTimes.map((time) => (
              <button
                key={time}
                onClick={() => toggleTime(time)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                  selectedTimes.includes(time)
                    ? "bg-yellow-500 text-white border-yellow-500 shadow"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-yellow-50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mb-10">
          <button
            onClick={handleSaveSlots}
            className="px-10 py-3 bg-yellow-500 text-white font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition transform hover:scale-105"
          >
            💾 Save Slot
          </button>
        </div>

        {/* Saved Slots List */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
            Saved Slots
          </h3>
          {savedSlots.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No slots added yet.
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border">Service</th>
                  <th className="p-3 border">From</th>
                  <th className="p-3 border">To</th>
                  <th className="p-3 border">Capacity</th>
                  <th className="p-3 border">Times</th>
                </tr>
              </thead>
              <tbody>
                {savedSlots.map((slot, index) => {
                  const serviceName =
                    services.find((s) => s._id === slot.serviceId)?.name || "-";
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 text-center transition"
                    >
                      <td className="p-3 border">{serviceName}</td>
                      <td className="p-3 border">{slot.from}</td>
                      <td className="p-3 border">{slot.to}</td>
                      <td className="p-3 border">{slot.capacity}</td>
                      <td className="p-3 border">
                        {slot.times.join(", ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointment;
