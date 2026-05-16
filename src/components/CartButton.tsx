'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function CartButton() {
  const { cartCount } = useCart();

  return (
    <Link href="/checkout" className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-700 transition shadow-sm hover:shadow-md">
      <ShoppingBag size={16} />
      <span>Giỏ hàng</span>
      {cartCount > 0 && (
        <span className="bg-white text-pink-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
