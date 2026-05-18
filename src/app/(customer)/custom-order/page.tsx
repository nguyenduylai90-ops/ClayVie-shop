'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CustomOrderPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    request: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number (exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Vui lòng nhập đúng số điện thoại của bạn (bao gồm 10 chữ số) để ClayVie liên hệ tư vấn nhé! 🌸');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: `[YÊU CẦU THIẾT KẾ RIÊNG]: ${formData.request}`,
          total_price: 0, // Giá 0đ để anh báo giá sau
          status: 'pending',
        });

      if (error) throw error;

      alert('Yêu cầu đặt hoa của bạn đã được gửi thành công! ClayVie sẽ gọi điện tư vấn và báo giá cho bạn ngay. 🌸');
      router.push('/');
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-2xl shadow-pink-50">
        <div className="bg-pink-50 w-20 h-20 rounded-full flex items-center justify-center mb-8">
          <span className="text-4xl">🎨</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Thiết kế hoa độc bản</h1>
        <p className="text-gray-500 mb-12 text-lg leading-relaxed">
          Bạn có ý tưởng riêng? Hãy mô tả mẫu hoa bạn mong muốn, màu sắc hoặc gửi lời nhắn. ClayVie sẽ biến ý tưởng của bạn thành tác phẩm nghệ thuật bằng đất sét.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Tên của bạn</label>
              <input
                type="text" required
                className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                placeholder="Ví dụ: Anh Duy"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Số điện thoại</label>
              <input
                type="tel" required
                maxLength={10}
                className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                placeholder="Ví dụ: 0901234567"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Mô tả mẫu hoa bạn muốn đặt</label>
            <textarea
              required rows={6}
              className="w-full p-6 bg-gray-50 border-none rounded-[32px] focus:ring-2 focus:ring-pink-500 outline-none font-medium text-lg italic"
              placeholder="Ví dụ: Tôi muốn đặt 1 chậu hoa Sen màu hồng sen, cao 50cm để tặng tân gia..."
              value={formData.request}
              onChange={e => setFormData({ ...formData, request: e.target.value })}
            ></textarea>
          </div>
          <button
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-[30px] font-black text-xl hover:bg-pink-600 transition-all duration-500 shadow-2xl hover:scale-[1.02] transform"
          >
            {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu thiết kế ngay'}
          </button>
        </form>
      </div>
    </div>
  );
}
