'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CustomOrderPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', phone: '', request: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) return alert('SĐT phải đúng 10 số!');
    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_notes: `[ĐẶT RIÊNG]: ${formData.request}`,
        total_price: 0, status: 'pending',
      });
      if (error) throw error;
      alert('Đã gửi yêu cầu! 🌸');
      router.push('/');
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-2xl">
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Đặt hoa độc bản</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input type="text" required className="w-full p-6 bg-gray-50 border-none rounded-2xl outline-none font-bold" placeholder="Tên của bạn" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="tel" required maxLength={10} className="w-full p-6 bg-gray-50 border-none rounded-2xl outline-none font-black text-pink-600 tracking-widest" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })} />
          <textarea required rows={5} className="w-full p-8 bg-gray-50 border-none rounded-[32px] outline-none italic" placeholder="Mô tả ý tưởng..." value={formData.request} onChange={e => setFormData({...formData, request: e.target.value})}></textarea>
          <button disabled={loading} className="w-full bg-black text-white py-8 rounded-[40px] font-black text-2xl hover:bg-pink-600 transition shadow-2xl uppercase">
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
          </button>
        </form>
      </div>
    </div>
  );
}
