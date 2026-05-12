'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // HÀM TẢI ẢNH LÊN SUPABASE STORAGE
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Tải ảnh lên bucket 'products'
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Lấy link ảnh công khai
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      alert('Tải ảnh thành công! 🌸');
    } catch (error: any) {
      alert('Lỗi tải ảnh: ' + error.message);
    } finally {
      setIsUploading(false);
    }
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
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Quản lý Sản phẩm</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pink-600 text-white px-8 py-4 rounded-3xl font-black shadow-xl shadow-pink-100 hover:scale-105 transition transform"
        >
          + Thêm hoa mới
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-8">Hình ảnh</th>
              <th className="p-8">Tên hoa</th>
              <th className="p-8">Giá</th>
              <th className="p-8">Tồn kho</th>
              <th className="p-8">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center font-bold text-gray-300 italic">Đang tải danh sách...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition">
                <td className="p-8">
                  <img src={p.image_url} alt={p.name} className="w-20 h-20 rounded-3xl object-cover shadow-sm" />
                </td>
                <td className="p-8 font-black text-gray-800 text-lg tracking-tight">{p.name}</td>
                <td className="p-8 font-black text-pink-600 text-xl">{Number(p.price).toLocaleString('vi-VN')}đ</td>
                <td className="p-8 font-bold text-gray-500">{p.stock_quantity}</td>
                <td className="p-8 space-x-6">
                  <button onClick={() => handleOpenModal(p)} className="text-blue-600 font-black hover:underline uppercase text-xs">Sửa</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 font-black hover:underline uppercase text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-2xl rounded-[50px] p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl font-black mb-10 tracking-tighter">{editingProduct ? 'Cập nhật hoa' : 'Thêm hoa mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* PHẦN TẢI ẢNH MỚI ĐÂY ANH */}
              <div className="bg-gray-50 p-8 rounded-[32px] border-2 border-dashed border-gray-200 text-center">
                {formData.image_url ? (
                  <div className="relative inline-block">
                    <img src={formData.image_url} className="w-40 h-40 rounded-3xl object-cover mx-auto mb-4 border-4 border-white shadow-lg" />
                    <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full font-bold">×</button>
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest">Chưa có ảnh hoa</p>
                    <label className="bg-white border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-2xl font-black cursor-pointer hover:bg-pink-50 transition">
                      {isUploading ? 'Đang tải...' : 'Chọn ảnh từ máy'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleUploadImage} disabled={isUploading} />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tên mẫu hoa</label>
                  <input required className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Giá bán (VNĐ)</label>
                  <input type="number" required className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Số lượng trong kho</label>
                  <input type="number" required className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Phân loại (Ví dụ: Hoa Lan, Hoa Sen...)</label>
                  <input className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Mô tả sản phẩm</label>
                <textarea rows={3} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="flex gap-6 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black text-gray-400 hover:text-gray-600 transition uppercase tracking-widest text-sm">Đóng</button>
                <button type="submit" className="flex-1 bg-pink-600 text-white py-5 rounded-3xl font-black shadow-2xl shadow-pink-100 hover:bg-pink-700 transition uppercase tracking-widest text-sm">Lưu mẫu hoa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
