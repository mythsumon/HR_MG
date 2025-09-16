'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">HR</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">HR Management System</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}