'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingBag, CreditCard, AlertCircle } from 'lucide-react';

export default function AddToCartSection({ product }: { product: any }) {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  
  const [quantity, setQuantity] = useState(isOutOfStock ? 0 : 1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleDecrease = () => {
    if (isOutOfStock) return;
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (isOutOfStock) return;
    if (quantity < product.stock_quantity) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    alert('Đã thêm vào giỏ hàng! 🌸');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100/80 space-y-6 shadow-sm">
      {/* Stock status indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Tình trạng:</span>
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-100/50 uppercase tracking-wide">
            Hết hàng
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-50 text-amber-600 border border-amber-100/50 animate-pulse">
            <AlertCircle size={12} />
            Chỉ còn {product.stock_quantity} mẫu!
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-green-50 text-green-600 border border-green-100/50">
            Còn hàng ({product.stock_quantity})
          </span>
        )}
      </div>
      
      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Quantity selector */}
        <div className={`flex items-center justify-between border rounded-2xl bg-white p-2.5 transition duration-300 ${
          isOutOfStock ? 'border-gray-100 bg-gray-50/50 opacity-60' : 'border-gray-200 focus-within:border-pink-500'
        }`}>
          <button 
            type="button"
            disabled={isOutOfStock || quantity <= 1}
            onClick={handleDecrease} 
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition duration-200"
          >
            <Minus size={16} />
          </button>
          
          <input 
            type="number" 
            disabled={isOutOfStock}
            value={quantity}
            onChange={(e) => {
              const val = Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1));
              setQuantity(val);
            }}
            className="w-12 text-center font-black text-slate-800 outline-none bg-transparent disabled:text-gray-400" 
          />
          
          <button 
            type="button"
            disabled={isOutOfStock || quantity >= product.stock_quantity}
            onClick={handleIncrease} 
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition duration-200"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add to Cart button */}
        <button 
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all duration-300 shadow-lg shadow-pink-100 hover:scale-[1.01] transform"
        >
          <ShoppingBag size={18} />
          {isOutOfStock ? 'Hết hàng tạm thời' : 'Thêm vào giỏ hàng'}
        </button>
      </div>
      
      {/* Buy Now button */}
      <button 
        type="button"
        disabled={isOutOfStock}
        onClick={handleBuyNow}
        className="w-full flex items-center justify-center gap-2 border-2 border-pink-600 text-pink-600 font-bold py-4 rounded-2xl hover:bg-pink-50 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent transition-all duration-300"
      >
        <CreditCard size={18} />
        Mua ngay
      </button>
    </div>
  );
}
