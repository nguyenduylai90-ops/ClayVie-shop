import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Tất Cả Sản Phẩm</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Khám phá bộ sưu tập hoa đất sét thủ công độc bản, mang vẻ đẹp vĩnh cửu vào không gian của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">
                  {product.category || 'Handmade'}
                </div>
                {product.stock_quantity <= 0 && (
                  <div className="absolute top-4 right-4 bg-rose-600/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10">
                    Hết hàng
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-pink-600">
                    {product.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
             <p className="text-gray-400">Chưa có sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
