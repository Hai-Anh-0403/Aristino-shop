"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in as admin
  useEffect(() => {
    const adminSession = localStorage.getItem('aristino_admin');
    if (adminSession) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Simulate Admin Authentication API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Allow any admin credential for this mockup build, 
      // but recommend admin@aristino.com for standard testing
      if (email.toLowerCase().includes('admin') && password.length >= 6) {
        localStorage.setItem('aristino_admin', JSON.stringify({
          email: email,
          role: 'Administrator'
        }));
        router.push('/admin/dashboard');
      } else {
        setError('Invalid administrator credentials or password too short (min 6 chars).');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full bg-[#1A1A1A] border border-neutral-800 p-8 rounded shadow-2xl">
        
        {/* Admin Header */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#C5A880]">
            ARISTINO
          </span>
        </div>

        {/* Status Notification messages */}
        {error && (
          <div className="p-3 text-xs font-sans font-semibold rounded mb-5 bg-red-950/40 text-red-400 border border-red-900/60">
            {error}
          </div>
        )}

        {/* Login Form (Exclusively for admin - no registration / forgot links) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="admin-email" className="text-[10px] font-sans font-bold tracking-wider text-neutral-400 mb-1 uppercase">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aristino.com"
              className="bg-[#262626] border border-neutral-800 text-white rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-600 transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="admin-password" className="text-[10px] font-sans font-bold tracking-wider text-neutral-400 mb-1 uppercase">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#262626] border border-neutral-800 text-white rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-600 transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C5A880] text-[#0A192F] hover:bg-[#A3855C] hover:text-white transition-all duration-300 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase mt-4 flex items-center justify-center min-h-[42px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>

        {/* Help Tip */}
        <div className="mt-8 pt-4 border-t border-neutral-800 text-center text-[10px] font-sans text-neutral-500 tracking-wide">
          Standard testing values: <span className="text-neutral-400">admin@aristino.com</span> / <span className="text-neutral-400">admin123</span>
        </div>

      </div>
    </div>
  );
}
