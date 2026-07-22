"use client";

import React from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
} from 'lucide-react';
import Image from 'next/image';
import { DashboardProduct } from '../types';

interface ProductsTabProps {
  products: DashboardProduct[];
  prodLoading: boolean;
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  prodPage: number;
  prodTotalPages: number;
  prodTotal: number;
  onPageChange: (page: number) => void;
  onOpenProductModal: (prod?: DashboardProduct) => void;
  onDeleteProductClick: (prod: DashboardProduct) => void;
  msg: { text: string; type: 'success' | 'error' } | null;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  prodLoading,
  searchInput,
  onSearchInputChange,
  prodPage,
  prodTotalPages,
  prodTotal,
  onPageChange,
  onOpenProductModal,
  onDeleteProductClick,
  msg,
}) => {
  return (
    <div className="space-y-6">
      {msg && (
        <div className={`p-4 rounded text-sm font-bold shadow-sm ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Action Header */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Tìm theo tên, thương hiệu, chủ đề..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>

        <button
          onClick={() => onOpenProductModal()}
          className="w-full sm:w-auto px-4 py-2 bg-brand-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/60 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4">Hình Ảnh</th>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4">Thương Hiệu</th>
                <th className="p-4">Giá Bán</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {prodLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 italic">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 italic">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const img = prod.imageUrl || (prod.images && prod.images.length > 0 ? prod.images[0] : '');
                  return (
                    <tr key={prod._id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-14 bg-neutral-100 rounded overflow-hidden relative border border-neutral-200 flex-shrink-0">
                          {img ? (
                            <Image src={img} alt={prod.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-neutral-900">
                        <p className="line-clamp-1">{prod.title}</p>
                        <p className="text-xs text-neutral-400 font-mono">Slug: {prod.slug}</p>
                      </td>
                      <td className="p-4 text-xs font-bold text-neutral-600">{prod.brand || 'Aristino'}</td>
                      <td className="p-4 font-serif font-bold text-neutral-900">
                        ${typeof prod.price === 'number' ? prod.price.toFixed(2) : prod.price}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.isFlashSale && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded uppercase">
                              Flash Sale
                            </span>
                          )}
                          {prod.isLookbook && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded uppercase">
                              Lookbook
                            </span>
                          )}
                          {!prod.isFlashSale && !prod.isLookbook && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 text-neutral-600 rounded uppercase">
                              Thường
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => onOpenProductModal(prod)}
                          className="p-1.5 text-neutral-500 hover:text-brand-navy bg-neutral-100 hover:bg-neutral-200 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProductClick(prod)}
                          className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {prodTotalPages > 1 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-bold">
              Tổng số: {prodTotal} sản phẩm (Trang {prodPage}/{prodTotalPages})
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={prodPage === 1}
                onClick={() => onPageChange(prodPage - 1)}
                className="px-3 py-1 text-xs font-bold border border-neutral-300 rounded bg-white hover:bg-neutral-100 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={prodPage === prodTotalPages}
                onClick={() => onPageChange(prodPage + 1)}
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
