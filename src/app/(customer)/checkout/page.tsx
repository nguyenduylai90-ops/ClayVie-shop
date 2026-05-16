'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Validate phone number (exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Vui lòng nhập đúng số điện thoại (chỉ bao gồm 10 chữ số).');
      return;
    }
    
    setLoading(true);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address + (formData.note ? ` (Ghi chú: ${formData.note})` : ''),
            total_price: totalPrice,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemError) throw itemError;

      alert('Đặt hàng thành công! ClayVie sẽ sớm liên hệ với bạn. 🌸');
      clearCart();
      router.push('/');
    } catch (error: any) {
      alert('Lỗi đặt hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
      <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
      <Link href="/products" className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition font-medium">
        Khám phá sản phẩm
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Thanh toán</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form */}
        <div className="flex-[3] space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 uppercase text-gray-800 tracking-tight">Thông tin nhận hoa</h2>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                  placeholder="Ví dụ: 0912345678"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phone: value });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ nhận hàng</label>
                <textarea
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition h-24 resize-none"
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm</label>
                <textarea
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition h-24 resize-none"
                  placeholder="Ghi chú thêm (thời gian giao hàng, lời nhắn trên thiệp...)"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-pink-600 text-white font-bold text-lg py-5 rounded-xl hover:bg-pink-700 transition shadow-lg mt-8 disabled:bg-gray-300 disabled:shadow-none"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận Đặt hàng'}
              </button>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="flex-[2]">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold mb-8 uppercase text-center tracking-tight">Giỏ hàng</h2>
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm relative group">
                  <button 
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute -left-3 -top-3 bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition shadow-sm opacity-0 group-hover:opacity-100"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm md:text-base truncate mb-2">{item.name}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:text-pink-600 transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:text-pink-600 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-pink-600 text-sm md:text-base whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 border-dashed pt-6 mt-6 space-y-4 text-sm md:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Tạm tính:</span>
                  <span className="font-bold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Phí vận chuyển:</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-xs">Miễn phí</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                  <span className="font-bold text-lg">Tổng cộng:</span>
                  <span className="text-3xl font-black text-pink-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
