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
        <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Tra cứu đơn hàng</h1>
        <p className="text-gray-500 text-lg">Nhập số điện thoại để kiểm tra hành trình hoa của bạn</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-16 p-2 bg-gray-50 rounded-[32px] border border-gray-100">
        <input
          type="tel"
          required
          placeholder="Nhập số điện thoại (ví dụ: 0901...)"
          className="flex-1 p-5 bg-transparent rounded-2xl outline-none text-lg font-medium"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-pink-600 text-white px-10 py-5 rounded-[24px] font-bold text-lg hover:bg-pink-700 transition shadow-xl shadow-pink-100 disabled:bg-gray-300"
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      <div className="space-y-8">
        {searched && orders.length === 0 && !loading && (
          <div className="text-center py-16 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-gray-400 font-bold text-xl">Chưa có đơn hàng nào cho số điện thoại này</p>
            <p className="text-gray-300 mt-2">Anh/Chị hãy kiểm tra lại số điện thoại nhé!</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">Mã đơn hàng của bạn</p>
                <p className="font-mono text-2xl text-gray-800 font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                order.status === 'received' ? 'bg-blue-100 text-blue-600' : 
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                'bg-red-100 text-red-600'
              }`}>
                {order.status === 'completed' ? 'Đã giao thành công' : 
                 order.status === 'received' ? 'Đã nhận đơn (Đang chuẩn bị)' : 
                 order.status === 'pending' ? 'Đang chờ xử lý' : 'Đã hủy'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-gray-50 pt-8">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Ngày đặt hoa</p>
                <p className="font-bold text-gray-700">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Tổng giá trị</p>
                <p className="font-black text-2xl text-pink-600">{Number(order.total_price).toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="col-span-2 bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Người nhận & Địa chỉ</p>
                <p className="font-bold text-gray-800">{order.customer_name}</p>
                <p className="text-sm text-gray-500 mt-1">{order.customer_address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
