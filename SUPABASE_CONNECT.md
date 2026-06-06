# Connect Supabase Database - Complete Setup Guide

## 📋 Step-by-Step Instructions

### **STEP 1: Create Supabase Account & Project**

1. Go to [supabase.com](https://supabase.com)
2. Click **"Sign Up"** 
3. Sign up with email or GitHub
4. Click **"New Project"**
5. Fill in project details:
   - **Name**: `restaubar` (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
   - **Plan**: Free tier is perfect
6. Click **"Create New Project"**
7. ⏳ Wait 1-2 minutes for the project to initialize

---

### **STEP 2: Copy SQL Schema**

1. Open the file: `SUPABASE_SCHEMA.sql` in your project
2. Copy **ALL the SQL code** (Ctrl+A to select all)

---

### **STEP 3: Run SQL in Supabase**

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. **Paste all the SQL** code you copied
4. Click **"Run"** (top right)
5. ✅ Wait for it to complete (you'll see a checkmark)

**That's it!** Your entire database is now set up with:
- ✅ All tables created
- ✅ Sample data loaded
- ✅ Views created
- ✅ Triggers configured
- ✅ Indexes optimized

---

### **STEP 4: Get Your API Keys**

1. Go to **Settings** → **API** (left sidebar)
2. Under **Project API Keys**, you'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon public** (this is your VITE_SUPABASE_ANON_KEY)
3. **Copy both values**

---

### **STEP 5: Update Environment Variables**

1. Open `.env.local` in your project root (create if doesn't exist)
2. Add these lines:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

3. Replace with your actual values from Step 4

---

### **STEP 6: Create Storage Bucket**

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Name: `menu-images` (exactly this)
4. Check **"Public bucket"** ✅
5. Click **"Create bucket"**

---

### **STEP 7: Set Bucket Policies**

1. Click on the `menu-images` bucket
2. Go to **Policies** tab
3. Click **"New Policy"** → **For authenticated users**
   - Allow: SELECT, INSERT, UPDATE, DELETE
   - Save it
4. Click **"New Policy"** → **For public users**
   - Allow: SELECT
   - Save it

---

### **STEP 8: Restart Dev Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

---

### **STEP 9: Verify Connection**

1. Go to `http://localhost:8080/login`
2. Try logging in with:
   - Email: `admin@restaubar.com`
   - Password: `admin123`
3. ✅ If you get to the dashboard, **it's connected!**

---

## 🔍 **Verify Everything is Working**

### Test in Supabase Console:

1. Go to **SQL Editor**
2. Create a new query
3. Run this to check users:
```sql
SELECT email, name, status FROM users;
```
You should see the 3 demo accounts!

4. Check orders:
```sql
SELECT * FROM orders;
```

5. Check menu items:
```sql
SELECT name, price FROM menu_items LIMIT 5;
```

---

## 📸 **Upload First Menu Image**

1. Login as admin: `admin@restaubar.com`
2. Go to **Menu Management**
3. Click **"Add Item"** or edit an item
4. Click **"Upload Image"**
5. Select an image from your computer
6. ✅ If it works, you're fully connected!

---

## 🔑 **Database Credentials Reference**

Your database now has:

### Demo User Accounts:
```
Admin:   admin@restaubar.com / admin123
POS:     pos@restaubar.com / pos123
Waiter:  waiter@restaubar.com / waiter123
```

### Database Tables Created:
```
✅ roles
✅ users
✅ categories
✅ menu_items
✅ restaurant_tables
✅ orders
✅ order_items
✅ payments
✅ receipts
✅ activity_logs
✅ daily_sales
```

### Sample Data Included:
```
✅ 3 user accounts (Admin, POS, Waiter)
✅ 7 categories (Food, Drinks, Beer, etc.)
✅ 12 menu items
✅ 6 restaurant tables
✅ Views & triggers for automation
```

---

## 🐛 **Troubleshooting**

### Error: "bucket 'menu-images' does not exist"
- **Solution**: Create the storage bucket (Step 6)
- Go to Storage → Create bucket → Name: `menu-images`

### Error: "Failed to upload image"
- **Solution**: Check environment variables in `.env.local`
- Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
- Restart dev server: `pnpm dev`

### Error: "Unauthorized" when uploading
- **Solution**: Check bucket policies (Step 7)
- Make sure bucket is PUBLIC
- Add policies for authenticated users

### Can't login with admin account
- **Solution**: Run this SQL to check users exist:
```sql
SELECT * FROM users;
```
- If empty, re-run the entire SUPABASE_SCHEMA.sql file

### Database is slow
- **Solution**: Check if you have many orders in testing
- Free tier should be plenty fast
- Consider upgrading to Pro if you have >10k orders/month

---

## 📊 **View Your Data in Supabase**

1. Go to **Table Editor** (left sidebar)
2. Select any table to view data:
   - `users` - See all accounts
   - `menu_items` - See all menu items
   - `orders` - See all orders
   - `restaurant_tables` - See all tables
   - `payments` - See all payments

3. You can edit data directly in Supabase console (great for testing!)

---

## 🚀 **Next Steps**

### Optional: Hash Passwords (Security)
The sample passwords in the database are NOT hashed (for demo purposes).

For production, hash them:

```sql
-- Example: Update admin password
UPDATE users 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@restaubar.com';
```

Then update your backend to verify with:
```typescript
const isValid = await bcrypt.compare(password, user.password_hash);
```

### Optional: Enable Row Level Security (RLS)

For production, enable RLS to restrict data access:

```sql
-- Enable RLS on sensitive tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY orders_user_access ON orders
  FOR SELECT USING (auth.uid() IS NOT NULL);
```

---

## 💾 **Backup Your Data**

Supabase automatic backups (Pro plan includes daily backups):

1. Go to **Settings** → **Backups**
2. Enable automatic backups
3. View & restore backup snapshots

For manual backup:
1. **SQL Editor** → **New Query**
2. Run `pg_dump` command
3. Save the output

---

## 📞 **Support**

If you have issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Read Docs**: https://supabase.com/docs
3. **Check Logs**: Supabase Dashboard → Logs
4. **Test Connectivity**: `curl https://your-url.supabase.co`

---

## ✅ **Checklist**

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Ran SUPABASE_SCHEMA.sql
- [ ] Got API keys
- [ ] Added to .env.local
- [ ] Created menu-images bucket
- [ ] Set bucket policies
- [ ] Restarted dev server
- [ ] Logged in as admin
- [ ] Tested image upload
- [ ] All systems working! ✅

---

## 🎉 **You're Connected!**

Your app is now using a real PostgreSQL database with Supabase! 

Everything you create in the app now saves to the database and persists between sessions.

**Happy managing!** 🍽️
