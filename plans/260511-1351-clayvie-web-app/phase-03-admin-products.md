# Phase 03: Admin - Product Management
Status: ✅ Done
Dependencies: Phase 02

## Objective
Xây dựng giao diện và logic quản lý sản phẩm hoa đất sét dành cho Admin.

## Implementation Steps
1. [x] Tạo Admin Layout (`src/app/admin/layout.tsx`) với sidebar điều hướng.
2. [x] Tạo trang danh sách sản phẩm (`src/app/admin/products/page.tsx`).
3. [x] Tạo trang thêm sản phẩm mới (`src/app/admin/products/new/page.tsx`).
4. [x] Viết logic xử lý thêm sản phẩm mới.
5. [x] Tích hợp hiển thị danh sách sản phẩm từ Supabase.

## Test Criteria
- [ ] Truy cập được vào `/admin/products`.
- [ ] Thêm được một sản phẩm mới và thấy nó hiện trong danh sách.
- [ ] Dữ liệu được lưu đúng vào bảng `products` trong Supabase.
