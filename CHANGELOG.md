# Changelog: ClayVie

## [2026-05-11] - "The Handmade Genesis"
Hôm nay chúng ta đã khởi động và hoàn thành phiên bản đầu tiên (MVP) của dự án.

### Added
- **Project Structure:** Khởi tạo Next.js App Router (Manual Boilerplate).
- **Database:** SQL Schema cho Products, Orders, Order_items.
- **Admin Panel:**
    - Dashboard thống kê cơ bản.
    - Quản lý danh sách & thêm mới Sản phẩm.
    - Quản lý danh sách Đơn hàng.
- **Customer Frontend:**
    - Trang chủ (Hero + Product Grid).
    - Trang chi tiết sản phẩm.
    - Quy trình Checkout & đặt hàng (Single item).
- **Auth:** Middleware bảo vệ route `/admin`.

### Changed
- Cập nhật `.env.local` với cấu hình Supabase thực tế của user.

### Fixed
- Lỗi thiếu môi trường Node.js bằng cách tạo file boilerplate thủ công.
