// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import config from "./config";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false); // ✅ Track success
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      Swal.fire("Error", "Please fill both fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${config.BASE_URL}auth/reset-password?token=${token}&email=${email}`,
        { newPassword: password }
      );

      Swal.fire("Success", "Password reset successfully!", "success");
      setResetSuccess(true); // ✅ Show login button
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to reset password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>

        {!resetSuccess ? (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <button
              type="submit"
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-green-600 font-medium">
              Your password has been reset successfully!
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
