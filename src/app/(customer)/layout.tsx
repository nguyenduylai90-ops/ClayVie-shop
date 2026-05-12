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
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black text-pink-600 transition-transform group-hover:scale-110">ClayVie</span>
            <span className="bg-pink-100 text-pink-600 text-[10px] px-2 py-0.5 rounded-full font-black">HANDMADE</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-pink-600 font-bold text-sm transition">Trang chủ</Link>
            <a href="/#san-pham" className="text-gray-600 hover:text-pink-600 font-bold text-sm transition">Sản phẩm</a>
            <Link href="/track-order" className="text-gray-600 hover:text-pink-600 font-bold text-sm transition">Tra cứu đơn hàng</Link>
            
            {/* Nút Đặt theo yêu cầu nổi bật */}
            <Link href="/custom-order" className="text-pink-600 hover:text-pink-700 font-black text-sm transition flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
              <span className="w-2 h-2 bg-pink-600 rounded-full animate-pulse"></span>
              Đặt theo yêu cầu
            </Link>

            <Link href="/" className="text-gray-600 hover:text-pink-600 font-bold text-sm transition">Về chúng tôi</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-xs font-black text-gray-300 hover:text-pink-600 transition uppercase tracking-widest">Admin</Link>
            <Link href="/checkout" className="relative bg-pink-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-pink-100 hover:bg-pink-700 transition flex items-center gap-3">
              <span className="text-sm">Giỏ hàng</span>
              <span className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-[10px] font-black">{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="text-2xl font-black text-gray-800">ClayVie</span>
            <p
