"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if session in DB is still valid before auto-redirecting
  useEffect(() => {
    const adminToken = localStorage.getItem('aristino_admin_token');
    const adminSession = localStorage.getItem('aristino_admin');

    if (adminToken && adminSession) {
      fetch('http://localhost:8000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        credentials: 'include',
      })
        .then((res) => {
          if (res.ok) {
            window.location.href = '/admin/dashboard';
          } else {
            // Session in DB was deleted or revoked! Clear stale local tokens.
            localStorage.removeItem('aristino_admin');
            localStorage.removeItem('aristino_admin_token');
          }
        })
        .catch(() => {
          // If offline or network error, verify basic token presence
          window.location.href = '/admin/dashboard';
        });
    } else if (adminSession && !adminToken) {
      // Mock session without token - clear it to force login screen
      localStorage.removeItem('aristino_admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Call Backend API Login concurrently with minimum 1.5s delay
      const [res] = await Promise.all([
        fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }),
        minDelay,
      ]);

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('aristino_admin_token', data.accessToken);
        localStorage.setItem('aristino_admin', JSON.stringify(data.user));
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      // Fallback for offline local dev mode if backend is not reachable
      if (email.toLowerCase().includes('admin') && password.length >= 6) {
        localStorage.setItem('aristino_admin', JSON.stringify({ email, name: 'Admin', role: 'admin' }));
        window.location.href = '/admin/dashboard';
      } else {
        setError('Cannot connect to authentication server. Please check backend status.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full bg-white border border-neutral-200 p-8 rounded shadow-lg">

        {/* Admin Header */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-brand-navy">
            ARISTINO
          </span>
        </div>

        {/* Status Notification messages */}
        {error && (
          <div className="p-3 text-xs font-sans font-semibold rounded mb-5 bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form (Exclusively for admin - no registration / forgot links) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="admin-email" className="text-xs font-sans font-bold tracking-wide text-neutral-500 mb-1.5 uppercase">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aristino.com"
              className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none placeholder-neutral-300 transition-colors"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="admin-password" className="text-xs font-sans font-bold tracking-wide text-neutral-500 mb-1.5 uppercase">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-neutral-300 text-neutral-800 rounded pl-3 pr-10 py-2 text-sm focus:border-brand-navy focus:outline-none placeholder-neutral-300 transition-colors"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-neutral-400 hover:text-brand-navy focus:outline-none transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a9.04 9.04 0 012.122-.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.225-4.225L3 3" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-navy text-white hover:bg-[#C5A880] hover:text-brand-navy transition-all duration-300 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase mt-4 flex items-center justify-center min-h-[42px]"
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
        <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-xs font-sans text-neutral-400 tracking-wide">
          Standard testing values: <span className="text-neutral-600">admin@aristino.com</span> / <span className="text-neutral-600">admin1234</span>
        </div>

      </div>
    </div>
  );
}
