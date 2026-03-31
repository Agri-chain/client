import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { otpService } from '../services/otpService';
import OTPInput from '../components/OTPInput';
import CountdownTimer from '../components/CountdownTimer';
import { useToast } from '../context/ToastContext';
import { formatError } from '../utils/errorHandler.js';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Verify OTP, 3: New Password
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedOTP, setVerifiedOTP] = useState(''); // Store verified OTP temporarily
  const [fieldErrors, setFieldErrors] = useState({});

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    if (!email) {
      toastError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toastError('Please enter a valid email address');
      return;
    }

    setIsSending(true);

    try {
      await otpService.sendPasswordResetOTP(email);
      toastSuccess('OTP sent to your email successfully!');
      setOtpSent(true);
      setStep(2); // Move to OTP verification step
    } catch (error) {
      const formattedError = formatError(error);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('email')) {
        setFieldErrors({ email: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
      
      toastError(formattedError.message);
    } finally {
      setIsSending(false);
    }
  };

  // Step 2: Verify OTP only (no password yet)
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toastError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Call verify endpoint without new password
      const response = await otpService.verifyPasswordResetOTPOnly(email, otp);
      
      toastSuccess('OTP verified successfully!');
      setVerifiedOTP(otp); // Store the verified OTP
      setStep(3); // Move to new password step
    } catch (error) {
      const formattedError = formatError(error);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('otp')) {
        setFieldErrors({ otp: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
      
      toastError(formattedError.message);
      
      // If OTP is wrong, redirect back to email step
      setTimeout(() => {
        setOtp('');
        setOtpSent(false);
        setStep(1);
        setFieldErrors({});
        toastError('Please request a new OTP');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password with verified OTP
  const handleResetPassword = async () => {
    if (!newPassword) {
      toastError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      toastError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await otpService.verifyPasswordResetOTP(email, verifiedOTP, newPassword);
      toastSuccess('Password reset successfully!');
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPExpire = () => {
    toastError('OTP has expired. Please request a new one.');
    setOtp('');
    setVerifiedOTP('');
    setOtpSent(false);
    setStep(1);
  };

  const handleResendOTP = () => {
    setOtp('');
    setVerifiedOTP('');
    setNewPassword('');
    setConfirmPassword('');
    handleSendOTP();
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleChangeEmail = () => {
    setOtp('');
    setVerifiedOTP('');
    setOtpSent(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-emerald-300/40 to-teal-300/40 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Glass Card Container */}
          <div className="bg-white/20 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl shadow-black/10 border border-white/30 relative overflow-hidden transform hover:scale-105 transition-all duration-700">
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 rounded-3xl"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-cyan-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2">
                  Reset Your Password
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                  {step === 1 && 'Enter your email to receive a reset code'}
                  {step === 2 && 'Enter the verification code sent to your email'}
                  {step === 3 && 'Enter your new password'}
                </p>
              </div>

              <div className="space-y-6">
                {/* Step 1: Email Input */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={isSending || !email}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                    >
                      {isSending ? 'Sending...' : 'Send Reset Code'}
                    </button>
                  </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-600">
                        Reset code sent to: <span className="font-medium">{email}</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Enter 6-digit Code
                      </label>
                      <OTPInput
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex justify-center">
                      <CountdownTimer
                        initialMinutes={5}
                        onExpire={handleOTPExpire}
                        onReset={handleResendOTP}
                      />
                    </div>

                    <div>
                      <button
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.length !== 6}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                      >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                      </button>
                    </div>

                    <div className="text-center space-y-2">
                      <button
                        onClick={handleResendOTP}
                        disabled={isSending}
                        className="text-emerald-500 hover:text-emerald-600 text-sm font-medium disabled:opacity-50 transition-colors"
                      >
                        {isSending ? 'Sending...' : 'Resend Code'}
                      </button>
                      
                      <div>
                        <button
                          onClick={handleChangeEmail}
                          className="text-gray-500 hover:text-gray-600 text-sm block transition-colors"
                        >
                          Change Email
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-emerald-600 font-medium">
                        ✓ OTP verified successfully
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Create your new password
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={handleResetPassword}
                        disabled={isLoading || !newPassword || !confirmPassword}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                      >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={handleChangeEmail}
                        className="text-gray-500 hover:text-gray-600 text-sm transition-colors"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={handleBackToLogin}
                    className="text-gray-500 hover:text-gray-600 text-sm transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
