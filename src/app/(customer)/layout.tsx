import Link from 'next/link';
import CartButton from '@/components/CartButton';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-pink-600">ClayVie</span>
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">Handmade</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-pink-600 transition">Trang chủ</Link>
              <Link href="/products" className="hover:text-pink-600 transition">Sản phẩm</Link>
              <Link href="/about" className="hover:text-pink-600 transition">Về chúng tôi</Link>
              <Link href="/contact" className="hover:text-pink-600 transition">Liên hệ</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">Admin</Link>
              <CartButton />
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-pink-50 py-12 mt-24 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-pink-600 font-bold text-xl mb-4">ClayVie 🌸</p>
          <p className="text-gray-500 text-sm">Trao gửi yêu thương qua từng cánh hoa đất sét.</p>
          <div className="mt-8 pt-8 border-t border-pink-200 text-gray-400 text-xs">
            © 2026 ClayVie. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
