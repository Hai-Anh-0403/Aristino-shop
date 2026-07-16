"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const userSession = localStorage.getItem('aristino_user');
    if (userSession) {
      router.push('/account');
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!loginEmail || !loginPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Look up in registered mock accounts or create a mock session
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const foundUser = registeredUsers.find((u: any) => u.email.toLowerCase() === loginEmail.toLowerCase());

      if (foundUser) {
        if (foundUser.password === loginPassword) {
          localStorage.setItem('aristino_user', JSON.stringify({
            email: foundUser.email,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName
          }));
          router.push('/account');
        } else {
          setMessage({ type: 'error', text: 'Incorrect password. Please try again.' });
        }
      } else {
        // Fallback default login session for demo purposes if not registered
        localStorage.setItem('aristino_user', JSON.stringify({
          email: loginEmail,
          firstName: 'Guest',
          lastName: 'User'
        }));
        router.push('/account');
      }
    }, 1500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!regFirstName || !regLastName || !regEmail || !regPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (regPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (!agreeTerms) {
      setMessage({ type: 'error', text: 'You must agree to the Terms & Conditions.' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const emailExists = registeredUsers.some((u: any) => u.email.toLowerCase() === regEmail.toLowerCase());

      if (emailExists) {
        setMessage({ type: 'error', text: 'An account with this email already exists.' });
        return;
      }

      const newUser = {
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword
      };

      // Add to registered list
      registeredUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

      // Sign in automatically
      localStorage.setItem('aristino_user', JSON.stringify({
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }));

      setMessage({ type: 'success', text: 'Account created successfully! Redirecting...' });
      
      setTimeout(() => {
        router.push('/account');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-brand-offwhite flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-neutral-200 p-8 rounded shadow-sm">
        
        {/* Logo/Header */}
        <div className="text-center mb-8 select-none">
          <span className="font-serif text-2xl font-black tracking-[0.25em] text-brand-navy">
            ARISTINO
          </span>
          <p className="text-[10px] font-sans text-brand-charcoal/50 font-bold tracking-widest mt-1 uppercase">
            Customer Portal
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setMessage(null); }}
            className={`flex-1 pb-3 text-xs font-sans font-bold tracking-widest uppercase transition-colors focus:outline-none border-b-2 ${
              activeTab === 'login'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setMessage(null); }}
            className={`flex-1 pb-3 text-xs font-sans font-bold tracking-widest uppercase transition-colors focus:outline-none border-b-2 ${
              activeTab === 'register'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Notification messages */}
        {message && (
          <div className={`p-3 text-xs font-sans font-semibold rounded mb-5 select-none ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab 1: Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="login-email" className="text-[10px] font-sans font-bold tracking-wider text-neutral-500 mb-1 uppercase">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="email@example.com"
                className="border border-neutral-300 rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-300"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="text-[10px] font-sans font-bold tracking-wider text-neutral-500 uppercase">
                  Password
                </label>
                <Link href="#" className="text-[9px] font-sans text-brand-gold hover:underline tracking-wider font-bold uppercase">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-neutral-300 rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-300"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase mt-2 flex items-center justify-center min-h-[42px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Registration Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="reg-firstname" className="text-[10px] font-sans font-bold tracking-wider text-neutral-500 mb-1 uppercase">
                  First Name
                </label>
                <input
                  id="reg-firstname"
                  type="text"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  placeholder="John"
                  className="border border-neutral-300 rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-300"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="reg-lastname" className="text-[10px] font-sans font-bold tracking-wider text-neutral-500 mb-1 uppercase">
                  Last Name
                </label>
                <input
                  id="reg-lastname"
                  type="text"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  placeholder="Doe"
                  className="border border-neutral-300 rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-300"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="reg-email" className="text-[10px] font-sans font-bold tracking-wider text-neutral-500 mb-1 uppercase">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="email@example.com"
                className="border border-neutral-300 rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-300"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="reg-password" className="text-[10px] font-sans font-bold tracking-wider text-neutral-500 mb-1 uppercase">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="border border-neutral-300 rounded px-3 py-2 text-sm focus:border-brand-gold focus:outline-none placeholder-neutral-300"
                disabled={isLoading}
                required
              />
            </div>

            {/* Agreement Box linking to terms */}
            <div className="flex items-start select-none pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 border-neutral-300 rounded text-brand-gold focus:ring-brand-gold mt-0.5"
                disabled={isLoading}
                required
              />
              <label htmlFor="agree-terms" className="ml-2.5 text-xs text-neutral-600 leading-normal cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-gold font-bold hover:underline">
                  Terms & Conditions
                </Link>{' '}
                governing this website.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 py-3 text-xs font-sans font-bold tracking-[0.2em] uppercase mt-2 flex items-center justify-center min-h-[42px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
