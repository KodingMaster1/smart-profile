# Supabase Setup Guide for Smart Profile App

This guide will help you set up Supabase for the Smart Profile application.

## 🚀 Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `smart-profile-app`
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## 🗄️ Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click "Run" to execute the schema
5. Verify that all tables and policies were created successfully

## 🔐 Step 3: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following settings:

### Site URL
- Add your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- Add `http://localhost:3000` for local development

### Email Templates
- Customize the email templates for:
  - Confirm signup
  - Magic link
  - Change email address
  - Reset password

### Auth Providers (Optional)
- Enable Google, GitHub, or other providers if desired
- Configure OAuth settings for each provider

## 🔑 Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 🌍 Step 5: Configure Environment Variables

### For Local Development
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📧 Step 6: Configure Email Settings (Optional)

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, etc.)
3. Test the email configuration

## 🗂️ Step 7: Set Up Storage (Optional)

1. Go to **Storage**
2. Create a new bucket called `resumes`
3. Set the bucket to private
4. Create a new bucket called `portfolios`
5. Set the bucket to public

### Storage Policies
Add the following policies to your storage buckets:

#### For `resumes` bucket:
```sql
-- Allow users to upload their own resumes
CREATE POLICY "Users can upload own resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own resumes
CREATE POLICY "Users can view own resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own resumes
CREATE POLICY "Users can update own resumes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete own resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### For `portfolios` bucket:
```sql
-- Allow users to upload portfolio images
CREATE POLICY "Users can upload portfolio images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to portfolio images
CREATE POLICY "Public access to portfolio images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolios');

-- Allow users to update their portfolio images
CREATE POLICY "Users can update portfolio images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their portfolio images
CREATE POLICY "Users can delete portfolio images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolios' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🔍 Step 8: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Try to register a new user
4. Verify that:
   - User registration works
   - Profile is automatically created
   - Alert settings are automatically created
   - You can log in and access the dashboard

## 📊 Step 9: Monitor and Debug

### Check Logs
1. Go to **Logs** in your Supabase dashboard
2. Monitor for any errors or issues

### Database Inspector
1. Go to **Table Editor**
2. Verify that tables are created correctly
3. Check that sample data was inserted

### Real-time
1. Go to **Database** → **Replication**
2. Enable real-time for tables that need it (optional)

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your environment variables are correct
   - Make sure you're using the anon key, not the service role key

2. **"Row Level Security" errors**
   - Check that RLS policies are created correctly
   - Verify user authentication is working

3. **"Email not sent" errors**
   - Check SMTP configuration
   - Verify email templates are set up

4. **"Storage access denied" errors**
   - Check storage bucket policies
   - Verify bucket permissions

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)
- Review the [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## 🎉 Next Steps

Once Supabase is set up:

1. **Deploy to Vercel** with the environment variables
2. **Test the full application** functionality
3. **Add more sample data** if needed
4. **Configure additional features** like:
   - Email notifications
   - Real-time updates
   - Advanced analytics

## 📝 Notes

- Keep your service role key secure and never expose it in client-side code
- Regularly backup your database
- Monitor your usage to stay within free tier limits
- Consider upgrading to a paid plan for production use 