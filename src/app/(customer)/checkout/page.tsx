'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Giỏ hàng của bạn đang trống!');
    
    if (!/^\d{10}$/.test(formData.phone)) {
      return alert('Số điện thoại nhận hoa phải đúng 10 chữ số anh/chị nhé! 🌸');
    }

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_notes: formData.notes,
          total_price: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      for (const item of cart) {
        const { data: p } = await supabase.from('products').select('stock_quantity').eq('id', item.id).single();
        if (p) {
          await supabase.from('products').update({ stock_quantity: Math.max(0, p.stock_quantity - item.quantity) }).eq('id', item.id);
        }
      }

      alert('Đặt hàng thành công! ClayVie sẽ sớm liên hệ với bạn. 🌸');
      clearCart(); 
      router.push('/');
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-400">Giỏ hàng của bạn đang trống.</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-pink-600 font-bold hover:underline">Quay lại mua hoa 🌸</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 tracking-tighter">
              <span className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center text-sm">1</span>
              Thông tin nhận hoa
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Họ và tên người nhận</label>
                <input type="text" required className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-lg" placeholder="Ví dụ: Nguyễn Văn A" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Số điện thoại (10 chữ số)</label>
                <input 
                  type="tel" required maxLength={10}
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-black text-xl text-pink-600 tracking-[0.2em]" 
                  placeholder="0901234567" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, "")})} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Địa chỉ giao hoa</label>
                <textarea required rows={2} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium text-lg italic" placeholder="Số nhà, tên đường..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ghi chú thêm (Nếu có)</label>
                <textarea rows={3} className="w-full p-5 bg-pink-50/30 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium italic" placeholder="Ví dụ: Gói quà, viết thiệp chúc mừng..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-pink-600 text-white py-6 rounded-[30px] font-black text-xl hover:bg-pink-700 transition shadow-2xl shadow-pink-100 disabled:bg-gray-300 uppercase">
                {loading ? 'Đang xác nhận...' : 'Xác nhận đặt hàng ngay'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 tracking-tighter text-gray-800">
            <span className="bg-gray-800 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm">2</span>
            Giỏ hàng của bạn
          </h2>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-5 rounded-[30px] shadow-sm">
                <img src={item.image_url} alt={item.name} className="w-24
