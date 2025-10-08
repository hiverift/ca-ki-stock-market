import React, { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const WebinarsAdmin = () => {
  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: "Market Analysis Weekly - Q3 2024 Review",
      instructors: ["CA Rajesh Kumar", "CA Priya Sharma"],
      description:
        "Comprehensive analysis of Q3 market trends, sector performance, and upcoming opportunities for the next quarter.",
      date: "2025-09-08T19:00",
      registered: 1240,
      duration: "90 minutes",
      level: "All Levels",
      status: "free",
      topics: ["Market Trends", "Sector Analysis", "Q&A Session"],
      agenda: [
        "Market Overview & Key Highlights",
        "Sector-wise Performance Analysis",
        "Upcoming IPOs and Investment Opportunities",
      ],
      amount: "",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // store webinar to show
  const [newWebinar, setNewWebinar] = useState({
    title: "",
    instructors: [],
    description: "",
    date: "",
    registered: 0,
    duration: "",
    level: "All Levels",
    status: "free",
    topics: [],
    agenda: [],
    amount: "",
  });

  // Handlers
  const handleSaveWebinar = () => {
    if (!newWebinar.title || !newWebinar.date) {
      alert("Please fill Title and Date");
      return;
    }
    setWebinars([...webinars, { ...newWebinar, id: Date.now() }]);
    setNewWebinar({
      title: "",
      instructors: [],
      description: "",
      date: "",
      registered: 0,
      duration: "",
      level: "All Levels",
      status: "free",
      topics: [],
      agenda: [],
      amount: "",
    });
    setShowForm(false);
  };

  const handleDeleteWebinar = (id) =>
    setWebinars(webinars.filter((w) => w.id !== id));

  const handleStatusToggle = (id) =>
    setWebinars(
      webinars.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "free" ? "paid" : "free" }
          : w
      )
    );

  const addTopic = () =>
    setNewWebinar({ ...newWebinar, topics: [...newWebinar.topics, ""] });
  const addAgenda = () =>
    setNewWebinar({ ...newWebinar, agenda: [...newWebinar.agenda, ""] });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-gray-900">Manage Webinars</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add Webinar
        </button>
      </div>

      {/* Webinar list: only title shown */}
      <div className="space-y-4">
        {webinars.map((w) => (
          <div
            key={w.id}
            className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center"
          >
            <h3 className="text-gray-900 text-lg">{w.title}</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowDetail(w)}>
                <Eye size={18} />
              </button>
              <button onClick={() => handleStatusToggle(w.id)}>
                <Edit size={18} />
              </button>
              <button onClick={() => handleDeleteWebinar(w.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Add Webinar</h3>

            <input
              type="text"
              placeholder="Title"
              value={newWebinar.title}
              onChange={(e) =>
                setNewWebinar({ ...newWebinar, title: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Instructors (comma separated)"
              value={newWebinar.instructors.join(", ")}
              onChange={(e) =>
                setNewWebinar({
                  ...newWebinar,
                  instructors: e.target.value
                    .split(",")
                    .map((i) => i.trim()),
                })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <textarea
              placeholder="Description"
              value={newWebinar.description}
              onChange={(e) =>
                setNewWebinar({ ...newWebinar, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="datetime-local"
              value={newWebinar.date}
              onChange={(e) =>
                setNewWebinar({ ...newWebinar, date: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 90 minutes)"
              value={newWebinar.duration}
              onChange={(e) =>
                setNewWebinar({ ...newWebinar, duration: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Level (All Levels / Beginner)"
              value={newWebinar.level}
              onChange={(e) =>
                setNewWebinar({ ...newWebinar, level: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <select
              value={newWebinar.status}
              onChange={(e) =>
                setNewWebinar({ ...newWebinar, status: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-2"
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            {newWebinar.status === "paid" && (
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newWebinar.amount || ""}
                onChange={(e) =>
                  setNewWebinar({ ...newWebinar, amount: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mb-2"
              />
            )}

            {/* Topics */}
            <div className="mb-2">
              <h4 className="font-semibold mb-1">Topics</h4>
              {newWebinar.topics.map((topic, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Topic ${idx + 1}`}
                  value={topic}
                  onChange={(e) => {
                    const updated = [...newWebinar.topics];
                    updated[idx] = e.target.value;
                    setNewWebinar({ ...newWebinar, topics: updated });
                  }}
                  className="w-full border px-3 py-2 rounded mb-1"
                />
              ))}
              <button
                type="button"
                onClick={addTopic}
                className="text-blue-500 text-sm"
              >
                + Add Topic
              </button>
            </div>

            {/* Agenda */}
            <div className="mb-2">
              <h4 className="font-semibold mb-1">Agenda</h4>
              {newWebinar.agenda.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Agenda ${idx + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...newWebinar.agenda];
                    updated[idx] = e.target.value;
                    setNewWebinar({ ...newWebinar, agenda: updated });
                  }}
                  className="w-full border px-3 py-2 rounded mb-1"
                />
              ))}
              <button
                type="button"
                onClick={addAgenda}
                className="text-blue-500 text-sm"
              >
                + Add Agenda
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWebinar}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal when Eye clicked */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{showDetail.title}</h3>
            <p className="text-gray-500 mb-1">
              By {showDetail.instructors.join(" & ")}
            </p>
            <p className="text-gray-600 mb-1">{showDetail.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              {new Date(showDetail.date).toLocaleDateString()}{" "}
              {new Date(showDetail.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              {showDetail.registered} registered | Duration: {showDetail.duration} | Level: {showDetail.level}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Topics: {showDetail.topics.join(", ")}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Agenda: {showDetail.agenda.join(", ")}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
              showDetail.status === "free" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {showDetail.status}{showDetail.status==="paid" && showDetail.amount ? ` | ₹${showDetail.amount}` : ""}
            </span>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetail(null)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebinarsAdmin;
