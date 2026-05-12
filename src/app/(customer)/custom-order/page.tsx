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
    
    if (!/^\d{10}$/.test(formData.phone)) {
      return alert('Vui lòng nhập đúng 10 số điện thoại để ClayVie gọi tư vấn cho bạn nhé! 🌸');
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_notes: `[ĐẶT RIÊNG]: ${formData.request}`,
          total_price: 0,
          status: 'pending',
        });

      if (error) throw error;

      alert('Yêu cầu thiết kế của bạn đã được gửi thành công! ClayVie sẽ gọi điện báo giá cho bạn ngay nhé. 🌸');
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
        <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mb-10 shadow-inner">
          <span className="text-5xl">🎨</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase leading-tight">Thiết kế hoa độc bản</h1>
        <p className="text-gray-500 mb-12 text-lg leading-relaxed italic">
          Hãy mô tả mẫu hoa bạn mong muốn, màu sắc hoặc kiểu dáng riêng. ClayVie sẽ biến ý tưởng của bạn thành hiện thực.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tên của bạn</label>
              <input 
                type="text" required
                className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-bold text-lg"
                placeholder="Ví dụ: Anh Duy"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Số điện thoại (10 số)</label>
              <input 
                type="tel" required maxLength={10}
                className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none font-black text-xl text-pink-600 tracking-[0.2em]"
                placeholder="0901234567"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Mô tả ý tưởng của bạn</label>
            <textarea 
              required rows={6}
              className="w-full p-8 bg-gray-50 border-none rounded-[32px] focus:ring-2 focus:ring-pink-500 outline-none font-medium text-lg italic"
              placeholder="Tôi muốn đặt 1 chậu hoa màu hồng sen cao 50cm..."
              value={formData.request}
              onChange={e => setFormData({...formData, request: e.target.value})}
            ></textarea>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-black text-white py-8 rounded-[40px] font-black text-2xl hover:bg-pink-600 transition-all duration-500 shadow-2xl hover:scale-[1.02] transform uppercase tracking-tighter"
          >
            {
