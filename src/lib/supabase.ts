import { createBrowserClient } from '@supabase/ssr';

// Khởi tạo Supabase Client hỗ trợ Cookies cho Next.js
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
