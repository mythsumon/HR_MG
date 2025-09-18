'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginTransitionProps {
  isAuthenticated: boolean;
  onTransitionComplete?: () => void;
  userInfo?: {
    name: string;
    role: string;
    avatar: string;
  };
}

export default function LoginTransition({ 
  isAuthenticated, 
  onTransitionComplete,
  userInfo 
}: LoginTransitionProps) {
  const [transitionStage, setTransitionStage] = useState<'idle' | 'loading' | 'fadeOut' | 'complete'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && transitionStage === 'idle') {
      startTransition();
    }
  }, [isAuthenticated, transitionStage]);

  const startTransition = async () => {
    // Stage 1: Show loading
    setTransitionStage('loading');
    
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

    // Wait for loading to complete
    setTimeout(() => {
      clearInterval(loadingInterval);
      setLoadingProgress(100);
      
      // Stage 2: Fade out after loading
      setTimeout(() => {
        setTransitionStage('fadeOut');
        
        // Stage 3: Navigate to dashboard after fade completes
        setTimeout(() => {
          setTransitionStage('complete');
          onTransitionComplete?.();
          // Use replace instead of push to prevent back navigation to login
          router.replace('/dashboard');
        }, 600); // Fade out duration
      }, 300); // Brief pause after loading completes
    }, 1500); // Total loading time
  };

  if (transitionStage === 'idle') {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-600 ease-in-out ${
      transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Background - matches login/dashboard background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
      
      {/* Transition Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className={`transform transition-all duration-800 ease-out ${
          transitionStage === 'fadeOut' 
            ? 'translate-y-[-20px] opacity-0 scale-95' 
            : 'translate-y-0 opacity-100 scale-100'
        }`}>
          {/* Loading Card with enhanced animations */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-4 animate-fade-in-up">
            {/* Logo with pulse glow effect */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <span className="text-white font-bold text-2xl">HR</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Welcome to HR System</h2>
            </div>

            {/* User Info */}
            {userInfo && (
              <div className="flex items-center justify-center mb-6 p-4 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium text-sm">{userInfo.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{userInfo.name}</p>
                  <p className="text-sm text-gray-600">{userInfo.role}</p>
                </div>
              </div>
            )}

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
        </div>
      </div>
    </div>
  );
}