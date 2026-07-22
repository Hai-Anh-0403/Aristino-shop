"use client";

import React from 'react';
import {
  Search,
  Eye,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { OrderData } from '../types';

interface OrdersTabProps {
  orders: OrderData[];
  orderLoading: boolean;
  orderSearchInput: string;
  onOrderSearchInputChange: (val: string) => void;
  orderStatusFilter: string;
  onOrderStatusFilterChange: (status: string) => void;
  orderPage: number;
  orderTotalPages: number;
  orderTotalCount: number;
  onPageChange: (page: number) => void;
  onViewOrder: (order: OrderData) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onDeleteOrderClick: (order: OrderData) => void;
  updatingId: string | null;
  msg: { text: string; type: 'success' | 'error' } | null;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  orderLoading,
  orderSearchInput,
  onOrderSearchInputChange,
  orderStatusFilter,
  onOrderStatusFilterChange,
  orderPage,
  orderTotalPages,
  orderTotalCount,
  onPageChange,
  onViewOrder,
  onUpdateStatus,
  onDeleteOrderClick,
  updatingId,
  msg,
}) => {
  const statuses = ['All', 'Processing', 'Confirmed', 'Shipping', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`p-4 rounded text-sm font-bold shadow-sm ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={orderSearchInput}
            onChange={(e) => onOrderSearchInputChange(e.target.value)}
            placeholder="Tìm theo mã đơn, email, SĐT..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400 mr-1 hidden sm:inline" />
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => onOrderStatusFilterChange(st)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                orderStatusFilter === st
                  ? 'bg-brand-navy text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/60 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4">Tổng Tiền</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orderLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 italic">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 italic">
                    Không tìm thấy đơn hàng phù hợp.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-navy">{order.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-medium text-neutral-900">{order.customerName}</p>
                      <p className="text-xs text-neutral-400">{order.customerEmail}</p>
                    </td>
                    <td className="p-4 text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 font-serif font-bold text-neutral-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded border border-transparent focus:outline-none focus:ring-1 focus:ring-brand-navy ${
                          order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {statuses.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-1.5 text-neutral-500 hover:text-brand-navy bg-neutral-100 hover:bg-neutral-200 rounded"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteOrderClick(order)}
                        className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded"
                        title="Xóa đơn hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {orderTotalPages > 1 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-bold">
              Tổng số: {orderTotalCount} đơn hàng (Trang {orderPage}/{orderTotalPages})
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={orderPage === 1}
                onClick={() => onPageChange(orderPage - 1)}
                className="px-3 py-1 text-xs font-bold border border-neutral-300 rounded bg-white hover:bg-neutral-100 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={orderPage === orderTotalPages}
                onClick={() => onPageChange(orderPage + 1)}
                className="px-3 py-1 text-xs font-bold border border-neutral-300 rounded bg-white hover:bg-neutral-100 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
