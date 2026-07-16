"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserSession {
  email: string;
  firstName: string;
  lastName: string;
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

  useEffect(() => {
    const userSession = localStorage.getItem('aristino_user');
    if (!userSession) {
      router.push('/account/login');
    } else {
      try {
        setUser(JSON.parse(userSession));
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

      {/* Account Info and Order List */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left: Orders History Table */}
        <div className="lg:w-2/3">
          <h2 className="font-serif text-lg font-bold tracking-wider text-brand-charcoal uppercase mb-6">
            Order History
          </h2>
          
          {MOCK_ORDERS.length === 0 ? (
            <div className="border border-neutral-200 p-8 text-center bg-white rounded">
              <p className="font-sans text-xs text-neutral-500">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="border border-neutral-200 rounded overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 font-sans text-xs text-left">
                  <thead className="bg-neutral-50 text-[10px] font-bold text-neutral-500 tracking-wider uppercase">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50/55 transition-colors">
                        <td className="px-6 py-4 font-bold text-black">{order.id}</td>
                        <td className="px-6 py-4">{order.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-green-50 text-green-700 rounded border border-green-200">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{order.payment}</td>
                        <td className="px-6 py-4 text-right font-semibold text-brand-navy">
                          {formatPrice(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Profile Details */}
        <div className="lg:w-1/3">
          <div className="border border-neutral-200 p-6 bg-white rounded shadow-xs">
            <h2 className="font-serif text-lg font-bold tracking-wider text-brand-charcoal uppercase border-b border-neutral-200 pb-3 mb-5">
              Account Details
            </h2>
            
            <div className="space-y-4 font-sans text-xs">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase block mb-0.5">
                  Full Name
                </span>
                <span className="text-sm font-semibold text-neutral-800">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase block mb-0.5">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-neutral-800">
                  {user.email}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase block mb-0.5">
                  Country / Region
                </span>
                <span className="text-sm font-semibold text-neutral-800">
                  Vietnam (Default)
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
