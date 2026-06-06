# Supabase Image Storage Setup Guide

This guide will help you set up Supabase Storage for menu item images in the RestauBar Management System.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project" or go to your dashboard
3. Create a new project with:
   - **Name**: restaubar-menu (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Start with Free tier
4. Wait for the project to be created (1-2 minutes)

## Step 2: Create Storage Bucket

1. Once your project is created, go to the **Storage** tab in the left sidebar
2. Click **Create a new bucket**
3. Name it: `menu-images`
4. Make sure **Public bucket** is selected
   - This allows menu images to be publicly accessible
5. Click **Create bucket**

## Step 3: Set Up Bucket Policies

1. Click on the `menu-images` bucket you just created
2. Go to the **Policies** tab
3. Click **+ New Policy**
4. Choose **For authenticated users** template or create custom:
   - **Allowed operations**: SELECT, INSERT, UPDATE, DELETE
   - **Target roles**: authenticated
   - Click **Review**
5. Also add **For anon users** to allow public reads:
   - **Allowed operations**: SELECT
   - **Target roles**: anon
   - Click **Review**

## Step 4: Get Your API Keys

1. Go to **Settings** → **API** in the left sidebar
2. Find **Project API Keys** section
3. Copy:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public**: This is your `VITE_SUPABASE_ANON_KEY`

## Step 5: Configure Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

3. Restart the development server:
```bash
pnpm dev
```

## Step 6: Test Image Upload

1. Go to the **Menu Management** page in the admin dashboard
2. Click **Add Item** or edit an existing item
3. Click **Upload Image**
4. Select a JPG, PNG, or WebP image (max 5MB)
5. Once uploaded, you should see the image preview
6. Fill in other details and click **Add** or **Update**

## Features

✅ **Upload**: Click "Upload Image" to select and upload images from your computer
✅ **Replace**: Edit an item and upload a new image to replace the old one
✅ **Delete**: Click the X button on the image preview to remove it
✅ **Validation**: Only image files up to 5MB are accepted
✅ **Storage**: Images are stored in Supabase and served via CDN

## Troubleshooting

### "Failed to upload image" error

1. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set in `.env.local`
2. Make sure the `menu-images` bucket exists in your Supabase project
3. Verify bucket policies allow uploads for your authentication level
4. Restart the development server after updating `.env.local`

### Images not loading

1. Check that the bucket is set to **Public**
2. Verify bucket policies include SELECT for anon/authenticated users
3. Check browser console (F12) for CORS errors
4. Ensure you're using the correct `VITE_SUPABASE_URL`

### "No such bucket" error

1. Create the `menu-images` bucket in Supabase Storage
2. Make sure it's named exactly `menu-images` (lowercase)

## Security Notes

- The `anon` key in `.env.local` is public and safe to expose in frontend code
- Never share your `service_role_key` or database password
- Images are stored with unique filenames to prevent overwrites
- Images older than specified cache duration will be refreshed

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [RestauBar Menu Management Guide](./README.md)
