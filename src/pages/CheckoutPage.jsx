import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck, FaLock, FaTag } from "react-icons/fa";
import config from "./config";
import checkoutImage from "../assets/image/checkout page.png";

const razorpayKey = "rzp_live_ReNg1FQibGawr8";
const fallbackThumb = "/fallback-course.png";

function formatINR(v) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(v));
  } catch {
    return `₹${v}`;
  }
}

function SafeImg({ src, alt, className }) {
  const [s, setS] = useState(src || fallbackThumb);
  return (
    <img
      src={s}
      alt={alt}
      className={className}
      onError={() => setS(fallbackThumb)}
    />
  );
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || ""
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || ""
  );
  // alert(userId)
  const item = location.state?.course ||
    location.state?.webinar ||
    location.state?.appointment || {
      id: "demo-1",
      title: location.state.title,
      description: location.state.description,
      price: 1299,
      duration: "9h 12m",
      rating: 4.9,
      students: 15840,
      thumbnail: fallbackThumb,
    };

  const preparedItem = { ...item };
  if (location.state?.coursetype) preparedItem.courseId = item._id || item.id;
  else if (location.state?.webinartype)
    preparedItem.webinarId = item._id || item.id;
  else if (location.state?.appointmenttype)
    preparedItem.appointmentId = location.state?.appointmentId || item.id;
  if (location.state?.price)
    preparedItem.price = location.state?.price || item.price;

  const [step, setStep] = useState("details");
  const [isLoggedIn, setIsLoggedIn] = useState(!!userId);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    fullAddress: "",
  });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errors, setErrors] = useState({});
const [showFullDescription, setShowFullDescription] = useState(false);
  const net = Math.max(
    0,
    (Number(preparedItem.price) || 0) - (Number(discount) || 0)
  );
  const formattedNet = useMemo(() => formatINR(net), [net]);
  const studentsDisplay = useMemo(
    () => (preparedItem?.students ?? 0).toLocaleString(),
    [preparedItem]
  );
  console.log("item details with product", preparedItem);
  // Load Razorpay script
  useEffect(() => {
    const id = "razorpay-checkout-js";
    if (document.getElementById(id)) {
      setScriptLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setScriptLoaded(true);
    s.onerror = () => {
      setScriptLoaded(false);
      Swal.fire("Error", "Razorpay failed to load", "error");
    };
    document.body.appendChild(s);
  }, []);

  // Fetch user info if logged in
  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn && accessToken) {
        try {
          const res = await axios.get(`${config.BASE_URL}users/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const user = res.data?.result || {};
          setAddress({
            firstName: user.name || "John",
            lastName: user.lastName || "",
            email: user.email || "",
            mobile: user.mobile || "",
            fullAddress: user.address || "",
          });
          if (user._id) localStorage.setItem("userId", user._id);
        } catch {
          setAddress({
            firstName: "John",
            lastName: "Doe",
            email: "",
            mobile: "",
            fullAddress: "",
          });
        }
      }
    };

    fetchUser();

    // Listen to storage changes for instant login update
    const updateLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      const userids = localStorage.getItem("userId");
      setIsLoggedIn(!!token);
      if (token) setAccessToken(token);
      else setAccessToken("");
    };
    window.addEventListener("storage", updateLoginStatus);

    return () => window.removeEventListener("storage", updateLoginStatus);
  }, [isLoggedIn, accessToken, userId]);

  // Login Handler
  const validateLogin = () => {
    const e = {};
    if (!loginData.email || !/^\S+@\S+\.\S+$/.test(loginData.email))
      e.email = "Invalid email";
    if (!loginData.password || loginData.password.length < 6)
      e.password = "Min 6 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const res = await axios.post(`${config.BASE_URL}auth/login`, loginData);
      // many APIs return tokens inside result or data — adapt if needed
      const result = res.data?.result || {};
      const accessToken = result.accessToken || result.access_token || null;
      const refreshToken = result.refreshToken || result.refresh_token || null;
      const user = result.user || result.userData || result; // fallbacks

      if (!accessToken) {
        Swal.fire("Error", "Login failed: Invalid response", "error");
        return;
      }

      // store tokens & user safely
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (user && (user._id || user.id)) {
        localStorage.setItem("userId", user._id || user.id);
      }

      // update local state so UI switches to logged-in immediately
      setAccessToken(accessToken);
      setUserId(user?._id || user?.id || "");
      setIsLoggedIn(true);

      // notify other parts of the app (some components might listen for this)
      window.dispatchEvent(new Event("loginStatusChanged"));

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${user?.firstName || user?.name || "User"}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      setAddress({
        firstName: user?.name || user?.firstName || "John",
        lastName: user?.lastName || "Doe",
        email: user?.email || loginData.email,
        mobile: user?.mobile || "",
        fullAddress: user?.address || "",
      });
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire("Error", "Login failed. Please check credentials.", "error");
    }
  };

  // Address Validation
  const validateAddress = () => {
    const e = {};
    if (!address.firstName) e.firstName = "Required";
    if (!address.lastName) e.lastName = "Required";
    if (!address.email || !/^\S+@\S+\.\S+$/.test(address.email))
      e.email = "Invalid email";
    if (!address.mobile || !/^\d{7,15}$/.test(address.mobile))
      e.mobile = "Invalid phone";
    // if (!address.fullAddress) e.fullAddress = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Apply Coupon
  const applyCoupon = async () => {
    if (!coupon.trim())
      return Swal.fire("Info", "Please enter a coupon code.", "info");
    try {
      const res = await axios.post(
        `${config.BASE_URL}coupon/apply`,
        { code: coupon },
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );
      setDiscount(res.data.discount || 0);
      Swal.fire(
        "Success",
        `Coupon applied: ₹${res.data.discount || 0} off`,
        "success"
      );
    } catch {
      Swal.fire("Error", "Invalid coupon code", "error");
    }
  };

  // Payment Handler
  const handlePayment = async () => {
    if (!scriptLoaded || typeof window.Razorpay === "undefined") {
      Swal.fire("Error", "Payment gateway not ready", "error");
      return;
    }

    if (!validateAddress()) return;
    setLoadingPayment(true);

    try {
      const createPayload = {
        webinarId: preparedItem.webinarId,
        courseId: preparedItem.courseId,
        appointmentId: preparedItem.appointmentId,
        itemType: location.state?.coursetype
          ? "course"
          : location.state?.webinartype
          ? "webinar"
          : location.state?.appointmenttype
          ? "appointment"
          : "course",
        amount: net,
        userId: userId || "guest",
      };

      const createRes = await axios.post(
        `${config.BASE_URL}orders`,
        createPayload,
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );

      const createData = createRes?.data || {};
      const ordReceipt = createData?.result?.order?.orderId || "ord-temp";
      const ordAmount = createData?.result?.order?.amount || net;

      const payRes = await axios.post(
        `${config.BASE_URL}orders/${ordReceipt}/pay`,
        { amount: ordAmount },
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );

      const payData = payRes?.data || {};
      const rOrderRaw = payData?.result?.rOrder || payData?.result?.order || {};
      const internalOrderId = payData?.result?.orderId || null;

      const rOrder = {
        id: rOrderRaw?.id,
        amount: rOrderRaw?.amount ?? Math.round(net * 100),
        currency: rOrderRaw?.currency || "INR",
        receipt: rOrderRaw?.receipt || null,
      };

      const verifyId = internalOrderId || rOrder?.receipt || null;

      const options = {
        key: razorpayKey,
        amount: rOrder.amount,
        currency: rOrder.currency,
        name: "CAKISTOCKMARKET",
        description: preparedItem.title,
        order_id: rOrder.id,
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.mobile,
        },
        handler: async (resp) => {
          try {
            await axios.post(
              `${config.BASE_URL}orders/${verifyId}/verify`,
              {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                amount: rOrder.amount,
              },
              {
                headers: accessToken
                  ? { Authorization: `Bearer ${accessToken}` }
                  : {},
              }
            );
            Swal.fire("Success", "Payment Successful!", "success");
            setStep("success");
            navigate("/user-dashboard");
          } catch {
            Swal.fire("Error", "Payment verification failed", "error");
          } finally {
            setLoadingPayment(false);
          }
        },
        modal: { ondismiss: () => setLoadingPayment(false) },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      Swal.fire("Error", "Payment failed to start", "error");
      setLoadingPayment(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-block p-4 bg-green-100 rounded-full">
            <FaCheck className="text-4xl text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            You have successfully enrolled in
          </p>
          <p className="text-lg font-semibold text-green-700 mb-6">
            {preparedItem.title}
          </p>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-18 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your enrollment securely</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SECTION - FORM */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Information
                </h2>

                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleLogin}
                      className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold py-3 rounded-lg transition duration-200 mt-4"
                    >
                      Sign In
                    </button>

                    {/* 🟡 SIGN UP BUTTON */}
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
                    >
                      SignUp
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="First name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                          value={address.firstName}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              firstName: e.target.value,
                            })
                          }
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Last name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                          value={address.lastName}
                          onChange={(e) =>
                            setAddress({ ...address, lastName: e.target.value })
                          }
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        value={address.email}
                        onChange={(e) =>
                          setAddress({ ...address, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        value={address.mobile}
                        onChange={(e) =>
                          setAddress({ ...address, mobile: e.target.value })
                        }
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.mobile}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        placeholder="Type Your Message"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                        value={address.fullAddress}
                        onChange={(e) =>
                          setAddress({
                            ...address,
                            fullAddress: e.target.value,
                          })
                        }
                      />
                      {errors.fullAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullAddress}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isLoggedIn && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Have a coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
                    >
                      <FaTag className="text-sm" /> Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - ORDER SUMMARY */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-md p-8 sticky top-10 space-y-6">
              <div>
                <img
                  src={checkoutImage}
                  alt="Checkout Page"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>

              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {preparedItem.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {showFullDescription
                    ? preparedItem.description
                    : preparedItem.description?.slice(0, 80) +
                      (preparedItem.description?.length > 80 ? "..." : "")}

                  {preparedItem.description?.length > 80 && (
                    <button
                      className="text-blue-600 ml-2 text-xs underline"
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>

              {/* 
              <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span> Enrolled</span>
                <span className="font-semibold text-gray-900">
                  {studentsDisplay}
                </span>
              </div> */}

              <div className="space-y-3 border-t border-b py-4">
                <div className="flex justify-between text-gray-600">
                  <span>Price</span>
                  <span className="font-semibold">₹{preparedItem.price}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-xs" /> Discount
                    </span>
                    <span className="font-semibold">- ₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-600">{formattedNet}</span>
              </div>

              <button
                onClick={handlePayment}
                className={`w-full py-4 rounded-lg font-bold text-white transition duration-200 flex items-center justify-center gap-2 ${
                  loadingPayment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-95"
                }`}
                disabled={loadingPayment}
              >
                <FaLock className="text-sm" />
                {loadingPayment ? "Processing..." : "Pay Now"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                💳 Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
