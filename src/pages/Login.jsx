import { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import config from "./config";

function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // ---------------------- MOBILE VALIDATION ----------------------
    if (activeTab === "mobile") {
      if (!formData.mobile) {
        Swal.fire("Error", "Please enter your mobile number", "error");
        return;
      }

      // Must be 10 digits
      if (formData.mobile.length !== 10) {
        Swal.fire(
          "Error",
          "Please enter a valid 10-digit mobile number",
          "error"
        );
        return;
      }
    }

    // ---------------------- EMAIL VALIDATION ----------------------
    if (activeTab === "email" && !formData.email) {
      Swal.fire("Error", "Please enter your email", "error");
      return;
    }

    // ---------------------- PASSWORD VALIDATION ----------------------
    if (!formData.password) {
      Swal.fire("Error", "Please enter your password", "error");
      return;
    }

    setLoading(true);

    try {
      const payload =
        activeTab === "email"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              mobile: formData.mobile,
              password: formData.password,
            };

      const response = await axios.post(
        `${config.BASE_URL}/auth/login`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.message === "Invalid credentials") {
        Swal.fire("Error", response.data.message, "error");
        return;
      }

      const result = response.data.result || {};
      const user = result.user;

      console.log("Login Response:", result);

      // ---------------------- REDIRECT BY ROLE ----------------------
      if (user?.role === "admin") {
        setSuccessMsg("Login successful!");

        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("admin", user._id);
        localStorage.setItem("adminId", user._id);
        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => navigate("/admin-dashboard"), 800);
      } else if (user?.role === "user") {
        setSuccessMsg("Login successful!");

        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);

        navigate("/user-dashboard");
      } else {
        console.warn("Unknown or missing user.role:", user?.role);
        navigate("/user-dashboard");
      }
    } catch (error) {
      if (error.response)
        Swal.fire(
          "Error",
          (error.response.data?.message && error.response.data.message[0]) ||
            error.response.data?.message ||
            "Login failed",
          "error"
        );
      else if (error.request)
        Swal.fire(
          "Error",
          "No response from server. Try again later.",
          "error"
        );
      else Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
        {successMsg && (
          <div className="bg-green-100  text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
            {successMsg}
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-2xl text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="flex rounded-lg bg-gray-100 mb-6">
          <button
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-2 text-sm rounded-lg ${
              activeTab === "email"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <EnvelopeIcon className="h-4 w-4" /> Email
            </div>
          </button>
          <button
            onClick={() => setActiveTab("mobile")}
            className={`flex-1 py-2 text-sm rounded-lg ${
              activeTab === "mobile"
                ? "bg-white shadow text-gray-800"
                : "text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PhoneIcon className="h-4 w-4" /> Mobile
            </div>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {activeTab === "mobile" && (
            <div>
              <label className="text-sm text-gray-700">Mobile Number</label>
              <div className="relative mt-1">
                <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => {
                    // Allow only digits
                    const value = e.target.value.replace(/\D/g, "");

                    // Maximum 10 digits allowed
                    if (value.length <= 10) {
                      setFormData({ ...formData, mobile: value });
                    }
                  }}
                  placeholder="Enter your mobile number"
                  maxLength="10"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div>
              <label className="text-sm text-gray-700">Email Address</label>
              <div className="relative mt-1">
                <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="relative mt-1">
              <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-orange-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="border-t my-6"></div>

        <p className="text-center text-sm text-gray-600">
          New to CA ki Stock Market?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-yellow-600 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
