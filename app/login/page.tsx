'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Pre-defined accounts
  const accounts = [
    {
      email: 'employee@company.com',
      password: 'employee123',
      role: 'employee',
      name: 'John Smith',
      avatar: 'JS'
    },
    {
      email: 'manager@company.com',
      password: 'manager123',
      role: 'manager',
      name: 'Sarah Johnson',
      avatar: 'SJ'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matching account
    const account = accounts.find(acc => 
      acc.email === formData.email && acc.password === formData.password
    );
    
    if (account) {
      // Store user info in localStorage for role-based access
      localStorage.setItem('userRole', account.role);
      localStorage.setItem('userName', account.name);
      localStorage.setItem('userAvatar', account.avatar);
      localStorage.setItem('userEmail', account.email);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      alert('Invalid email or password. Please try:\n\nEmployee Account:\nemail: employee@company.com\npassword: employee123\n\nManager Account:\nemail: manager@company.com\npassword: manager123');
    }
  };

  const handleQuickLogin = (accountType: 'employee' | 'manager') => {
    const account = accounts.find(acc => acc.role === accountType);
    if (account) {
      setFormData({ email: account.email, password: account.password });
      
      // Auto login
      localStorage.setItem('userRole', account.role);
      localStorage.setItem('userName', account.name);
      localStorage.setItem('userAvatar', account.avatar);
      localStorage.setItem('userEmail', account.email);
      
      router.push('/dashboard');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Mock social login
    router.push('/dashboard');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkTheme 
              ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' 
              : 'bg-white/70 text-gray-700 hover:bg-white shadow-lg'
          }`}
        >
          {isDarkTheme ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Dark Theme Floating Shapes */}
      {isDarkTheme && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-indigo-500/15 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Light Theme - Left Side Illustration */}
        {!isDarkTheme && (
          <div className="hidden lg:flex lg:flex-1 items-center justify-center px-12">
            <div className="max-w-md text-center">
              {/* HR Illustration */}
              <div className="mb-8">
                <div className="relative mx-auto w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">👥</div>
                      <div className="text-4xl mb-2">💼</div>
                      <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-xl animate-bounce">
                    ⭐
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-lg animate-pulse">
                    ✓
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to HR System
              </h1>
              <p className="text-lg text-gray-600">
                Streamline your workforce management with our comprehensive HR platform
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
          !isDarkTheme ? 'lg:flex-none lg:w-1/2' : ''
        }`}>
          <div className="w-full max-w-md">
            {/* Dark Theme - Header */}
            {isDarkTheme && (
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">HR</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-300">Sign in to your account to continue</p>
              </div>
            )}

            {/* Login Card */}
            <div className={`${isDarkTheme 
              ? 'bg-white/10 backdrop-blur-md border border-white/20' 
              : 'bg-white shadow-2xl border border-gray-100'
            } rounded-2xl p-8 transition-all duration-300`}>
              
              {/* Light Theme - Header */}
              {!isDarkTheme && (
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">HR</span>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
                  <p className="text-gray-600">Access your HR dashboard</p>
                </div>
              )}

              {/* Demo Accounts */}
              <div className={`mb-6 p-4 rounded-xl ${isDarkTheme ? 'bg-white/5 border border-white/20' : 'bg-blue-50 border border-blue-200'}`}>
                <h3 className={`text-sm font-semibold mb-3 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Demo Accounts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('employee')}
                    className={`p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${isDarkTheme ? 'bg-white/10 hover:bg-white/15 border border-white/20' : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">👤</span>
                      </div>
                      <div className="ml-3">
                        <div className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Employee</div>
                        <div className={`text-xs ${isDarkTheme ? 'text-gray-300' : 'text-gray-500'}`}>John Smith</div>
                      </div>
                    </div>
                    <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>employee@company.com</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('manager')}
                    className={`p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${isDarkTheme ? 'bg-white/10 hover:bg-white/15 border border-white/20' : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">👨‍💼</span>
                      </div>
                      <div className="ml-3">
                        <div className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>HR Manager</div>
                        <div className={`text-xs ${isDarkTheme ? 'text-gray-300' : 'text-gray-500'}`}>Sarah Johnson</div>
                      </div>
                    </div>
                    <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>manager@company.com</div>
                  </button>
                </div>
                <p className={`text-xs mt-3 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Click to login instantly or use manual credentials below</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-white' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-400'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`block w-full pl-10 pr-3 py-3 rounded-xl transition-all duration-200 ${
                        isDarkTheme 
                          ? 'bg-white/5 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/10' 
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-white' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className={`h-5 w-5 ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-400'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`block w-full pl-10 pr-12 py-3 rounded-xl transition-all duration-200 ${
                        isDarkTheme 
                          ? 'bg-white/5 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/10' 
                          : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                      }`}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                        isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`h-4 w-4 rounded transition-colors ${
                        isDarkTheme 
                          ? 'bg-white/10 border-white/20 text-blue-400 focus:ring-blue-400/20' 
                          : 'bg-gray-50 border-gray-300 text-blue-600 focus:ring-blue-500/20'
                      }`}
                    />
                    <span className={`ml-2 text-sm ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className={`text-sm font-medium transition-colors ${
                      isDarkTheme 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isDarkTheme 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  Sign In
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className={`absolute inset-0 flex items-center ${
                    isDarkTheme ? 'opacity-30' : ''
                  }`}>
                    <div className={`w-full border-t ${
                      isDarkTheme ? 'border-white/20' : 'border-gray-300'
                    }`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-4 font-medium ${
                      isDarkTheme 
                        ? 'bg-white/10 text-gray-300 backdrop-blur-sm' 
                        : 'bg-white text-gray-500'
                    }`}>
                      OR
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDarkTheme 
                        ? 'bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Microsoft')}
                    className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDarkTheme 
                        ? 'bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M0 0h11.5v11.5H0z"/>
                      <path fill="#00a4ef" d="M12.5 0H24v11.5H12.5z"/>
                      <path fill="#7fba00" d="M0 12.5h11.5V24H0z"/>
                      <path fill="#ffb900" d="M12.5 12.5H24V24H12.5z"/>
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('LinkedIn')}
                    className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isDarkTheme 
                        ? 'bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                  <span className={`text-sm ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className={`font-medium transition-colors ${
                        isDarkTheme 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      Sign Up
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}