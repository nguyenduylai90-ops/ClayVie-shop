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
