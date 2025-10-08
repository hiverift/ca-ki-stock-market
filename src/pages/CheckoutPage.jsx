import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCheck,
  FaSun,
  FaMoon,
} from "react-icons/fa";
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

  const item = location.state?.course || {
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
  else if (location.state?.appointmenttype) preparedItem.appointmentId = item._id || item.id;

  const [dark, setDark] = useState(false);
  const [step, setStep] = useState("details");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "user" });
  const [address, setAddress] = useState({ firstName: "", lastName: "", email: "", phone: "", fullAddress: "" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || "");

  const net = Math.max(0, (Number(preparedItem.price) || 0) - (Number(discount) || 0));
  const formattedNet = useMemo(() => formatINR(net), [net]);
  const studentsDisplay = useMemo(() => (preparedItem?.students ?? 0).toLocaleString(), [preparedItem]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
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
    s.onerror = () => toast.push("Razorpay failed to load", "error");
    document.body.appendChild(s);
  }, []);

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
      const res = await axios.post(`${config.BASE_URL}coupon/apply`, { code: coupon }, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
      setDiscount(res.data.discount || 0);
      toast.push(`Coupon applied: ₹${res.data.discount || 0} off`, "success");
    } catch {
      toast.push("Invalid coupon", "error");
    }
  };

  const createOrder = async () => {
    try {
      const payload = {
        webinarId: preparedItem.webinarId,
        courseId: preparedItem.courseId,
        appointmentId: preparedItem.appointmentId,
        itemType: location.state?.coursetype
          ? "course"
          : location.state?.webinartype
          ? "webinar"
          : "appointment",
        amount: Math.round(net),
        userId: "68b1a01074ad0c19f272b438",
      };

      const createRes = await axios.post(`${config.BASE_URL}orders`, payload, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
      const createData = createRes?.data?.result?.order || {};
      const ordReceipt = createData.orderId || "ord-default";

      const payRes = await axios.post(`${config.BASE_URL}orders/${ordReceipt}/pay`, { amount: createData.amount }, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      const rOrder = payRes?.data?.result?.rOrder;
      const internalOrderId = payRes?.data?.result?.orderId;
      return { rOrder, internalOrderId };
    } catch (err) {
      toast.push("Order creation failed", "error");
      throw err;
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded || typeof window.Razorpay === "undefined") {
      toast.push("Payment gateway not ready", "error");
      return;
    }

    setLoadingPayment(true);
    try {
      const { rOrder, internalOrderId } = await createOrder();

      const options = {
        key: razorpayKey,
        amount: rOrder.amount,
        currency: "INR",
        name: "CAKISTOCKMARKET",
        description: preparedItem.title,
        order_id: rOrder.id,
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#facc15" },
        handler: async (resp) => {
          try {
            await axios.post(`${config.BASE_URL}orders/${internalOrderId}/verify`, resp, {
              headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
            });
            setLoadingPayment(false);
            setStep("success");
            toast.push("Payment successful!", "success");

            // redirect according to type
            setTimeout(() => {
              if (preparedItem.courseId) navigate(`/course/${preparedItem.courseId}`);
              else if (preparedItem.webinarId) navigate(`/webinar/${preparedItem.webinarId}`);
              else if (preparedItem.appointmentId) navigate(`/appointment/${preparedItem.appointmentId}`);
              else navigate("/");
            }, 1800);
          } catch {
            toast.push("Payment verification failed", "error");
            setLoadingPayment(false);
          }
        },
        modal: { ondismiss: () => setLoadingPayment(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setLoadingPayment(false);
      toast.push("Payment failed to start", "error");
    }
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50 dark:bg-gray-900 text-center">
        <FaCheck className="text-6xl text-green-500" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p>You have successfully enrolled in <strong>{preparedItem.title}</strong>.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 max-w-4xl mx-auto transition-colors duration-300 ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <button onClick={() => setDark(!dark)} className="p-2 rounded-full border">
          {dark ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-lg shadow space-y-3">
          <h2 className="text-lg font-semibold mb-2">Your Details</h2>

          <input type="text" placeholder="First Name" className="w-full p-2 rounded border dark:bg-gray-700" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

          <input type="text" placeholder="Last Name" className="w-full p-2 rounded border dark:bg-gray-700" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

          <input type="email" placeholder="Email" className="w-full p-2 rounded border dark:bg-gray-700" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input type="tel" placeholder="Phone" className="w-full p-2 rounded border dark:bg-gray-700" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <textarea placeholder="Full Address" className="w-full p-2 rounded border dark:bg-gray-700" value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} />
          {errors.fullAddress && <p className="text-red-500 text-sm">{errors.fullAddress}</p>}

          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Coupon code" className="flex-1 p-2 rounded border dark:bg-gray-700" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            <button onClick={applyCoupon} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded">Apply</button>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-5 rounded-lg shadow flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <SafeImg src={preparedItem.thumbnail} alt={preparedItem.title} className="w-full h-40 object-cover rounded" />
          <h3 className="font-bold">{preparedItem.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{preparedItem.description}</p>
          <p>Students Enrolled: {studentsDisplay}</p>

          <div className="flex justify-between"><span>Price:</span><span>₹{preparedItem.price}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>₹{discount}</span></div>}
          <div className="flex justify-between font-bold"><span>Total:</span><span>{formattedNet}</span></div>

          <button disabled={loadingPayment} onClick={() => validateAddress() && setShowConfirm(true)} className="mt-2 bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-bold text-black transition">
            {loadingPayment ? "Processing..." : "Proceed to Pay"}
          </button>
          {showConfirm && (
            <button onClick={handlePayment} className="mt-2 bg-green-500 hover:bg-green-600 py-2 rounded font-bold text-white transition">Confirm & Pay</button>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toast.toasts.map((t) => (
          <div key={t.id} className={`p-3 rounded shadow-md text-sm ${t.type === "error" ? "bg-red-500" : t.type === "success" ? "bg-green-500" : "bg-gray-800"} text-white`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
