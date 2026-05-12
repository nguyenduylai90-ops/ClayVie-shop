'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Đang tải sản phẩm...</div>;
  if (!product) return <div className="p-20 text-center">Không tìm thấy sản phẩm.</div>;

  // Kiểm tra xem còn hàng không
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    alert('Đã thêm hoa vào giỏ hàng! 🌸');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Ảnh sản phẩm */}
        <div className="rounded-[40px] overflow-hidden bg-gray-50 shadow-inner relative">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-black px-8 py-3 rounded-full font-black text-2xl shadow-2xl uppercase tracking-tighter">Hết hàng</span>
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="space-y-8">
          <div>
            <p className="text-pink-600 font-bold uppercase tracking-widest text-sm mb-2">{product.category}</p>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">{product.name}</h1>
            <p className="text-4xl font-black text-pink-600">{Number(product.price).toLocaleString('vi-VN')}đ</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-6">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl p-2 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-12 h-12 flex items-center justify-center font-bold text-2xl hover:text-pink-600 transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} 
                  className="w-12 h-12 flex items-center justify-center font-bold text-2xl hover:text-pink-600 transition"
                >
                  +
                </button>
              </div>
              <p className="text-gray-400 font-bold">
                Còn lại <span className="text-gray-800">{product.stock_quantity}</span> sản phẩm
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-6 rounded-3xl font-bold text-xl transition-all duration-300 ${
                isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50'
              }`}
            >
              Thêm vào giỏ hàng
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 py-6 rounded-3xl font-bold text-xl transition-all duration-300 shadow-xl ${
                isOutOfStock 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-100'
              }`}
            >
              {isOutOfStock ? 'Tạm hết hàng' : 'Mua ngay'}
            </button>
          </div>
          
          {isOutOfStock && (
            <p className="text-center text-gray-400 font-medium">
              Sản phẩm này hiện đã hết. Anh/Chị vui lòng quay lại sau nhé! 🌸
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
