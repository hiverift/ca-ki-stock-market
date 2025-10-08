import React, { useState } from "react";
import { Plus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // form states
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotInput, setSlotInput] = useState("");
  const [slots, setSlots] = useState([]);

  // ➕ Add slot
  const handleAddSlot = () => {
    if (slotInput && !slots.includes(slotInput)) {
      setSlots([...slots, slotInput]);
      setSlotInput("");
    }
  };

  // ✅ Save appointment
  const handleSave = () => {
    if (!serviceName || !servicePrice || !selectedDate || slots.length === 0) {
      alert("Please fill all fields");
      return;
    }

    const newApp = {
      id: Date.now(),
      service: serviceName,
      price: servicePrice,
      date: selectedDate.toDateString(),
      slots,
    };

    setAppointments([...appointments, newApp]);

    // Reset
    setServiceName("");
    setServicePrice("");
    setSelectedDate(null);
    setSlots([]);
    setShowForm(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl text-gray-900">Manage Appointments</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          New Appointment
        </button>
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="border rounded-lg p-4 bg-gray-50 shadow-sm"
          >
            <h4 className="font-semibold">{app.service}</h4>
            <p>Date: {app.date}</p>
            <p>Slots: {app.slots.join(", ")}</p>
            <p className="text-green-600 font-medium">Price: ₹{app.price}</p>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              ➕ Add New Appointment
            </h3>

            {/* Service Name */}
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Service Name"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            {/* Service Price */}
            <input
              type="number"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              placeholder="Service Price (₹)"
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            {/* Calendar */}
            <div className="mb-4">
              <p className="font-medium mb-2">📅 Select a Date:</p>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="rounded-lg shadow-sm"
              />
              {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedDate.toDateString()}
                </p>
              )}
            </div>

            {/* Slots */}
            {selectedDate && (
              <>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={slotInput}
                    onChange={(e) => setSlotInput(e.target.value)}
                    placeholder="Add Slot (e.g. 10:00 AM)"
                    className="flex-1 border px-3 py-2 rounded-lg"
                  />
                  <button
                    onClick={handleAddSlot}
                    className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    ➕
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {slots.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-yellow-100 border rounded-lg text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
