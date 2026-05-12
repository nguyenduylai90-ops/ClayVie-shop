# Phase 02: Database & Auth
Status: 🟡 In Progress
Dependencies: Phase 01

## Objective
Thiết lập cơ sở dữ liệu trên Supabase và chức năng đăng nhập Admin.

## Implementation Steps
1. [x] Tạo bảng `products` (SQL Script in `docs/database.sql`).
2. [x] Tạo bảng `orders` (SQL Script in `docs/database.sql`).
3. [x] Tạo bảng `order_items` (SQL Script in `docs/database.sql`).
4. [ ] Cấu hình Authentication trên Supabase cho tài khoản Admin.
5. [x] Tạo Middleware kiểm tra đăng nhập cho các trang `/admin`.

## Test Criteria
- [ ] Đăng nhập vào được trang Admin.
- [ ] Thêm thử dữ liệu vào bảng qua Supabase Dashboard thành công.
