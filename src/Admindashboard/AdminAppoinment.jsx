import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import config from "../pages/config";

const BASE_URL = config.BASE_URL.replace(/\/$/, "");

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

  // Format ISO → YYYY-MM-DD
  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toISOString().split("T")[0];
  };

  // Format ISO → HH:MM AM/PM
  const formatTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    let h = d.getHours();
    let m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const formatDateLocal = (date) => new Date(date).toISOString().split("T")[0];

  // STATES
  const [errors, setErrors] = useState({});
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [capacity, setCapacity] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState(""); // ⭐ NEW

  const [savedSlots, setSavedSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [popupMsg, setPopupMsg] = useState("");

  // VALIDATION FUNCTION
  const validateForm = () => {
    let err = {};

    if (!serviceId) err.serviceId = "Service is required";
    if (!fromDate) err.fromDate = "From date is required";
    if (!toDate) err.toDate = "To date is required";
    if (!capacity) err.capacity = "Capacity is required";
    if (!googleMeetLink) err.googleMeetLink = "Google meet link is required";
    if (selectedTimes.length === 0) err.times = "Select at least 1 time slot";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // UPDATE SAVE BUTTON FUNCTION
  const handleSaveSlots = async () => {
    if (!validateForm()) return;

    const payload = {
      serviceId,
      from: formatDateLocal(fromDate),
      to: formatDateLocal(toDate),
      capacity: Number(capacity),
      times: selectedTimes,
      googleMeetLink: googleMeetLink,
    };

    try {
      await axios.post(`${BASE_URL}/admin/slots/bulk`, payload);
      showPopup("Slot Saved");
      getAllSlots();
      resetForm();
    } catch (err) {
      console.error(err);
      showPopup("Save failed");
    }
  };
  // FETCH SERVICES
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/services`);
      setServices(res.data?.result || []);
    } catch (error) {
      console.log("Service fetch error", error);
    }
  };

  // FETCH ALL SLOTS (NEWEST FIRST)
  const getAllSlots = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getAllSlots`);
      const sorted = (res.data?.result || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSavedSlots(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
    getAllSlots();
  }, []);

  // DELETE SLOT
  const deleteSlot = async (slotId) => {
    try {
      await axios.delete(`${BASE_URL}/admin/slots/${slotId}`);
      showPopup("Slot Deleted", "delete");
      getAllSlots();
    } catch (err) {
      console.error(err);
      showPopup("Delete Failed", "error");
    }
  };

  // Helpers
  const toggleTime = (time) =>
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );

  const resetForm = () => {
    setServiceId("");
    setFromDate(new Date());
    setToDate(new Date());
    setSelectedTimes([]);
    setCapacity("");
    setGoogleMeetLink("");
    setErrors({});
  };
  const showPopup = (message, type = "success") => {
    setPopupMsg({ text: message, type });
    setTimeout(() => setPopupMsg(null), 2000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {popupMsg && (
        <div className={`fixed top-5 right-5 z-50`}>
          <div
            className={`min-w-[260px] max-w-[360px] px-6 py-5 rounded-2xl shadow-2xl 
      text-white text-xl font-bold transition-all duration-500 transform animate-toast 
      flex items-center justify-center text-center
      ${popupMsg.type === "success" ? "bg-green-600" : ""}
      ${popupMsg.type === "error" ? "bg-red-600" : ""}
      ${popupMsg.type === "delete" ? "bg-orange-600" : ""}
    `}
          >
            {popupMsg.text}
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-center mb-6">
        Appointment Slot Manager
      </h2>

      {/* CREATE SLOT UI */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create Slot</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* SERVICE */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Select Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className={`border p-2 rounded h-[42px] ${
                errors.serviceId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceId}</p>
            )}
          </div>

          {/* FROM DATE */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              From Date
            </label>
            <DatePicker
              selected={fromDate}
              onChange={setFromDate}
              dateFormat="dd-MM-yyyy"
              className="border p-2 rounded w-full h-[42px]"
              minDate={new Date()}
            />
          </div>

          {/* TO DATE */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              To Date
            </label>
            <DatePicker
              selected={toDate}
              onChange={setToDate}
              dateFormat="dd-MM-yyyy"
              className="border p-2 rounded w-full h-[42px]"
              minDate={fromDate}
            />
          </div>

          {/* CAPACITY */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Capacity
            </label>
            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className={`border p-2 rounded h-[42px] ${
                errors.capacity ? "border-red-500" : ""
              }`}
            />
            {errors.capacity && (
              <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
            )}
          </div>

          {/* ⭐ GOOGLE MEET LINK */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Google Meet Link
            </label>
            <input
              type="text"
              placeholder="Google meet link"
              value={googleMeetLink}
              onChange={(e) => setGoogleMeetLink(e.target.value)}
              className={`border p-2 rounded h-[42px] ${
                errors.googleMeetLink ? "border-red-500" : ""
              }`}
            />
            {errors.googleMeetLink && (
              <p className="text-red-500 text-xs mt-1">
                {errors.googleMeetLink}
              </p>
            )}
          </div>
        </div>

        {/* TIMES */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-gray-600 mb-2 block">
            Select Time Slots
          </label>
          {errors.times && (
            <p className="text-red-500 text-xs mb-2">{errors.times}</p>
          )}
          <div className="grid grid-cols-4 gap-2">
            {defaultTimes.map((t) => (
              <button
                key={t}
                onClick={() => toggleTime(t)}
                className={`rounded px-4 py-2 text-sm border ${
                  selectedTimes.includes(t)
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSaveSlots}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            Save Slot
          </button>

          <button
            onClick={resetForm}
            className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* SLOTS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">All Slots (Latest First)</h3>

        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Start Time</th>
              <th className="p-3">End Time</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Google Meet Link</th> {/* ⭐ NEW */}
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {savedSlots.map((slot) => (
              <tr key={slot._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {slot?.serviceId?.name || "Unknown"}
                </td>
                <td className="p-3">{formatDate(slot.start)}</td>
                <td className="p-3">{formatTime(slot.start)}</td>
                <td className="p-3">{formatTime(slot.end)}</td>
                <td className="p-3 font-semibold">{slot.capacity}</td>

                {/* ⭐ SHOW MEET LINK */}
                <td className="p-3">
                  {slot.googleMeetLink ? (
                    <a
                      href={slot.googleMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {slot.googleMeetLink}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not Added</span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => deleteSlot(slot._id)}
                    className="px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointment;
