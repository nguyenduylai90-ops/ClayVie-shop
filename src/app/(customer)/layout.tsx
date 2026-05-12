'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-pink-600">ClayVie</span>
            <span className="bg-pink-100 text-pink-600 text-[10px] px-2 py-0.5 rounded-full font-bold">HANDMADE</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium transition">Trang chủ</Link>
            <a href="/#san-pham" className="text-gray-600 hover:text-pink-600 font-medium transition">Sản phẩm</a>
            <Link href="/track-order" className="text-pink-600 hover:text-pink-700 font-bold transition">Tra cứu đơn hàng</Link>
            <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium transition">Về chúng tôi</Link>
            <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium transition">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-pink-600 transition">Admin</Link>
            <Link href="/checkout" className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-pink-200 hover:bg-pink-700 transition flex items-center gap-2">
              <span>Giỏ hàng</span>
              <span className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-xs">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 ClayVie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
