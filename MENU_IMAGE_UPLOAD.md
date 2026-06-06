# Menu Image Upload Feature

The RestauBar Management System now includes **image upload capability** for menu items using Supabase Storage.

## 🚀 Quick Start

### 1. Set Up Supabase (One-time setup)

Follow the **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** guide to:
- Create a Supabase project
- Create a `menu-images` storage bucket
- Get your API keys
- Add credentials to `.env.local`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server: `pnpm dev`

### 2. Upload Images in Menu Management

1. **Add New Item**:
   - Go to **Menu Management** page
   - Click **Add Item** button
   - Click **Upload Image**
   - Select a JPG, PNG, or WebP file (max 5MB)
   - Fill in item details
   - Click **Add**

2. **Replace Image**:
   - Click **Edit** on an existing item
   - Click **Upload Image** to replace the current image
   - Or click the **X** button to remove the image
   - Click **Update**

3. **View Images**:
   - Menu items with images show a beautiful preview card
   - Hover over images to see zoom effect
   - Images display on the menu ordering interface

## 📋 Supported Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **Maximum size**: 5MB per image

## 🎯 Features

✅ **Upload** - Drag & drop or click to select images
✅ **Preview** - See image before saving
✅ **Replace** - Change images anytime
✅ **Delete** - Remove images with one click
✅ **Optimize** - Images stored with unique filenames
✅ **CDN** - Fast delivery via Supabase CDN
✅ **Responsive** - Works on desktop, tablet, mobile

## 🔧 Technical Details

- Images are stored in Supabase Storage `menu-images` bucket
- Files are renamed with timestamp to prevent conflicts
- All images are publicly accessible for customers to view
- Images are cached for 1 hour by default
- Local file picker is used for secure uploads

## 📸 Image Recommendations

- **Aspect Ratio**: 4:3 (recommended for menu display)
- **Resolution**: 800x600px or higher
- **Size**: Keep under 2MB for best performance
- **Format**: PNG for transparency, JPEG for photos

## 🐛 Troubleshooting

**Images not uploading?**
- Check `.env.local` has correct Supabase credentials
- Verify `menu-images` bucket exists in Supabase
- Restart development server
- Check browser console for errors

**Images not displaying?**
- Ensure bucket is set to **Public**
- Check bucket has proper access policies
- Verify image file wasn't deleted from Supabase

**Want to use placeholder images temporarily?**
- Images will show placeholder URL if upload fails
- You can still add items without images
- Upload images later by editing the item

## 🔐 Security Notes

- Only images up to 5MB are accepted
- Files are validated as actual image files
- Images stored with unique filenames (timestamped)
- Anon key is safe for frontend use
- Private database operations use service role key

## 📖 Related Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Menu Management Documentation](./AGENTS.md)
- [Admin Dashboard Features](./client/pages/Menu.tsx)
