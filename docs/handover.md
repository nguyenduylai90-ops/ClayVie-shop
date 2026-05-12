# Tài liệu Bàn giao Dự án ClayVie 🌸

Dự án Web App quản lý hoa đất sét handmade.

## 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Language:** TypeScript

## 🚀 Hướng dẫn Chạy Dự án (Local)

### 1. Yêu cầu hệ thống
- Đã cài đặt **Node.js** (phiên bản 18 trở lên).
- Đã cài đặt **npm** hoặc **yarn**.

### 2. Cài đặt Dependencies
Mở terminal tại thư mục `ClayVie` và chạy lệnh:
```bash
npm install
```

### 3. Cấu hình Môi trường
Kiểm tra file `.env.local` và đảm bảo các thông số `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` đã chính xác.

### 4. Chạy dự án
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

## 📁 Cấu trúc Thư mục Chính
- `src/app/(customer)`: Giao diện dành cho khách mua hàng.
- `src/app/admin`: Giao diện quản lý cho chủ shop.
- `src/lib/supabase.ts`: Cấu hình kết nối Database.
- `docs/database.sql`: File chứa lệnh tạo bảng dữ liệu.

## 📌 Các tính năng đã hoàn thiện
- [x] Xem danh sách sản phẩm & chi tiết.
- [x] Đặt hàng & lưu thông tin khách hàng.
- [x] Quản lý sản phẩm (Thêm mới).
- [x] Xem danh sách đơn hàng & Thống kê doanh thu.

---
*Chúc anh quản lý cửa hàng ClayVie hồng phát!* 🫡
