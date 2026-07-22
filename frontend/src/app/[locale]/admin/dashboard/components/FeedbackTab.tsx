"use client";

import React from 'react';
import { Search, Eye, Trash2, MessageSquare } from 'lucide-react';
import { FeedbackData } from '../types';

interface FeedbackTabProps {
  feedbacks: FeedbackData[];
  feedbackLoading: boolean;
  feedbackSearchInput: string;
  onSearchInputChange: (val: string) => void;
  onViewFeedback: (fb: FeedbackData) => void;
  onDeleteFeedbackClick: (fb: FeedbackData) => void;
  msg: { text: string; type: 'success' | 'error' } | null;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({
  feedbacks,
  feedbackLoading,
  feedbackSearchInput,
  onSearchInputChange,
  onViewFeedback,
  onDeleteFeedbackClick,
  msg,
}) => {
  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (!feedbackSearchInput.trim()) return true;
    const term = feedbackSearchInput.toLowerCase();
    return (
      fb.name.toLowerCase().includes(term) ||
      fb.email.toLowerCase().includes(term) ||
      fb.phone.includes(term) ||
      fb.message.toLowerCase().includes(term)
    );
  });

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
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={feedbackSearchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT hoặc nội dung..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/60 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Số Điện Thoại</th>
                <th className="p-4">Nội Dung Thư</th>
                <th className="p-4">Thời Gian</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {feedbackLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 italic">
                    Đang tải danh sách phản hồi...
                  </td>
                </tr>
              ) : filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 italic">
                    Không tìm thấy phản hồi nào từ khách hàng.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <tr key={fb._id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-neutral-900">{fb.name}</p>
                      <p className="text-xs text-neutral-400">{fb.email}</p>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-neutral-700">{fb.phone}</td>
                    <td className="p-4 text-neutral-600 max-w-xs">
                      <p className="line-clamp-2">{fb.message}</p>
                    </td>
                    <td className="p-4 text-xs text-neutral-500">
                      {new Date(fb.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onViewFeedback(fb)}
                        className="p-1.5 text-neutral-500 hover:text-brand-navy bg-neutral-100 hover:bg-neutral-200 rounded"
                        title="Xem tin nhắn chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteFeedbackClick(fb)}
                        className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded"
                        title="Xóa tin nhắn"
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
      </div>
    </div>
  );
};
