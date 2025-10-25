'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingUIPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment between 5-20
      });
    }, 100);

    // Reset animation after completion
    const resetTimer = setTimeout(() => {
      clearInterval(loadingInterval);
      setTimeout(() => {
        setLoadingProgress(0);
        // Restart animation
        const newInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 100) {
              clearInterval(newInterval);
              return 100;
            }
            return prev + Math.random() * 15 + 5;
          });
        }, 100);
      }, 500);
    }, 3000);

    return () => {
      clearInterval(loadingInterval);
      clearTimeout(resetTimer);
    };
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    if (!isAnimating) {
      setLoadingProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Loading UI Demo</h1>
            <button 
              onClick={toggleAnimation}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              {isAnimating ? 'Pause' : 'Resume'}
            </button>
          </div>
          
          {/* Logo with pulse glow effect */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <span className="text-white font-bold text-2xl">HR</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Welcome to HR System</h2>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-center mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium text-sm">SJ</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-sm text-gray-600">HR Manager</p>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Spinning ring */}
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
              {/* Inner dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Loading dashboard...</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className={`flex items-center transition-colors duration-300 ${
              loadingProgress > 20 ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                loadingProgress > 20 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {loadingProgress > 20 ? '✓' : '○'}
              </div>
              Authenticating user...
            </div>
            <div className={`flex items-center transition-colors duration-300 ${
              loadingProgress > 50 ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                loadingProgress > 50 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {loadingProgress > 50 ? '✓' : '○'}
              </div>
              Loading employee data...
            </div>
            <div className={`flex items-center transition-colors duration-300 ${
              loadingProgress > 80 ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                loadingProgress > 80 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {loadingProgress > 80 ? '✓' : '○'}
              </div>
              Preparing dashboard...
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This is the same loading UI that appears after login</p>
        </div>
      </div>
    </div>
  );
}