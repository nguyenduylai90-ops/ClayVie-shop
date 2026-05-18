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

-- 5. Create Policies (Example: Admin can do everything, public can view products)
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Only authenticated admins can manage products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can manage orders" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Only authenticated admins can manage order_items" ON order_items FOR ALL TO authenticated USING (true);

-- Cho phép khách vãng lai gửi đơn hàng và lưu sản phẩm đơn hàng
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert order_items" ON public.order_items;

CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);

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

CREATE TRIGGER trigger_subtract_stock
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.subtract_product_stock();
