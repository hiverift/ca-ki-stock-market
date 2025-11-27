import React, { useEffect, useState } from "react";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate, useLocation } from "react-router-dom";

import Swal from "sweetalert2";
import config from "./config";

import {
  getServices,
  getAvailability,
  createBooking,
} from "../Api/bookings/bookings";
import ApiLogin from "../Api/bookings/auth.js";
import axios, { Axios } from "axios";

const localizer = momentLocalizer(moment);

export default function AppointmentPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [slotsForDate, setSlotsForDate] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [postLoginAction, setPostLoginAction] = useState(null);

  const [availableDates, setAvailableDates] = useState([]); // Dates with slots

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const handleRegisterSubmit = async () => {
  //   if (!agreed) {
  //     alert("You must agree to Terms & Privacy Policy");
  //     return;
  //   }
  //   if (!registerForm.name || !registerForm.email || !registerForm.mobile || !registerForm.password || !registerForm.confirmPassword) {
  //     alert("Please fill all fields");
  //     return;
  //   }
  //   if (registerForm.password !== registerForm.confirmPassword) {
  //     alert("Passwords do not match");
  //     return;
  //   }

  //   setRegisterLoading(true);
  //   try {
  //     const res = await axios.post(`${config.BASE_URL}auth/register`, {
  //       name: registerForm.name,
  //       email: registerForm.email,
  //       mobile: registerForm.mobile,
  //       password: registerForm.password,
  //       role: "user",
  //     });

  //     if (res.data.statusCode === 403) {
  //       alert("Email or mobile already exists");
  //       return;
  //     }

  //     // Auto-login after signup
  //     const loginRes = await axios.post(`${config.BASE_URL}auth/login`, {
  //       email: registerForm.email,
  //       password: registerForm.password,
  //     });
  //     const token = loginRes.data.token ?? loginRes.data.accessToken;
  //     if (token) {
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("accessToken", token);
  //       setIsAuthenticated(true);
  //       setShowRegisterModal(false);
  //       setStep(3); // continue to payment
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.response?.data?.message || "Registration failed");
  //   } finally {
  //     setRegisterLoading(false);
  //   }
  // };

  // Updated Next button handler
  // const handleNextPaymentStep = () => {
  //   const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  //   if (!token) {
  //     // If not logged in, open login modal and allow switch to registration
  //     openLoginModal(() => setStep(3));
  //     return;
  //   }
  //   setStep(3);
  // };

  // const handleNextPaymentStep = () => {
  //   const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

  //   if (!token) {
  //     // Redirect to login and store the current page so user can come back
  //     navigate("/login", { state: { from: location.pathname } });
  //     return;
  //   }

  //   // If already logged in, move to payment step
  //   setStep(3);
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(Boolean(userId));
  }, []);

  // Automatically show login modal if user reaches Payment step
  useEffect(() => {
    if (step === 3 && !isAuthenticated) {
      openLoginModal(null);
    }
  }, [step, isAuthenticated]);

  // ⭐ Step Navigation Control Function
  const canGoToStep = (targetStep) => {
    if (targetStep === 1) return true;

    if (targetStep === 2 && selectedService) return true;

    if (targetStep === 3 && selectedService && selectedDate && selectedSlot)
      return true;

    if (
      targetStep === 4 &&
      isAuthenticated &&
      selectedService &&
      selectedDate &&
      selectedSlot
    )
      return true;

    return false;
  };

  const doLogin = async (form) => {
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
      const token =
        data?.token ??
        localStorage.getItem("token") ??
        data?.accessToken ??
        data?.jwt ??
        null;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
      }

      const user = data?.user ?? data;
      if (user) {
        if (user._id || user.id)
          localStorage.setItem("userId", user._id ?? user.id);
        if (user.name) localStorage.setItem("userName", user.name);
        if (user.email) localStorage.setItem("userEmail", user.email);
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {}
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
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
      openLoginModal(actionIfAuthenticated);
      return false;
    }
    setIsAuthenticated(true);
    if (typeof actionIfAuthenticated === "function") actionIfAuthenticated();
    return true;
  };

  // Fetch services
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

  // Fetch availability & process slots in IST
  useEffect(() => {
    (async () => {
      try {
        if (!selectedService) {
          setSlotsForDate([]);
          setAvailableDates([]);
          return;
        }
        setIsLoading(true);

        const serviceId = selectedService._id ?? selectedService.id;
        const month = moment(selectedDate || new Date()).format("YYYY-MM");
        const raw = await getAvailability(serviceId, month);
        const payload = raw && raw.result ? raw.result : raw;
        const slots = Array.isArray(payload) ? payload : [];

        const processedSlots = slots
          .map((s) => {
            const startUtc = s.start ? moment.utc(s.start) : null;
            const endUtc = s.end ? moment.utc(s.end) : null;

            const startIST = startUtc
              ? startUtc.tz("Asia/Kolkata").toDate()
              : null;
            const endIST = endUtc
              ? endUtc.tz("Asia/Kolkata").toDate()
              : startIST;

            return {
              ...s,
              _startDate: startIST,
              _endDate: endIST,
              sDayUtc: startIST ? moment(startIST).format("YYYY-MM-DD") : null,
              label: startIST ? moment(startIST).format("hh:mm A") : "",
              seatsLeft: s.seatsLeft ?? s.capacity ?? 1,
              id: s._id ?? s.id,
            };
          })
          .filter((s) => s._startDate && (s.seatsLeft ?? 0) > 0);

        const unique = [];
        const seen = new Set();
        for (const f of processedSlots) {
          const key = `${f.sDayUtc}_${f.label}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push({
              id: f.id,
              label: f.label,
              start: f._startDate,
              end: f._endDate,
              seatsLeft: f.seatsLeft,
              raw: f,
            });
          }
        }

        const datesSet = new Set(
          unique.map((s) => moment(s.start).startOf("day").toISOString())
        );
        setAvailableDates(Array.from(datesSet));

        if (selectedDate) {
          const dayIso = moment(selectedDate).startOf("day").toISOString();
          setSlotsForDate(
            unique.filter(
              (s) => moment(s.start).startOf("day").toISOString() === dayIso
            )
          );
        } else {
          setSlotsForDate([]);
        }
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
    const clickedDate = moment(slotInfo.start).startOf("day");
    const today = moment().startOf("day");

    const isAvailable = availableDates.some((d) =>
      moment(d).isSame(clickedDate, "day")
    );

    if (!isAvailable) {
      alert("No slots available on this date");
      return;
    }

    if (clickedDate.isBefore(today)) {
      alert("You cannot book a past date!");
      return;
    }

    setSelectedDate(slotInfo.start);
    setSelectedSlot(null);
  };

  const handleProceedToCheckout = async () => {
    requireAuthInline(async () => {
      setIsLoading(true);
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("accessToken");
        const bookingPayload = {
          serviceId: selectedService?._id ?? selectedService?.id,
          slotId: selectedSlot?.id,
          date: moment(selectedDate).format("YYYY-MM-DD"),
          userId: localStorage.getItem("userId"),
        };

        const bookingResult = await createBooking(bookingPayload, token);

        if (!bookingResult || !bookingResult.bookingId) {
          alert("Booking creation failed");
          return;
        }

        navigate("/checkout", {
          state: {
            appointmenttype: "appointment",
            appointmentId: bookingResult.bookingId,
            title: selectedService?.name,
            description: `Appointment on ${moment(selectedDate).format(
              "DD MMM YYYY"
            )} at ${selectedSlot?.label}`,
            price: Number(selectedService?.price) || 0,
            slot: selectedSlot,
            date: selectedDate,
            serviceId: selectedService?._id ?? selectedService?.id,
          },
        });
      } catch (err) {
        console.error(err);
        alert("Booking creation failed");
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleRegisterSubmit = async () => {
    if (!agreed) {
      Swal.fire(
        "Error",
        "Please agree to the Terms and Privacy Policy",
        "error"
      );
      return;
    }

    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.mobile ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      setRegisterLoading(true);

      const response = await axios.post(`${config.BASE_URL}auth/register`, {
        name: registerForm.name,
        email: registerForm.email,
        mobile: registerForm.mobile,
        password: registerForm.password,
        role: "user",
      });

      if (response.data.statusCode === 403) {
        Swal.fire("Error", "Email or mobile number already exists", "error");
        return;
      }

      Swal.fire("Success", "Account created successfully!", "success").then(
        () => {
          // Reset form
          setRegisterForm({
            name: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
          });
          setAgreed(false);
          setShowRegisterModal(false);
          setShowLoginModal(true); // Optionally open login after successful registration
        }
      );
    } catch (error) {
      console.error("Register error:", error);
      if (error.response) {
        Swal.fire(
          "Error",
          error.response.data.message || "Something went wrong!",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          "Unable to connect to server. Try again later.",
          "error"
        );
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="px-4 pt-5 md:py-12 bg-gray-50 min-h-screen mt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left Menu */}
        <div className="w-full md:w-1/4 bg-gray-100 border-r p-4 md:p-6 space-y-4 md:space-y-6">
          {["Service", "Schedule", "Payment", "Confirm"].map((label, i) => (
            <div
              key={i}
              onClick={() => {
                if (canGoToStep(i + 1)) setStep(i + 1);
              }}
              className={`p-3 rounded-lg text-sm font-medium 
        ${
          step === i + 1
            ? "bg-yellow-400 text-black"
            : canGoToStep(i + 1)
            ? "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }
      `}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main Step Content */}
        <div className="flex-1 p-6 overflow-auto">
          {isLoading && (
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {/* Step 1: Select Service */}
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

          {/* Step 2: Calendar & Slots */}
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
                view={Views.MONTH}
                views={[Views.MONTH]}
                onNavigate={(newDate) => setDate(newDate)}
                onSelectSlot={handleSelectSlotOnCalendar}
                onDrillDown={(date, view) => setSelectedDate(date)}
                dayPropGetter={(date) => {
                  const isAvailable = availableDates.some((d) =>
                    moment(d).isSame(date, "day")
                  );
                  return {
                    className: isAvailable
                      ? ""
                      : "bg-gray-100 text-gray-300 pointer-events-none",
                  };
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
                  onClick={() => setStep(3)}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50"
                >
                  Next: Payment
                </button>
              </div>
            </>
          )}

          {/* Step 3: Payment */}
          {step === 3 && !isLoading && (
            <>
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="space-y-4">
                {!isAuthenticated ? (
                  <div className="p-4 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                    You must be logged in to complete booking.
                  </div>
                ) : (
                  <p>Proceed to checkout to complete your payment.</p>
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
                  onClick={handleProceedToCheckout}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black"
                  disabled={isLoading}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && !isLoading && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 Booking Confirmed!
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Login to continue</h3>

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
                disabled={
                  loginLoading || !loginForm.email || !loginForm.password
                }
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Register</h3>

            {/* Form state */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-3 py-2 border rounded"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-3 py-2 border rounded"
                value={registerForm.mobile}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, mobile: e.target.value })
                }
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border rounded"
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            {/* Toggle password visibility */}
            <div className="flex space-x-2 mt-1">
              <button
                type="button"
                className="text-sm text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
              <button
                type="button"
                className="text-sm text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide Confirm" : "Show Confirm"}
              </button>
            </div>

            {/* Terms checkbox */}
            <div className="mt-3 flex items-start">
              <input
                type="checkbox"
                className="mt-1 mr-2 accent-yellow-500"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <label className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 rounded border"
                disabled={registerLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black"
                onClick={handleRegisterSubmit}
                disabled={registerLoading || !agreed}
              >
                {registerLoading ? "Registering..." : "Register"}
              </button>
            </div>

            {/* Login link */}
            <p className="mt-2 text-sm text-gray-500">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
