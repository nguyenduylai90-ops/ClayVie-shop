'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });

    if (!error) {
      setOrders(data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Tra cứu đơn hàng</h1>
        <p className="text-gray-500">Nhập số điện thoại của bạn để kiểm tra trạng thái đơn hàng tại ClayVie</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-12">
        <input
          type="tel"
          required
          placeholder="Nhập số điện thoại (ví dụ: 0901...)"
          className="flex-1 p-4 border-2 border-gray-100 rounded-2xl focus:border-pink-500 outline-none transition"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-100 disabled:bg-gray-300"
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      <div className="space-y-6">
        {searched && orders.length === 0 && !loading && (
          <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Không tìm thấy đơn hàng nào gắn với số điện thoại này. 🌸</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Mã đơn hàng</p>
                <p className="font-mono text-gray-600">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100/50' :
                order.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                order.status === 'shipping' ? 'bg-purple-50 text-purple-600 border-purple-100/50' :
                order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                'bg-rose-50 text-rose-600 border-rose-100/50'
              }`}>
                {order.status === 'completed' ? 'Đã giao thành công' :
                 order.status === 'confirmed' ? 'Đã chấp nhận đơn' :
                 order.status === 'shipping' ? 'Đang giao hàng' :
                 order.status === 'pending' ? 'Đang chờ xử lý' : 'Đã hủy đơn'}
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                <p className="font-bold text-lg mt-1 text-gray-800">{Number(order.total_price).toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Người nhận: {order.customer_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
