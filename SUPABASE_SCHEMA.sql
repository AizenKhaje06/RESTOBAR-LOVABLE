-- RestauBar Management System - Complete Supabase Schema
-- Copy & Paste all SQL below into Supabase SQL Editor
-- Then run it to set up the database

-- =====================================================
-- 1. ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator with full access'),
  ('pos', 'Point of Sale operator'),
  ('waiter', 'Waiter/Server staff'),
  ('table', 'Table/Customer access')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 2. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- Sample data (passwords are hashed - use bcrypt in production)
INSERT INTO users (email, password_hash, name, role_id, phone, status) VALUES
  ('admin@restaubar.com', 'hash_admin123', 'Admin User', (SELECT id FROM roles WHERE name = 'admin'), '555-0001', 'active'),
  ('pos@restaubar.com', 'hash_pos123', 'POS User', (SELECT id FROM roles WHERE name = 'pos'), '555-0002', 'active'),
  ('waiter@restaubar.com', 'hash_waiter123', 'Waiter User', (SELECT id FROM roles WHERE name = 'waiter'), '555-0003', 'active')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 3. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description, display_order) VALUES
  ('Food', 'Main dishes and meals', 1),
  ('Drinks', 'Non-alcoholic beverages', 2),
  ('Beer', 'Beer selection', 3),
  ('Cocktail', 'Mixed cocktails', 4),
  ('Liquor', 'Spirits and liqueurs', 5),
  ('Dessert', 'Desserts and sweets', 6),
  ('Add-ons', 'Additional items and sides', 7)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. MENU ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  preparation_time INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);

-- Sample menu data
INSERT INTO menu_items (name, category_id, description, price, is_available) VALUES
  ('Burger', (SELECT id FROM categories WHERE name = 'Food'), 'Classic beef burger with crispy fries', 250.00, true),
  ('Pizza Margherita', (SELECT id FROM categories WHERE name = 'Food'), 'Fresh mozzarella and basil', 380.00, true),
  ('Caesar Salad', (SELECT id FROM categories WHERE name = 'Food'), 'Crisp romaine with parmesan', 220.00, true),
  ('Pasta Carbonara', (SELECT id FROM categories WHERE name = 'Food'), 'Creamy pasta with bacon and eggs', 320.00, true),
  ('Coca-Cola', (SELECT id FROM categories WHERE name = 'Drinks'), 'Cold soft drink', 80.00, true),
  ('Iced Tea', (SELECT id FROM categories WHERE name = 'Drinks'), 'Fresh iced tea', 70.00, true),
  ('Orange Juice', (SELECT id FROM categories WHERE name = 'Drinks'), 'Fresh squeezed orange juice', 90.00, true),
  ('San Miguel Beer', (SELECT id FROM categories WHERE name = 'Beer'), 'Local premium beer', 120.00, true),
  ('Margarita', (SELECT id FROM categories WHERE name = 'Cocktail'), 'Tequila-based cocktail', 280.00, true),
  ('Mojito', (SELECT id FROM categories WHERE name = 'Cocktail'), 'Refreshing mint cocktail', 250.00, true),
  ('Tiramisu', (SELECT id FROM categories WHERE name = 'Dessert'), 'Classic Italian dessert', 180.00, true),
  ('Chocolate Cake', (SELECT id FROM categories WHERE name = 'Dessert'), 'Rich chocolate cake', 200.00, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. TABLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INT NOT NULL UNIQUE CHECK (table_number > 0),
  capacity INT NOT NULL CHECK (capacity > 0),
  status VARCHAR(50) DEFAULT 'available',
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tables_table_number ON restaurant_tables(table_number);
CREATE INDEX idx_tables_status ON restaurant_tables(status);

-- Sample tables data
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
  (1, 2, 'available'),
  (2, 2, 'available'),
  (3, 4, 'available'),
  (4, 4, 'available'),
  (5, 6, 'available'),
  (6, 6, 'available')
ON CONFLICT (table_number) DO NOTHING;

-- =====================================================
-- 6. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  table_id UUID NOT NULL REFERENCES restaurant_tables(id),
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  service_charge DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =====================================================
-- 7. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_order DECIMAL(10, 2) NOT NULL,
  special_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- =====================================================
-- 8. PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  amount_due DECIMAL(10, 2) NOT NULL,
  amount_received DECIMAL(10, 2),
  amount_change DECIMAL(10, 2),
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'unpaid',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- 9. RECEIPTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  payment_id UUID NOT NULL REFERENCES payments(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  receipt_content TEXT,
  printed BOOLEAN DEFAULT false,
  printed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_receipts_payment_id ON receipts(payment_id);
CREATE INDEX idx_receipts_order_id ON receipts(order_id);

-- =====================================================
-- 10. ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);

-- =====================================================
-- 11. DAILY SALES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date DATE NOT NULL UNIQUE,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_service_charge DECIMAL(10, 2) DEFAULT 0,
  average_order_value DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_daily_sales_sale_date ON daily_sales(sale_date);

-- =====================================================
-- VIEWS FOR EASIER QUERIES
-- =====================================================

-- View: Orders with Table and User Info
CREATE OR REPLACE VIEW orders_summary AS
SELECT 
  o.id,
  o.order_number,
  rt.table_number,
  rt.capacity,
  o.status,
  o.subtotal,
  o.tax_amount,
  o.service_charge,
  o.total_amount,
  COUNT(oi.id) as item_count,
  o.created_at,
  o.updated_at
FROM orders o
JOIN restaurant_tables rt ON o.table_id = rt.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, rt.table_number, rt.capacity;

-- View: Menu Items with Category
CREATE OR REPLACE VIEW menu_items_detail AS
SELECT 
  mi.id,
  mi.name,
  c.name as category,
  mi.description,
  mi.price,
  mi.image_url,
  mi.is_available,
  mi.is_popular,
  mi.created_at
FROM menu_items mi
JOIN categories c ON mi.category_id = c.id;

-- View: Payment Status Summary
CREATE OR REPLACE VIEW payment_summary AS
SELECT 
  p.id,
  o.order_number,
  rt.table_number,
  p.amount_due,
  p.amount_received,
  p.amount_change,
  p.payment_method,
  p.status,
  o.created_at,
  p.paid_at
FROM payments p
JOIN orders o ON p.order_id = o.id
JOIN restaurant_tables rt ON o.table_id = rt.id;

-- =====================================================
-- FUNCTIONS FOR AUTOMATIC TRIGGERS
-- =====================================================

-- Function: Update table status when order is placed
CREATE OR REPLACE FUNCTION update_table_status_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurant_tables 
  SET status = 'ordering', updated_at = NOW()
  WHERE id = NEW.table_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update table status
CREATE TRIGGER trigger_update_table_status
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION update_table_status_on_order();

-- Function: Calculate order totals
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_subtotal DECIMAL(10, 2);
  v_tax DECIMAL(10, 2);
  v_service DECIMAL(10, 2);
BEGIN
  -- Calculate subtotal
  SELECT COALESCE(SUM(quantity * price_at_order), 0)
  INTO v_subtotal
  FROM order_items
  WHERE order_id = NEW.order_id;
  
  -- Calculate tax (12%)
  v_tax := v_subtotal * 0.12;
  
  -- Calculate service charge (10%)
  v_service := v_subtotal * 0.10;
  
  -- Update order
  UPDATE orders
  SET 
    subtotal = v_subtotal,
    tax_amount = v_tax,
    service_charge = v_service,
    total_amount = v_subtotal + v_tax + v_service,
    updated_at = NOW()
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Calculate totals
CREATE TRIGGER trigger_calculate_order_totals
AFTER INSERT OR UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_order_totals();

-- Function: Log activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (action, entity_type, entity_id, details)
  VALUES (
    TG_ARGV[0],
    TG_TABLE_NAME,
    NEW.id,
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (OPTIONAL - Enable for Production)
-- =====================================================

-- Uncomment these lines when you have authentication set up

-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY users_policy ON orders
--   FOR SELECT USING (auth.uid() IS NOT NULL);

-- =====================================================
-- STORAGE BUCKET (Manual Setup Required)
-- =====================================================
-- After running this SQL, go to Storage tab and:
-- 1. Create bucket: "menu-images"
-- 2. Make it public
-- 3. Add policy for public access

-- =====================================================
-- DONE!
-- =====================================================
-- Your database is now set up and ready to use!
-- Next steps:
-- 1. Update your .env.local with Supabase credentials
-- 2. Create menu-images bucket in Storage tab
-- 3. Restart the dev server
-- 4. Start using the app!
