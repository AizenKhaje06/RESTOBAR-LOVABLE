# RestauBar Management System - Quick Start Guide

## 🚀 **Get Started in 5 Minutes**

### Step 1: Start the Dev Server
```bash
pnpm dev
```
Server runs on: `http://localhost:8080`

### Step 2: Access the Admin Panel
Go to: `http://localhost:8080/login`

**Demo Login:**
- Email: `admin@restaubar.com`
- Password: `admin123`

### Step 3: Explore Features

#### Admin Features
- 📊 Dashboard - View sales & analytics
- 📋 Orders - Manage all orders
- 🪑 Tables - Create tables & QR codes
- 🍽️ Menu - Add menu items with images
- 👥 Users - Create staff accounts

#### POS Features (Login as pos@restaubar.com)
- ✅ Approve pending orders
- 💳 Process payments
- 🧾 Print receipts

#### Waiter Features (Login as waiter@restaubar.com)
- ✅ Confirm orders
- 📝 Update order status

#### Customer Ordering
Navigate to: `/table/1` (or any table number)
- 🍽️ Browse menu
- 🛒 Add to cart
- ✅ Submit order

---

## 📸 **Image Upload Setup (Optional)**

### Quick Setup
1. Go to [supabase.com](https://supabase.com)
2. Create account → New Project
3. Go to Storage → Create bucket named `menu-images`
4. Get API keys from Settings → API
5. Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
6. Restart: `pnpm dev`
7. Upload images in Menu Management!

**Full guide:** See SUPABASE_SETUP.md

---

## 🎯 **Key Features to Try**

### 1. Admin Dashboard
```
1. Login as admin
2. View sales metrics & charts
3. Check table status
4. See recent orders
```

### 2. Create Menu Item
```
1. Click "Menu Management"
2. Click "Add Item"
3. Upload an image (optional)
4. Fill details
5. Click "Add"
```

### 3. Create Staff Account
```
1. Click "Users"
2. Click "Add User"
3. Select role (POS/Waiter)
4. Set password
5. Click "Create"
```

### 4. Generate QR Code
```
1. Click "Tables"
2. Click "Add Table"
3. Set capacity
4. Click "QR Code" to view/download
5. Print & display at table
```

### 5. Process Payment
```
1. Login as POS
2. Go to "POS System"
3. Approve pending orders
4. Click "Process Payment"
5. Enter amount
6. Print receipt
```

### 6. Confirm Order
```
1. Login as Waiter
2. Go to "Orders"
3. Confirm pending orders
4. Update status through workflow
```

### 7. Customer Ordering
```
1. Go to /table/1
2. Browse menu
3. Add items
4. Click "Review Order"
5. Confirm
6. See success page
```

---

## 🔐 **Login Credentials**

### Admin Account
- **Email:** admin@restaubar.com
- **Password:** admin123
- **Access:** All features

### POS Account
- **Email:** pos@restaubar.com
- **Password:** pos123
- **Access:** Order approval & payments

### Waiter Account
- **Email:** waiter@restaubar.com
- **Password:** waiter123
- **Access:** Order confirmation & status

---

## 📱 **Test on Different Devices**

### Desktop
- Full admin dashboard
- Wide data tables
- All features visible

### Tablet
- Sidebar collapses
- Responsive grids
- Touch-friendly buttons

### Mobile
- Full-screen mode
- Mobile-optimized navigation
- Single-column layouts

---

## 🐛 **Troubleshooting**

### Server won't start
```bash
# Clear node_modules & reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Images not uploading
- Check `.env.local` has Supabase credentials
- Verify `menu-images` bucket exists
- Restart: `pnpm dev`

### Login not working
- Clear browser cache
- Try incognito mode
- Check console for errors

### Hot reload issues
```bash
# Full dev server restart
pkill -f "vite"
pnpm dev
```

---

## 📚 **Full Documentation**

- **FEATURES_COMPLETE.md** - All features explained
- **SUPABASE_SETUP.md** - Image upload setup
- **MENU_IMAGE_UPLOAD.md** - Image feature guide
- **SUPABASE_PLAN.md** - Pricing & scaling

---

## ✅ **What's Working**

- ✅ Admin dashboard with analytics
- ✅ Menu management (with images)
- ✅ User management
- ✅ Table management (QR codes)
- ✅ POS system (payments)
- ✅ Waiter dashboard (orders)
- ✅ Customer ordering (QR menu)
- ✅ Responsive design
- ✅ Authentication
- ✅ Order tracking

---

## 🚀 **Ready to Deploy?**

### Production Build
```bash
pnpm build
pnpm start
```

### Deploy to Vercel (Recommended)
```bash
# Push to GitHub, then:
# 1. Go to vercel.com
# 2. Import project
# 3. Add env variables
# 4. Deploy
```

### Docker Deployment
```bash
docker build -t restaubar .
docker run -p 8080:8080 restaubar
```

---

## 💡 **Tips & Tricks**

1. **Demo Data** - All pages have sample data to explore
2. **Search** - Use search boxes to filter items quickly
3. **QR Codes** - Download & print for each table
4. **Responsive** - Try resizing window to see mobile view
5. **Dark Mode** - Built-in (ready when enabled)
6. **Toast Notifications** - Bottom-right corner shows actions
7. **Auto-save** - All changes save immediately
8. **Modal Forms** - Click outside to cancel

---

## 🎓 **Learning Path**

**Day 1: Setup**
- [ ] Start dev server
- [ ] Login as admin
- [ ] Explore dashboard

**Day 2: Content**
- [ ] Create menu items
- [ ] Upload images
- [ ] Create staff accounts

**Day 3: Operations**
- [ ] Create tables & QR codes
- [ ] Test POS payment flow
- [ ] Test waiter order flow

**Day 4: Customer**
- [ ] Test QR code ordering
- [ ] Place test orders
- [ ] Process payments

**Day 5: Deploy**
- [ ] Build for production
- [ ] Set up Supabase
- [ ] Deploy to Vercel

---

## 📞 **Support**

- Check FEATURES_COMPLETE.md for detailed feature docs
- Check console (F12) for error messages
- Review code in `client/pages/` for implementation
- All API endpoints in `server/routes/`

---

## 🎉 **You're All Set!**

Your RestauBar Management System is ready to use. Start by logging in and exploring the features. Everything you need is built-in and working out of the box.

**Happy managing! 🍽️**
