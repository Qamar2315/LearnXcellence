import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FlashContext } from "../helpers/FlashContext";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Success from "../components/Success";

function EmailVerification() {
  const { authState } = useContext(AuthContext);
  const { flashMessage, setFlashMessage } = useContext(FlashContext);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  // Generate OTP function
  const generateOtp = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/generate-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.message === "OTP sent successfully") {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "OTP Sent",
          type: "success",
        });
        setIsOtpSent(true);
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        heading: "Error",
        type: "error",
      });
    }
  };

  // Verify OTP function
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-otp`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (res.data.message === "Email verified successfully") {
        setFlashMessage({
          status: true,
          message: res.data.message,
          heading: "Email Verified",
          type: "success",
        });
        navigate("/studentDashboard");
      }
    } catch (error) {
      setFlashMessage({
        status: true,
        message: "Invalid OTP. Please try again.",
        heading: "Verification Failed",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Verify Your Email
        </h1>
        <p className="text-center mb-6">
          Enter the OTP sent to your email to verify your account.
        </p>

        {flashMessage.status && flashMessage.type === "error" && (
          <Alert
            message={flashMessage.message}
            heading={flashMessage.heading}
          />
        )}
        {flashMessage.status && flashMessage.type === "success" && (
          <Success
            message={flashMessage.message}
            heading={flashMessage.heading}
          />
        )}
        <br />

        {!isOtpSent ? (
          <button
            onClick={generateOtp}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Send OTP
          </button>
        ) : (
          <>
            <div className="mt-4">
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter OTP"
              />
            </div>
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;
