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
    notes: '' // Thêm trường ghi chú
  });

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Giỏ hàng của bạn đang trống!');
    
    setLoading(true);

    try {
      // 1. Tạo đơn hàng
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_notes: formData.notes, // Lưu ghi chú vào database
          total_price: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Trừ kho
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
        <button onClick={() => router.push('/')} className="mt-4 text-pink-600 font-bold hover:underline font-bold">Quay lại mua hoa 🌸</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Cột trái: Thông tin khách */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <span className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center text-sm">1</span>
              Thông tin giao hàng
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Họ và tên</label>
                <input type="text" required className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium" placeholder="Nguyễn Văn A" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Số điện thoại</label>
                <input type="tel" required className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium" placeholder="0901..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Địa chỉ nhận hoa</label>
                <textarea required rows={2} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium" placeholder="Số nhà, tên đường, phường/xã..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              {/* Ô Ghi chú mới thêm đây anh */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Yêu cầu / Ghi chú riêng</label>
                <textarea rows={3} className="w-full p-5 bg-pink-50/30 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-medium italic" placeholder="Ví dụ: Gói quà, viết thiệp, đổi màu hoa..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-pink-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-pink-700 transition shadow-xl shadow-pink-100 disabled:bg-gray-300 uppercase tracking-tighter">
                {loading ? 'Đang gửi đơn...' : 'Xác nhận đặt hàng'}
              </button>
            </form>
          </div>
        </div>

        {/* Cột phải: Giỏ hàng linh động */}
        <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <span className="bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm">2</span>
            Giỏ hàng của bạn
          </h2>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm group">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    {/* Nút tăng giảm số lượng đây anh */}
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-pink-100 hover:text-pink-600 transition">-</button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-pink-100 hover:text-pink-600 transition">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-pink-600">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase mt-2">Xóa</button>
                </div>
              </div>
            ))}
            
            <div className="border-t-2 border-dashed border-gray-200 pt-8 mt-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Tổng cộng thanh toán:</span>
                <span className="text-4xl font-black text-pink-600 tracking-tighter">{totalAmount.toLocaleString('vi-VN')}đ</span>
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
    <Suspense fallback={<div className="p-20 text-center font-bold text-gray-300">Đang tải giỏ hàng...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
