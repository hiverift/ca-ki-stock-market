import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

function useToasts() {
  const [toasts, setToasts] = useState([]);
  function push(message, type = "info", ttl = 3500) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }
  return { toasts, push, remove: (id) => setToasts((t) => t.filter((x) => x.id !== id)) };
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToasts();

  // ✅ FIXED: Manage accessToken and userId with state and localStorage sync
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
  else if (location.state?.appointmenttype) preparedItem.appointmentId = location.state?.appointmentId || item.id;
  if (location.state?.price) preparedItem.price = location.state?.price || item.price;

  const [dark, setDark] = useState(false);
  const [step, setStep] = useState("details");
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "user" });
  const [address, setAddress] = useState({ firstName: "", lastName: "", email: "", phone: "", fullAddress: "" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
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
      toast.push("Razorpay failed to load", "error");
    };
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      (async () => {
        try {
          const res = await axios.get(`${config.BASE_URL}auth/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const user = res.data?.user || {};
          setAddress({
            firstName: user.firstName || "John",
            lastName: user.lastName || "Doe",
            email: user.email || "example@gmail.com",
            phone: user.phone || "9999999999",
            fullAddress: user.address || "Delhi, India",
          });
          if (user._id) {
            localStorage.setItem("userId", user._id);
            setUserId(user._id);
          }
        } catch {
          setAddress({
            firstName: "John",
            lastName: "Doe",
            email: "example@gmail.com",
            phone: "9999999999",
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
      const { accessToken, user } = res.data?.result || {};

      if (accessToken && user) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user._id || "");
        localStorage.setItem("user", JSON.stringify(user));

        setAccessToken(accessToken);
        setUserId(user._id || "");
        setIsLoggedIn(true);
        toast.push("Login successful!", "success");

        setAddress({
          firstName: user.firstName || "John",
          lastName: user.lastName || "Doe",
          email: user.email || loginData.email,
          phone: user.phone || "9999999999",
          fullAddress: user.address || "Delhi, India",
        });
      } else {
        toast.push("Login failed: Invalid response", "error");
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data || err.message);
      toast.push("Login failed", "error");
    }
  };

  const validateAddress = () => {
    const e = {};
    if (!address.firstName) e.firstName = "Required";
    if (!address.lastName) e.lastName = "Required";
    if (!address.email || !/^\S+@\S+\.\S+$/.test(address.email)) e.email = "Invalid email";
    if (!address.phone || !/^\d{7,15}$/.test(address.phone)) e.phone = "Invalid phone";
    if (!address.fullAddress) e.fullAddress = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async () => {
    if (!coupon) return toast.push("Enter coupon code", "info");
    try {
      const res = await axios.post(
        `${config.BASE_URL}coupon/apply`,
        { code: coupon },
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );
      setDiscount(res.data.discount || 0);
      toast.push(`Coupon applied: ₹${res.data.discount || 0} off`, "success");
    } catch {
      toast.push("Invalid coupon", "error");
    }
  };

  const createOrder = async () => {
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
      const ordReceipt = createData?.result?.order?.orderId || "ord-doneod";
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

      return {
        rOrder: {
          id: rOrderRaw?.id,
          amount: rOrderRaw?.amount ?? Math.round(net * 100),
          currency: rOrderRaw?.currency || "INR",
          receipt: rOrderRaw?.receipt || null,
        },
        internalOrderId: internalOrderId || null,
      };
    } catch (err) {
      console.error("createOrder error:", err?.response?.data || err.message);
      toast.push("Order creation failed", "error");
      throw err;
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded || typeof window.Razorpay === "undefined") {
      toast.push("Payment gateway not ready", "error");
      return;
    }

    if (!validateAddress()) return;
    setLoadingPayment(true);

    try {
      const { rOrder, internalOrderId } = await createOrder();

      if (!rOrder?.id) throw new Error("Razorpay order id missing");

      const verifyId = internalOrderId || rOrder?.receipt || null;

      const options = {
        key: razorpayKey,
        amount: rOrder.amount,
        currency: rOrder.currency || "INR",
        name: "CAKISTOCKMARKET",
        description: preparedItem.title,
        order_id: rOrder.id,
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "var(--accent)" },
        handler: async (resp) => {
          try {
            const verifyUrl = `${config.BASE_URL}orders/${verifyId}/verify`;
            await axios.post(
              verifyUrl,
              {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                amount: rOrder.amount,
              },
              {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
              }
            );

            toast.push("Payment successful!", "success");
            setStep("success");
            setLoadingPayment(false);
            navigate("/user-dashboard");
          } catch (verifyErr) {
            console.error("verify error:", verifyErr);
            toast.push("Payment verification failed", "error");
            setLoadingPayment(false);
          }
        },
        modal: { ondismiss: () => setLoadingPayment(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("handlePayment error:", err?.response?.data || err.message);
      setLoadingPayment(false);
      toast.push("Payment failed to start", "error");
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
        <FaCheck className="text-6xl text-green-500" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p>
          You have successfully enrolled in <strong>{preparedItem.title}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-8 max-w-6xl mx-auto ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="py-10">
        <h1 className="text-xl sm:text-2xl font-bold">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
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
                className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded mt-2 font-semibold"
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
                    value={address.firstName}
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
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
            <button onClick={applyCoupon} className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-semibold">
              Apply
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <SafeImg src={preparedItem.thumbnail} alt={preparedItem.title} className="w-full h-40 sm:h-48 object-cover rounded" />
          <h3 className="font-bold text-base sm:text-lg">{preparedItem.title}</h3>
          <p className="text-sm sm:text-base">{preparedItem.description}</p>
          <p className="text-sm sm:text-base">Students Enrolled: {studentsDisplay}</p>

          <div className="flex justify-between text-sm sm:text-base">
            <span>Price:</span>
            <span>₹{preparedItem.price}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm sm:text-base text-green-500">
              <span>Discount:</span>
              <span>- ₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-base sm:text-lg border-t pt-2">
            <span>Total:</span>
            <span>{formattedNet}</span>
          </div>

          <button
            onClick={handlePayment}
            className={`w-full bg-green-500 hover:bg-green-600 py-2 rounded font-bold ${loadingPayment ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loadingPayment}
          >
            {loadingPayment ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
