import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <div className="flex-1">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-8">
          <div>
            <span className="text-pink-600 font-bold uppercase tracking-wider text-sm">{product.category || 'Handmade'}</span>
            <h1 className="text-4xl font-black text-gray-900 mt-2">{product.name}</h1>
            <p className="text-3xl font-bold text-pink-600 mt-4">
              {product.price.toLocaleString('vi-VN')} đ
            </p>
          </div>

          <div className="prose prose-pink text-gray-600">
            <h3 className="text-lg font-bold text-gray-800">Mô tả sản phẩm</h3>
            <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tình trạng:</span>
              <span className="text-green-600 font-bold">Còn hàng ({product.stock_quantity})</span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button className="px-4 py-2 hover:bg-gray-100">-</button>
                <input type="number" defaultValue="1" className="w-12 text-center outline-none" />
                <button className="px-4 py-2 hover:bg-gray-100">+</button>
              </div>
              <button className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition shadow-lg shadow-pink-200">
                Thêm vào giỏ hàng
              </button>
            </div>
            
            <Link 
              href={`/checkout?productId=${product.id}`}
              className="w-full block text-center border-2 border-pink-600 text-pink-600 font-bold py-3 rounded-xl hover:bg-pink-50 transition"
            >
              Mua ngay
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              🚚 Giao hàng toàn quốc
            </div>
            <div className="flex items-center gap-2">
              🛡️ Bảo hành 12 tháng
            </div>
            <div className="flex items-center gap-2">
              ✨ Chất liệu cao cấp
            </div>
            <div className="flex items-center gap-2">
              🎨 Thủ công 100%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
