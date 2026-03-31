import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { initializeGoogleAuth, renderGoogleButton, signOutGoogle } from '../utils/googleAuth.js';
import { authService } from '../services/authService.js';
import debug from '../utils/debug';
import ErrorDisplay from '../components/ErrorDisplay.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleAuthReady, setGoogleAuthReady] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({});
  const { login, googleLogin, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initialize Google OAuth
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        debug.log('Initializing Google OAuth...');
        await initializeGoogleAuth(handleGoogleSignIn);
        setGoogleAuthReady(true);
        debug.log('Google OAuth initialized successfully');
      } catch (error) {
        debug.error('Failed to initialize Google OAuth:', error);
        toastError('Failed to initialize Google authentication');
      }
    };

    initGoogleAuth();

    // Cleanup on unmount
    return () => {
      signOutGoogle();
    };
  }, [toastError]);

  // Render Google button when ready
  useEffect(() => {
    if (googleAuthReady) {
      setTimeout(() => {
        try {
          renderGoogleButton('google-signin-button');
        } catch (error) {
          debug.error('Failed to render Google button:', error);
        }
      }, 100);
    }
  }, [googleAuthReady]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6 || password.length > 30) errors.push('6-30 characters');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/\d/.test(password)) errors.push('one number');
    if (!/[@$!%*?&]/.test(password)) errors.push('one special character (@$!%*?&)');
    return errors;
  };

  const handleChange = (e) => {
    clearError(); // Clear error when user starts typing
    setFieldErrors({}); // Clear field errors
    
    if (e.target.name === 'password') {
      const passwordErrors = validatePassword(e.target.value);
      setPasswordStrength({
        isValid: passwordErrors.length === 0,
        errors: passwordErrors
      });
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError(); // Clear previous errors

    try {
      await login(formData);
      success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      // Set field-specific errors
      if (error.serverMessage) {
        if (error.serverMessage.includes('email')) {
          setFieldErrors({ email: error.serverMessage });
        } else if (error.serverMessage.includes('password')) {
          setFieldErrors({ password: error.serverMessage });
        } else {
          setFieldErrors({ general: error.serverMessage });
        }
      } else {
        setFieldErrors({ general: error.message || 'Login failed' });
      }
      toastError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In response
  const handleGoogleSignIn = async (response) => {
    debug.log('Google Sign-In response received:', response);
    clearError(); // Clear previous errors
    
    try {
      setGoogleLoading(true);
      
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUserData = {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        picture: payload.picture,
        emailVerified: payload.email_verified
      };
      
      debug.log('Processed Google user data:', { 
        email: googleUserData.email, 
        name: googleUserData.name,
        googleId: googleUserData.googleId,
        picture: googleUserData.picture,
        emailVerified: googleUserData.emailVerified
      });
      
      // Check if user exists
      console.log('Checking if Google user exists...');
      const userCheckResponse = await authService.checkGoogleUserExists(
        googleUserData.email, 
        googleUserData.googleId
      );
      
      console.log('User check response:', userCheckResponse);
      
      let selectedRole;
      if (userCheckResponse.data.isNewUser) {
        // New user - show role selection
        console.log('New Google user detected, showing role selection');
        selectedRole = await showRoleSelection();
      } else {
        // Existing user - use their existing role
        console.log('Existing Google user found, using existing role:', userCheckResponse.data.user.role);
        selectedRole = userCheckResponse.data.user.role;
      }
      
      googleUserData.role = selectedRole;
      
      console.log('Sending to backend:', googleUserData);
      const authResponse = await googleLogin(googleUserData);
      
      // Show appropriate message based on whether it's a new user
      if (authResponse.isNewUser) {
        success('Google account created successfully!');
      } else {
        success('Google login successful!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      toastError(error.message || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Show role selection modal
  const showRoleSelection = () => {
    return new Promise((resolve) => {
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modalOverlay.id = 'role-selection-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'bg-white rounded-lg p-6 max-w-md w-full mx-4';
      modalContent.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
        <p class="text-sm text-gray-600 mb-4">Choose your role in the Agri-chain platform</p>
        <div class="space-y-3">
          <button class="role-option w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" data-role="farmer">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🌾</span>
              <div>
                <div class="font-medium text-gray-900">Farmer</div>
                <div class="text-sm text-gray-500">Sell crops and manage farm operations</div>
              </div>
            </div>
          </button>
          <button class="role-option w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-role="buyer">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🛒</span>
              <div>
                <div class="font-medium text-gray-900">Buyer</div>
                <div class="text-sm text-gray-500">Purchase crops and agricultural products</div>
              </div>
            </div>
          </button>
          <button class="role-option w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-purple-50 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" data-role="logistics">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🚚</span>
              <div>
                <div class="font-medium text-gray-900">Logistics Provider</div>
                <div class="text-sm text-gray-500">Provide transportation and storage services</div>
              </div>
            </div>
          </button>
        </div>
      `;
      
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      
      // Handle role selection
      const handleRoleSelect = (role) => {
        document.body.removeChild(modalOverlay);
        resolve(role);
      };
      
      // Add event listeners
      modalContent.querySelectorAll('.role-option').forEach(button => {
        button.addEventListener('click', () => {
          handleRoleSelect(button.dataset.role);
        });
      });
      
      // Close on overlay click
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          document.body.removeChild(modalOverlay);
          resolve('farmer'); // Default role
        }
      });
    });
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
          <div className="bg-white/20 backdrop-blur-3xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/10 border border-white/30 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-700">
            {/* Glass Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 rounded-3xl"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-cyan-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-2">
                  Sign in to your account
                </h2>
                <p className="text-sm text-gray-600 mb-8">
                  Or{' '}
                  <Link
                    to="/register"
                    className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    create a new account
                  </Link>
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Google Auth Section - Top */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    {!googleAuthReady ? (
                      <div className="w-full max-w-xs flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-2"></div>
                        Loading Google...
                      </div>
                    ) : (
                      <div className="w-full max-w-xs">
                        <div id="google-signin-button" className="w-full"></div>
                      </div>
                    )}
                  </div>
                  
                  {googleLoading && (
                    <div className="text-center text-sm text-gray-600">
                      Authenticating with Google...
                    </div>
                  )}
                </div>
                
                {/* Email/Password Section */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500">Or sign in with email</span>
                  </div>
                </div>
                {fieldErrors.general && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 text-sm text-center p-3 rounded-xl">{fieldErrors.general}</div>
                )}
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none relative block w-full px-4 py-3 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {fieldErrors.email && (
                      <div className="text-red-600 text-xs mt-1">{fieldErrors.email}</div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className={`appearance-none relative block w-full px-4 py-3 pr-12 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all duration-300`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-[26px] pr-3 flex items-center text-gray-400 hover:text-emerald-500 focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {fieldErrors.password && (
                      <div className="text-red-600 text-xs mt-1">{fieldErrors.password}</div>
                    )}
                    {formData.password && !passwordStrength.isValid && (
                      <div className="text-gray-500 text-xs mt-1">
                        Password needs: {passwordStrength.errors.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link 
                        to="/reset-password" 
                        className="font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
