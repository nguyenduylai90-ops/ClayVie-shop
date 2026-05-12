import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Lấy session thực tế
  const { data: { session } } = await supabase.auth.getSession();

  // Kiểm tra quyền truy cập Admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Nếu chưa đăng nhập, chuyển về login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Nếu đã đăng nhập mà vẫn cố vào trang /login, đẩy sang Admin
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
