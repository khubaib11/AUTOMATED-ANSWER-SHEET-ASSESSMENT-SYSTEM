import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const sendOTP = async () => {
    setSendOtpLoading(true);
    try {
      const response = await fetch("/api/auth/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!data.success) {
        console.log("OTP sent successfully!");
      } else {
        console.error("Error:", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error in sendOTP:", error);
    } finally {
      setSendOtpLoading(false);
    }
  };

  
  const verifyOTP = async () => {
    try {
      const response = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        console.log("OTP verified successfully!");
        setOtpVerified(true);
      } else {
        console.error("Error:", data.message || "Failed to verify OTP");
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Error in verifyOTP:", error);
    }
  };

  const updatePassword = async () => {
    try {
      const response = await fetch("/api/auth/updatepassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        console.log("Password updated successfully!");
        navigate("/signin");
      } else {
        console.error("Error:", data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error in updatePassword:", error);
    }
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Forgot Password
          </h2>

          {/* Email Field */}
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={handleChange}
              value={formData.email}
              disabled={sendOtpLoading}
            />
            <button
              type="button"
              className={`mt-4 text-white border-0 py-2 px-6 rounded text-lg ${
                formData.email && !sendOtpLoading
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={sendOTP}
              disabled={!formData.email || sendOtpLoading}
            >
              {sendOtpLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {/* OTP Field */}
          <div className="relative mb-4">
            <label htmlFor="otp" className="leading-7 text-sm text-gray-600">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={handleChange}
              value={formData.otp}
              disabled={!formData.email || otpVerified}
            />
            <button
              type="button"
              className={`mt-4 text-white border-0 py-2 px-6 rounded text-lg ${
                formData.otp && !otpVerified
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={verifyOTP}
              disabled={!formData.otp || otpVerified}
            >
              Verify OTP
            </button>
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={handleChange}
              value={formData.password}
              disabled={!otpVerified}
            />
          </div>

          {/* Submit Button */}
          <button
            className={`text-white border-0 py-2 px-8 rounded text-lg ${
              formData.password
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={updatePassword}
            disabled={!formData.password}
          >
            Reset Password
          </button>
        </div>
      </div>
    </section>
  );
}
