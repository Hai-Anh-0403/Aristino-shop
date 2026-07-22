"use client";

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="text-[11px] font-sans text-neutral-500 tracking-wider mb-6">
        <Link href="/" className="hover:text-brand-gold transition-colors duration-200">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black font-semibold uppercase">Terms & Conditions</span>
      </div>

      {/* Page Header */}
      <div className="pb-6 border-b border-neutral-200 mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-brand-charcoal uppercase">
          Terms & Conditions
        </h1>
        <p className="text-xs font-sans text-neutral-500 tracking-wider mt-2">
          LAST UPDATED: JULY 16, 2026
        </p>
      </div>

      {/* Terms Body */}
      <div className="font-sans text-sm text-neutral-700 leading-relaxed space-y-6">
        <p>
          Welcome to the ARISTINO online store. By accessing or using our website, services, or products, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide uppercase">
            1. Use of the Site
          </h2>
          <p>
            You agree to use this website only for lawful purposes. You are prohibited from violating or attempting to violate the security of the website, including, without limitation, accessing data not intended for you or logging into a server or account that you are not authorized to access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide uppercase">
            2. Intellectual Property
          </h2>
          <p>
            All content on this site—including text, graphics, logos, images, digital downloads, and software—is the property of K&G Vietnam Investment Joint Stock Company or its content suppliers and is protected by international copyright laws. Any unauthorized use of our intellectual property is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide uppercase">
            3. Product Information and Prices
          </h2>
          <p>
            While we strive to provide accurate product images, details, and pricing, errors may occur. Aristino reserves the right to correct any errors, inaccuracies, or omissions, and to change or update information at any time without prior notice. All prices are listed in US Dollars (USD).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide uppercase">
            4. User Accounts
          </h2>
          <p>
            If you create an account on our website, you are responsible for maintaining the confidentiality of your username and password, and for restricting access to your computer or devices. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide uppercase">
            5. Limitation of Liability
          </h2>
          <p>
            Aristino shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this website, including but not limited to reliance by a user on any information obtained from this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-brand-navy tracking-wide uppercase">
            6. Governing Law
          </h2>
          <p>
            These terms and conditions shall be governed by and construed in accordance with the laws of Vietnam, without giving effect to any principles of conflicts of law. Any dispute arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Hanoi, Vietnam.
          </p>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-neutral-200 flex justify-start">
          <Link 
            href="/account/login"
            className="font-sans text-[11px] font-bold tracking-[0.25em] text-brand-charcoal uppercase border-b border-brand-charcoal pb-0.5 hover:text-brand-gold hover:border-brand-gold transition-colors duration-300"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
