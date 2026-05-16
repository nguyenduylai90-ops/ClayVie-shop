import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/types';

type Product = Database['public']['Tables']['products']['Row'];

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition shadow-md"
        >
          + Thêm hoa mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Hình ảnh</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Tên hoa</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Giá</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Tồn kho</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-pink-600 font-semibold">{product.price.toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 text-gray-600">{product.stock_quantity}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Sửa</button>
                    <button className="text-red-600 hover:text-red-800">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
