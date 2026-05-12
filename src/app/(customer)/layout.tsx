// Trong file src/app/(customer)/layout.tsx, hãy sửa phần <nav> như sau:

<nav className="hidden md:flex items-center gap-8">
  <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium transition">Trang chủ</Link>
  <Link href="/track-order" className="text-gray-600 hover:text-pink-600 font-medium transition">Tra cứu đơn hàng</Link>
  {/* Nút Đặt theo yêu cầu mới đây anh */}
  <Link href="/custom-order" className="text-pink-600 hover:text-pink-700 font-bold transition flex items-center gap-2">
    <span className="w-2 h-2 bg-pink-600 rounded-full animate-pulse"></span>
    Đặt theo yêu cầu
  </Link>
  <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium transition">Liên hệ</Link>
</nav>
