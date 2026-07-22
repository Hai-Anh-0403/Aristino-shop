"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Plus,
  Search,
  ExternalLink,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Filter,
  Eye,
  Trash2,
  Edit,
  Clock,
  CheckCircle2
} from 'lucide-react';

import { AdminSidebar } from './components/AdminSidebar';
import { OverviewTab } from './components/OverviewTab';
import { OrdersTab } from './components/OrdersTab';
import { ProductsTab } from './components/ProductsTab';
import { FeedbackTab } from './components/FeedbackTab';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { AdminSession, SliderItem, DashboardProduct, HomepageBannerItem, OrderData, FeedbackData, LookbookInfo } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const parseNumericPrice = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const formatPrice = (value: any) => {
  const num = parseNumericPrice(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
};

const getTabLabelInEnglish = (tab: string): string => {
  const mapping: Record<string, string> = {
    'Tổng quan': 'Overview',
    'Đơn hàng': 'Orders',
    'Sản phẩm': 'Products',
    'Flash Sale': 'Flash Sale',
    'Lookbook': 'Lookbook',
    'Sản phẩm gợi ý': 'Suggested Products',
    'Khách hàng': 'Customers',
    'Cài đặt': 'Settings'
  };
  return mapping[tab] || tab;
};

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
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [sliderLoading, setSliderLoading] = useState(false);
  const [sliderMsg, setSliderMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2 Large Images Homepage Banner states
  const [homepageBanners, setHomepageBanners] = useState<HomepageBannerItem[]>([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [bannerForm, setBannerForm] = useState({
    src: '',
    label: '',
    href: '',
    alt: ''
  });
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [bannerUploading, setBannerUploading] = useState(false);

  // Video settings states
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('mp4');
  const [videoEmbedUrl, setVideoEmbedUrl] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoMsg, setVideoMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Order Management states
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderTotalCount, setOrderTotalCount] = useState(0);
  const [orderMetrics, setOrderMetrics] = useState({
    totalOrdersCount: 0,
    totalRevenue: 0,
    processingCount: 0,
    completedCount: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [orderUpdatingId, setOrderUpdatingId] = useState<string | null>(null);
  const [orderMsg, setOrderMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderData | null>(null);
  const [orderToEditStatus, setOrderToEditStatus] = useState<{ order: OrderData; newStatus: string } | null>(null);
  const [sliderToDelete, setSliderToDelete] = useState<SliderItem | null>(null);

  // Product management states
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodSearch, setProdSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [prodPage, setProdPage] = useState(1);
  const [prodTotalPages, setProdTotalPages] = useState(1);
  const [prodTotal, setProdTotal] = useState(0);
  const [prodMsg, setProdMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Feedback states
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackSearchInput, setFeedbackSearchInput] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackData | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Flash Sale states
  const [flashProducts, setFlashProducts] = useState<DashboardProduct[]>([]);
  const [flashLoading, setFlashLoading] = useState(false);
  const [flashSearch, setFlashSearch] = useState('');
  const [flashSearchInput, setFlashSearchInput] = useState('');
  const [flashAllProducts, setFlashAllProducts] = useState<DashboardProduct[]>([]);
  const [flashAllLoading, setFlashAllLoading] = useState(false);
  const [flashMsg, setFlashMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [flashModalProduct, setFlashModalProduct] = useState<DashboardProduct | null>(null);
  const [flashForm, setFlashForm] = useState({
    originalPrice: '',
    discount: '',
    price: ''
  });

  // Flash Sale countdown end time states
  const [flashEndTime, setFlashEndTime] = useState<string>('');
  const [flashEndTimeInput, setFlashEndTimeInput] = useState<string>('');
  const [flashEndTimeSaving, setFlashEndTimeSaving] = useState(false);

  const openFlashSaleModal = (product: DashboardProduct) => {
    setFlashModalProduct(product);
    const numPrice = parseNumericPrice(product.price);
    const origPriceNum = product.originalPrice ? parseNumericPrice(product.originalPrice) : (numPrice > 0 ? numPrice * 1.3 : 0);
    const discountStr = product.discount || '25%';

    setFlashForm({
      originalPrice: origPriceNum > 0 ? origPriceNum.toFixed(2) : (numPrice * 1.3).toFixed(2),
      discount: discountStr,
      price: numPrice > 0 ? numPrice.toFixed(2) : ''
    });
  };

  const handleSaveFlashSaleProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flashModalProduct) return;

    const finalOrigPrice = parseNumericPrice(flashForm.originalPrice);
    const finalPrice = parseNumericPrice(flashForm.price);
    const cleanDiscount = flashForm.discount.trim();
    const discountLabel = cleanDiscount ? (cleanDiscount.includes('%') ? cleanDiscount : `-${cleanDiscount}%`) : undefined;

    try {
      const res = await fetch(`${API_URL}/products/${flashModalProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFlashSale: true,
          originalPrice: finalOrigPrice > 0 ? finalOrigPrice : undefined,
          price: finalPrice > 0 ? finalPrice : parseNumericPrice(flashModalProduct.price),
          discount: discountLabel
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFlashMsg({
          text: `Đã cập nhật Flash Sale cho "${flashModalProduct.title}"`,
          type: 'success'
        });
        setTimeout(() => setFlashMsg(null), 3000);
        setFlashModalProduct(null);
        fetchFlashProducts();
        fetchFlashAllProducts();
      } else {
        alert(data.message || 'Lưu thất bại');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  // Flash Sale bulk selection states
  const [selectedActiveIds, setSelectedActiveIds] = useState<string[]>([]);
  const [selectedSearchIds, setSelectedSearchIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Lookbook states
  const [lookbookProducts, setLookbookProducts] = useState<DashboardProduct[]>([]);
  const [lookbookLoading, setLookbookLoading] = useState(false);
  const [lookbookSearch, setLookbookSearch] = useState('');
  const [lookbookSearchInput, setLookbookSearchInput] = useState('');
  const [lookbookAllProducts, setLookbookAllProducts] = useState<DashboardProduct[]>([]);
  const [lookbookAllLoading, setLookbookAllLoading] = useState(false);
  const [lookbookMsg, setLookbookMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [lookbookTitleInput, setLookbookTitleInput] = useState('INHERIT THE LEGEND');
  const [lookbookDescInput, setLookbookDescInput] = useState('');

  // Lookbook bulk selection states
  const [selectedLookbookActiveIds, setSelectedLookbookActiveIds] = useState<string[]>([]);
  const [selectedLookbookSearchIds, setSelectedLookbookSearchIds] = useState<string[]>([]);
  const [lookbookBulkLoading, setLookbookBulkLoading] = useState(false);

  // Product modal / form states
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DashboardProduct | null>(null);
  const [prodForm, setProdForm] = useState({
    brand: '',
    title: '',
    price: '',
    originalPrice: '',
    discount: '',
    imageUrl: '',
    images: '',
    description: '',
    theme: '',
    colors: '',
    slug: '',
    tagLeft: '',
    tagRight: ''
  });

  const handleOpenProdModal = () => {
    setEditingProduct(null);
    setProdForm({
      brand: '',
      title: '',
      price: '',
      originalPrice: '',
      discount: '',
      imageUrl: '',
      images: '',
      description: '',
      theme: '',
      colors: '',
      slug: '',
      tagLeft: '',
      tagRight: ''
    });
    setShowProdModal(true);
  };

  // KOL Showcase / Gợi ý sản phẩm states
  const [kolProducts, setKolProducts] = useState<DashboardProduct[]>([]);
  const [kolLoading, setKolLoading] = useState(false);
  const [kolSearch, setKolSearch] = useState('');
  const [kolSearchInput, setKolSearchInput] = useState('');
  const [kolAllProducts, setKolAllProducts] = useState<DashboardProduct[]>([]);
  const [kolAllLoading, setKolAllLoading] = useState(false);
  const [kolMsg, setKolMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeSuggestedSearch, setActiveSuggestedSearch] = useState('');

  // Suggested Products bulk selection states
  const [selectedKolActiveIds, setSelectedKolActiveIds] = useState<string[]>([]);
  const [selectedKolSearchIds, setSelectedKolSearchIds] = useState<string[]>([]);
  const [kolBulkLoading, setKolBulkLoading] = useState(false);

  const fetchSuggestedProducts = useCallback(async () => {
    try {
      setKolLoading(true);
      const res = await fetch(`${API_URL}/settings/kol_slider_products`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setKolProducts(data.data);
      } else {
        setKolProducts([]);
      }
    } catch {
      console.error('Failed to fetch suggested products setting');
    } finally {
      setKolLoading(false);
    }
  }, []);

  const fetchKolAllProducts = useCallback(async () => {
    try {
      setKolAllLoading(true);
      const query = new URLSearchParams({ limit: '100' });
      if (kolSearch.trim()) {
        query.append('search', kolSearch.trim());
      }
      const res = await fetch(`${API_URL}/products?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setKolAllProducts(data.data);
      }
    } catch {
      console.error('Failed to fetch products for KOL list');
    } finally {
      setKolAllLoading(false);
    }
  }, [kolSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setKolSearch(kolSearchInput);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [kolSearchInput]);

  useEffect(() => {
    if (activeTab === 'Sản phẩm gợi ý') {
      fetchSuggestedProducts();
      fetchKolAllProducts();
    }
  }, [activeTab, kolSearch, fetchSuggestedProducts, fetchKolAllProducts]);

  const saveSuggestedProducts = async (updatedList: DashboardProduct[]) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const res = await fetch(`${API_URL}/settings/kol_slider_products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ value: updatedList }),
      });
      const data = await res.json();
      if (data.success) {
        setKolProducts(updatedList);
        return true;
      }
    } catch {
      console.error('Failed to save suggested products');
    }
    return false;
  };

  const handleKolBulkAdd = async () => {
    if (selectedKolSearchIds.length === 0) return;
    try {
      setKolBulkLoading(true);
      const itemsToAdd = kolAllProducts.filter(p => selectedKolSearchIds.includes(p._id));
      const alreadyInList = new Set(kolProducts.map(p => p._id));
      const newItems = itemsToAdd.filter(p => !alreadyInList.has(p._id));

      if (newItems.length === 0) {
        setKolMsg({ text: 'Các sản phẩm đã chọn đã có sẵn trong danh sách', type: 'error' });
        setTimeout(() => setKolMsg(null), 3000);
        return;
      }

      const updated = [...kolProducts, ...newItems];
      const success = await saveSuggestedProducts(updated);
      if (success) {
        setKolMsg({
          text: `Đã thêm thành công ${newItems.length} sản phẩm gợi ý!`,
          type: 'success',
        });
        setTimeout(() => setKolMsg(null), 3000);
        setSelectedKolSearchIds([]);
        fetchSuggestedProducts();
      } else {
        setKolMsg({ text: 'Lưu cấu hình thất bại!', type: 'error' });
        setTimeout(() => setKolMsg(null), 3000);
      }
    } catch {
      setKolMsg({ text: 'Lỗi kết nối máy chủ!', type: 'error' });
      setTimeout(() => setKolMsg(null), 3000);
    } finally {
      setKolBulkLoading(false);
    }
  };

  const handleKolBulkRemove = async () => {
    if (selectedKolActiveIds.length === 0) return;
    try {
      setKolBulkLoading(true);
      const updated = kolProducts.filter(p => !selectedKolActiveIds.includes(p._id));
      const success = await saveSuggestedProducts(updated);
      if (success) {
        setKolMsg({
          text: `Đã gỡ thành công ${selectedKolActiveIds.length} sản phẩm gợi ý!`,
          type: 'success',
        });
        setTimeout(() => setKolMsg(null), 3000);
        setSelectedKolActiveIds([]);
        fetchSuggestedProducts();
      } else {
        setKolMsg({ text: 'Lưu cấu hình thất bại!', type: 'error' });
        setTimeout(() => setKolMsg(null), 3000);
      }
    } catch {
      setKolMsg({ text: 'Lỗi kết nối máy chủ!', type: 'error' });
      setTimeout(() => setKolMsg(null), 3000);
    } finally {
      setKolBulkLoading(false);
    }
  };

  const toggleKolProduct = async (product: DashboardProduct, status: boolean) => {
    try {
      let updated: DashboardProduct[] = [];
      if (status) {
        if (kolProducts.some(p => p._id === product._id)) return;
        updated = [...kolProducts, product];
      } else {
        updated = kolProducts.filter(p => p._id !== product._id);
      }

      const success = await saveSuggestedProducts(updated);
      if (success) {
        setKolMsg({
          text: status ? `Successfully added "${product.title}" to suggestions` : `Successfully removed "${product.title}" from suggestions`,
          type: 'success'
        });
        setTimeout(() => setKolMsg(null), 3000);
        fetchSuggestedProducts();
      }
    } catch {
      setKolMsg({ text: 'Failed to save configuration', type: 'error' });
      setTimeout(() => setKolMsg(null), 3000);
    }
  };

  const fetchSliders = useCallback(async () => {
    try {
      setSliderLoading(true);
      const res = await fetch(`${API_URL}/sliders/all`);
      const data = await res.json();
      if (data.success) setSliders(data.data);
    } catch {
      console.error('Failed to fetch sliders');
    } finally {
      setSliderLoading(false);
    }
  }, []);

  const fetchVideoSetting = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/settings/homepage_video`);
      const data = await res.json();
      if (data.success && data.data) {
        setVideoUrl(data.data.url || '');
        setVideoType(data.data.type || 'mp4');
        setVideoEmbedUrl(data.data.embedUrl || '');
      }
    } catch {
      console.error('Failed to fetch video setting');
    }
  }, []);

  const fetchHomepageBanners = useCallback(async () => {
    try {
      setBannerLoading(true);
      const res = await fetch(`${API_URL}/settings/homepage_banners`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHomepageBanners(data.data);
      }
    } catch {
      console.error('Failed to fetch homepage banners setting');
    } finally {
      setBannerLoading(false);
    }
  }, []);

  const saveHomepageBanners = async (newList: HomepageBannerItem[]) => {
    try {
      setBannerLoading(true);
      const res = await fetch(`${API_URL}/settings/homepage_banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newList }),
      });
      const data = await res.json();
      if (data.success) {
        setHomepageBanners(newList);
        setBannerMsg({ text: 'Cập nhật danh sách Banner thành công!', type: 'success' });
        setTimeout(() => setBannerMsg(null), 3000);
        return true;
      } else {
        setBannerMsg({ text: data.message || 'Lưu banner thất bại', type: 'error' });
        setTimeout(() => setBannerMsg(null), 3000);
      }
    } catch {
      setBannerMsg({ text: 'Lỗi kết nối máy chủ', type: 'error' });
      setTimeout(() => setBannerMsg(null), 3000);
    } finally {
      setBannerLoading(false);
    }
    return false;
  };

  const handleOpenBannerModal = (banner?: HomepageBannerItem, index?: number) => {
    if (banner !== undefined && index !== undefined) {
      setEditingBannerIndex(index);
      setBannerForm({
        src: banner.src || '',
        label: banner.label || '',
        href: banner.href || '',
        alt: banner.alt || banner.label || ''
      });
    } else {
      setEditingBannerIndex(null);
      setBannerForm({
        src: '',
        label: '',
        href: '/collections/new-arrivals',
        alt: ''
      });
    }
    setShowBannerModal(true);
  };

  const handleSaveBannerModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.src.trim() || !bannerForm.label.trim()) {
      alert('Vui lòng nhập đường dẫn ảnh và nhãn hiển thị!');
      return;
    }

    const newBanner: HomepageBannerItem = {
      src: bannerForm.src.trim(),
      label: bannerForm.label.trim().toUpperCase(),
      href: bannerForm.href.trim() || '/collections/new-arrivals',
      alt: bannerForm.alt.trim() || bannerForm.label.trim()
    };

    let updatedList: HomepageBannerItem[] = [];
    if (editingBannerIndex !== null) {
      updatedList = [...homepageBanners];
      updatedList[editingBannerIndex] = newBanner;
    } else {
      updatedList = [...homepageBanners, newBanner];
    }

    const success = await saveHomepageBanners(updatedList);
    if (success) {
      setShowBannerModal(false);
      setEditingBannerIndex(null);
      setBannerForm({ src: '', label: '', href: '', alt: '' });
    }
  };

  const moveBanner = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= homepageBanners.length) return;

    const newList = [...homepageBanners];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    await saveHomepageBanners(newList);
  };

  const deleteBanner = async (index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa Banner này?')) return;
    const newList = homepageBanners.filter((_, i) => i !== index);
    await saveHomepageBanners(newList);
  };

  const fetchOrders = useCallback(async () => {
    try {
      setOrderLoading(true);
      const query = new URLSearchParams({
        page: orderPage.toString(),
        limit: '20',
        status: orderStatusFilter,
      });
      if (orderSearch.trim()) {
        query.append('search', orderSearch.trim());
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`${API_URL}/orders?${query.toString()}`, {
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        if (data.pagination) {
          setOrderTotalPages(data.pagination.totalPages);
          setOrderTotalCount(data.pagination.totalOrders);
        }
        if (data.metrics) {
          setOrderMetrics(data.metrics);
        }
      }
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setOrderLoading(false);
    }
  }, [orderPage, orderStatusFilter, orderSearch]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrderUpdatingId(orderId);
      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderMsg({ text: `Đã cập nhật trạng thái đơn hàng thành ${newStatus}`, type: 'success' });
        setTimeout(() => setOrderMsg(null), 3000);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      } else {
        setOrderMsg({ text: data.message || 'Cập nhật thất bại', type: 'error' });
        setTimeout(() => setOrderMsg(null), 3000);
      }
    } catch {
      setOrderMsg({ text: 'Lỗi máy chủ', type: 'error' });
      setTimeout(() => setOrderMsg(null), 3000);
    } finally {
      setOrderUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setOrderUpdatingId(orderId);
      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setOrderMsg({ text: 'Đã xóa đơn hàng thành công', type: 'success' });
        setTimeout(() => setOrderMsg(null), 3000);
        if (showOrderDetailModal && selectedOrder?._id === orderId) {
          setShowOrderDetailModal(false);
          setSelectedOrder(null);
        }
        fetchOrders();
      } else {
        setOrderMsg({ text: data.message || 'Xóa đơn hàng thất bại', type: 'error' });
        setTimeout(() => setOrderMsg(null), 3000);
      }
    } catch {
      setOrderMsg({ text: 'Lỗi máy chủ', type: 'error' });
      setTimeout(() => setOrderMsg(null), 3000);
    } finally {
      setOrderUpdatingId(null);
      setOrderToDelete(null);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setOrderSearch(orderSearchInput);
      setOrderPage(1);
    }, 600);
    return () => clearTimeout(handler);
  }, [orderSearchInput]);

  useEffect(() => {
    if (activeTab === 'Đơn hàng') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setProdSearch(searchInput);
      setProdPage(1); // Reset page on query change
    }, 800); // 800ms delay to wait for typing to finish

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    if (activeTab === 'Cài đặt') {
      fetchSliders();
      fetchVideoSetting();
      fetchHomepageBanners();
    }
  }, [activeTab, fetchSliders, fetchVideoSetting, fetchHomepageBanners]);


  const fetchFlashProducts = useCallback(async () => {
    try {
      setFlashLoading(true);
      const res = await fetch(`${API_URL}/products?isFlashSale=true&limit=100`);
      const data = await res.json();
      if (data.success) {
        setFlashProducts(data.data);
      }
    } catch {
      console.error('Failed to fetch flash products');
    } finally {
      setFlashLoading(false);
    }
  }, []);

  const fetchFlashAllProducts = useCallback(async () => {
    try {
      setFlashAllLoading(true);
      const query = new URLSearchParams({ limit: '100' });
      if (flashSearch.trim()) {
        query.append('search', flashSearch.trim());
      }
      const res = await fetch(`${API_URL}/products?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setFlashAllProducts(data.data);
      }
    } catch {
      console.error('Failed to fetch products for flash sale add');
    } finally {
      setFlashAllLoading(false);
    }
  }, [flashSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFlashSearch(flashSearchInput);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [flashSearchInput]);

  useEffect(() => {
    if (activeTab === 'Flash Sale') {
      fetchFlashProducts();
      fetchFlashAllProducts();
      // Fetch flash sale end time
      (async () => {
        try {
          const res = await fetch(`${API_URL}/settings/flash_sale_end_time`);
          const data = await res.json();
          if (data.success && data.data?.endTime) {
            const iso = data.data.endTime;
            setFlashEndTime(iso);
            // Format to datetime-local input value (YYYY-MM-DDTHH:mm)
            const d = new Date(iso);
            const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);
            setFlashEndTimeInput(local);
          }
        } catch {
          // ignore
        }
      })();
    }
  }, [activeTab, flashSearch, fetchFlashProducts, fetchFlashAllProducts]);

  const handleSaveFlashEndTime = async () => {
    if (!flashEndTimeInput) return;
    setFlashEndTimeSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const endTimeISO = new Date(flashEndTimeInput).toISOString();
      const res = await fetch(`${API_URL}/settings/flash_sale_end_time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ value: { endTime: endTimeISO } }),
      });
      const data = await res.json();
      if (data.success) {
        setFlashEndTime(endTimeISO);
        setFlashMsg({ text: 'Đã cập nhật thời gian kết thúc Flash Sale', type: 'success' });
        setTimeout(() => setFlashMsg(null), 3000);
      } else {
        setFlashMsg({ text: data.message || 'Lưu thất bại', type: 'error' });
        setTimeout(() => setFlashMsg(null), 3000);
      }
    } catch {
      setFlashMsg({ text: 'Lỗi kết nối máy chủ', type: 'error' });
      setTimeout(() => setFlashMsg(null), 3000);
    } finally {
      setFlashEndTimeSaving(false);
    }
  };

  const fetchFeedbacks = useCallback(async () => {
    try {
      setFeedbackLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const res = await fetch(`${API_URL}/feedbacks`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch feedbacks', e);
    } finally {
      setFeedbackLoading(false);
    }
  }, []);

  const handleDeleteFeedback = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aristino_admin_token') : null;
      const res = await fetch(`${API_URL}/feedbacks/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ text: 'Đã xóa phản hồi thành công.', type: 'success' });
        setTimeout(() => setFeedbackMsg(null), 3000);
        fetchFeedbacks();
      } else {
        setFeedbackMsg({ text: data.message || 'Xóa phản hồi thất bại.', type: 'error' });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    } catch (e) {
      console.error('Failed to delete feedback', e);
      setFeedbackMsg({ text: 'Lỗi hệ thống khi xóa phản hồi.', type: 'error' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      setFeedbackToDelete(null);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setFeedbackSearch(feedbackSearchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [feedbackSearchInput]);

  useEffect(() => {
    if (activeTab === 'Khách hàng') {
      fetchFeedbacks();
    }
  }, [activeTab, fetchFeedbacks]);

  const toggleFlashSale = async (product: DashboardProduct, status: boolean) => {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFlashSale: status }),
      });
      const data = await res.json();
      if (data.success) {
        setFlashMsg({
          text: status ? `Đã thêm "${product.title}" vào Flash Sale` : `Đã gỡ "${product.title}" khỏi Flash Sale`,
          type: 'success'
        });
        setTimeout(() => setFlashMsg(null), 3000);
        fetchFlashProducts();
        fetchFlashAllProducts();
      }
    } catch {
      setFlashMsg({ text: 'Lỗi kết nối máy chủ', type: 'error' });
    }
  };

  const handleBulkAdd = async () => {
    if (selectedSearchIds.length === 0) return;
    try {
      setBulkLoading(true);
      await Promise.all(
        selectedSearchIds.map((id) =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFlashSale: true }),
          })
        )
      );
      setFlashMsg({
        text: `Đã thêm thành công ${selectedSearchIds.length} sản phẩm vào Flash Sale`,
        type: 'success',
      });
      setTimeout(() => setFlashMsg(null), 3000);
      setSelectedSearchIds([]);
      fetchFlashProducts();
      fetchFlashAllProducts();
    } catch {
      setFlashMsg({ text: 'Lỗi khi thêm hàng loạt', type: 'error' });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkRemove = async () => {
    if (selectedActiveIds.length === 0) return;
    try {
      setBulkLoading(true);
      await Promise.all(
        selectedActiveIds.map((id) =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFlashSale: false }),
          })
        )
      );
      setFlashMsg({
        text: `Đã gỡ thành công ${selectedActiveIds.length} sản phẩm khỏi Flash Sale`,
        type: 'success',
      });
      setTimeout(() => setFlashMsg(null), 3000);
      setSelectedActiveIds([]);
      fetchFlashProducts();
      fetchFlashAllProducts();
    } catch {
      setFlashMsg({ text: 'Lỗi khi gỡ hàng loạt', type: 'error' });
    } finally {
      setBulkLoading(false);
    }
  };

  const fetchLookbookProducts = useCallback(async () => {
    try {
      setLookbookLoading(true);
      const res = await fetch(`${API_URL}/products?isLookbook=true&limit=100`);
      const data = await res.json();
      if (data.success) {
        setLookbookProducts(data.data);
      }
    } catch {
      console.error('Failed to fetch lookbook products');
    } finally {
      setLookbookLoading(false);
    }
  }, []);

  const fetchLookbookAllProducts = useCallback(async () => {
    try {
      setLookbookAllLoading(true);
      const query = new URLSearchParams({ limit: '100' });
      if (lookbookSearch.trim()) {
        query.append('search', lookbookSearch.trim());
      }
      const res = await fetch(`${API_URL}/products?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLookbookAllProducts(data.data);
      }
    } catch {
      console.error('Failed to fetch products for lookbook add');
    } finally {
      setLookbookAllLoading(false);
    }
  }, [lookbookSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setLookbookSearch(lookbookSearchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [lookbookSearchInput]);

  const fetchLookbookInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/settings/lookbook_info`);
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.title) setLookbookTitleInput(data.data.title);
        if (data.data.description) setLookbookDescInput(data.data.description);
      }
    } catch {
      console.error('Failed to fetch lookbook settings');
    }
  }, []);

  const saveLookbookInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/settings/lookbook_info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: {
            title: lookbookTitleInput,
            description: lookbookDescInput,
          }
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLookbookMsg({ text: 'Lưu thông tin Lookbook thành công!', type: 'success' });
        setTimeout(() => setLookbookMsg(null), 3000);
      } else {
        setLookbookMsg({ text: 'Lưu thông tin Lookbook thất bại!', type: 'error' });
        setTimeout(() => setLookbookMsg(null), 3000);
      }
    } catch {
      setLookbookMsg({ text: 'Lỗi kết nối máy chủ!', type: 'error' });
      setTimeout(() => setLookbookMsg(null), 3000);
    }
  };

  useEffect(() => {
    if (activeTab === 'Lookbook') {
      fetchLookbookProducts();
      fetchLookbookAllProducts();
      fetchLookbookInfo();
    }
  }, [activeTab, lookbookSearch, fetchLookbookProducts, fetchLookbookAllProducts, fetchLookbookInfo]);

  const toggleLookbook = async (product: DashboardProduct, status: boolean) => {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLookbook: status }),
      });
      const data = await res.json();
      if (data.success) {
        setLookbookMsg({
          text: status ? `Đã thêm "${product.title}" vào Lookbook` : `Đã gỡ "${product.title}" khỏi Lookbook`,
          type: 'success'
        });
        setTimeout(() => setLookbookMsg(null), 3000);
        fetchLookbookProducts();
        fetchLookbookAllProducts();
      }
    } catch {
      setLookbookMsg({ text: 'Lỗi kết nối máy chủ', type: 'error' });
    }
  };

  const updateLookbookLabel = async (product: DashboardProduct, label: string) => {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lookbookLabel: label }),
      });
      const data = await res.json();
      if (data.success) {
        setLookbookMsg({
          text: `Đã cập nhật tiêu đề cho "${product.title}" thành "${label}"`,
          type: 'success'
        });
        setTimeout(() => setLookbookMsg(null), 3000);
        fetchLookbookProducts();
      }
    } catch {
      setLookbookMsg({ text: 'Lỗi khi cập nhật nhãn', type: 'error' });
    }
  };

  const handleLookbookBulkAdd = async () => {
    if (selectedLookbookSearchIds.length === 0) return;
    try {
      setLookbookBulkLoading(true);
      await Promise.all(
        selectedLookbookSearchIds.map((id) =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isLookbook: true }),
          })
        )
      );
      setLookbookMsg({
        text: `Đã thêm thành công ${selectedLookbookSearchIds.length} sản phẩm vào Lookbook`,
        type: 'success',
      });
      setTimeout(() => setLookbookMsg(null), 3000);
      setSelectedLookbookSearchIds([]);
      fetchLookbookProducts();
      fetchLookbookAllProducts();
    } catch {
      setLookbookMsg({ text: 'Lỗi khi thêm hàng loạt', type: 'error' });
    } finally {
      setLookbookBulkLoading(false);
    }
  };

  const handleLookbookBulkRemove = async () => {
    if (selectedLookbookActiveIds.length === 0) return;
    try {
      setLookbookBulkLoading(true);
      await Promise.all(
        selectedLookbookActiveIds.map((id) =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isLookbook: false }),
          })
        )
      );
      setLookbookMsg({
        text: `Đã gỡ thành công ${selectedLookbookActiveIds.length} sản phẩm khỏi Lookbook`,
        type: 'success',
      });
      setTimeout(() => setLookbookMsg(null), 3000);
      setSelectedLookbookActiveIds([]);
      fetchLookbookProducts();
      fetchLookbookAllProducts();
    } catch {
      setLookbookMsg({ text: 'Lỗi khi gỡ hàng loạt', type: 'error' });
    } finally {
      setLookbookBulkLoading(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setProdLoading(true);
      // Create a delay promise to ensure loading is visible for ~1 second
      const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));

      const query = new URLSearchParams({
        page: prodPage.toString(),
        limit: '20',
      });
      if (prodSearch.trim()) {
        query.append('search', prodSearch.trim());
      }

      const [res] = await Promise.all([
        fetch(`${API_URL}/products?${query.toString()}`),
        delayPromise // Wait at least 1s
      ]);

      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setProdTotalPages(data.pagination.totalPages || 1);
        setProdTotal(data.pagination.total || 0);
      }
    } catch {
      console.error('Failed to fetch products');
    } finally {
      setProdLoading(false);
    }
  }, [prodPage, prodSearch]);

  useEffect(() => {
    if (activeTab === 'Sản phẩm') {
      fetchProducts();
    }
    if (activeTab === 'Tổng quan') {
      fetchOrders();
      fetchProducts();
      fetchFeedbacks();
    }
  }, [activeTab, prodPage, fetchProducts, fetchOrders, fetchFeedbacks]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese accents
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // collapse duplicate hyphens
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('aristino_admin');
    const adminToken = localStorage.getItem('aristino_admin_token');

    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdmin(JSON.parse(adminSession));
    } catch (e) {
      console.error('Failed to parse admin session', e);
      router.push('/admin/login');
      return;
    }

    const verifySession = async () => {
      if (!adminToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
          credentials: 'include',
        });
        if (!res.ok) {
          // DB session was deleted or revoked! Force logout and redirect.
          localStorage.removeItem('aristino_admin');
          localStorage.removeItem('aristino_admin_token');
          router.push('/admin/login');
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    };

    // Immediate check on mount
    verifySession();

    // 5-second polling interval to detect database session deletion in real-time
    const pollInterval = setInterval(verifySession, 5000);

    // Re-verify whenever user switches focus back to this browser window
    window.addEventListener('focus', verifySession);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', verifySession);
    };
  }, [router]);

  const handleTabSelect = async (tabLabel: string) => {
    const adminToken = localStorage.getItem('aristino_admin_token');
    if (adminToken) {
      try {
        const res = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${adminToken}` },
          credentials: 'include',
        });
        if (!res.ok) {
          // Session deleted in DB! Block tab switch and kick out
          localStorage.removeItem('aristino_admin');
          localStorage.removeItem('aristino_admin_token');
          router.push('/admin/login');
          return;
        }
      } catch (e) {
        console.error('Tab session verification failed:', e);
      }
    }
    setActiveTab(tabLabel);
  };

  const handleSignOut = async () => {
    const adminToken = localStorage.getItem('aristino_admin_token');
    try {
      if (adminToken) {
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          credentials: 'include',
        });
      }
    } catch (e) {
      console.error('Logout API call failed:', e);
    } finally {
      localStorage.removeItem('aristino_admin');
      localStorage.removeItem('aristino_admin_token');
      router.push('/admin/login');
    }
  };

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen bg-brand-offwhite flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-navy" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 select-none font-sans flex flex-col md:flex-row">

      {/* 1. Left Side Admin Navigation Bar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        admin={admin}
        onSignOut={handleSignOut}
      />

      {/* 2. Right Side Admin Content */}
      <main className="flex-grow p-6 sm:p-10">

        {/* Admin Dashboard Navbar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-neutral-200 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#8B6E4A] tracking-widest uppercase block mb-1">
              ARISTINO LUXURY CONTROL CENTER
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-widest uppercase text-brand-navy flex items-center gap-3">
              {activeTab}
              <span className="text-xs font-sans font-semibold text-neutral-400 normal-case tracking-normal">
                ({getTabLabelInEnglish(activeTab)})
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-brand-navy hover:text-brand-gold bg-white border border-neutral-300 hover:border-brand-gold px-3.5 py-2 rounded shadow-sm transition-all uppercase tracking-wider"
            >
              <span>Xem cửa hàng</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>

            <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3.5 py-2 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Hệ thống: Trực tuyến
            </span>
          </div>
        </div>

        {activeTab === 'Tổng quan' && (
          <OverviewTab
            metrics={orderMetrics}
            recentOrders={orders}
            onTabSelect={handleTabSelect}
            onOpenProductModal={() => handleOpenProdModal()}
          />
        )}

        {/* Order Management Tab Panel */}
        {activeTab === 'Đơn hàng' && (
          <OrdersTab
            orders={orders}
            orderLoading={orderLoading}
            orderSearchInput={orderSearchInput}
            onOrderSearchInputChange={setOrderSearchInput}
            orderStatusFilter={orderStatusFilter}
            onOrderStatusFilterChange={(st) => {
              setOrderStatusFilter(st);
              setOrderPage(1);
            }}
            orderPage={orderPage}
            orderTotalPages={orderTotalPages}
            orderTotalCount={orderTotalCount}
            onPageChange={setOrderPage}
            onViewOrder={(ord) => {
              setSelectedOrder(ord);
              setShowOrderDetailModal(true);
            }}
            onUpdateStatus={(id, st) => handleUpdateOrderStatus(id, st)}
            onDeleteOrderClick={(ord) => setOrderToDelete(ord)}
            updatingId={orderUpdatingId}
            msg={orderMsg}
          />
        )}

            {/* Modal Order Details */}
            {showOrderDetailModal && selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg border border-neutral-200 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <div>
                      <span className="text-[10px] font-bold text-[#8B6E4A] uppercase tracking-wider block">Chi tiết Đơn hàng</span>
                      <h3 className="font-serif text-lg font-bold text-brand-navy uppercase tracking-wider">
                        {selectedOrder.orderNumber}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowOrderDetailModal(false)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700">
                    {/* Customer Info Card */}
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Thông tin Khách hàng</span>
                        <p className="font-bold text-sm text-neutral-800">{selectedOrder.customerName}</p>
                        <p className="text-neutral-600 mt-0.5">{selectedOrder.customerEmail}</p>
                        <p className="text-neutral-600 font-mono mt-0.5">{selectedOrder.phone || 'Chưa cung cấp SĐT'}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">Giao hàng &amp; Thanh toán</span>
                        <p className="text-neutral-800 font-semibold">{selectedOrder.shippingAddress || 'Nhận tại cửa hàng'}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            {selectedOrder.paymentMethod || 'COD'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div>
                      <h4 className="font-serif text-sm font-bold text-brand-navy uppercase tracking-wider mb-3">
                        Danh sách sản phẩm trong đơn ({selectedOrder.items.length})
                      </h4>
                      <div className="border border-neutral-200 rounded overflow-hidden">
                        <table className="min-w-full divide-y divide-neutral-200 text-left">
                          <thead className="bg-neutral-50 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                            <tr>
                              <th className="px-4 py-2.5">Sản phẩm</th>
                              <th className="px-4 py-2.5">Màu &amp; Size</th>
                              <th className="px-4 py-2.5 text-right">Đơn giá</th>
                              <th className="px-4 py-2.5 text-center">SL</th>
                              <th className="px-4 py-2.5 text-right">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {selectedOrder.items.map((item, i) => (
                              <tr key={i} className="hover:bg-neutral-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={item.imageUrl || '/images/shirt-white.png'}
                                      alt={item.name}
                                      className="w-10 h-12 object-cover rounded border border-neutral-200 flex-shrink-0"
                                    />
                                    <span className="font-bold text-neutral-800">{item.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-neutral-600">
                                  <span>{item.color || 'Default'}</span>
                                  <span className="text-neutral-400 mx-1">|</span>
                                  <span className="font-bold text-neutral-800">{item.size || 'M'}</span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono font-semibold">{formatPrice(item.price)}</td>
                                <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-brand-navy">
                                  {formatPrice(item.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Order Financial Summary */}
                    <div className="border-t border-neutral-200 pt-4 flex flex-col items-end space-y-1 text-xs">
                      <div className="flex justify-between w-64 text-neutral-600">
                        <span>Tạm tính:</span>
                        <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between w-64 text-neutral-600">
                        <span>Phí vận chuyển:</span>
                        <span className="font-mono">{formatPrice(selectedOrder.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between w-64 pt-2 border-t border-neutral-200 text-sm font-bold text-brand-navy">
                        <span>TỔNG THÀNH TIỀN:</span>
                        <span className="font-mono">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Order Notes */}
                    {selectedOrder.notes && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs">
                        <strong>Ghi chú đơn hàng:</strong> {selectedOrder.notes}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-500 uppercase">Cập nhật trạng thái:</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => setOrderToEditStatus({ order: selectedOrder, newStatus: e.target.value })}
                        className="bg-white border border-neutral-300 text-neutral-800 text-xs font-bold uppercase rounded px-2.5 py-1.5 focus:outline-none"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setShowOrderDetailModal(false)}
                      className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy px-5 py-2 rounded text-xs font-bold tracking-wider uppercase transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}

        {activeTab === 'Cài đặt' && (
          <div className="space-y-8">
            {/* Status Message */}
            {sliderMsg && (
              <div className={`p-3 rounded text-sm font-semibold ${sliderMsg.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {sliderMsg.text}
              </div>
            )}

            {/* Current Slider Images */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Ảnh Slider Trang Chủ
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">Những ảnh đang hiển thị trên slider lớn ở đầu trang chủ</p>
                </div>
                <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded px-2.5 py-1">
                  {sliders.length} ảnh
                </span>
              </div>

              <div className="p-6">
                {sliderLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : sliders.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-semibold">Chưa có ảnh slider nào</p>
                    <p className="text-xs mt-1">Tải ảnh từ máy tính của bạn lên ở khu vực bên dưới</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sliders.map((slider, idx) => (
                      <div key={slider._id} className="group relative rounded-lg overflow-hidden border-2 border-brand-navy/20 shadow-sm aspect-[16/9]">
                        <Image
                          src={`http://localhost:8000${slider.imageUrl}`}
                          alt={slider.originalName || `Slider ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          unoptimized={true}
                          className="object-cover"
                        />
                        {/* Order badge */}
                        <span className="absolute top-2 left-2 bg-brand-navy text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                          {idx + 1}
                        </span>
                        {/* Delete button */}
                        <button
                          onClick={() => setSliderToDelete(slider)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Xóa"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload from computer */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                  Tải ảnh từ máy tính
                </h2>
              </div>
              <div className="p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    setUploading(true);
                    setSliderMsg(null);
                    try {
                      const formData = new FormData();
                      for (let i = 0; i < files.length; i++) {
                        formData.append('images', files[i]);
                      }
                      const res = await fetch(`${API_URL}/sliders/upload`, {
                        method: 'POST',
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.success && Array.isArray(data.data)) {
                        setSliders(prev => [...prev, ...data.data]);
                        setSliderMsg({ text: `Đã tải lên thành công ${files.length} ảnh!`, type: 'success' });
                        setTimeout(() => setSliderMsg(null), 3000);
                      } else {
                        setSliderMsg({ text: data.message || 'Upload thất bại', type: 'error' });
                      }
                    } catch {
                      setSliderMsg({ text: 'Lỗi kết nối server', type: 'error' });
                    } finally {
                      setUploading(false);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-neutral-300 hover:border-brand-navy rounded-lg py-10 flex flex-col items-center justify-center transition-colors group cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <svg className="animate-spin h-8 w-8 text-brand-navy mb-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-neutral-400 group-hover:text-brand-navy transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )}
                  <span className="text-sm font-bold text-neutral-600 group-hover:text-brand-navy transition-colors">
                    {uploading ? 'Đang tải lên...' : 'Click để chọn ảnh từ máy tính'}
                  </span>
                  <span className="text-xs text-neutral-400 mt-1">JPG, PNG, WebP, GIF — tối đa 5MB</span>
                </button>
              </div>
            </div>

            {/* Homepage Video Settings */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                  Cấu hình Video Trang Chủ
                </h2>
                <p className="text-sm text-neutral-500 mt-1">Thay thế video mẫu ở trang chủ bằng liên kết YouTube, TikTok hoặc link MP4</p>
              </div>

              <div className="p-6 space-y-4">
                {videoMsg && (
                  <div className={`p-3 rounded text-sm font-semibold ${videoMsg.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {videoMsg.text}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="video-url" className="text-xs font-bold text-neutral-700 uppercase">
                    Liên kết Video
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="video-url"
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... hoặc https://www.tiktok.com/@..."
                      className="flex-grow bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none placeholder-neutral-300 transition-colors"
                      disabled={videoLoading}
                    />
                    <button
                      onClick={async () => {
                        setVideoLoading(true);
                        setVideoMsg(null);
                        try {
                          const res = await fetch(`${API_URL}/settings/homepage_video`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ value: { url: videoUrl } }),
                          });
                          const data = await res.json();
                          if (data.success && data.data) {
                            setVideoType(data.data.type);
                            setVideoEmbedUrl(data.data.embedUrl);
                            setVideoMsg({ text: 'Đã lưu cấu hình video thành công!', type: 'success' });
                            setTimeout(() => setVideoMsg(null), 3000);
                          } else {
                            setVideoMsg({ text: data.message || 'Lưu thất bại', type: 'error' });
                          }
                        } catch {
                          setVideoMsg({ text: 'Lỗi kết nối tới máy chủ', type: 'error' });
                        } finally {
                          setVideoLoading(false);
                        }
                      }}
                      disabled={videoLoading}
                      className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy px-6 py-2.5 rounded text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center min-h-[38px] disabled:opacity-50"
                    >
                      {videoLoading ? (
                        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        'Lưu'
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Hỗ trợ các định dạng YouTube (video thường, shorts), TikTok (video chi tiết), hoặc link trực tiếp file video (.mp4)
                  </p>
                </div>

                {videoEmbedUrl && (
                  <div className="pt-4 border-t border-neutral-100">
                    <span className="text-xs font-bold text-neutral-700 uppercase block mb-2">Xem trước cấu hình</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-neutral-500">
                        Loại nhận diện: <strong className="uppercase text-brand-navy">{videoType}</strong>
                      </span>
                    </div>

                    <div className="mt-3 relative w-full rounded-lg overflow-hidden bg-black aspect-video max-w-lg border border-neutral-200">
                      {videoType === 'youtube' || videoType === 'tiktok' ? (
                        <iframe
                          src={videoEmbedUrl}
                          className="w-full h-full"
                          allowFullScreen
                          allow="autoplay; encrypted-media; picture-in-picture"
                        />
                      ) : (
                        <video
                          src={videoEmbedUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Homepage 2 Large Images Banners Management Card */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Cấu hình Slide 2 Ảnh Lớn Trang Chủ
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Quản lý các Banner lớn hiển thị ở Slide 2 cột trang chủ (Hình ảnh, Nhãn chữ &amp; Liên kết)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenBannerModal()}
                    className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm Banner Mới
                  </button>
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded px-2.5 py-1">
                    {homepageBanners.length} banner
                  </span>
                </div>
              </div>

              <div className="p-6">
                {bannerMsg && (
                  <div className={`p-3 rounded text-sm font-semibold mb-4 ${bannerMsg.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {bannerMsg.text}
                  </div>
                )}

                {bannerLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : homepageBanners.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400">
                    <p className="text-sm font-semibold">Chưa có banner nào.</p>
                    <p className="text-xs mt-1">Bấm nút &quot;Thêm Banner Mới&quot; để khởi tạo banner đầu tiên.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {homepageBanners.map((banner, idx) => (
                      <div key={idx} className="border border-neutral-200 rounded-lg overflow-hidden flex flex-col sm:flex-row bg-white hover:shadow-md transition-shadow">
                        <div className="relative w-full sm:w-44 aspect-[4/5] sm:aspect-auto flex-shrink-0 bg-neutral-100 min-h-[160px]">
                          <img
                            src={banner.src}
                            alt={banner.alt || banner.label}
                            className="w-full h-full object-cover object-top"
                          />
                          <span className="absolute top-2 left-2 bg-brand-navy text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                            {idx + 1}
                          </span>
                        </div>

                        <div className="p-4 flex flex-col justify-between flex-grow">
                          <div>
                            <span className="text-[10px] font-bold text-[#8B6E4A] uppercase tracking-wider block mb-1">
                              Nhãn hiển thị
                            </span>
                            <h3 className="font-sans text-base font-bold text-brand-navy uppercase tracking-wider">
                              {banner.label}
                            </h3>
                            <div className="mt-3 space-y-1 text-xs">
                              <span className="text-neutral-400 block font-semibold uppercase text-[10px]">Liên kết click:</span>
                              <p className="text-neutral-700 font-mono text-[11px] truncate bg-neutral-50 p-1.5 rounded border border-neutral-200">
                                {banner.href}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-1">
                              <button
                                disabled={idx === 0}
                                onClick={() => moveBanner(idx, 'up')}
                                className="p-1.5 rounded border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-600"
                                title="Trượt lên trước"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                disabled={idx === homepageBanners.length - 1}
                                onClick={() => moveBanner(idx, 'down')}
                                className="p-1.5 rounded border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-600"
                                title="Trượt xuống sau"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenBannerModal(banner, idx)}
                                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded text-xs tracking-wider uppercase transition-colors"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => deleteBanner(idx)}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded text-xs tracking-wider uppercase transition-colors"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Create/Edit Homepage Banner */}
            {showBannerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg border border-neutral-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <h3 className="font-serif text-base font-bold text-brand-charcoal uppercase tracking-wider">
                      {editingBannerIndex !== null ? 'Chỉnh sửa Banner 2 Ảnh Lớn' : 'Thêm Banner 2 Ảnh Lớn Mới'}
                    </h3>
                    <button
                      onClick={() => setShowBannerModal(false)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveBannerModal} className="p-6 space-y-4 text-xs font-bold text-neutral-700 uppercase">
                    {/* Image URL & Upload button */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banner-src">Đường dẫn Hình ảnh (URL) *</label>
                      <div className="flex gap-2">
                        <input
                          id="banner-src"
                          type="text"
                          required
                          value={bannerForm.src}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, src: e.target.value }))}
                          placeholder="https://... hoặc /uploads/..."
                          className="flex-grow bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                        <input
                          ref={bannerFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setBannerUploading(true);
                            try {
                              const formData = new FormData();
                              formData.append('images', file);
                              const res = await fetch(`${API_URL}/sliders/upload`, {
                                method: 'POST',
                                body: formData,
                              });
                              const data = await res.json();
                              if (data.success && data.data?.[0]?.imageUrl) {
                                const fullUrl = `http://localhost:8000${data.data[0].imageUrl}`;
                                setBannerForm(prev => ({ ...prev, src: fullUrl }));
                              }
                            } catch {
                              alert('Lỗi tải ảnh lên');
                            } finally {
                              setBannerUploading(false);
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={bannerUploading}
                          onClick={() => bannerFileInputRef.current?.click()}
                          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 px-3 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap"
                        >
                          {bannerUploading ? 'Đang tải...' : 'Tải từ máy'}
                        </button>
                      </div>
                    </div>

                    {/* Preview Image if provided */}
                    {bannerForm.src && (
                      <div className="relative w-full aspect-[16/7] rounded overflow-hidden border border-neutral-200 bg-neutral-100">
                        <img src={bannerForm.src} alt="Preview" className="w-full h-full object-cover object-top" />
                      </div>
                    )}

                    {/* Banner Label */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banner-label">Nhãn chữ hiển thị (Label) *</label>
                      <input
                        id="banner-label"
                        type="text"
                        required
                        value={bannerForm.label}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Ví dụ: NEW ARRIVALS, LUXURY SUITS..."
                        className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                      />
                    </div>

                    {/* Banner Href link */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="banner-href">Đường dẫn liên kết khi bấm (Link URL)</label>
                      <input
                        id="banner-href"
                        type="text"
                        value={bannerForm.href}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, href: e.target.value }))}
                        placeholder="Ví dụ: /collections/new-arrivals"
                        className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50 -mx-6 -mb-6 p-6">
                      <button
                        type="button"
                        onClick={() => setShowBannerModal(false)}
                        className="border border-neutral-300 hover:border-neutral-500 text-neutral-700 px-5 py-2 rounded text-xs font-bold tracking-wider transition-colors bg-white uppercase"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy px-5 py-2 rounded text-xs font-bold tracking-wider transition-colors uppercase"
                      >
                        {editingBannerIndex !== null ? 'Lưu thay đổi' : 'Thêm Banner'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'Sản phẩm' && (
          <ProductsTab
            products={products}
            prodLoading={prodLoading}
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            prodPage={prodPage}
            prodTotalPages={prodTotalPages}
            prodTotal={prodTotal}
            onPageChange={setProdPage}
            onOpenProductModal={(prod) => {
              if (prod) {
                setEditingProduct(prod);
                const numPrice = parseNumericPrice(prod.price);
                const origPriceNum = prod.originalPrice ? parseNumericPrice(prod.originalPrice) : numPrice;
                setProdForm({
                  brand: prod.brand || '',
                  title: prod.title || '',
                  price: numPrice > 0 ? numPrice.toString() : '',
                  originalPrice: origPriceNum > 0 ? origPriceNum.toString() : '',
                  discount: prod.discount || '',
                  imageUrl: prod.imageUrl || (prod.images && prod.images[0]) || '',
                  images: (prod.images || []).join('\n'),
                  description: prod.description || '',
                  theme: prod.theme || '',
                  colors: (prod.colors || []).join(', '),
                  slug: prod.slug || '',
                  tagLeft: prod.tagLeft || '',
                  tagRight: prod.tagRight || ''
                });
              } else {
                setEditingProduct(null);
                setProdForm({
                  brand: '',
                  title: '',
                  price: '',
                  originalPrice: '',
                  discount: '',
                  imageUrl: '',
                  images: '',
                  description: '',
                  theme: '',
                  colors: '',
                  slug: '',
                  tagLeft: '',
                  tagRight: ''
                });
              }
              setShowProdModal(true);
            }}
            onDeleteProductClick={async (prod) => {
              if (!confirm(`Xóa sản phẩm "${prod.title}"?`)) return;
              try {
                const res = await fetch(`${API_URL}/products/${prod._id}`, {
                  method: 'DELETE',
                });
                const data = await res.json();
                if (data.success) {
                  setProdMsg({ text: 'Xóa sản phẩm thành công!', type: 'success' });
                  setTimeout(() => setProdMsg(null), 3000);
                  fetchProducts();
                }
              } catch {
                setProdMsg({ text: 'Lỗi khi xóa sản phẩm', type: 'error' });
              }
            }}
            msg={prodMsg}
          />
        )}

            {/* Product Dialog Modal */}
            {showProdModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg border border-neutral-200 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                  <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <h3 className="font-serif text-lg font-bold text-brand-charcoal uppercase tracking-wider">
                      {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    <button
                      onClick={() => setShowProdModal(false)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setProdLoading(true);
                      try {
                        const payload = {
                          brand: prodForm.brand,
                          title: prodForm.title,
                          price: parseNumericPrice(prodForm.price),
                          originalPrice: prodForm.originalPrice ? parseNumericPrice(prodForm.originalPrice) : undefined,
                          discount: prodForm.discount || undefined,
                          imageUrl: editingProduct?.imageUrl || (editingProduct?.images && editingProduct.images[0]) || '/images/shirt-white.png',
                          images: editingProduct?.images || [],
                          description: prodForm.description || undefined,
                          theme: prodForm.theme || undefined,
                          colors: editingProduct?.colors || [],
                          slug: editingProduct ? (editingProduct.slug || generateSlug(prodForm.title)) : generateSlug(prodForm.title),
                        };

                        const url = editingProduct
                          ? `${API_URL}/products/${editingProduct._id}`
                          : `${API_URL}/products`;
                        const method = editingProduct ? 'PUT' : 'POST';

                        const res = await fetch(url, {
                          method,
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload),
                        });
                        const data = await res.json();

                        if (data.success) {
                          setProdMsg({
                            text: editingProduct ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!',
                            type: 'success'
                          });
                          setTimeout(() => setProdMsg(null), 3000);
                          setShowProdModal(false);
                          fetchProducts();
                        } else {
                          alert(data.message || 'Lưu thất bại');
                        }
                      } catch {
                        alert('Lỗi kết nối máy chủ');
                      } finally {
                        setProdLoading(false);
                      }
                    }}
                    className="p-6 space-y-4 text-xs font-bold text-neutral-700 uppercase"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="prod-title">Tên sản phẩm *</label>
                        <input
                          id="prod-title"
                          type="text"
                          required
                          value={prodForm.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setProdForm(prev => ({
                              ...prev,
                              title: newTitle,
                              slug: editingProduct ? prev.slug : generateSlug(newTitle)
                            }));
                          }}
                          className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                      </div>

                      {/* Brand */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="prod-brand">Thương hiệu *</label>
                        <input
                          id="prod-brand"
                          type="text"
                          required
                          value={prodForm.brand}
                          onChange={(e) => setProdForm(prev => ({ ...prev, brand: e.target.value }))}
                          className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                      </div>
                    </div>

                    {/* Theme */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="prod-theme">Chủ đề (Theme, ví dụ: monkey, polo)</label>
                      <input
                        id="prod-theme"
                        type="text"
                        value={prodForm.theme}
                        onChange={(e) => setProdForm(prev => ({ ...prev, theme: e.target.value }))}
                        className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Original Price */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="prod-orig-price">Giá gốc (USD)</label>
                        <input
                          id="prod-orig-price"
                          type="number"
                          step="0.01"
                          placeholder="Ví dụ: 100"
                          value={prodForm.originalPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            const origPriceNum = parseFloat(val.replace(/[^0-9.]/g, ''));
                            const discountNum = parseFloat((prodForm.discount || '').replace(/[^0-9.]/g, ''));
                            let newSellingPrice = prodForm.price;

                            if (!isNaN(origPriceNum) && origPriceNum > 0 && !isNaN(discountNum) && discountNum > 0) {
                              newSellingPrice = (origPriceNum * (1 - Math.min(100, discountNum) / 100)).toFixed(2);
                            } else if (!isNaN(origPriceNum) && origPriceNum > 0 && !prodForm.discount) {
                              newSellingPrice = val;
                            }

                            setProdForm(prev => ({
                              ...prev,
                              originalPrice: val,
                              price: newSellingPrice
                            }));
                          }}
                          className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                      </div>

                      {/* Discount Percentage */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="prod-discount">Phần trăm giảm (% hoặc e.g. 20%)</label>
                        <input
                          id="prod-discount"
                          type="text"
                          placeholder="Ví dụ: 20 hoặc 20%"
                          value={prodForm.discount}
                          onChange={(e) => {
                            const val = e.target.value;
                            const origPriceNum = parseFloat((prodForm.originalPrice || '').replace(/[^0-9.]/g, ''));
                            const discountNum = parseFloat(val.replace(/[^0-9.]/g, ''));
                            let newSellingPrice = prodForm.price;

                            if (!isNaN(origPriceNum) && origPriceNum > 0 && !isNaN(discountNum) && discountNum > 0) {
                              newSellingPrice = (origPriceNum * (1 - Math.min(100, discountNum) / 100)).toFixed(2);
                            }

                            setProdForm(prev => ({
                              ...prev,
                              discount: val,
                              price: newSellingPrice
                            }));
                          }}
                          className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                      </div>

                      {/* Selling Price */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="prod-price">Giá bán (USD) * (Tự tính)</label>
                        <input
                          id="prod-price"
                          type="number"
                          step="0.01"
                          required
                          value={prodForm.price}
                          onChange={(e) => setProdForm(prev => ({ ...prev, price: e.target.value }))}
                          className="bg-neutral-50 border border-brand-navy/30 text-brand-navy font-bold rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case"
                        />
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="prod-desc">Mô tả sản phẩm (Description)</label>
                      <textarea
                        id="prod-desc"
                        rows={3}
                        value={prodForm.description}
                        onChange={(e) => setProdForm(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                      />
                    </div>

                    <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50 -mx-6 -mb-6 p-6">
                      <button
                        type="button"
                        onClick={() => setShowProdModal(false)}
                        className="border border-neutral-300 hover:border-neutral-500 text-neutral-700 px-6 py-2.5 rounded text-xs font-bold tracking-wider transition-colors bg-white uppercase"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy px-6 py-2.5 rounded text-xs font-bold tracking-wider transition-colors uppercase"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

        {activeTab === 'Flash Sale' && (
          <div className="space-y-6">
            {flashMsg && (
              <div className={`p-3 rounded text-sm font-semibold ${flashMsg.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {flashMsg.text}
              </div>
            )}

            {/* Countdown Timer Configuration */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Cài đặt thời gian đếm ngược
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Chọn thời gian kết thúc Flash Sale — bộ đếm ngược trên trang chủ sẽ tự động đếm lùi đến thời điểm này.
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <label htmlFor="flash-end-time" className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Thời gian kết thúc
                    </label>
                    <input
                      id="flash-end-time"
                      type="datetime-local"
                      value={flashEndTimeInput}
                      onChange={(e) => setFlashEndTimeInput(e.target.value)}
                      className="w-full sm:w-72 px-3 py-2 border border-neutral-300 rounded text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSaveFlashEndTime}
                    disabled={flashEndTimeSaving || !flashEndTimeInput}
                    className="bg-brand-navy hover:bg-brand-navy/90 disabled:bg-neutral-300 text-white font-bold py-2 px-5 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                  >
                    {flashEndTimeSaving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Lưu thời gian
                      </>
                    )}
                  </button>
                </div>
                {flashEndTime && (
                  <p className="text-xs text-neutral-500 mt-3">
                    <span className="font-semibold">Đang áp dụng:</span>{' '}
                    {new Date(flashEndTime).toLocaleString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Part 1: Current Flash Sale Products */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Sản phẩm Flash Sale đang hoạt động
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">Các sản phẩm đang được hiển thị ở bảng Flash Sale trang chủ</p>
                </div>

                <div className="flex items-center gap-3">
                  {selectedActiveIds.length > 0 && (
                    <button
                      onClick={handleBulkRemove}
                      disabled={bulkLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 text-white font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                    >
                      {bulkLoading ? 'Đang gỡ...' : `Gỡ ${selectedActiveIds.length} đã chọn`}
                    </button>
                  )}
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded px-2.5 py-1">
                    {flashProducts.length} sản phẩm
                  </span>
                </div>
              </div>

              <div className="p-6">
                {flashLoading ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : flashProducts.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-sm">
                    Chưa có sản phẩm nào được thiết lập Flash Sale.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {flashProducts.map((product) => {
                      const isChecked = selectedActiveIds.includes(product._id);
                      return (
                        <div key={product._id} className="border border-neutral-200 rounded-lg p-3 relative flex flex-col justify-between hover:shadow-md transition-shadow">
                          {/* Selection Checkbox */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedActiveIds(prev => [...prev, product._id]);
                                } else {
                                  setSelectedActiveIds(prev => prev.filter(id => id !== product._id));
                                }
                              }}
                              className="w-4.5 h-4.5 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                            />
                          </div>

                          <div className="pl-6">
                            <div className="relative w-full aspect-square rounded overflow-hidden mb-2 bg-neutral-100">
                              <Image
                                src={product.imageUrl || (product.images && product.images[0]) || '/images/shirt-white.png'}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, 150px"
                                className="object-cover"
                              />
                            </div>
                            <h4 className="font-bold text-sm text-neutral-800 line-clamp-1">{product.title}</h4>
                            <p className="text-xs text-neutral-500">{product.brand}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-sm font-bold text-brand-navy">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => openFlashSaleModal(product)}
                              className="flex-1 bg-brand-navy/10 hover:bg-brand-navy hover:text-white text-brand-navy font-bold py-1.5 px-2 rounded text-[11px] tracking-wider uppercase transition-colors text-center"
                            >
                              Sửa giá
                            </button>
                            <button
                              onClick={() => toggleFlashSale(product, false)}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 px-2 rounded text-[11px] tracking-wider uppercase transition-colors text-center"
                            >
                              Gỡ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Part 2: Search & Add Products */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Thêm sản phẩm vào Flash Sale
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">Tìm kiếm sản phẩm bên dưới và bấm nút Cấu hình giá &amp; Thêm</p>
                </div>

                {selectedSearchIds.length > 0 && (
                  <button
                    onClick={handleBulkAdd}
                    disabled={bulkLoading}
                    className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy disabled:bg-neutral-300 font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                  >
                    {bulkLoading ? 'Đang thêm...' : `Thêm ${selectedSearchIds.length} đã chọn`}
                  </button>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Gõ từ khóa để tìm sản phẩm..."
                    value={flashSearchInput}
                    onChange={(e) => setFlashSearchInput(e.target.value)}
                    className="w-full bg-white border border-neutral-300 text-neutral-800 rounded px-4 py-2 pl-10 text-sm focus:border-brand-navy focus:outline-none placeholder-neutral-400 transition-colors"
                  />
                  <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {flashAllLoading ? (
                  <div className="flex justify-center py-6">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : flashAllProducts.length === 0 ? (
                  <div className="text-sm text-neutral-400 py-2">
                    Không tìm thấy sản phẩm phù hợp.
                  </div>
                ) : (
                  <div className="border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100">
                    {flashAllProducts.map((product) => {
                      const isAlreadyFlash = flashProducts.some(p => p._id === product._id);
                      const isChecked = selectedSearchIds.includes(product._id);
                      return (
                        <div key={product._id} className="flex items-center justify-between p-3 hover:bg-neutral-50 transition-colors">
                          <div className="flex items-center gap-3">
                            {/* Checkbox for selection (disabled if already added to flash sale) */}
                            <input
                              type="checkbox"
                              disabled={isAlreadyFlash}
                              checked={isChecked && !isAlreadyFlash}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSearchIds(prev => [...prev, product._id]);
                                } else {
                                  setSelectedSearchIds(prev => prev.filter(id => id !== product._id));
                                }
                              }}
                              className={`w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy ${isAlreadyFlash ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer bg-white'
                                }`}
                            />

                            <div className="relative w-10 h-10 rounded overflow-hidden border border-neutral-200 ml-1">
                              <Image
                                src={product.imageUrl || (product.images && product.images[0]) || '/images/shirt-white.png'}
                                alt={product.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-neutral-800 line-clamp-1">{product.title}</h5>
                              <p className="text-xs text-neutral-500">{product.brand} — {formatPrice(product.price)}</p>
                            </div>
                          </div>

                          <button
                            disabled={isAlreadyFlash}
                            onClick={() => openFlashSaleModal(product)}
                            className={`font-bold py-1.5 px-3 rounded text-[10px] tracking-wider uppercase transition-colors ${isAlreadyFlash
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                              : 'bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy'
                              }`}
                          >
                            {isAlreadyFlash ? 'Đang Flash Sale' : 'Cấu hình giá & Thêm'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Flash Sale Price Configuration Modal */}
            {flashModalProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                <div className="bg-white rounded-lg border border-neutral-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <h3 className="font-serif text-base font-bold text-brand-charcoal uppercase tracking-wider">
                      Cấu hình Giá Flash Sale
                    </h3>
                    <button
                      onClick={() => setFlashModalProduct(null)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveFlashSaleProduct} className="p-6 space-y-4 text-xs font-bold text-neutral-700 uppercase">
                    <div className="p-3 bg-neutral-50 rounded border border-neutral-200 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden border border-neutral-200 flex-shrink-0">
                        <Image
                          src={flashModalProduct.imageUrl || (flashModalProduct.images && flashModalProduct.images[0]) || '/images/shirt-white.png'}
                          alt={flashModalProduct.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-800 line-clamp-1">{flashModalProduct.title}</h4>
                        <p className="text-xs text-neutral-500 normal-case font-normal">{flashModalProduct.brand}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Original Price */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="flash-orig-price">Giá gốc (USD)</label>
                        <input
                          id="flash-orig-price"
                          type="number"
                          step="0.01"
                          required
                          value={flashForm.originalPrice}
                          onChange={(e) => {
                            const val = e.target.value;
                            const origNum = parseFloat(val.replace(/[^0-9.]/g, ''));
                            const discNum = parseFloat((flashForm.discount || '').replace(/[^0-9.]/g, ''));
                            let newSellingPrice = flashForm.price;

                            if (!isNaN(origNum) && origNum > 0 && !isNaN(discNum) && discNum > 0) {
                              newSellingPrice = (origNum * (1 - Math.min(100, discNum) / 100)).toFixed(2);
                            } else if (!isNaN(origNum) && origNum > 0 && !flashForm.discount) {
                              newSellingPrice = val;
                            }

                            setFlashForm(prev => ({
                              ...prev,
                              originalPrice: val,
                              price: newSellingPrice
                            }));
                          }}
                          className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                      </div>

                      {/* Discount Percentage */}
                      <div className="flex flex-col gap-1">
                        <label htmlFor="flash-discount">Giảm giá (% hoặc e.g. 20%)</label>
                        <input
                          id="flash-discount"
                          type="text"
                          placeholder="Ví dụ: 20 hoặc 20%"
                          value={flashForm.discount}
                          onChange={(e) => {
                            const val = e.target.value;
                            const origNum = parseFloat((flashForm.originalPrice || '').replace(/[^0-9.]/g, ''));
                            const discNum = parseFloat(val.replace(/[^0-9.]/g, ''));
                            let newSellingPrice = flashForm.price;

                            if (!isNaN(origNum) && origNum > 0 && !isNaN(discNum) && discNum > 0) {
                              newSellingPrice = (origNum * (1 - Math.min(100, discNum) / 100)).toFixed(2);
                            }

                            setFlashForm(prev => ({
                              ...prev,
                              discount: val,
                              price: newSellingPrice
                            }));
                          }}
                          className="bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case font-normal"
                        />
                      </div>
                    </div>

                    {/* Flash Sale Selling Price */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="flash-price">Giá Flash Sale bán ra (USD) * (Tự tính)</label>
                      <input
                        id="flash-price"
                        type="number"
                        step="0.01"
                        required
                        value={flashForm.price}
                        onChange={(e) => setFlashForm(prev => ({ ...prev, price: e.target.value }))}
                        className="bg-neutral-50 border border-brand-navy/30 text-brand-navy font-bold rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none normal-case"
                      />
                    </div>

                    <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50 -mx-6 -mb-6 p-6">
                      <button
                        type="button"
                        onClick={() => setFlashModalProduct(null)}
                        className="border border-neutral-300 hover:border-neutral-500 text-neutral-700 px-5 py-2 rounded text-xs font-bold tracking-wider transition-colors bg-white uppercase"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy px-5 py-2 rounded text-xs font-bold tracking-wider transition-colors uppercase"
                      >
                        Xác nhận &amp; Thêm Flash Sale
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Lookbook' && (
          <div className="space-y-6">
            {lookbookMsg && (
              <div className={`p-3 rounded text-sm font-semibold ${lookbookMsg.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {lookbookMsg.text}
              </div>
            )}

            {/* Lookbook Metadata Editor */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm p-6">
              <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal mb-4">
                Cấu hình Nội dung Lookbook
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                    Tiêu đề Lookbook
                  </label>
                  <input
                    type="text"
                    value={lookbookTitleInput}
                    onChange={(e) => setLookbookTitleInput(e.target.value)}
                    placeholder="Ví dụ: INHERIT THE LEGEND"
                    className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-sm text-neutral-800 focus:border-brand-navy focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5">
                    Mô tả Lookbook
                  </label>
                  <textarea
                    value={lookbookDescInput}
                    onChange={(e) => setLookbookDescInput(e.target.value)}
                    placeholder="Nhập mô tả/nội dung ở đây..."
                    className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-sm text-neutral-800 focus:border-brand-navy focus:outline-none transition-colors min-h-[100px] resize-y"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={saveLookbookInfo}
                    className="bg-brand-navy hover:bg-neutral-850 text-white font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>
            </div>

            {/* Part 1: Current Lookbook Products with Text/Label editing input */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Sản phẩm Lookbook đang hoạt động
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">Các sản phẩm đang hiển thị ở slide lookbook (trên & dưới) tại trang chủ. Bạn có thể thay đổi tiêu đề chữ hiển thị tương ứng ở slide dưới.</p>
                </div>

                <div className="flex items-center gap-3.5">
                  {lookbookProducts.length > 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={lookbookProducts.length > 0 && selectedLookbookActiveIds.length === lookbookProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLookbookActiveIds(lookbookProducts.map(p => p._id));
                          } else {
                            setSelectedLookbookActiveIds([]);
                          }
                        }}
                        className="w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                      />
                      Chọn tất cả
                    </label>
                  )}
                  {selectedLookbookActiveIds.length > 0 && (
                    <button
                      onClick={handleLookbookBulkRemove}
                      disabled={lookbookBulkLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 text-white font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                    >
                      {lookbookBulkLoading ? 'Đang gỡ...' : `Gỡ ${selectedLookbookActiveIds.length} đã chọn`}
                    </button>
                  )}
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded px-2.5 py-1">
                    {lookbookProducts.length} sản phẩm
                  </span>
                </div>
              </div>

              <div className="p-6">
                {lookbookLoading ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : lookbookProducts.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-sm">
                    Chưa có sản phẩm nào được chọn vào Lookbook.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {lookbookProducts.map((product) => {
                      const isChecked = selectedLookbookActiveIds.includes(product._id);
                      return (
                        <div key={product._id} className="border border-neutral-200 rounded-lg p-3 relative flex flex-col justify-between hover:shadow-md transition-shadow">
                          {/* Selection Checkbox */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLookbookActiveIds(prev => [...prev, product._id]);
                                } else {
                                  setSelectedLookbookActiveIds(prev => prev.filter(id => id !== product._id));
                                }
                              }}
                              className="w-4.5 h-4.5 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                            />
                          </div>

                          <div className="pl-6">
                            <div className="relative w-full aspect-[3/4] rounded overflow-hidden mb-2 bg-neutral-100">
                              <Image
                                src={product.imageUrl || (product.images && product.images[0]) || '/images/shirt-white.png'}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, 150px"
                                className="object-cover"
                              />
                            </div>
                            <h4 className="font-bold text-sm text-neutral-800 line-clamp-1">{product.title}</h4>
                            <p className="text-xs text-neutral-500">{product.brand}</p>
                            <div className="flex items-center gap-1.5 mt-1 mb-3">
                              <span className="text-sm font-bold text-brand-navy">{formatPrice(product.price)}</span>
                            </div>

                            {/* Title/Label text input */}
                            <div className="mt-2 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Tiêu đề slide dưới</label>
                              <input
                                type="text"
                                defaultValue={product.lookbookLabel || ''}
                                placeholder="Ví dụ: SUMMER COLLECTION"
                                onBlur={(e) => {
                                  if (e.target.value !== (product.lookbookLabel || '')) {
                                    updateLookbookLabel(product, e.target.value);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateLookbookLabel(product, (e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                className="w-full bg-neutral-50 border border-neutral-300 rounded px-2.5 py-1 text-xs text-neutral-800 focus:bg-white focus:border-brand-navy focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => toggleLookbook(product, false)}
                            className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold py-1.5 px-3 rounded text-xs tracking-wider uppercase transition-colors"
                          >
                            Gỡ khỏi Lookbook
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Part 2: Search & Add Products to Lookbook */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Thêm sản phẩm vào Lookbook
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">Tìm kiếm sản phẩm bên dưới và bấm nút Thêm</p>
                </div>

                <div className="flex items-center gap-3.5">
                  {lookbookAllProducts.length > 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={
                          lookbookAllProducts.length > 0 &&
                          lookbookAllProducts.filter(p => !lookbookProducts.some(lp => lp._id === p._id)).length > 0 &&
                          lookbookAllProducts
                            .filter(p => !lookbookProducts.some(lp => lp._id === p._id))
                            .every(p => selectedLookbookSearchIds.includes(p._id))
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            const unadded = lookbookAllProducts.filter(p => !lookbookProducts.some(lp => lp._id === p._id));
                            setSelectedLookbookSearchIds(unadded.map(p => p._id));
                          } else {
                            setSelectedLookbookSearchIds([]);
                          }
                        }}
                        className="w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                      />
                      Chọn tất cả
                    </label>
                  )}
                  {selectedLookbookSearchIds.length > 0 && (
                    <button
                      onClick={handleLookbookBulkAdd}
                      disabled={lookbookBulkLoading}
                      className="bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy disabled:bg-neutral-300 font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                    >
                      {lookbookBulkLoading ? 'Đang thêm...' : `Thêm ${selectedLookbookSearchIds.length} đã chọn`}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Gõ từ khóa để tìm sản phẩm..."
                    value={lookbookSearchInput}
                    onChange={(e) => setLookbookSearchInput(e.target.value)}
                    className="w-full bg-white border border-neutral-300 text-neutral-800 rounded px-4 py-2 pl-10 text-sm focus:border-brand-navy focus:outline-none placeholder-neutral-400 transition-colors"
                  />
                  <svg className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {lookbookAllLoading ? (
                  <div className="flex justify-center py-6">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : lookbookAllProducts.length === 0 ? (
                  <div className="text-sm text-neutral-400 py-2">
                    Không tìm thấy sản phẩm phù hợp.
                  </div>
                ) : (
                  <div className="border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100">
                    {lookbookAllProducts.map((product) => {
                      const isAlreadyInLookbook = lookbookProducts.some(p => p._id === product._id);
                      const isChecked = selectedLookbookSearchIds.includes(product._id);
                      return (
                        <div key={product._id} className="flex items-center justify-between p-3 hover:bg-neutral-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              disabled={isAlreadyInLookbook}
                              checked={isChecked && !isAlreadyInLookbook}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLookbookSearchIds(prev => [...prev, product._id]);
                                } else {
                                  setSelectedLookbookSearchIds(prev => prev.filter(id => id !== product._id));
                                }
                              }}
                              className={`w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy ${isAlreadyInLookbook ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer bg-white'
                                }`}
                            />

                            <div className="relative w-10 h-10 rounded overflow-hidden border border-neutral-200 ml-1">
                              <Image
                                src={product.imageUrl || (product.images && product.images[0]) || '/images/shirt-white.png'}
                                alt={product.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-neutral-800 line-clamp-1">{product.title}</h5>
                              <p className="text-xs text-neutral-500">{product.brand} — {formatPrice(product.price)}</p>
                            </div>
                          </div>

                          <button
                            disabled={isAlreadyInLookbook}
                            onClick={() => toggleLookbook(product, true)}
                            className={`font-bold py-1.5 px-3 rounded text-[10px] tracking-wider uppercase transition-colors ${isAlreadyInLookbook
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                              : 'bg-brand-navy hover:bg-[#C5A880] text-white hover:text-brand-navy'
                              }`}
                          >
                            {isAlreadyInLookbook ? 'Đang trong Lookbook' : 'Thêm vào Lookbook'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Sản phẩm gợi ý' && (
          <div className="space-y-6">
            {kolMsg && (
              <div className={`p-3 rounded text-sm font-semibold ${kolMsg.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {kolMsg.text}
              </div>
            )}

            {/* Part 1: Current Suggested Products */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Sản phẩm gợi ý đang hoạt động
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">Các sản phẩm hiện đang hiển thị ở hai thanh trượt bên dưới phần &quot;Things You Might Like&quot; tại trang chủ.</p>
                  
                  {/* Search input for currently active suggested products */}
                  <div className="mt-3 max-w-xs">
                    <input
                      type="text"
                      placeholder="Tìm trong danh sách hoạt động..."
                      value={activeSuggestedSearch}
                      onChange={(e) => setActiveSuggestedSearch(e.target.value)}
                      className="w-full bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-1.5 text-xs focus:border-brand-navy focus:outline-none placeholder-neutral-350 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  {kolProducts.length > 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={kolProducts.length > 0 && selectedKolActiveIds.length === kolProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedKolActiveIds(kolProducts.map(p => p._id));
                          } else {
                            setSelectedKolActiveIds([]);
                          }
                        }}
                        className="w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                      />
                      Chọn tất cả
                    </label>
                  )}
                  {selectedKolActiveIds.length > 0 && (
                    <button
                      onClick={handleKolBulkRemove}
                      disabled={kolBulkLoading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 text-white font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                    >
                      {kolBulkLoading ? 'Đang gỡ...' : `Gỡ ${selectedKolActiveIds.length} mục đã chọn`}
                    </button>
                  )}
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded px-2.5 py-1">
                    {kolProducts.length} sản phẩm
                  </span>
                </div>
              </div>

              <div className="p-6">
                {kolLoading ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : kolProducts.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-sm">
                    Chưa có sản phẩm nào được chọn.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {kolProducts
                      .filter((product) => {
                        const term = activeSuggestedSearch.toLowerCase().trim();
                        if (!term) return true;
                        return product.title.toLowerCase().includes(term) ||
                               product.brand.toLowerCase().includes(term);
                      })
                      .map((product) => {
                        const isChecked = selectedKolActiveIds.includes(product._id);
                        return (
                          <div key={product._id} className="border border-neutral-200 rounded-lg p-3 relative flex flex-col justify-between hover:shadow-md transition-shadow">
                            {/* Checkbox */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedKolActiveIds([...selectedKolActiveIds, product._id]);
                                  } else {
                                    setSelectedKolActiveIds(selectedKolActiveIds.filter(id => id !== product._id));
                                  }
                                }}
                                className="w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                              />
                            </div>

                            <div className="flex items-start gap-3 pl-6">
                              <img src={product.imageUrl} alt={product.title} className="w-12 h-16 object-cover rounded bg-neutral-100 flex-shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-neutral-800 truncate">{product.title}</h4>
                                <span className="text-[10px] text-neutral-500 block mt-0.5">{product.brand}</span>
                                <span className="text-xs font-bold text-brand-navy block mt-1">{formatPrice(product.price)}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
                              <button
                                onClick={() => toggleKolProduct(product, false)}
                                className="text-red-600 hover:text-red-700 text-[10px] font-bold tracking-wider uppercase transition-colors"
                              >
                                Gỡ sản phẩm
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Part 2: Product selection with checkboxes */}
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-grow">
                  <h2 className="font-serif text-base font-bold tracking-wider uppercase text-brand-charcoal">
                    Chọn sản phẩm hiển thị trong sliders
                  </h2>
                  <div className="mt-3 max-w-md">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm theo tên..."
                      value={kolSearchInput}
                      onChange={(e) => setKolSearchInput(e.target.value)}
                      className="w-full bg-white border border-neutral-300 text-neutral-800 rounded px-3 py-2 text-sm focus:border-brand-navy focus:outline-none placeholder-neutral-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 flex-shrink-0">
                  {kolAllProducts.length > 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={kolAllProducts.length > 0 && selectedKolSearchIds.length === kolAllProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedKolSearchIds(kolAllProducts.map(p => p._id));
                          } else {
                            setSelectedKolSearchIds([]);
                          }
                        }}
                        className="w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer bg-white"
                      />
                      Chọn tất cả
                    </label>
                  )}
                  {selectedKolSearchIds.length > 0 && (
                    <button
                      onClick={handleKolBulkAdd}
                      disabled={kolBulkLoading}
                      className="bg-brand-navy hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold py-2 px-4 rounded text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
                    >
                      {kolBulkLoading ? 'Đang thêm...' : `Thêm ${selectedKolSearchIds.length} mục đã chọn`}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {kolAllLoading ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-brand-navy" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kolAllProducts.map((product) => {
                      const isAlreadyInKol = kolProducts.some((p) => p._id === product._id);
                      const isChecked = selectedKolSearchIds.includes(product._id);
                      return (
                        <div key={product._id} className="border border-neutral-200 rounded-lg p-3 flex flex-col justify-between hover:shadow-sm transition-shadow relative">
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isAlreadyInKol}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedKolSearchIds([...selectedKolSearchIds, product._id]);
                                } else {
                                  setSelectedKolSearchIds(selectedKolSearchIds.filter(id => id !== product._id));
                                }
                              }}
                              className="w-4 h-4 text-brand-navy border-neutral-300 rounded focus:ring-brand-navy cursor-pointer disabled:bg-neutral-200 disabled:cursor-not-allowed bg-white"
                            />
                          </div>

                          <div className="flex items-start gap-3 pl-6">
                            <img src={product.imageUrl} alt={product.title} className="w-12 h-16 object-cover rounded bg-neutral-100 flex-shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-neutral-800 truncate">{product.title}</h4>
                              <span className="text-[10px] text-neutral-500 block mt-0.5">{product.brand}</span>
                              <span className="text-xs font-bold text-brand-navy block mt-1">{formatPrice(product.price)}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
                            <button
                              disabled={isAlreadyInKol}
                              onClick={() => toggleKolProduct(product, true)}
                              className={`font-bold py-1.5 px-3 rounded text-[10px] tracking-wider uppercase transition-colors ${isAlreadyInKol
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : 'bg-brand-navy hover:bg-neutral-850 text-white'
                                }`}
                            >
                              {isAlreadyInKol ? 'Đã thêm' : 'Thêm gợi ý'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Customer / Contact Feedback Management Tab Panel */}
        {activeTab === 'Khách hàng' && (
          <FeedbackTab
            feedbacks={feedbacks}
            feedbackLoading={feedbackLoading}
            feedbackSearchInput={feedbackSearchInput}
            onSearchInputChange={setFeedbackSearchInput}
            onViewFeedback={setSelectedFeedback}
            onDeleteFeedbackClick={setFeedbackToDelete}
            msg={feedbackMsg}
          />
        )}

        {/* --- Global Overlay Confirmation Modals (Rendered outside tab wrappers) --- */}

        {/* Delete Order Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={!!orderToDelete}
          title="Xác nhận xóa đơn hàng"
          message={orderToDelete ? `Bạn có chắc chắn muốn xóa đơn hàng ${orderToDelete.orderNumber}? Hành động này không thể hoàn tác.` : ''}
          onConfirm={() => orderToDelete && handleDeleteOrder(orderToDelete._id)}
          onCancel={() => setOrderToDelete(null)}
          isLoading={!!orderUpdatingId}
        />

        {/* Edit Order Status Confirmation Modal */}
        {orderToEditStatus && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded border border-neutral-200 shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <h3 className="font-serif text-sm font-bold text-neutral-800 uppercase tracking-wider mb-2">
                Xác nhận thay đổi trạng thái
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Thay đổi trạng thái của đơn hàng <strong className="text-brand-navy font-mono">{orderToEditStatus.order.orderNumber}</strong> từ <span className="underline font-bold">{orderToEditStatus.order.status}</span> sang <span className="underline font-bold text-brand-gold">{orderToEditStatus.newStatus}</span>?
              </p>
              <div className="flex justify-end gap-3 text-xs font-bold uppercase">
                <button
                  onClick={() => setOrderToEditStatus(null)}
                  className="px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-50 text-neutral-600"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={async () => {
                    await handleUpdateOrderStatus(orderToEditStatus.order._id, orderToEditStatus.newStatus);
                    setOrderToEditStatus(null);
                  }}
                  className="px-4 py-2 bg-brand-navy hover:bg-[#C5A880] hover:text-brand-navy text-white rounded"
                >
                  Xác nhận lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Slider Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={!!sliderToDelete}
          title="Xác nhận xóa ảnh slider"
          message={sliderToDelete ? `Bạn có chắc chắn muốn xóa ảnh ${sliderToDelete.originalName}? Hành động này không thể hoàn tác.` : ''}
          onConfirm={async () => {
            if (!sliderToDelete) return;
            try {
              const res = await fetch(`${API_URL}/sliders/${sliderToDelete._id}`, { method: 'DELETE' });
              const data = await res.json();
              if (data.success) {
                setSliders(prev => prev.filter(s => s._id !== sliderToDelete._id));
                setSliderMsg({ text: 'Đã xóa ảnh slider thành công', type: 'success' });
                setTimeout(() => setSliderMsg(null), 3000);
              } else {
                setSliderMsg({ text: data.message || 'Xóa ảnh slider thất bại', type: 'error' });
                setTimeout(() => setSliderMsg(null), 3000);
              }
            } catch {
              setSliderMsg({ text: 'Lỗi khi xóa ảnh', type: 'error' });
              setTimeout(() => setSliderMsg(null), 3000);
            } finally {
              setSliderToDelete(null);
            }
          }}
          onCancel={() => setSliderToDelete(null)}
        />

        {/* Feedback Detail Inspection Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-sans animate-in fade-in duration-200">
            <div className="bg-white rounded border border-neutral-200 shadow-2xl w-full max-w-lg p-6 relative flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setSelectedFeedback(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="font-serif text-sm font-bold text-neutral-800 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-4">
                CHI TIẾT TIN NHẮN PHẢN HỒI
              </h3>

              <div className="space-y-4 text-sm text-neutral-700">
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                  <span className="font-bold text-neutral-450 uppercase text-xs">Người gửi</span>
                  <span className="col-span-2 font-semibold text-neutral-800">{selectedFeedback.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                  <span className="font-bold text-neutral-450 uppercase text-xs">Email</span>
                  <span className="col-span-2 text-brand-navy font-semibold select-all">{selectedFeedback.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                  <span className="font-bold text-neutral-450 uppercase text-xs">Số điện thoại</span>
                  <span className="col-span-2 text-neutral-800 font-semibold select-all">{selectedFeedback.phone}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                  <span className="font-bold text-neutral-450 uppercase text-xs">Thời gian</span>
                  <span className="col-span-2 text-neutral-600 font-normal">
                    {new Date(selectedFeedback.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
                {selectedFeedback.userKey && (
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-neutral-50">
                    <span className="font-bold text-neutral-450 uppercase text-xs">Mã định danh</span>
                    <span className="col-span-2 text-xs text-neutral-400 font-mono select-all">{selectedFeedback.userKey}</span>
                  </div>
                )}
                <div className="flex flex-col pt-2 font-normal">
                  <span className="font-bold text-neutral-450 uppercase text-xs mb-2">Nội dung phản hồi</span>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 rounded text-neutral-700 leading-relaxed font-sans max-h-60 overflow-y-auto whitespace-pre-wrap select-text">
                    {selectedFeedback.message}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 text-xs font-bold uppercase">
                <button
                  onClick={() => {
                    setFeedbackToDelete(selectedFeedback);
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 border border-red-200 hover:border-red-505 text-red-650 hover:bg-red-50 rounded transition-colors"
                >
                  Xóa tin nhắn
                </button>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 bg-brand-charcoal text-white hover:bg-brand-navy rounded transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Feedback Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={!!feedbackToDelete}
          title="Xác nhận xóa phản hồi"
          message={feedbackToDelete ? `Bạn có chắc chắn muốn xóa tin nhắn từ khách hàng ${feedbackToDelete.name}? Hành động này không thể hoàn tác.` : ''}
          onConfirm={() => feedbackToDelete && handleDeleteFeedback(feedbackToDelete._id)}
          onCancel={() => setFeedbackToDelete(null)}
        />

      </main>
    </div>
  );
}
