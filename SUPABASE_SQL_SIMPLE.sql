-- SIMPLEST VERSION - JUST COPY AND PASTE ALL OF THIS INTO SUPABASE SQL EDITOR
-- No modifications needed - just run it!

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator'),
  ('pos', 'Point of Sale'),
  ('waiter', 'Waiter'),
  ('table', 'Table')
ON CONFLICT (name) DO NOTHING;

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (email, password_hash, name, role_id, phone, status) VALUES
  ('admin@restaubar.com', 'hash_admin123', 'Admin User', (SELECT id FROM roles WHERE name = 'admin'), '555-0001', 'active'),
  ('pos@restaubar.com', 'hash_pos123', 'POS User', (SELECT id FROM roles WHERE name = 'pos'), '555-0002', 'active'),
  ('waiter@restaubar.com', 'hash_waiter123', 'Waiter User', (SELECT id FROM roles WHERE name = 'waiter'), '555-0003', 'active')
ON CONFLICT (email) DO NOTHING;

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description, display_order) VALUES
  ('Food', 'Main dishes', 1),
  ('Drinks', 'Beverages', 2),
  ('Beer', 'Beer selection', 3),
  ('Cocktail', 'Mixed drinks', 4),
  ('Liquor', 'Spirits', 5),
  ('Dessert', 'Desserts', 6),
  ('Add-ons', 'Sides', 7)
ON CONFLICT (name) DO NOTHING;

-- 4. MENU ITEMS
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO menu_items (name, category_id, description, price, is_available) VALUES
  ('Burger', (SELECT id FROM categories WHERE name = 'Food'), 'Classic beef burger', 250.00, true),
  ('Pizza Margherita', (SELECT id FROM categories WHERE name = 'Food'), 'Fresh mozzarella and basil', 380.00, true),
  ('Caesar Salad', (SELECT id FROM categories WHERE name = 'Food'), 'Crisp romaine with parmesan', 220.00, true),
  ('Pasta Carbonara', (SELECT id FROM categories WHERE name = 'Food'), 'Creamy pasta with bacon', 320.00, true),
  ('Coca-Cola', (SELECT id FROM categories WHERE name = 'Drinks'), 'Cold soft drink', 80.00, true),
  ('Iced Tea', (SELECT id FROM categories WHERE name = 'Drinks'), 'Fresh iced tea', 70.00, true),
  ('San Miguel Beer', (SELECT id FROM categories WHERE name = 'Beer'), 'Local beer', 120.00, true),
  ('Margarita', (SELECT id FROM categories WHERE name = 'Cocktail'), 'Tequila cocktail', 280.00, true),
  ('Tiramisu', (SELECT id FROM categories WHERE name = 'Dessert'), 'Italian dessert', 180.00, true)
ON CONFLICT DO NOTHING;

-- 5. TABLES
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INT NOT NULL UNIQUE,
  capacity INT NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
  (1, 2, 'available'),
  (2, 2, 'available'),
  (3, 4, 'available'),
  (4, 4, 'available'),
  (5, 6, 'available'),
  (6, 6, 'available')
ON CONFLICT (table_number) DO NOTHING;

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  table_id UUID NOT NULL REFERENCES restaurant_tables(id),
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  service_charge DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INT NOT NULL,
  price_at_order DECIMAL(10, 2) NOT NULL,
  special_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) UNIQUE,
  amount_due DECIMAL(10, 2) NOT NULL,
  amount_received DECIMAL(10, 2),
  amount_change DECIMAL(10, 2),
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'unpaid',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. RECEIPTS
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  payment_id UUID NOT NULL REFERENCES payments(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  printed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DONE! Your database is ready to use!
-- Next steps:
-- 1. Go back to Supabase Dashboard
-- 2. Go to Storage tab
-- 3. Create bucket "menu-images" (make it public)
-- 4. Update .env.local with your API keys
-- 5. Restart your app: pnpm dev
