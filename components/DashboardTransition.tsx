'use client';

import React, { useState, useEffect } from 'react';

interface DashboardTransitionProps {
  children: React.ReactNode;
}

export default function DashboardTransition({ children }: DashboardTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Start the fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Mark as fully loaded after animation completes
    const loadedTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(loadedTimer);
    };
  }, []);

  return (
    <div className={`transition-all duration-800 ease-out transform ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-4 scale-95'
    }`}>
      {/* Background consistent with login */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className={`transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {children}
        </div>
      </div>
      
      {/* Optional: Subtle loading overlay that fades out */}
      {!isLoaded && (
        <div className={`fixed inset-0 bg-white pointer-events-none transition-opacity duration-800 ${
          isVisible ? 'opacity-0' : 'opacity-20'
        }`} />
      )}
    </div>
  );
}