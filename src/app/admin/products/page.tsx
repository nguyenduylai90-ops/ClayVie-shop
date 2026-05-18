'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/types';
import { Plus, Search, Edit, Trash2, SlidersHorizontal, Package, AlertCircle } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      // Update state
      setProducts(products.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert('Không thể xóa sản phẩm: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <span className="p-2 bg-pink-100 text-pink-600 rounded-xl">🌸</span>
            Quản lý Sản phẩm
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Xem, chỉnh sửa, thêm mới hoặc xóa hoa đất sét trong cửa hàng</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="flex items-center gap-2 bg-pink-600 text-white px-5 py-3 rounded-2xl hover:bg-pink-700 transition-all duration-300 font-bold shadow-lg shadow-pink-100 hover:scale-[1.02] transform"
        >
          <Plus size={20} />
          Thêm hoa mới
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-medium transition text-sm text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-gray-400" />
          <select
            className="bg-gray-50 border-none p-3 rounded-xl font-bold text-sm text-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            <option value="hoa-le">Hoa lẻ</option>
            <option value="chau-hoa">Chậu hoa</option>
            <option value="qua-tang">Quà tặng</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4 font-semibold text-sm">Đang tải danh sách hoa đất sét...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Hình ảnh</th>
                  <th className="px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Tên hoa đất sét</th>
                  <th className="px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Danh mục</th>
                  <th className="px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Giá bán</th>
                  <th className="px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest">Tồn kho</th>
                  <th className="px-6 py-4 font-black text-xs text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-pink-50/20 transition-all duration-200 group">
                      {/* Image */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.image_url ? (
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 font-bold">
                            Không ảnh
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-800 text-sm md:text-base">{product.name}</div>
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate font-medium">
                          {product.description || 'Chưa có mô tả chi tiết'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          product.category === 'hoa-le' ? 'bg-blue-50 text-blue-600' :
                          product.category === 'chau-hoa' ? 'bg-purple-50 text-purple-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {product.category === 'hoa-le' ? 'Hoa lẻ' :
                           product.category === 'chau-hoa' ? 'Chậu hoa' : 'Quà tặng'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-black text-pink-600">
                          {product.price.toLocaleString('vi-VN')}đ
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package size={14} className={product.stock_quantity > 0 ? 'text-green-500' : 'text-rose-500'} />
                          <span className={`text-sm font-bold ${
                            product.stock_quantity > 0 ? 'text-slate-700' : 'text-rose-500'
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2.5 bg-gray-50 text-slate-600 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition duration-200"
                            title="Sửa sản phẩm"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition duration-200"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="max-w-md mx-auto flex flex-col items-center">
                        <div className="text-4xl mb-4">🌸</div>
                        <h3 className="font-bold text-lg text-slate-700">Không tìm thấy sản phẩm nào</h3>
                        <p className="text-gray-400 text-sm mt-1">Thử đổi từ khóa tìm kiếm hoặc lọc danh mục khác nhé.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-gray-100 shadow-2xl animate-scaleUp">
            <div className="text-rose-500 bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-2">Xác nhận xóa hoa?</h3>
            <p className="text-gray-500 leading-relaxed text-sm mb-8">
              Hành động này sẽ xóa vĩnh viễn mẫu hoa đất sét này khỏi hệ thống cửa hàng và không thể hoàn tác. Bạn chắc chắn chứ?
            </p>

            <div className="flex gap-4">
              <button
                disabled={deleting}
                onClick={() => setDeleteId(null)}
                className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-slate-700 font-bold rounded-2xl transition"
              >
                Hủy
              </button>
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition shadow-lg shadow-rose-100 disabled:bg-rose-300"
              >
                {deleting ? 'Đang xóa...' : 'Đúng, xóa ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
