'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Giỏ hàng trống!');
    if (!/^\d{10}$/.test(formData.phone)) return alert('SĐT phải đúng 10 số!');
    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_notes: formData.notes,
        total_price: totalAmount,
        status: 'pending',
      }).select().single();
      if (orderError) throw orderError;
      alert('Đặt hàng thành công! 🌸');
      clearCart();
      router.push('/');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="p-20 text-center">Giỏ hàng trống!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
          <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase">Thông tin nhận hoa</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" required className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="Họ và tên" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="tel" required maxLength={10} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none font-black text-pink-600 tracking-widest" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, "")})} />
            <textarea required rows={2} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none" placeholder="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <textarea rows={2} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none italic" placeholder="Ghi chú thêm" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            <button disabled={loading} type="submit" className="w-full bg-pink-600 text-white py-6 rounded-[30px] font-black text-xl hover:bg-pink-700 transition shadow-2xl uppercase">
              {loading ? 'Đang gửi...' : 'Xác nhận ngay'}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
          <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase text-gray-800 text-center">Giỏ hàng</h2>
          {cart.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-3xl mb-4">
              <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 font-bold text-sm uppercase">{item.name} x {item.quantity}</div>
              <div className="font-black text-pink-600">{(item.price * item.quantity).toLocaleString()}đ</div>
            </div>
          ))}
          <div className="border-t-2 border-dashed pt-8 text-center">
            <span className="text-4xl font-black text-pink-600">{totalAmount.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent /></Suspense>;
}
