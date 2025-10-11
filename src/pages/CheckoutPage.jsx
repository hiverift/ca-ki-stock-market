import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import config from "./config";

const razorpayKey = "rzp_test_RD67KFzwSW83SE";
const fallbackThumb = "/fallback-course.png";

function formatINR(v) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v));
  } catch {
    return `₹${v}`;
  }
}

function SafeImg({ src, alt, className }) {
  const [s, setS] = useState(src || fallbackThumb);
  return <img src={s} alt={alt} className={className} onError={() => setS(fallbackThumb)} />;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");

  const item =
    location.state?.course ||
    location.state?.webinar ||
    location.state?.appointment || {
      id: "demo-1",
      title: "Master React — Complete Guide",
      description: "Modern React from zero to pro.",
      price: 1299,
      duration: "9h 12m",
      rating: 4.9,
      students: 15840,
      thumbnail: fallbackThumb,
    };

  const preparedItem = { ...item };
  if (location.state?.coursetype) preparedItem.courseId = item._id || item.id;
  else if (location.state?.webinartype) preparedItem.webinarId = item._id || item.id;
  else if (location.state?.appointmenttype)
    preparedItem.appointmentId = location.state?.appointmentId || item.id;
  if (location.state?.price) preparedItem.price = location.state?.price || item.price;

  const [dark, setDark] = useState(false);
  const [step, setStep] = useState("details");
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "user" });
  const [address, setAddress] = useState({
    name: "",
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

  const net = Math.max(0, (Number(preparedItem.price) || 0) - (Number(discount) || 0));
  const formattedNet = useMemo(() => formatINR(net), [net]);
  const studentsDisplay = useMemo(() => (preparedItem?.students ?? 0).toLocaleString(), [preparedItem]);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

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

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      (async () => {
        try {
          const res = await axios.get(`${BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log("User details fetch response:", res);
          const user = res.result?.user || {};
          console.log("Fetched user details:", user);
          setAddress({
            name: user.name || "John",
            lastName: user.lastName || "Doe",
            email: user.email || "example@gmail.com",
            mobile: user.mobile || "9999999999",
            fullAddress: user.address || "Delhi, India",
          });
          if (user._id) {
            localStorage.setItem("userId", user._id);
            setUserId(user._id);
          }
        } catch {
          setAddress({
            name: "John",
            lastName: "Doe",
            email: "example@gmail.com",
            mobile: "9999999999",
            fullAddress: "Delhi, India",
          });
        }
      })();
    }
  }, [isLoggedIn, accessToken]);

  const validateLogin = () => {
    const e = {};
    if (!loginData.email || !/^\S+@\S+\.\S+$/.test(loginData.email)) e.email = "Invalid email";
    if (!loginData.password || loginData.password.length < 6) e.password = "Min 6 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const res = await axios.post(`${config.BASE_URL}auth/login`, loginData);
       console.log("Login successful, user:", res.data?.result);
      const { accessToken, user } = res.data?.result || {};
       
      if (accessToken) {
     
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user._id || "");
        localStorage.setItem("user", JSON.stringify(user));

        setAccessToken(accessToken);
        setUserId(user._id || "");
        setIsLoggedIn(true);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${user.firstName || "User"}!`,
          timer: 2500,
          showConfirmButton: false,
        });

        setAddress({
          name: user.name || "John",
          lastName: user.lastName || "Doe",
          email: user.email || loginData.email,
          mobile: user.mobile || "9999999999",
          fullAddress: user.address || "Delhi, India",
        });
      } else {
        Swal.fire("Error", "Login failed: Invalid response", "error");
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      Swal.fire("Error", "Login failed. Please check credentials.", "error");
    }
  };
  const validateAddress = () => {
    const e = {};
    if (!address.name) e.name = "Required";
    if (!address.lastName) e.lastName = "Required";
    if (!address.email || !/^\S+@\S+\.\S+$/.test(address.email)) e.email = "Invalid email";
    if (!address.mobile || !/^\d{7,15}$/.test(address.mobile)) e.mobile = "Invalid phone";
    if (!address.fullAddress) e.fullAddress = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async () => {
    if (!coupon)
      return Swal.fire("Info", "Please enter a coupon code.", "info");
    try {
      const res = await axios.post(
        `${config.BASE_URL}coupon/apply`,
        { code: coupon },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );
      setDiscount(res.data.discount || 0);
      Swal.fire("Success", `Coupon applied: ₹${res.data.discount || 0} off`, "success");
    } catch {
      Swal.fire("Error", "Invalid coupon code", "error");
    }
  };

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
        itemType:
          location.state?.coursetype
            ? "course"
            : location.state?.webinartype
            ? "webinar"
            : location.state?.appointmenttype
            ? "appointment"
            : "course",
        amount: net,
        userId: userId || "guest",
      };

      const createRes = await axios.post(`${config.BASE_URL}orders`, createPayload, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });

      const createData = createRes?.data || {};
      const ordReceipt = createData?.result?.order?.orderId || "ord-temp";
      const ordAmount = createData?.result?.order?.amount || net;

      const payRes = await axios.post(
        `${config.BASE_URL}orders/${ordReceipt}/pay`,
        { amount: ordAmount },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
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
          contact: address.phone,
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
              { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
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
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("handlePayment error:", err);
      Swal.fire("Error", "Payment failed to start", "error");
      setLoadingPayment(false);
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
        <FaCheck className="text-6xl text-green-500" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p>
          You have successfully enrolled in <strong>{preparedItem.title}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 max-w-6xl mx-auto ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SECTION */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-lg font-semibold mb-2">Your Info</h2>

          {!isLoggedIn ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded border text-sm"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded border text-sm"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <button
                onClick={handleLogin}
                className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded mt-2 font-semibold transition"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-2 rounded border text-sm"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-2 rounded border text-sm"
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded border text-sm"
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-2 rounded border text-sm"
                value={address.mobile}
                onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
              <textarea
                placeholder="Full Address"
                rows={3}
                className="w-full p-2 rounded border text-sm"
                value={address.fullAddress}
                onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
              />
              {errors.fullAddress && <p className="text-red-500 text-sm">{errors.fullAddress}</p>}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <input
              type="text"
              placeholder="Coupon code"
              className="flex-1 p-2 rounded border text-sm"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button
              onClick={applyCoupon}
              className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-semibold transition"
            >
              Apply
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <SafeImg src={preparedItem.thumbnail} alt={preparedItem.title} className="w-full h-44 object-cover rounded-lg" />
          <h3 className="font-bold text-base sm:text-lg">{preparedItem.title}</h3>
          <p className="text-sm">{preparedItem.description}</p>
          <p className="text-sm">Students Enrolled: {studentsDisplay}</p>

          <div className="flex justify-between text-sm">
            <span>Price:</span>
            <span>₹{preparedItem.price}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>- ₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Total:</span>
            <span>{formattedNet}</span>
          </div>

          <button
            onClick={handlePayment}
            className={`w-full bg-green-500 hover:bg-green-600 py-2 rounded font-bold transition ${loadingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loadingPayment}
          >
            {loadingPayment ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
