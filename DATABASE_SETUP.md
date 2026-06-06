# Database Setup - Everything You Need

## 🎯 **3 Options for SQL Code**

### **OPTION 1: RECOMMENDED - Simplified Version (Easiest)**
File: `SUPABASE_SQL_SIMPLE.sql`
- ✅ 164 lines (easy to read)
- ✅ Just copy & paste
- ✅ No modifications needed
- ✅ Includes all essential tables

### **OPTION 2: Complete Version (Full Features)**
File: `SUPABASE_SCHEMA.sql`
- ✅ 405 lines
- ✅ Includes views, triggers, functions
- ✅ Advanced features
- ✅ Auto-calculation of totals

### **OPTION 3: Manual - Copy Below**
See instructions below

---

## ⚡ **Quick Setup (5 Minutes)**

### 1️⃣ **Create Supabase Project**
- Go to https://supabase.com
- Sign up or login
- Click "New Project"
- Fill in details, click Create
- Wait 1-2 minutes

### 2️⃣ **Copy SQL Code**
Open one of these files:
- **RECOMMENDED**: `SUPABASE_SQL_SIMPLE.sql` (easiest)
- Or: `SUPABASE_SCHEMA.sql` (full features)

Select all text (Ctrl+A) and copy

### 3️⃣ **Run in Supabase**
1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Paste all SQL code
4. Click **Run**
5. ✅ Done!

### 4️⃣ **Get API Keys**
1. Go to **Settings** → **API**
2. Copy:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: `eyJhbG...`

### 5️⃣ **Update `.env.local`**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6️⃣ **Create Storage Bucket**
1. Go to **Storage**
2. Click **Create bucket**
3. Name: `menu-images`
4. Check "Public bucket"
5. Click Create

### 7️⃣ **Set Bucket Policies**
1. Click `menu-images` bucket
2. Go to **Policies**
3. Click **New Policy**
   - For authenticated users: Allow all (SELECT, INSERT, UPDATE, DELETE)
   - For anon users: Allow SELECT
4. Save both

### 8️⃣ **Restart App**
```bash
pnpm dev
```

### 9️⃣ **Login & Test**
- URL: http://localhost:8080/login
- Email: `admin@restaubar.com`
- Password: `admin123`
- ✅ If dashboard loads, you're connected!

---

## 📝 **What Gets Created**

### Tables (10 total)
```
✅ roles          - User roles
✅ users          - Admin, POS, Waiter accounts
✅ categories     - Food, Drinks, Beer, etc.
✅ menu_items     - All menu items with prices
✅ restaurant_tables - All restaurant tables
✅ orders         - All customer orders
✅ order_items    - Items in each order
✅ payments       - Payment records
✅ receipts       - Printed receipts
✅ activity_logs  - User activity tracking
```

### Demo Data
```
✅ 3 User Accounts
   - admin@restaubar.com / admin123
   - pos@restaubar.com / pos123
   - waiter@restaubar.com / waiter123

✅ 7 Categories
   - Food, Drinks, Beer, Cocktail, Liquor, Dessert, Add-ons

✅ 9 Menu Items
   - Burger, Pizza, Salad, Pasta, Coca-Cola, Iced Tea, Beer, Margarita, Tiramisu

✅ 6 Tables
   - Table 1-6 with various capacities
```

---

## 🔑 **Demo Login Credentials**

After running SQL, use these to login:

```
ADMIN ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: admin@restaubar.com
Password: admin123
Access: Full admin dashboard

POS ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: pos@restaubar.com
Password: pos123
Access: POS system & payments

WAITER ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: waiter@restaubar.com
Password: waiter123
Access: Order confirmation & status
```

---

## 📊 **Verify Connection Works**

After running SQL, check in Supabase:

1. **Table Editor** → Click `users` table
2. You should see 3 rows (admin, pos, waiter)
3. Go back and click `menu_items` table
4. You should see 9 menu items

If you see data, **your database is connected!** ✅

---

## 🖼️ **What Each File Contains**

### `SUPABASE_SQL_SIMPLE.sql` (RECOMMENDED)
- Basic tables
- Sample data
- No views/triggers
- 164 lines
- Perfect for starting out

### `SUPABASE_SCHEMA.sql` (Full Version)
- All tables
- Views for easier querying
- Triggers for automation
- Functions for calculations
- Advanced features
- 405 lines
- Use this for production

---

## 🚀 **Full Step-by-Step**

See detailed instructions: `SUPABASE_CONNECT.md`

That file has:
- Screenshots (described)
- Detailed troubleshooting
- Production tips
- Password hashing
- Row Level Security
- Backup procedures

---

## ✅ **Checklist**

- [ ] Supabase project created
- [ ] SQL code run in SQL Editor
- [ ] Storage bucket created
- [ ] Bucket policies set
- [ ] `.env.local` updated
- [ ] Dev server restarted
- [ ] Logged in as admin
- [ ] Dashboard loads correctly
- [ ] Can view menu items
- [ ] Image upload works

---

## 🆘 **If Something Goes Wrong**

### "Table already exists"
- Perfectly fine! Just means data is there
- Click Run anyway, it skips duplicates

### "Permission denied" uploading images
- Go to Storage → menu-images → Policies
- Add policy: Allow SELECT for anon users
- Restart app

### "Can't login"
- Check `.env.local` has correct credentials
- Verify database has users (check Table Editor)
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito window

### "Database is empty"
- Re-run the SQL code
- Make sure you clicked "Run"
- Check SQL Editor for error messages
- Scroll up to see if any errors

### "No SQL Editor button"
- Wait 2 minutes for project to fully load
- Refresh the Supabase dashboard
- Project tab → SQL Editor in sidebar

---

## 💾 **Environment Variables Needed**

```env
# Required for Supabase Connection
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Optional
PING_MESSAGE=ping pong
```

Get these from: Supabase Dashboard → Settings → API

---

## 🎯 **What Happens After Setup**

1. ✅ Users login with email/password
2. ✅ All data saves to Supabase PostgreSQL
3. ✅ Images upload to Supabase Storage
4. ✅ Orders persist between sessions
5. ✅ Payment history is tracked
6. ✅ Activity logs are recorded

---

## 📈 **Database Limits (Free Tier)**

```
Storage:        1GB (enough for ~1000 images)
Bandwidth:      5GB/month
Database:       Unlimited
API Requests:   Unlimited
Concurrent:     ~200 connections
```

Perfect for small to medium restaurants! 

---

## 🎓 **Next Steps**

1. **Connect Database** ← You are here
2. **Upload Images** - Use Menu Management
3. **Create Staff** - Use User Management
4. **Setup Tables** - Use Table Management
5. **Take Orders** - Customer QR menu
6. **Process Payments** - POS system
7. **Deploy** - To production

---

## 📞 **Need Help?**

1. **Supabase Documentation**: https://supabase.com/docs
2. **SQL Errors**: Check Supabase SQL Editor output
3. **Connection Issues**: Check `.env.local` variables
4. **Feature Help**: See FEATURES_COMPLETE.md

---

## 🎉 **You're Ready!**

Everything you need is in this folder:

```
SUPABASE_SQL_SIMPLE.sql     ← Copy & paste this (EASIEST)
SUPABASE_SCHEMA.sql         ← Or this (FULL VERSION)
SUPABASE_CONNECT.md         ← Step-by-step instructions
DATABASE_SETUP.md           ← This file
```

**Pick one SQL file, copy it, paste in Supabase, run it, and you're done!** ✅

Questions? Check the detailed guide in `SUPABASE_CONNECT.md`
