import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function HomePage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-pink-50 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-200 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Hoa Đất Sét <span className="text-pink-600">Handmade</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Nghệ thuật tạo hình từ đất sét, mang vẻ đẹp vĩnh cửu của thiên nhiên vào không gian sống của bạn.
          </p>
          <button className="bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-pink-700 transition shadow-xl hover:scale-105 transform">
            Khám phá ngay
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 mt-2">Những mẫu hoa được yêu thích nhất tại ClayVie</p>
          </div>
          <Link href="/products" className="text-pink-600 font-semibold hover:underline">
            Xem tất cả &rarr;
          </Link>
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
                    {product.category || 'New'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-pink-600">
                      {product.price.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-xs text-gray-400">Đã bán 12</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
               <p className="text-gray-400">Đang cập nhật các mẫu hoa mới...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
