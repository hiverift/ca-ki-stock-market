import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import config from "./config"; // ✅ works in Vite

const SignUp = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!agreed) {
      Swal.fire("Error", "You must agree to the Terms and Privacy Policy", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios({
        method: "POST",
        url:`${config.BASE_URL}auth/register`,
        headers: { "Content-Type": "application/json" },
        data: {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          role: "user",
        },
      });

      Swal.fire("Success", "Account created successfully!", "success");

      // Clear form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });
      setAgreed(false);

      // Redirect to login page
      navigate("/login"); // Change "/login" to your login route
    } catch (error) {
      if (error.response) {
        Swal.fire("Error", error.response.data.message || "Something went wrong!", "error");
      } else if (error.request) {
        Swal.fire("Error", "No response from server. Please try again later.", "error");
      } else {
        Swal.fire("Error", error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", icon: <FaUser />, type: "text", name: "name", placeholder: "Enter your full name" },
    { label: "Email Address", icon: <FaEnvelope />, type: "email", name: "email", placeholder: "Enter your email address" },
    { label: "Mobile Number", icon: <FaPhoneAlt />, type: "tel", name: "mobile", placeholder: "Enter your mobile number" },
    { label: "Password", icon: <FaLock />, type: "password", name: "password", placeholder: "Create a strong password" },
    { label: "Confirm Password", icon: <FaLock />, type: "password", name: "confirmPassword", placeholder: "Confirm your password" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-sm text-gray-600">Join thousands of successful traders</p>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        {fields.map((field, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">{field.label}</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <span className="text-gray-500 mr-2">{field.icon}</span>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
            </div>
          </div>
        ))}

        <div className="mb-4 flex items-start">
          <input type="checkbox" id="kyc" className="mt-1 mr-2 accent-yellow-500" />
          <label htmlFor="kyc" className="text-sm text-gray-700">
            I want to complete KYC now <span className="text-gray-500">(Optional - can be done later)</span>
          </label>
        </div>

        <div className="mb-6 flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 mr-2 accent-yellow-500"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!agreed || loading}
          className={`w-full py-2 rounded-md font-semibold shadow transition ${
            agreed
              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
              : "bg-yellow-400 text-gray-500 opacity-60 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-sm text-center mt-6">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In here</a>
        </p>
      </div>

      <p className="text-xs text-center text-gray-500 mt-4 pt-4">
        We use industry-standard encryption to protect your personal <br /> information
      </p>
    </div>
  );
};

export default SignUp;
