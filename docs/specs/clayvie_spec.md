# 🛠️ SPECS: ClayVie Web App

## 1. Executive Summary
ClayVie là giải pháp web app toàn diện cho shop hoa đất sét, kết hợp giữa cửa hàng online cho khách và công cụ quản trị cho chủ shop.

## 2. User Stories
- **Khách hàng:** Có thể xem ảnh hoa chất lượng cao, đặt hàng nhanh mà không cần tài khoản, gửi yêu cầu custom.
- **Admin:** Đăng sản phẩm mới, nhận thông báo đơn hàng, quản lý quy trình làm hoa, xem báo cáo doanh thu.

## 3. Database Design (Conceptual)
- **Table: products**
    - id (UUID, PK)
    - name (Text)
    - price (Numeric)
    - description (Text)
    - images (Array of Text)
- **Table: orders**
    - id (UUID, PK)
    - customer_info (JSON: name, phone, address)
    - status (Enum: pending, contacting, processing, shipping, completed)
    - type (Enum: ready_made, custom)
    - total_price (Numeric)

## 4. UI Components
- **Public:** `Header`, `Hero`, `ProductGallery`, `ProductCard`, `OrderForm`, `Footer`.
- **Admin:** `Sidebar`, `StatCard`, `OrderTable`, `ProductForm`, `RevenueChart`.

## 5. Tech Stack
- Next.js (Frontend & API Routes)
- Supabase (Auth, DB, Storage)
- Chart.js (Visualization)
- Lucide React (Icons)
