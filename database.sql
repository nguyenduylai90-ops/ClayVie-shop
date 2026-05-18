-- SQL Script for ClayVie Database Schema

-- 1. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, shipping, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_time NUMERIC NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Quyền truy cập cho cửa hàng ClayVie)
-- Bỏ các policy cũ để tránh lỗi trùng lặp khi chạy lại
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Only authenticated admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Only authenticated admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Only authenticated admins can manage order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public can select orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
DROP POLICY IF EXISTS "Public can select order_items" ON public.order_items;
DROP POLICY IF EXISTS "Public can manage products" ON public.products;
DROP POLICY IF EXISTS "Public can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Public can manage order_items" ON public.order_items;

-- Thiết lập quyền Public để Admin không cần đăng nhập vẫn quản lý được qua API Client
CREATE POLICY "Public can manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public can manage orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public can manage order_items" ON public.order_items FOR ALL USING (true);

-- 6. Trigger tự động trừ hàng tồn kho khi đặt hàng thành công
CREATE OR REPLACE FUNCTION public.subtract_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_subtract_stock ON public.order_items;
CREATE TRIGGER trigger_subtract_stock
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.subtract_product_stock();

-- 7. Trigger tự động CỘNG LẠI hàng tồn kho khi HỦY đơn hàng (status = 'cancelled')
CREATE OR REPLACE FUNCTION public.handle_order_status_stock_adjustment()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
BEGIN
  -- Trường hợp 1: Chuyển trạng thái SANG 'cancelled' (Hủy đơn -> Cộng lại kho)
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    FOR item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
      UPDATE public.products
      SET stock_quantity = stock_quantity + item.quantity
      WHERE id = item.product_id;
    END LOOP;
  
  -- Trường hợp 2: Khôi phục từ 'cancelled' VỀ trạng thái khác (Kích hoạt lại đơn -> Trừ lại kho)
  ELSIF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    FOR item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id LOOP
      UPDATE public.products
      SET stock_quantity = GREATEST(0, stock_quantity - item.quantity)
      WHERE id = item.product_id;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_order_status_stock ON public.orders;
CREATE TRIGGER trigger_order_status_stock
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_status_stock_adjustment();

-- 8. Trigger tự động CỘNG LẠI hàng tồn kho khi XÓA hẳn đơn hàng (hoặc xóa order_items)
CREATE OR REPLACE FUNCTION public.restore_product_stock_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Chỉ cộng lại kho nếu đơn hàng đó CHƯA bị hủy (nếu đã hủy thì kho đã được cộng từ trước)
  IF EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = OLD.order_id AND status != 'cancelled'
  ) THEN
    UPDATE public.products
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE id = OLD.product_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_restore_stock_on_delete ON public.order_items;
CREATE TRIGGER trigger_restore_stock_on_delete
AFTER DELETE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.restore_product_stock_on_delete();
