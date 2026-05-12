import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Ép Next.js luôn lấy dữ liệu mới (không dùng cache cũ)
export const revalidate = 0;

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Lỗi lấy sản phẩm:", error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-pink-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 tracking-tight">
            Clay<span className="text-pink-600">Vie</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium">
            Nghệ thuật tạo hình từ đất sét, mang vẻ đẹp vĩnh cửu của thiên nhiên vào không gian sống của bạn.
          </p>
          <a href="#san-pham" className="bg-pink-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-pink-700 transition shadow-2xl hover:scale-105 transform inline-block">
            Khám phá ngay
          </a>
        </div>
      </section>

      {/* Product Grid */}
      <section id="san-pham" className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 mt-2 text-lg">Những mẫu hoa được yêu thích nhất tại ClayVie</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-pink-600 shadow-lg">
                    {product.category || 'Handmade'}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-pink-600">
                      {Number(product.price).toLocaleString('vi-VN')}đ
                    </span>
                    <div className="bg-pink-50 text-pink-600 px-4 py-2 rounded-xl font-bold group-hover:bg-pink-600 group-hover:text-white transition-colors">
                      Mua ngay
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-50 rounded-[40px]">
               <div className="text-6xl mb-4">🌸</div>
               <p className="text-gray-400 text-xl font-medium">Đang cập nhật các mẫu hoa mới nhất...</p>
               <p className="text-gray-300 text-sm mt-2">(Nếu đã thêm data, hãy Redeploy trên Vercel để cập nhật anh nhé!)</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
