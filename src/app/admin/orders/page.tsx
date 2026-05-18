'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, RefreshCw, Phone, MapPin, Calendar, DollarSign, Package } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  products: {
    name: string;
    image_url: string;
  } | null;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Đang chờ xử lý', color: 'bg-amber-50 text-amber-600 border border-amber-100/50' };
    case 'confirmed':
      return { label: 'Đã chấp nhận đơn', color: 'bg-blue-50 text-blue-600 border border-blue-100/50' };
    case 'shipping':
      return { label: 'Đang giao hàng', color: 'bg-purple-50 text-purple-600 border border-purple-100/50' };
    case 'completed':
      return { label: 'Đã giao thành công', color: 'bg-green-50 text-green-600 border border-green-100/50' };
    case 'cancelled':
      return { label: 'Đã hủy đơn', color: 'bg-rose-50 text-rose-600 border border-rose-100/50' };
    default:
      return { label: 'Không xác định', color: 'bg-gray-50 text-gray-600 border border-gray-100/50' };
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingItems(true);
    setOrderItems([]);

    // Fetch order items joined with product names and images
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        price_at_time,
        products (
          name,
          image_url
        )
      `)
      .eq('order_id', order.id);

    if (!error && data) {
      setOrderItems(data as any);
    }
    setLoadingItems(false);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', selectedOrder.id);

    if (!error) {
      // Update local orders list state
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      alert('Cập nhật trạng thái đơn hàng thành công! 🎉');
    } else {
      alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
    setUpdatingStatus(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <button 
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 font-black text-gray-400 text-xs uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const statusObj = getStatusLabel(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800 text-sm">{order.customer_name}</div>
                          <div className="text-xs text-gray-500">{order.customer_phone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 font-bold text-pink-600 text-sm">
                          {order.total_price.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${statusObj.color}`}>
                            {statusObj.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleOpenDetail(order)}
                            className="bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-xs py-2 px-4 rounded-xl transition"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPUP DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-slide-over">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-black text-gray-800 text-lg">Chi Tiết Đơn Hàng</h3>
                <p className="text-xs font-mono text-gray-400 mt-1">#{selectedOrder.id.toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Update Card */}
              <div className="bg-pink-50/50 p-5 rounded-3xl border border-pink-100/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-700">Cập nhật trạng thái</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusLabel(selectedOrder.status).color}`}>
                    {getStatusLabel(selectedOrder.status).label}
                  </span>
                </div>
                <div className="relative">
                  <select 
                    disabled={updatingStatus}
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 font-bold text-gray-700 outline-none focus:border-pink-500 transition duration-300 disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="pending">⏳ Đang chờ xử lý</option>
                    <option value="confirmed">👍 Đã chấp nhận đơn</option>
                    <option value="shipping">🚚 Đang giao hàng</option>
                    <option value="completed">✅ Đã giao thành công</option>
                    <option value="cancelled">❌ Đã hủy đơn</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Package size={14} />
                  Thông tin giao hàng
                </h4>
                
                <div className="bg-gray-50/60 p-5 rounded-3xl border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                      <span className="font-black text-sm">{selectedOrder.customer_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{selectedOrder.customer_name}</div>
                      <div className="text-xs text-gray-500">Khách hàng</div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 text-sm">
                    <div className="flex items-center gap-3 py-3">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${selectedOrder.customer_phone}`} className="text-pink-600 font-bold hover:underline">
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3 py-3">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <span className="text-gray-600 leading-relaxed font-semibold">{selectedOrder.customer_address}</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-500">
                        Đặt ngày: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Package size={14} />
                  Sản phẩm đặt mua
                </h4>

                {loadingItems ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 overflow-hidden shrink-0">
                          {item.products?.image_url ? (
                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">No Image</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="font-bold text-gray-800 text-sm line-clamp-1">{item.products?.name || 'Sản phẩm đã xóa'}</div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-semibold">Số lượng: {item.quantity}</span>
                            <span className="text-pink-600 font-black">{item.price_at_time.toLocaleString('vi-VN')} đ</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Total Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="font-bold text-gray-600">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-pink-600">
                {selectedOrder.total_price.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
