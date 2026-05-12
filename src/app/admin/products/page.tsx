'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    description: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        description: product.description || '',
        category: product.category || '',
        image_url: product.image_url || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock_quantity: '', description: '', category: '', image_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity)
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
      if (!error) alert('Đã cập nhật sản phẩm! 🌸');
    } else {
      const { error } = await supabase.from('products').insert([productData]);
      if (!error) alert('Đã thêm sản phẩm mới! 🌸');
    }
    
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Anh có chắc muốn xóa mẫu hoa này không?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchProducts();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Quản lý Sản phẩm</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-100"
        >
          + Thêm hoa mới
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-6">Hình ảnh</th>
              <th className="p-6">Tên hoa</th>
              <th className="p-6">Giá</th>
              <th className="p-6">Tồn kho</th>
              <th className="p-6">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center font-bold text-gray-300 italic">Đang tải danh sách...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition">
                <td className="p-6">
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-2xl object-cover" />
                </td>
                <td className="p-6 font-bold text-gray-800">{p.name}</td>
                <td className="p-6 font-black text-pink-600">{Number(p.price).toLocaleString('vi-VN')}đ</td>
                <td className="p-6 font-bold">{p.stock_quantity}</td>
                <td className="p-6 space-x-4">
                  <button onClick={() => handleOpenModal(p)} className="text-blue-600 font-bold hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 font-bold hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black mb-8">{editingProduct ? 'Cập nhật mẫu hoa' : 'Thêm mẫu hoa mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tên hoa</label>
                  <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Giá tiền (VNĐ)</label>
                  <input type="number" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Số lượng kho</label>
                  <input type="number" required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Link ảnh (URL)</label>
                  <input className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mô tả</label>
                <textarea rows={3} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition">Hủy bỏ</button>
                <button type="submit" className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-pink-100 hover:bg-pink-700 transition">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
