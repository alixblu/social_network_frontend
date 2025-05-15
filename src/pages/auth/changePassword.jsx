import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/users/sendOtp',
        null,
        { params: { email: email } }
      );
      toast.success('OTP sent successfully');
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error('Failed to send OTP');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users/verifyOtp', null, {
        params: {
          email: email,
          otp: otp,
        },
      });
      toast.success(response.data || 'OTP verified successfully');
      setStep(3);
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data || 'Invalid OTP. Please try again.';
      toast.error(message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/users/resetPassword', null, {
        params: {
          email: email,
          newPassword: newPassword
        }
      });

      toast.success(response.data.message || 'Password reset successfully');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || 'Error resetting password. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-2 px-4 rounded text-white transition-colors ${
                isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter the OTP"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4 relative">
              <label htmlFor="newPassword" className="block text-gray-700 mb-1">
                New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter new password"
                required
              />
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-9 cursor-pointer text-sm text-blue-600"
              >
                {showNewPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Confirm new password"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 cursor-pointer text-sm text-blue-600"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}

        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default ForgotPassword;
