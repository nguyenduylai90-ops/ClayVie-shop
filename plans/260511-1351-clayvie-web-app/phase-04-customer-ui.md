# Phase 04: Customer UI & Ordering
Status: ✅ Done
Dependencies: Phase 02, Phase 03

## Objective
Xây dựng giao diện cho khách hàng xem sản phẩm hoa đất sét và đặt hàng trực tuyến.

## Implementation Steps
1. [x] Tạo Customer Layout (`src/app/(customer)/layout.tsx`) với thanh điều hướng (Navbar).
2. [x] Thiết kế trang chủ hiển thị danh sách sản phẩm (Grid view).
3. [x] Tạo trang chi tiết sản phẩm (`src/app/(customer)/products/[id]/page.tsx`).
4. [x] Tạo form đặt hàng (Checkout) đơn giản (`src/app/(customer)/checkout/page.tsx`).
5. [x] Viết logic lưu đơn hàng vào bảng `orders` và `order_items` bằng Supabase client.

## Test Criteria
- [ ] Khách hàng xem được danh sách hoa.
- [ ] Khách hàng có thể nhấn vào xem chi tiết một sản phẩm.
- [ ] Khách hàng điền thông tin và đặt hàng thành công.
