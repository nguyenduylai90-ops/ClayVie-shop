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
    
    if (!/^\d{10}$/.test(phone)) {
      return alert('Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số ạ! 🌸');
    }

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
        <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Tra cứu đơn hàng</h1>
        <p className="text-gray-500 text-lg italic">Nhập số điện thoại để kiểm tra hành trình hoa của bạn</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-16 p-2 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner">
        <input
          type="tel"
          required
          maxLength={10}
          placeholder="Nhập 10 số điện thoại..."
          className="flex-1 p-5 bg-transparent rounded-2xl outline-none text-xl font-black tracking-[0.2em] text-pink-600"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-pink-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-pink-700 transition shadow-xl shadow-pink-100 disabled:bg-gray-300 uppercase"
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>

      <div className="space-y-10">
        {searched && orders.length === 0 && !loading && (
          <div className="text-center py-16 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-gray-400 font-bold text-xl uppercase tracking-tighter">Chưa có đơn hàng cho số điện thoại này</p>
          </div>
        )}

        {orders.map((order) => {
          const remaining = order.total_price - (order.paid_amount || 0);
          
          return (
            <div key={order.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">Mã đơn hàng</p>
                  <p className="font-mono text-2xl text-gray-800 font-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Tổng cộng</p>
                  <p className="font-black text-gray-800 text-xl">{Number(order.total_price).toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="text-center border-y md:border-y-0 md:border-x border-gray-200 py-4 md:py-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Đã cọc/ứng</p>
                  <p className="font-black text-green-600 text-xl">{Number(order.paid_amount || 0).toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Cần thanh toán thêm</p>
                  <p className={`font-black text-2xl ${remaining <= 0 ? 'text-green-500' : 'text-pink-600'}`}>
                    {remaining <= 0 ? '✅ Xong' : `${remaining.toLocaleString('vi-VN')}đ`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-gray-50 pt-8">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider underline">Thông tin nhận hoa</p>
                  <p className="font-black text-gray-800 text-lg uppercase tracking-tighter">{order.customer_name}</p>
                  <p className="text-gray-500 mt-1 font-medium italic">📍 {order.customer_address}</p>
                </div>
                
                {order.customer_notes && (
                  <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                    <p className="text-[10px] text-pink-400 font-bold uppercase mb-1">Yêu cầu của bạn</p>
                    <p className="text-gray-700 italic">"{order.customer_notes}"</p>
                  </div>
                )}
                
                <p className="text-[10px] text-gray-300 font-bold uppercase text-center mt-4">Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
