import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getServices,
  getAvailability,
  createBooking,
  confirmPayment,
} from "../Api/bookings/bookings";
import ApiLogin from "../Api/bookings/auth.js";
import { sendBookingEmails } from "../Api/notification/notifications";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

export default function AppointmentPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [slotsForDate, setSlotsForDate] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added for loading states

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [postLoginAction, setPostLoginAction] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(Boolean(token));
  }, []);

const doLogin = async (form) => {
  console.log("Trying login with:", loginForm.email, loginForm.password);

  if (!form.email || !form.password) {
    setLoginError("Please enter both email and password");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    setLoginError("Please enter a valid email address");
    return;
  }

  setLoginLoading(true);
  setLoginError("");

  try {
    const data = await ApiLogin(form);
    console.log("ApiLogin returned:", data);

    // token: prefer returned token else localStorage (auth.js may already have stored it)
    const token = data?.token ?? localStorage.getItem("token") ?? data?.accessToken ?? data?.jwt ?? null;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);
    } else {
      // server might be using httpOnly cookie — treat login as success if API indicates success or user present
      if (!(data?.success || data?.user || data?._id)) {
        throw new Error("Login failed: no token and no user info returned");
      }
    }

    // Normalize user
    const user = data?.user ?? data;
    if (user) {
      if (user._id || user.id) localStorage.setItem("userId", user._id ?? user.id);
      if (user.name) localStorage.setItem("userName", user.name);
      if (user.email) localStorage.setItem("userEmail", user.email);
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        // ignore
      }
    }

    setIsAuthenticated(true);
    setShowLoginModal(false);

    if (typeof postLoginAction === "function") {
      postLoginAction();
      setPostLoginAction(null);
    }
  } catch (err) {
    console.error("Login failed", err);
    const message =
      err.response?.status === 401
        ? "Invalid email or password"
        : err.response?.data?.message || err.message || "Login failed";
    setLoginError(message);
  } finally {
    setLoginLoading(false);
  }
};

  const openLoginModal = (afterLoginAction = null) => {
    setLoginError("");
    setLoginForm({ email: "", password: "" });
    setShowLoginModal(true);
    setPostLoginAction(() => afterLoginAction ?? null);
  };

const requireAuthInline = (actionIfAuthenticated) => {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!token) {
    openLoginModal(actionIfAuthenticated);
    return false;
  }
  setIsAuthenticated(true);
  if (typeof actionIfAuthenticated === "function") actionIfAuthenticated();
  return true;
};


  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getServices();
        const items = data.items ?? data;
        setServices(items);
      } catch (e) {
        console.error("Failed to load services", e);
        alert("Failed to load services");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!selectedService || !selectedDate) {
          setSlotsForDate([]);
          return;
        }
        setIsLoading(true);
        const serviceId = selectedService._id ?? selectedService.id;
        const month = moment(selectedDate).format("YYYY-MM");
        const raw = await getAvailability(serviceId, month);
        const payload = raw && raw.result ? raw.result : raw;
        const slots = Array.isArray(payload) ? payload : [];
        const dayIso = moment(selectedDate)
          .utcOffset(0, true)
          .format("YYYY-MM-DD");

        const filtered = slots
          .map((s) => {
            const start = s.start ? new Date(s.start) : null;
            return {
              ...s,
              _startDate: start,
              sDayUtc: start ? moment(start).utc().format("YYYY-MM-DD") : null,
              label: start ? moment(start).local().format("hh:mm A") : "",
              seatsLeft: s.seatsLeft ?? s.capacity ?? 1,
              id: s._id ?? s.id,
            };
          })
          .filter(
            (s) =>
              s._startDate && s.sDayUtc === dayIso && (s.seatsLeft ?? 0) > 0
          );

        const unique = [];
        const seen = new Set();
        for (const f of filtered) {
          const key = `${f.sDayUtc}_${f.label}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push({
              id: f.id,
              label: f.label,
              start: f._startDate,
              end: f.end ? new Date(f.end) : null,
              seatsLeft: f.seatsLeft,
              raw: f,
            });
          }
        }
        setSlotsForDate(unique);
      } catch (err) {
        console.error("Availability error", err);
        setSlotsForDate([]);
        alert("Failed to load availability");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedDate, selectedService]);

  const handleSelectSlotOnCalendar = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedSlot(null);
  };

  const handleStartBooking = async () => {
    const ok = requireAuthInline();
    if (!ok) return;
    if (!selectedService || !selectedSlot) {
      alert("Please choose a service and slot");
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const createRes = await createBooking({
        serviceId: selectedService._id ?? selectedService.id,
        slotId: selectedSlot.id,
        paymentMethod: "mock",
        userId,
      });
      const result = createRes.result ?? createRes;
      setBookingInfo(result);

      await confirmPayment({
        bookingId: result.bookingId,
        paymentRef: result.paymentRef,
        status: "success",
      });

      const payload = {
        bookingId: result.bookingId ?? result.id ?? null,
        serviceName: selectedService?.name ?? "",
        date: moment(selectedDate).format("YYYY-MM-DD"),
        slotLabel: selectedSlot?.label ?? "",
        amount: result.amount ?? selectedService?.price ?? 0,
        user: {
          name: result.userName ?? localStorage.getItem("userName") ?? null,
          email:
            result.userEmail ??
            localStorage.getItem("userEmail") ??
            loginForm.email ??
            null,
        },
        consultant: {
          name:
            selectedService?.consultantName ??
            selectedService?.consultant?.name ??
            selectedService?.providerName ??
            null,
          email:
            selectedService?.consultant?.email ??
            selectedService?.consultantEmail ??
            selectedService?.providerEmail ??
            null,
        },
      };

      try {
        if (payload.user?.email) {
          await sendBookingEmails(payload);
        } else {
          console.warn("No user email available - skipping email send");
          alert("Booking successful, but no email sent due to missing user email");
        }
      } catch (mailErr) {
        console.error("sendBookingEmails failed", mailErr);
      }

      alert("Booking successful! Confirmation email (if available) sent.");
      setStep(4);
    } catch (e) {
      console.error("Booking failed", e);
      alert("Booking failed: " + (e?.response?.data?.message ?? e?.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-5 md:py-12 bg-gray-50 min-h-screen mt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row h-[700px]">
        <div className="w-full md:w-1/4 bg-gray-100 border-r p-4 md:p-6 space-y-4 md:space-y-6">
          {["Service", "Schedule", "Payment", "Confirm"].map((label, i) => (
            <div
              key={i}
              onClick={() => setStep(i + 1)}
              className={`cursor-pointer p-3 rounded-lg text-sm font-medium ${
                step === i + 1
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {label}
            </div>
          ))}

          {!isAuthenticated ? (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700">
              Login required to book.
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => openLoginModal(null)}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-3 py-1 border rounded"
                >
                  Register
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-700">
              Logged in as {localStorage.getItem("userName") || "User"} — you can book appointments.
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {isLoading && (
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {step === 1 && !isLoading && (
            <>
              <h2 className="text-xl font-semibold mb-4">Choose a Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.length ? (
                  services.map((s) => (
                    <div
                      key={s._id ?? s.id}
                      onClick={() => setSelectedService(s)}
                      className={`cursor-pointer border rounded-lg p-4 text-center ${
                        selectedService?._id === s._id
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200"
                      }`}
                    >
                      <h3 className="font-medium">{s.name}</h3>
                      <p className="text-gray-600">₹{s.price}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No services available</p>
                )}
              </div>
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg disabled:opacity-50"
              >
                Next: Select Date & Time
              </button>
            </>
          )}

          {step === 2 && !isLoading && (
            <>
              <h2 className="text-xl font-semibold mb-4">Choose Date & Time</h2>
              <Calendar
                localizer={localizer}
                events={slotsForDate.map((slot) => ({
                  id: slot.id,
                  title: `${slot.label} (${slot.seatsLeft} left)`,
                  start: slot.start,
                  end: slot.end,
                }))}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400 }}
                selectable
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(newView) => setView(newView)}
                onSelectSlot={handleSelectSlotOnCalendar}
                components={{
                  toolbar: (props) => (
                    <div style={{ padding: "8px" }}>
                      <strong>{props.label}</strong>
                    </div>
                  ),
                }}
              />

              {selectedDate && (
                <>
                  <h3 className="font-medium mt-4 mb-2">
                    Selected Date: {moment(selectedDate).format("DD MMM YYYY")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {slotsForDate.length ? (
                      slotsForDate.map((slot) => {
                        const isFull = (slot.seatsLeft ?? 0) <= 0;
                        return (
                          <button
                            key={slot.id}
                            onClick={() => !isFull && setSelectedSlot(slot)}
                            disabled={isFull}
                            className={`px-4 py-2 rounded-lg border ${
                              selectedSlot?.id === slot.id
                                ? "bg-yellow-400 text-black border-yellow-400"
                                : isFull
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{slot.label}</span>
                              <small className="text-xs">
                                {isFull
                                  ? "Full"
                                  : `${slot.seatsLeft ?? 1} left`}
                              </small>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-gray-500">
                        No slots available for selected date
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Back
                </button>
                <button
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() => {
                    if (!isAuthenticated) {
                      openLoginModal(() => setStep(3));
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50"
                >
                  Next: Payment
                </button>
              </div>
            </>
          )}

          {step === 3 && !isLoading && (
            <>
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="space-y-4">
                {!isAuthenticated ? (
                  <div className="p-4 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                    You must be logged in to complete booking.
                    <div className="mt-2">
                      <button
                        onClick={() => openLoginModal(handleStartBooking)}
                        className="px-3 py-1 bg-yellow-400 rounded"
                      >
                        Login & Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>Mock payment flow — click Confirm to simulate payment.</p>
                )}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={() => requireAuthInline(handleStartBooking)}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black"
                  disabled={isLoading}
                >
                  Pay & Confirm
                </button>
              </div>
            </>
          )}

          {step === 4 && !isLoading && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 Booking Confirmed!
              </h2>
              <p className="mb-2">
                <strong>Service:</strong> {selectedService?.name}
              </p>
              <p className="mb-2">
                <strong>Date:</strong>{" "}
                {moment(selectedDate).format("DD MMM YYYY")}
              </p>
              <p className="mb-2">
                <strong>Slot:</strong> {selectedSlot?.label}
              </p>
              <p className="mb-4">
                A confirmation email has been sent if we have your email. You can
                also view/manage appointments in your dashboard.
              </p>

              <div className="flex items-center justify-center gap-3">
                {/* <button
                  onClick={() => (window.location.href = "/user-dashboard")}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
                >
                  Go to My Dashboard
                </button> */}
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedService(null);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                    setBookingInfo(null);
                  }}
                  className="px-6 py-2 rounded-lg border"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Login to continue</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your credentials — you'll stay on this page.
            </p>

            {loginError && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
                {loginError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Email</label>
                <input
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((s) => ({ ...s, email: e.target.value }))
                  }
                  className="w-full mt-1 px-3 py-2 border rounded"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Password</label>
                <input
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((s) => ({ ...s, password: e.target.value }))
                  }
                  className="w-full mt-1 px-3 py-2 border rounded"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded border"
                disabled={loginLoading}
              >
                Cancel
              </button>

              <button
                onClick={() => doLogin(loginForm)}
                className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black"
                disabled={loginLoading || !loginForm.email || !loginForm.password}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}