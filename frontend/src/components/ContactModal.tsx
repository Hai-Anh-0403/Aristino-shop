"use client";
 
import React, { useState } from 'react';
import Link from 'next/link';
 
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}
 
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

const getUserIdentifier = (): string => {
  if (typeof window === 'undefined') return 'default_client';
  
  // 1. Check if user is logged in
  const userSessionStr = localStorage.getItem('aristino_user');
  if (userSessionStr) {
    try {
      const user = JSON.parse(userSessionStr);
      if (user && user.email) {
        return `user_${user.email.toLowerCase()}`;
      }
    } catch {
      // ignore
    }
  }

  // 2. Check or create guest client identifier
  let clientId = localStorage.getItem('aristino_client_id');
  if (!clientId) {
    clientId = 'client_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('aristino_client_id', clientId);
  }
  return clientId;
};

const getRecentSubmissions = (userKey: string): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`contact_rate_limit_${userKey}`);
    if (!raw) return [];
    const list: number[] = JSON.parse(raw);
    const now = Date.now();
    return list.filter((t) => now - t < WINDOW_MS);
  } catch {
    return [];
  }
};

const recordSubmission = (userKey: string) => {
  if (typeof window === 'undefined') return;
  const recent = getRecentSubmissions(userKey);
  recent.push(Date.now());
  localStorage.setItem(`contact_rate_limit_${userKey}`, JSON.stringify(recent));
};

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
 
  if (!isOpen) return null;
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
 
    const userKey = getUserIdentifier();
    const recentAttempts = getRecentSubmissions(userKey);

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      setErrorMsg(
        'Submission limit reached: You can submit up to 3 contact requests per 15-minute window. Please try again later.'
      );
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();
 
    // 1. Required Fields Check
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
      setErrorMsg('Please fill in all required fields (*)');
      return;
    }
 
    // 2. Full Name validation
    if (trimmedName.length < 2) {
      setErrorMsg('Full Name must be at least 2 characters long.');
      return;
    }
 
    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
 
    // 4. Phone format validation
    const phoneRegex = /^[+]?[0-9\s\-()]{8,18}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setErrorMsg('Please enter a valid phone number (8-18 digits).');
      return;
    }
 
    // 5. Message length validation
    if (trimmedMessage.length < 10) {
      setErrorMsg('Message must be at least 10 characters long.');
      return;
    }
 
    setIsSubmitting(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    try {
      await fetch(`${API_URL}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          message: trimmedMessage,
          userKey,
        }),
      });

      recordSubmission(userKey);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      recordSubmission(userKey);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-9999 flex items-center justify-center p-4">
      {/* Modal Content */}
      <div className="bg-white w-full max-w-[500px] p-6 sm:p-8 shadow-2xl relative flex flex-col font-sans border border-neutral-100 animate-fadeIn">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
 
        {isSuccess ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-brand-charcoal mb-2">Sent successfully!</h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
              Thank you for leaving a message. We will get back to you as soon as possible.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="bg-brand-charcoal text-white text-[11px] font-bold tracking-[0.2em] uppercase py-3 px-6 hover:bg-brand-navy transition-colors duration-300"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Title */}
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-neutral-850 uppercase pr-8 mb-6">
              LEAVE US A MESSAGE
            </h2>
 
            {errorMsg && (
              <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2 text-center rounded">
                {errorMsg}
              </div>
            )}
 
            <div className="space-y-4">
              {/* Name Field */}
              <div className="border border-neutral-300 focus-within:border-brand-charcoal transition-colors px-3 py-1.5 flex flex-col">
                <label className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-transparent text-sm text-neutral-800 focus:outline-none placeholder-neutral-400 w-full mt-0.5"
                  disabled={isSubmitting}
                  required
                />
              </div>
 
              {/* Email Field */}
              <div className="border border-neutral-300 focus-within:border-brand-charcoal transition-colors px-3 py-1.5 flex flex-col">
                <label className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-transparent text-sm text-neutral-800 focus:outline-none placeholder-neutral-400 w-full mt-0.5"
                  disabled={isSubmitting}
                  required
                />
              </div>
 
              {/* Phone Field */}
              <div className="border border-neutral-300 focus-within:border-brand-charcoal transition-colors px-3 py-1.5 flex flex-col">
                <label className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="bg-transparent text-sm text-neutral-800 focus:outline-none placeholder-neutral-400 w-full mt-0.5"
                  disabled={isSubmitting}
                  required
                />
              </div>
 
              {/* Message Field */}
              <div className="border border-neutral-300 focus-within:border-brand-charcoal transition-colors px-3 py-1.5 flex flex-col">
                <label className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  className="bg-transparent text-sm text-neutral-800 focus:outline-none placeholder-neutral-400 w-full min-h-[90px] resize-none mt-1"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
 
            {/* Legal text */}
            <div className="mt-5 space-y-2 text-[10.5px] text-neutral-500 font-sans leading-relaxed tracking-normal">
              <p>
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-800">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <Link href="/terms" onClick={onClose} className="underline hover:text-neutral-800">
                  Terms of Service
                </Link>{' '}
                apply.
              </p>
              <p>
                You agree to provide information in accordance with our{' '}
                <Link href="/terms" onClick={onClose} className="underline font-medium hover:text-neutral-800">
                  Privacy Policy
                </Link>
              </p>
            </div>
 
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white font-sans text-xs font-bold tracking-[0.25em] uppercase py-4 mt-6 hover:bg-neutral-805 active:bg-neutral-950 disabled:bg-neutral-300 transition-colors duration-200"
            >
              {isSubmitting ? 'SENDING...' : 'SEND TO US'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
