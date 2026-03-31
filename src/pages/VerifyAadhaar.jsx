import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { otpService } from '../services/otpService.js';
import { formatError } from '../utils/errorHandler.js';

const VerifyAadhaar = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const sendAadhaarOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const response = await otpService.sendAadhaarOTP(aadhaar);
      success(response.message || 'OTP sent to your registered email');
      setOtpSent(true);
      setTimer(300);
    } catch (err) {
      const formattedError = formatError(err);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('aadhaar')) {
        setFieldErrors({ aadhaar: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
      
      toastError(formattedError.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAadhaarOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      await otpService.verifyAadhaarOTP(otp);
      success('Aadhaar verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      const formattedError = formatError(err);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('otp')) {
        setFieldErrors({ otp: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
      
      toastError(formattedError.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  Verify Aadhaar
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                  {otpSent 
                    ? `Enter the OTP sent to ${user?.email}` 
                    : 'Enter your 12-digit Aadhaar number to receive OTP via email'
                  }
                </p>
              </div>

              {!otpSent ? (
                <form className="space-y-6" onSubmit={sendAadhaarOTP}>
                  {fieldErrors.general && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 text-sm text-center p-3 rounded-xl">{fieldErrors.general}</div>
                  )}
                  
                  <div>
                    <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number
                    </label>
                    <input
                      id="aadhaar"
                      name="aadhaar"
                      type="text"
                      required
                      maxLength={12}
                      value={aadhaar}
                      onChange={(e) => {
                        setAadhaar(e.target.value.replace(/\D/g, ''));
                        setFieldErrors({});
                      }}
                      className={`appearance-none block w-full px-4 py-3 border ${fieldErrors.aadhaar ? 'border-red-500' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300`}
                      placeholder="123456789012"
                    />
                    {fieldErrors.aadhaar && (
                      <div className="text-red-600 text-xs mt-1">{fieldErrors.aadhaar}</div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your 12-digit Aadhaar number
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || aadhaar.length !== 12}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                  >
                    {loading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={verifyAadhaarOTP}>
                  {fieldErrors.general && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 text-sm text-center p-3 rounded-xl">{fieldErrors.general}</div>
                  )}
                  
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setFieldErrors({});
                      }}
                      className={`appearance-none block w-full px-4 py-3 border ${fieldErrors.otp ? 'border-red-500' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300`}
                      placeholder="000000"
                    />
                    {fieldErrors.otp && (
                      <div className="text-red-600 text-xs mt-1">{fieldErrors.otp}</div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Check your email for the 6-digit OTP
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setTimer(0);
                      }}
                      className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      Change Aadhaar
                    </button>

                    {timer > 0 ? (
                      <span className="text-sm text-gray-500">
                        Resend in {formatTime(timer)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={sendAadhaarOTP}
                        disabled={loading}
                        className="text-sm text-emerald-500 hover:text-emerald-600 disabled:opacity-50 transition-colors"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                  >
                    {loading ? 'Verifying...' : 'Verify Aadhaar'}
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-gray-500 hover:text-gray-600 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAadhaar;
