import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaTag, FaStar, FaTimes, FaGift, FaMoon, FaSun } from "react-icons/fa";
import config from "./config";
import { Reorder } from "framer-motion";

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
  const toast = useToasts();

  // item coming from location.state.course or fallback demo item
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

  // ensure we set courseId/webinarId/appointmentId consistently (don't mutate props directly in real app)
  const preparedItem = { ...item };
  console.log('loaction state',preparedItem)
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
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || ""); // try localStorage by default
  const [orderData, setOrderData] = useState(null); // fixed naming

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
    s.onerror = () => { setScriptLoaded(false); toast.push("Razorpay failed to load", "error"); };
    document.body.appendChild(s);
  }, []);

  const validateLogin = () => {
    const e = {};
    if (!loginData.email || !/^\S+@\S+\.\S+$/.test(loginData.email)) e.email = "Invalid email";
    if (!loginData.password || loginData.password.length < 6) e.password = "Min 6 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
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
      const res = await axios.post(`${config.BASE_URL}coupon/apply`, { code: coupon }, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
      setDiscount(res.data.discount || 0);
      toast.push(`Coupon applied: ₹${res.data.discount || 0} off`, "success");
    } catch (err) {
      toast.push("Invalid coupon", "error");
    }
  };

// ---------- Replace createOrder & handlePayment with this ----------

/**
 * createOrder()
 * 1) POST /orders   -> expects to receive an ORD-... receipt or an identifier we can use
 * 2) POST /orders/:ORD-.../pay -> backend will call Razorpay and return rOrder + internal DB orderId
 *
 * Returns: { rOrder: { id, amount, currency, receipt }, internalOrderId }
 */
const createOrder = async () => {
  try {
    // 1) create internal order (you send amount in rupees as your backend expects)
    const createPayload = {
      webinarId: preparedItem.webinarId,
      courseId: preparedItem.courseId,
      appointmentId: preparedItem.appointmentId,
      itemType: location.state?.coursetype ? "course" : location.state?.webinartype ? "webinar" : location.state?.appointmenttype ? "appointment" : "course",
      amount: Math.round(net), // you said you send `4999` (rupees) here
      userId: "68b1a01074ad0c19f272b438",
    };

    const createRes = await axios.post(`${config.BASE_URL}orders`, createPayload, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });

    // Try to find the ORD receipt or key in many common places
    const createData = createRes?.data || {};
    console.log('create datr',createData)
    // common shapes: createData.result.orderId (internal DB id), createData.result?.receipt or createData.result?.order?.orderId or createData.orderId
    let ordReceipt =createData?.result?.order.orderId || 'ord-doneod'
    let ordAmount = createData?.result?.order.amount || null
    console.log(ordReceipt,ordAmount,'order recidepti')
    // If the backend returns "ORD-7YVXMBAFIP" as a field named 'orderId' or similar, ordReceipt will capture it.
  
    if (!ordReceipt) {
      console.error("createOrder: could not find ORD receipt from /orders response:", createRes.data);
      throw new Error("No ORD receipt returned by create order endpoint");
    }

   
    const payRes = await axios.post(`${config.BASE_URL}orders/${ordReceipt}/pay`, {amount:ordAmount}, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });

    const payData = payRes?.data || {};
    // Backend's response shape (as you showed):
    // payData.result.rOrder  -> Razorpay order object (contains id, amount, currency, receipt)
    // payData.result.orderId -> internal DB id (68cd...)
    const rOrderRaw = payData?.result?.rOrder || payData?.result?.order || payData?.result?.rorder || payData?.rOrder || null;
    const internalOrderId = payData?.result?.orderId || payData?.result?._id || payData?.orderId || null;

    if (!rOrderRaw || !(rOrderRaw.id || rOrderRaw.orderId || rOrderRaw.order_id)) {
      console.error("createOrder: pay route did not return rOrder as expected", payRes.data);
      throw new Error("Razorpay order not returned by pay endpoint");
    }
console.log('reorder',rOrderRaw)
    // Normalize rOrder
    const razorId = rOrderRaw.id || rOrderRaw.orderId || rOrderRaw.order_id;
    const amountPaise = rOrderRaw.amount ?? Math.round(net * 100); // backend returns paise (e.g., 499900)
    const currency = rOrderRaw.currency || "INR";
    const receipt = rOrderRaw.receipt || (rOrderRaw.notes && rOrderRaw.notes.orderId) || sanitizedReceipt;
    
    return {
      rOrder: { id: razorId, amount: amountPaise, currency, receipt },
      internalOrderId: internalOrderId || null,
    };
  } catch (err) {
    console.error("createOrder error:", err?.response?.data || err.message);
    toast.push("Order creation failed", "error");
    throw err;
  }
};

/**
 * handlePayment()
 * - creates order (internal -> pay -> rOrder)
 * - opens Razorpay using rOrder.id (order_xxx)
 * - on success -> POST /orders/:internalDbId/verify with razorpay params
 */
const handlePayment = async () => {
  if (!scriptLoaded || typeof window.Razorpay === "undefined") {
    toast.push("Payment gateway not ready", "error");
    return;
  }
  setLoadingPayment(true);
  try {
    // Step A: create the internal order and trigger pay route to create rOrder
    const { rOrder, internalOrderId } = await createOrder();

    if (!rOrder || !rOrder.id) {
      throw new Error("Razorpay order id missing");
    }

    // ensure we have the internal DB id to verify later. If backend didn't return internalOrderId,
    // try to extract from rOrder.notes.orderId (which may be "ORD-..." or internal id)
    let verifyId = internalOrderId;
    if (!verifyId && rOrder && rOrder.receipt) {
      // rOrder.receipt might be "receipt_ORD-..." -> convert to ORD-...
      verifyId = String(rOrder.receipt).startsWith("receipt_") ? String(rOrder.receipt).replace(/^receipt_/, "") : rOrder.receipt;
    }

    // If verifyId is still the ORD-... (receipt-like) and your verify route expects internal DB id (68cd...), you must adjust backend.
    // From your described process you want to call: POST /orders/:internalDbId/verify (e.g. /orders/68cd.../verify)
    // pay endpoint already returned payRes.result.orderId which should be the internal DB id (we attempted to capture it).
    // if verifyId currently is an ORD-... string (receipt) but your verify expects DB id, prefer internalOrderId from createOrder result.
    // We'll use internalOrderId if available; else fallback to receipt-style id (ORD-...) because you said you built /orders/ORD-.../pay earlier.
    // Final verify endpoint:
    const verifyTarget = verifyId || internalOrderId || (rOrder.notes && rOrder.notes.orderId) || null;

    const options = {
      key: razorpayKey,
      amount: rOrder.amount,
      currency: rOrder.currency || "INR",
      name: "CAKISTOCKMARKET",
      description: preparedItem.title,
      order_id: rOrder.id, // MUST be Razorpay order id (order_xxx)
      prefill: {
        name: `${address.firstName} ${address.lastName}`,
        email: address.email,
        contact: address.phone,
      },
      theme: { color: "var(--accent)" },
      handler: async (resp) => {
        console.log("razorpay handler response:", resp);
        try {
          if (!verifyTarget) {
            console.warn("No verify target (internal id or receipt) available, cannot verify on server.");
            throw new Error("Missing verify id");
          }

          // Construct verify URL. You said backend expects: /orders/68cd.../verify
          // If verifyTarget contains ORD-... and your verify route is /orders/ORD-.../pay then adjust accordingly.
          // Based on your last message, verification endpoint is: /orders/:internalDbId/verify (68cd...)
          // So we call:
          const verifyUrl = `${config.BASE_URL}orders/${verifyTarget}/verify`;

          await axios.post(verifyUrl, {
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
            amount: rOrder.amount, // optional: helpful for server-side validation
          }, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
          });

          setLoadingPayment(false);
          setStep("success");
          toast.push("Payment successful!", "success");
        } catch (verifyErr) {
          console.error("verify error:", verifyErr?.response?.data || verifyErr.message);
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
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <FaCheck className="text-6xl text-green-500" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p>You have successfully enrolled in <strong>{preparedItem.title}</strong>.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 py-10 max-w-4xl mx-auto ${dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <button onClick={() => setDark(!dark)} className="p-2 rounded-full border">{dark ? <FaSun /> : <FaMoon />}</button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold mb-2">Your Info</h2>

          {!isLoggedIn ? (
            <>
              <input type="email" placeholder="Email" className="w-full p-2 rounded border" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input type="password" placeholder="Password" className="w-full p-2 rounded border" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <button onClick={() => validateLogin() && setIsLoggedIn(true)} className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded mt-2">Login</button>
            </>
          ) : (
            <>
              <input type="text" placeholder="First Name" className="w-full p-2 rounded border" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              <input type="text" placeholder="Last Name" className="w-full p-2 rounded border" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              <input type="email" placeholder="Email" className="w-full p-2 rounded border" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input type="tel" placeholder="Phone" className="w-full p-2 rounded border" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              <textarea placeholder="Full Address" className="w-full p-2 rounded border" value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} />
              {errors.fullAddress && <p className="text-red-500 text-sm">{errors.fullAddress}</p>}
            </>
          )}

          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Coupon code" className="flex-1 p-2 rounded border" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            <button onClick={applyCoupon} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded">Apply</button>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <SafeImg src={preparedItem.thumbnail} alt={preparedItem.title} className="w-full h-40 object-cover rounded" />
          <h3 className="font-bold">{preparedItem.title}</h3>
          <p>{preparedItem.description}</p>
          <p>Students Enrolled: {studentsDisplay}</p>
          <div className="flex justify-between">
            <span>Price:</span>
            <span>₹{preparedItem.price}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formattedNet}</span>
          </div>
          <button disabled={loadingPayment} onClick={() => validateAddress() && setShowConfirm(true)} className="mt-2 bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-bold text-black">
            {loadingPayment ? "Processing..." : "Proceed to Pay"}
          </button>
          {showConfirm && (
            <button onClick={handlePayment} className="mt-2 bg-green-500 hover:bg-green-600 py-2 rounded font-bold text-white">Confirm & Pay</button>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toast.toasts.map((t) => (
          <div key={t.id} className={`p-3 rounded shadow-md text-sm ${t.type === "error" ? "bg-red-500 text-white" : t.type === "success" ? "bg-green-500 text-white" : "bg-gray-800 text-white"}`}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
