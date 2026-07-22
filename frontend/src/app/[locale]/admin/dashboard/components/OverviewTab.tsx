"use client";

import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Zap,
  BookOpen,
  Sparkles,
  Users,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { DashboardProduct, OrderData } from '../types';

interface OverviewTabProps {
  metrics: {
    totalOrdersCount: number;
    totalRevenue: number;
    processingCount: number;
    completedCount: number;
  };
  recentOrders: OrderData[];
  onTabSelect: (tab: string) => void;
  onOpenProductModal?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  recentOrders,
  onTabSelect,
  onOpenProductModal,
}) => {
  const metricCards = [
    {
      label: 'TỔNG DOANH THU',
      value: `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.4%',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'TỔNG ĐƠN HÀNG',
      value: metrics.totalOrdersCount.toString(),
      change: '+3.2%',
      isPositive: true,
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'ĐƠN CẦN XỬ LÝ',
      value: metrics.processingCount.toString(),
      change: metrics.processingCount > 0 ? 'Cần duyệt' : 'Hoàn tất',
      isPositive: metrics.processingCount === 0,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'ĐƠN HOÀN THÀNH',
      value: metrics.completedCount.toString(),
      change: 'Thành công',
      isPositive: true,
      icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50',
    },
  ];

  const quickActions = [
    { label: 'Thêm sản phẩm', action: () => onOpenProductModal && onOpenProductModal(), icon: <Package className="w-5 h-5 text-brand-navy" />, desc: 'Tạo sản phẩm mới' },
    { label: 'Quản lý Đơn hàng', action: () => onTabSelect('Đơn hàng'), icon: <ShoppingBag className="w-5 h-5 text-blue-600" />, desc: 'Xem danh sách đơn' },
    { label: 'Cấu hình Flash Sale', action: () => onTabSelect('Flash Sale'), icon: <Zap className="w-5 h-5 text-amber-500" />, desc: 'Chỉnh khuyến mãi' },
    { label: 'Cài đặt Lookbook', action: () => onTabSelect('Lookbook'), icon: <BookOpen className="w-5 h-5 text-blue-500" />, desc: 'Bộ sưu tập thời trang' },
    { label: 'Sản phẩm gợi ý', action: () => onTabSelect('Sản phẩm gợi ý'), icon: <Sparkles className="w-5 h-5 text-amber-500" />, desc: 'KOL curation' },
    { label: 'Phản hồi khách hàng', action: () => onTabSelect('Khách hàng'), icon: <Users className="w-5 h-5 text-emerald-500" />, desc: 'Tin nhắn liên hệ' },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 mt-1">{card.value}</h3>
              <p className={`text-xs font-bold mt-1 ${card.isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
                {card.change}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Shortcuts Grid */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-brand-navy mb-4 tracking-wide uppercase">
          Lối Tắt Thao Tác Nhanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="p-4 bg-neutral-50 hover:bg-brand-navy hover:text-white rounded border border-neutral-200 transition-all text-left group flex flex-col justify-between"
            >
              <div className="p-2 bg-white rounded shadow-sm w-fit mb-3 group-hover:bg-white/20">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide uppercase line-clamp-1">{item.label}</p>
                <p className="text-[10px] text-neutral-400 group-hover:text-neutral-200 mt-0.5 line-clamp-1">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders Log Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h2 className="font-serif text-base font-bold text-brand-navy uppercase tracking-wider">
            Đơn Hàng Gần Đây
          </h2>
          <button
            onClick={() => onTabSelect('Đơn hàng')}
            className="text-xs font-bold text-brand-navy hover:text-brand-gold flex items-center tracking-wider uppercase"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/60 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-navy">{order.orderNumber}</td>
                  <td className="p-4 font-medium text-neutral-800">{order.customerName} ({order.customerEmail})</td>
                  <td className="p-4 font-serif font-bold text-neutral-900">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                      order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-400 text-sm italic">
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
