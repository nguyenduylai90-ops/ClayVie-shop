'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock_quantity: '0',
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('products').insert([
        {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          stock_quantity: parseInt(formData.stock_quantity),
          image_url: formData.image_url,
        },
      ]);

      if (error) throw error;

      alert('Thêm sản phẩm thành công! 🎉');
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thêm sản phẩm mới</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên hoa đất sét</label>
          <input
            required
            type="text"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="Ví dụ: Hoa Sen hồng đại"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
            <input
              required
              type="number"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Chọn danh mục</option>
            <option value="hoa-le">Hoa lẻ</option>
            <option value="chau-hoa">Chậu hoa</option>
            <option value="qua-tang">Quà tặng</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
          <textarea
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-32"
            placeholder="Nhập chi tiết về sản phẩm..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="https://..."
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
