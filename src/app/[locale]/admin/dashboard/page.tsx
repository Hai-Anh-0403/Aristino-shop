"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminSession {
  email: string;
  role: string;
}

const MOCK_METRICS = [
  { label: 'DOANH THU HÔM NAY', value: '$24,590.00', change: '+12.4%', isPositive: true },
  { label: 'ĐƠN HÀNG HOẠT ĐỘNG', value: '47', change: '+3.2%', isPositive: true },
  { label: 'TRUY CẬP TRỰC TUYẾN', value: '184', change: '-2.1%', isPositive: false },
  { label: 'TỶ LỆ CHUYỂN ĐỔI', value: '3.42%', change: '+0.5%', isPositive: true }
];

const MOCK_SALES_LOG = [
  { id: '#10244', customer: 'john.doe@example.com', items: 'Suit (1), Áo sơ mi (1)', total: 12626.40, status: 'Đã hoàn thành' },
  { id: '#10243', customer: 'guest840@gmail.com', items: 'Blazer (1)', total: 4500.00, status: 'Đã hoàn thành' },
  { id: '#10242', customer: 'test-user@outlook.com', items: 'Áo Polo (2)', total: 64.00, status: 'Đang xử lý' },
  { id: '#10241', customer: 'customer92@yahoo.com', items: 'Đồ mặc trong (1)', total: 47.80, status: 'Đã hoàn thành' }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tổng quan');

  useEffect(() => {
    const adminSession = localStorage.getItem('aristino_admin');
    if (!adminSession) {
      router.push('/admin/login');
    } else {
      try {
        setAdmin(JSON.parse(adminSession));
      } catch (e) {
        console.error('Failed to parse admin session', e);
        router.push('/admin/login');
      }
      setIsLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('aristino_admin');
    router.push('/admin/login');
  };

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#C5A880]" fill="none" viewBox="0 0 24 24">
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

  const getTabLabelInEnglish = (tab: string): string => {
    const mapping: Record<string, string> = {
      'Tổng quan': 'Overview',
      'Đơn hàng': 'Orders',
      'Sản phẩm': 'Products',
      'Khách hàng': 'Customers',
      'Cài đặt': 'Settings'
    };
    return mapping[tab] || tab;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white select-none font-sans flex flex-col md:flex-row">
      
      {/* 1. Left Side Admin Navigation Bar */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-[#1A1A1A] border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between p-6">
        <div>
          {/* Admin Brand Logo */}
          <div className="mb-8 select-none">
            <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#C5A880]">
              ARISTINO
            </span>
            <div className="text-[9px] font-sans text-neutral-400 font-bold tracking-[0.2em] uppercase mt-0.5">
              Trung tâm Kiểm soát
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { label: 'Tổng quan', icon: (
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
              ) },
              { label: 'Đơn hàng', icon: (
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              ) },
              { label: 'Sản phẩm', icon: (
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ) },
              { label: 'Khách hàng', icon: (
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) },
              { label: 'Cài đặt', icon: (
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) }
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => setActiveTab(link.label)}
                className={`w-full flex items-center px-4 py-2.5 text-xs font-bold tracking-wider uppercase rounded transition-colors text-left ${
                  activeTab === link.label 
                    ? 'bg-[#C5A880] text-[#0A192F]' 
                    : 'text-neutral-400 hover:bg-[#262626] hover:text-white'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Profile / Sign Out Widget */}
        <div className="mt-8 pt-6 border-t border-neutral-800 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#C5A880] flex items-center justify-center text-[#0A192F] font-bold text-sm">
              {admin.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{admin.email.split('@')[0]}</p>
              <p className="text-[9px] text-neutral-400 font-bold tracking-wide truncate">Quản trị viên</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full border border-neutral-800 hover:border-white text-[10px] font-bold tracking-[0.2em] py-2.5 bg-neutral-900 text-white transition-colors uppercase rounded focus:outline-none flex items-center justify-center"
          >
            <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* 2. Right Side Admin Content */}
      <main className="flex-grow p-6 sm:p-10">
        
        {/* Admin Dashboard Navbar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-neutral-800 mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.3em] uppercase block mb-1">
              BẢNG ĐIỀU KHIỂN ARISTINO
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-widest uppercase">
              Bản tin {activeTab}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1.5 uppercase tracking-wider">
              Trạng thái máy chủ: <span className="text-green-400 font-bold ml-1">Trực tuyến</span>
            </span>
          </div>
        </div>

        {activeTab === 'Tổng quan' && (
          <>
            {/* Metrics Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {MOCK_METRICS.map((metric) => (
                <div key={metric.label} className="bg-[#1A1A1A] border border-neutral-800 p-5 rounded">
                  <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block mb-2">
                    {metric.label}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-white font-mono">
                      {metric.value}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      metric.isPositive 
                        ? 'bg-green-950/40 text-green-400 border border-green-900/60' 
                        : 'bg-red-950/40 text-red-400 border border-red-900/60'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Sales Log Panel */}
            <div className="bg-[#1A1A1A] border border-neutral-800 rounded overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-800">
                <h2 className="font-serif text-base font-bold tracking-wider uppercase">
                  Đơn hàng cửa hàng gần đây
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800 text-xs font-mono text-left">
                  <thead className="bg-[#242424] text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                    <tr>
                      <th className="px-6 py-4">Mã đơn hàng</th>
                      <th className="px-6 py-4">Email khách hàng</th>
                      <th className="px-6 py-4">Sản phẩm đã mua</th>
                      <th className="px-6 py-4 text-right">Tổng đơn hàng</th>
                      <th className="px-6 py-4 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 text-neutral-300">
                    {MOCK_SALES_LOG.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">{log.id}</td>
                        <td className="px-6 py-4">{log.customer}</td>
                        <td className="px-6 py-4">{log.items}</td>
                        <td className="px-6 py-4 text-right text-[#C5A880] font-bold">
                          {formatPrice(log.total)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            log.status === 'Đã hoàn thành'
                              ? 'bg-green-950/30 text-green-400 border border-green-900/40'
                              : 'bg-yellow-950/30 text-yellow-400 border border-yellow-900/40'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab !== 'Tổng quan' && (
          <div className="border border-neutral-800 rounded bg-[#1A1A1A] p-8 text-center">
            <svg className="w-12 h-12 text-[#C5A880] opacity-60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-serif text-base font-bold mb-1">Tính năng đang phát triển</h3>
            <p className="font-sans text-xs text-neutral-400 max-w-sm mx-auto">
              Phần bảng điều khiển {activeTab} ({getTabLabelInEnglish(activeTab)}) đang được xây dựng. Các hoạt động giao dịch và hồ sơ cơ sở dữ liệu là các thành phần giả lập cho bản dựng mẫu này.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}
