'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left p-3 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition flex items-center gap-2"
    >
      <span>🚪</span> Đăng xuất
    </button>
  );
}
