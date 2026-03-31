import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { otpService } from '../services/otpService';
import OTPInput from '../components/OTPInput';
import CountdownTimer from '../components/CountdownTimer';
import { formatError } from '../utils/errorHandler.js';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [email, setEmail] = useState(searchParams.get('email') || user?.email || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
  }, [email, navigate]);

  const handleSendOTP = async () => {
    if (!email) {
      setFieldErrors({ email: 'Email is required' });
      return;
    }

    setIsSending(true);
    setFieldErrors({});
    setSuccess('');

    try {
      await otpService.sendEmailOTP(email);
      setSuccess('OTP sent to your email successfully!');
      setOtpSent(true);
    } catch (error) {
      const formattedError = formatError(error);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('email')) {
        setFieldErrors({ email: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setFieldErrors({ otp: 'Please enter a 6-digit OTP' });
      return;
    }

    setIsVerifying(true);
    setFieldErrors({});
    setSuccess('');

    try {
      const response = await otpService.verifyEmailOTP(email, otp);
      setSuccess('Email verified successfully!');
      
      // Redirect to dashboard or next step after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const formattedError = formatError(error);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('otp')) {
        setFieldErrors({ otp: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPExpire = () => {
    setFieldErrors({ general: 'OTP has expired. Please request a new one.' });
    setOtp('');
    setOtpSent(false);
  };

  const handleResendOTP = () => {
    setOtp('');
    setFieldErrors({});
    setSuccess('');
    handleSendOTP();
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
                  Verify Your Email
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                  We've sent a 6-digit code to {email}
                </p>
              </div>

              <div className="space-y-6">
                {fieldErrors.general && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 text-sm text-center p-3 rounded-xl">{fieldErrors.general}</div>
                )}

                {success && (
                  <div className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 text-emerald-600 text-sm text-center p-3 rounded-xl">{success}</div>
                )}

                {!otpSent ? (
                  <div>
                    <button
                      onClick={handleSendOTP}
                      disabled={isSending || !email}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                    >
                      {isSending ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Enter 6-digit OTP
                      </label>
                      <OTPInput
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isVerifying}
                      />
                      {fieldErrors.otp && (
                        <div className="text-red-600 text-xs mt-2 text-center">{fieldErrors.otp}</div>
                      )}
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
                        disabled={isVerifying || otp.length !== 6}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify Email'}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={handleResendOTP}
                        disabled={isSending}
                        className="text-emerald-500 hover:text-emerald-600 text-sm font-medium disabled:opacity-50 transition-colors"
                      >
                        {isSending ? 'Sending...' : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => navigate('/login')}
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

export default EmailVerification;
