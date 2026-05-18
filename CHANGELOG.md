# Changelog: ClayVie

## [2026-05-18] - "Interactive Product Editor & Premium Image Uploader"
Hoàn thành nâng cấp giao diện quản lý danh mục sản phẩm (CRUD) và tích hợp bộ tải ảnh trực tiếp.

### Added
- **Product Edit Page:** Tạo trang dynamic route `/admin/products/edit/[id]/page.tsx` tự động load thông tin sản phẩm và lưu cập nhật về Supabase.
- **Premium Image Uploader:** Xây dựng bộ tải ảnh kéo thả (Drag & Drop File Upload) có live preview. Hỗ trợ tải trực tiếp lên Supabase Storage (bucket `products`) hoặc chuyển sang dán URL linh hoạt.
- **Search & Filter:** Tích hợp bộ tìm kiếm sản phẩm theo tên/mô tả và lọc theo danh mục ngay tại trang danh sách admin.

### Changed
- **Interactive Product List:** Chuyển `/admin/products/page.tsx` thành Client Component hỗ trợ xóa sản phẩm realtime kèm modal xác nhận an toàn, nút sửa/xóa hoạt động hoàn chỉnh.

## [2026-05-16] - "Cart & UX Enhancements"
Hoàn thiện luồng mua hàng và bổ sung các trang còn thiếu từ MVP.

### Added
- **Global Cart State:** Tích hợp `CartProvider` (sử dụng Context API và LocalStorage) vào toàn bộ ứng dụng.
- **Cart Features:** 
  - Thêm tính năng tăng/giảm số lượng và xoá sản phẩm khỏi giỏ hàng.
  - Component `CartButton` hiển thị số lượng realtime trên Navbar.
  - Component `AddToCartSection` tại trang chi tiết sản phẩm.
- **Checkout:** Thêm trường nhập "Ghi chú thêm" khi đặt hàng.
- **Pages:** Bổ sung các trang hoàn chỉnh cho `/products`, `/about`, và tự động chuyển hướng `/admin` sang `/admin/dashboard`.

### Fixed
- Lỗi 404 khi truy cập các trang từ menu (Sản phẩm, Về chúng tôi, Admin).
- Thêm validate số điện thoại (chỉ nhận đúng 10 số, không nhận chữ) tại trang Checkout.

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
