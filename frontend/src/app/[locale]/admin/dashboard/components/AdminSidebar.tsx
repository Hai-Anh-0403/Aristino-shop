"use client";

import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Zap,
  BookOpen,
  Sparkles,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { AdminSession } from '../types';

interface AdminSidebarProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
  admin: AdminSession | null;
  onSignOut: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabSelect,
  admin,
  onSignOut,
}) => {
  const navItems = [
    { label: 'Tổng quan', icon: <LayoutDashboard className="w-4 h-4 mr-3" /> },
    { label: 'Đơn hàng', icon: <ShoppingBag className="w-4 h-4 mr-3" /> },
    { label: 'Sản phẩm', icon: <Package className="w-4 h-4 mr-3" /> },
    { label: 'Flash Sale', icon: <Zap className="w-4 h-4 mr-3 text-amber-500" /> },
    { label: 'Lookbook', icon: <BookOpen className="w-4 h-4 mr-3 text-blue-500" /> },
    { label: 'Sản phẩm gợi ý', icon: <Sparkles className="w-4 h-4 mr-3 text-amber-500" /> },
    { label: 'Khách hàng', icon: <Users className="w-4 h-4 mr-3 text-emerald-500" /> },
    { label: 'Cài đặt', icon: <Settings className="w-4 h-4 mr-3 text-neutral-500" /> },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col justify-between p-6 shadow-sm md:sticky md:top-0 md:h-screen overflow-y-auto">
      <div>
        {/* Admin Brand Logo */}
        <div className="mb-8 select-none">
          <span className="font-serif text-xl font-bold tracking-[0.2em] text-brand-navy">
            ARISTINO
          </span>
          <div className="text-xs font-sans text-neutral-500 font-bold tracking-wider uppercase mt-0.5">
            Trung tâm Kiểm soát
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((link) => (
            <button
              key={link.label}
              onClick={() => onTabSelect(link.label)}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-bold tracking-wide uppercase rounded transition-colors text-left ${
                activeTab === link.label
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Profile / Sign Out Widget */}
      {admin && (
        <div className="mt-8 pt-6 border-t border-neutral-200 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm">
              {admin.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-neutral-800 truncate">{admin.email.split('@')[0]}</p>
              <p className="text-xs text-neutral-500 font-bold tracking-wide truncate">Quản trị viên</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full border border-neutral-200 hover:border-neutral-400 text-xs font-bold tracking-wider py-2.5 bg-white text-neutral-700 hover:text-black transition-colors uppercase rounded focus:outline-none flex items-center justify-center"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Đăng xuất
          </button>
        </div>
      )}
    </aside>
  );
};
