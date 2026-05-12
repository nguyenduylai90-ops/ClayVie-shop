import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-pink-400">ClayVie Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="block p-3 hover:bg-slate-700 rounded transition">
            📊 Dashboard
          </Link>
          <Link href="/admin/products" className="block p-3 hover:bg-slate-700 rounded transition">
            🌸 Sản phẩm
          </Link>
          <Link href="/admin/orders" className="block p-3 hover:bg-slate-700 rounded transition">
            📦 Đơn hàng
          </Link>
          <div className="pt-8 mt-8 border-t border-slate-700">
            <Link href="/" className="block p-3 text-gray-400 hover:text-white transition">
              🏠 Về trang chủ
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
