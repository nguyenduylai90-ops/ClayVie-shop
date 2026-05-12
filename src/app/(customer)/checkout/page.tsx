'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Tính tổng tiền từ giỏ hàng
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Giỏ hàng của bạn đang trống!');
    
    setLoading(true);

    try {
      // 1. Tạo đơn hàng chính
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          total_price: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Lưu chi tiết từng món hoa trong giỏ (nếu anh có bảng order_items)
      // Tạm thời bản này mình chỉ cần lưu thông tin đơn hàng chính là đủ để anh gọi điện cho khách rồi.

      alert('Đặt hàng thành công! ClayVie sẽ sớm liên hệ với bạn. 🌸');
      clearCart(); // Xóa giỏ hàng sau khi đặt xong
      router.push('/');
    } catch (error: any) {
      alert('Lỗi đặt hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">Giỏ hàng của bạn đang trống.</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-pink-600 font-bold hover:underline">
          Quay lại chọn hoa &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-12 text-center md:text-left">Xác nhận đơn hàng</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form thông tin khách */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Thông tin giao hàng
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text" required
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel" required
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Để ClayVie gọi xác nhận đơn hàng"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ nhận hàng</label>
              <textarea
                required rows={3}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Địa chỉ cụ thể của bạn"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-pink-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-pink-700 transition shadow-xl shadow-pink-100 disabled:bg-gray-300"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
          </form>
        </div>

        {/* Tóm tắt giỏ hàng */}
        <div className="bg-gray-50 p-8 rounded-[40px]">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Giỏ hàng của bạn
          </h2>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                </div>
                <p className="font-bold text-pink-600">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-600">Tổng cộng:</span>
                <span className="text-3xl font-black text-pink-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Đang tải...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
