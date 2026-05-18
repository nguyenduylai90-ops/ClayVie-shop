import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartSection from '@/components/AddToCartSection';

export const dynamic = 'force-dynamic';

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

          <AddToCartSection product={product} />

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
