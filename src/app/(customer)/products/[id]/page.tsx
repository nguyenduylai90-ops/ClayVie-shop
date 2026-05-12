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
      setLoading(true);
      if (data) setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Đang tải sản phẩm...</div>;
  if (!product) return <div className="p-20 text-center">Không tìm thấy sản phẩm.</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Đã thêm hoa vào giỏ hàng! 🌸');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Ảnh sản phẩm */}
        <div className="rounded-3xl overflow-hidden bg-gray-50">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Thông tin */}
        <div className="space-y-8">
          <div>
            <p className="text-pink-600 font-bold uppercase tracking-widest text-sm mb-2">{product.category}</p>
            <h1 className="text-5xl font-black text-gray-900 mb-4">{product.name}</h1>
            <p className="text-4xl font-black text-pink-600">{Number(product.price).toLocaleString('vi-VN')}đ</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl">
            <h3 className="font-bold text-gray-800 mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center border-2 border-gray-100 rounded-2xl p-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center font-bold text-xl">-</button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center font-bold text-xl">+</button>
            </div>
            <p className="text-gray-400 text-sm">Còn lại {product.stock_quantity} sản phẩm</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white border-2 border-pink-600 text-pink-600 py-5 rounded-2xl font-bold text-xl hover:bg-pink-50 transition"
            >
              Thêm vào giỏ hàng
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-pink-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-pink-700 transition shadow-xl shadow-pink-100"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
