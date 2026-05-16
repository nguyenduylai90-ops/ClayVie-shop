'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function AddToCartSection({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock_quantity) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Đã thêm vào giỏ hàng! 🌸');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Tình trạng:</span>
        <span className="text-green-600 font-bold">Còn hàng ({product.stock_quantity})</span>
      </div>
      
      <div className="flex gap-4">
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button onClick={handleDecrease} className="px-4 py-2 hover:bg-gray-100 transition">-</button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
            className="w-12 text-center outline-none" 
          />
          <button onClick={handleIncrease} className="px-4 py-2 hover:bg-gray-100 transition">+</button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition shadow-lg shadow-pink-200"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
      
      <button 
        onClick={handleBuyNow}
        className="w-full block text-center border-2 border-pink-600 text-pink-600 font-bold py-3 rounded-xl hover:bg-pink-50 transition"
      >
        Mua ngay
      </button>
    </div>
  );
}
