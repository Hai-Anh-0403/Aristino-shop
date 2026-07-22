"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserSession {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  provider?: string;
  avatarUrl?: string;
  googleId?: string;
}

const MOCK_ORDERS = [
  { id: 'ORD-84920', date: 'Jul 10, 2026', status: 'Delivered', payment: 'Paid', total: 12500.00 },
  { id: 'ORD-75918', date: 'Jun 28, 2026', status: 'Delivered', payment: 'Paid', total: 154.00 },
  { id: 'ORD-63910', date: 'May 15, 2026', status: 'Delivered', payment: 'Paid', total: 32.00 }
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; phone?: string; address?: string }>({});

  useEffect(() => {
    const userSession = localStorage.getItem('aristino_user');
    if (!userSession) {
      router.push('/account/login');
    } else {
      try {
        const parsed = JSON.parse(userSession);
        setUser(parsed);
        setFirstName(parsed.firstName || '');
        setLastName(parsed.lastName || '');
        setPhone(parsed.phone || '');
        setAddress(parsed.address || '');
      } catch (e) {
        console.error('Failed to parse user session', e);
        router.push('/account/login');
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('aristino_user');
    router.push('/account/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const newErrors: typeof errors = {};

    // 1. First Name Validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters.';
    }

    // 2. Last Name Validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters.';
    }

    // 3. Phone Validation (Optional, but must be valid format if filled)
    if (phone.trim()) {
      const phoneRegex = /^[+]?[0-9\s\-()]{8,18}$/;
      if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = 'Phone number is invalid (8-18 digits).';
      }
    }

    // 4. Address Validation (Required, min 10 chars)
    if (!address.trim()) {
      newErrors.address = 'Delivery address is required.';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Address must be descriptive (at least 10 characters).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMsg({ text: 'Please resolve the errors below.', type: 'error' });
      return;
    }

    setErrors({});
    try {
      const updatedUser: UserSession = {
        ...user!,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };
      localStorage.setItem('aristino_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMsg({ text: 'Personal information updated successfully!', type: 'success' });
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ text: 'Failed to update personal information.', type: 'error' });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] bg-brand-offwhite flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-navy" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none">
      {/* Breadcrumbs */}
      <div className="text-[11px] font-sans text-neutral-500 tracking-wider mb-6">
        <Link href="/" className="hover:text-brand-gold transition-colors duration-200">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black font-semibold uppercase">My Account</span>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-neutral-200 mb-10 gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-brand-charcoal uppercase leading-none">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs font-sans text-neutral-500 tracking-wider mt-2 uppercase">
            Customer Account Dashboard
          </p>
        </div>

        <button 
          onClick={handleSignOut}
          className="border border-brand-charcoal/20 hover:border-black text-[10px] font-sans font-bold tracking-[0.2em] px-4 py-2 bg-white text-neutral-800 transition-colors uppercase rounded focus:outline-none"
        >
          Sign Out
        </button>
      </div>

      {/* Personal Information Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSaveProfile} className="border border-neutral-200 p-8 bg-white rounded shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-bold tracking-wider text-brand-charcoal uppercase border-b border-neutral-200 pb-3 mb-2">
            Personal Information
          </h2>

          {msg && (
            <div className={`p-3 text-xs font-semibold rounded border text-center ${
              msg.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {msg.text}
            </div>
          )}

          <div className="space-y-4 font-sans text-xs">
            {/* First Name Field */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className={`w-full bg-white border ${errors.firstName ? 'border-red-500' : 'border-neutral-300 focus:border-brand-charcoal'} text-neutral-800 rounded px-3 py-2.5 text-sm focus:outline-none transition-colors`}
              />
              {errors.firstName && <span className="text-[10px] font-semibold text-red-650 mt-1">{errors.firstName}</span>}
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className={`w-full bg-white border ${errors.lastName ? 'border-red-500' : 'border-neutral-300 focus:border-brand-charcoal'} text-neutral-800 rounded px-3 py-2.5 text-sm focus:outline-none transition-colors`}
              />
              {errors.lastName && <span className="text-[10px] font-semibold text-red-655 mt-1">{errors.lastName}</span>}
            </div>

            {/* Email (Read-Only) */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-450 rounded px-3 py-2.5 text-sm cursor-not-allowed"
              />
            </div>

            {/* Phone Field */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-neutral-300 focus:border-brand-charcoal'} text-neutral-800 rounded px-3 py-2.5 text-sm focus:outline-none transition-colors`}
              />
              {errors.phone && <span className="text-[10px] font-semibold text-red-650 mt-1">{errors.phone}</span>}
            </div>

            {/* Address Field */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase mb-1.5">
                Delivery Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter detailed delivery address"
                rows={3}
                className={`w-full bg-white border ${errors.address ? 'border-red-500' : 'border-neutral-300 focus:border-brand-charcoal'} text-neutral-800 rounded px-3 py-2.5 text-sm focus:outline-none resize-none transition-colors`}
              />
              {errors.address && <span className="text-[10px] font-semibold text-red-650 mt-1">{errors.address}</span>}
            </div>

            {/* Sign In Provider Info */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase block mb-1.5">
                Login Method
              </span>
              {user.provider === 'google' ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Account</span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-neutral-700">Email & Password</span>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-brand-charcoal text-white font-sans text-xs font-bold tracking-[0.25em] uppercase py-3.5 hover:bg-brand-navy active:bg-neutral-900 transition-colors duration-200 rounded"
          >
            Save Information
          </button>
        </form>
      </div>
    </div>
  );
}
