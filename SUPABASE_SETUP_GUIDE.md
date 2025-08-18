# Supabase Setup Guide for Smart Profile App

## 🚀 Quick Setup Steps

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zswsyjxnnvcuwkyqkfun.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3N5anhubnZjdXdreXFrZnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDU0MzIsImV4cCI6MjA3MTEyMTQzMn0.YkTHhIP_gPuKD4UjOEb84gZAys_ewibxjLdd2UhCa10

# Service Role Key (for admin operations - keep secret)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3N5anhubnZjdXdreXFrZnVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU0NTQzMiwiZXhwIjoyMDcxMTIxNDMyfQ.pOVaqxImj9QzhmhOK-lR83dfgZ4EmnBqTOpsUKhJzc8

# JWT Secret
SUPABASE_JWT_SECRET=vBgKTzr8llhS8MKMcUfAobDI67vzbFL6VdqCTX1KWFqkRkKBC2FG2JUw7JBoAl2oACtyolMoyXsex/W3ZNVlRQ==

# OpenAI API Key (for AI features - add your own key)
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Database Schema Setup

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/zswsyjxnnvcuwkyqkfun
2. **Navigate to SQL Editor** (left sidebar)
3. **Create a new query** and paste the entire contents of `supabase-schema.sql`
4. **Run the query** to create all tables, policies, and sample data

### 3. Authentication Setup

1. **Go to Authentication > Settings** in your Supabase dashboard
2. **Configure Site URL**: Add your local development URL (e.g., `http://localhost:3000`)
3. **Add Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - Your production URL when deployed

### 4. Email Templates (Optional)

1. **Go to Authentication > Email Templates**
2. **Customize the email templates** for:
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

### 5. Storage Setup (Optional)

1. **Go to Storage** in your Supabase dashboard
2. **Create a new bucket** called `resumes`
3. **Set up RLS policies** for the bucket:

```sql
-- Allow users to upload their own resumes
CREATE POLICY "Users can upload own resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own resumes
CREATE POLICY "Users can view own resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own resumes
CREATE POLICY "Users can update own resumes" ON storage.objects
FOR UPDATE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete own resumes" ON storage.objects
FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🗄️ Database Tables Created

The schema creates the following tables:

- **`profiles`** - User profile information
- **`jobs`** - Job listings
- **`applications`** - Job applications
- **`resumes`** - User resumes
- **`interviews`** - Mock interview sessions
- **`portfolios`** - User portfolios
- **`projects`** - Portfolio projects
- **`portfolio_views`** - Portfolio analytics
- **`notifications`** - User notifications
- **`alert_settings`** - User notification preferences

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Custom policies** ensure users can only access their own data
- **Public access** for job listings and public portfolios
- **Automatic profile creation** when users sign up

## 🧪 Testing the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit** `http://localhost:3000`

3. **Try to register** a new user account

4. **Check the database** to see if a profile was automatically created

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Check that your environment variables are correctly set
   - Restart your development server after changing `.env.local`

2. **"Table doesn't exist" error**:
   - Make sure you ran the `supabase-schema.sql` script
   - Check that all tables were created successfully

3. **Authentication redirect issues**:
   - Verify your redirect URLs in Supabase Auth settings
   - Check that your site URL is correctly configured

4. **RLS policy errors**:
   - Ensure you're logged in when testing protected routes
   - Check that the user has the correct permissions

## 📊 Database Schema Overview

```mermaid
erDiagram
    auth.users ||--o{ profiles : has
    auth.users ||--o{ applications : submits
    auth.users ||--o{ resumes : creates
    auth.users ||--o{ interviews : takes
    auth.users ||--o{ portfolios : owns
    auth.users ||--o{ notifications : receives
    auth.users ||--o{ alert_settings : configures
    
    jobs ||--o{ applications : receives
    portfolios ||--o{ projects : contains
    portfolios ||--o{ portfolio_views : tracks
    
    profiles {
        uuid id PK
        uuid user_id FK
        text headline
        text bio
        text[] skills
        jsonb experience
        jsonb education
        boolean availability
        text remote_preference
    }
    
    jobs {
        uuid id PK
        text title
        text company
        text location
        text type
        text experience_level
        text remote
        text salary
        text description
        text[] requirements
        text[] benefits
        boolean is_active
    }
    
    applications {
        uuid id PK
        uuid user_id FK
        uuid job_id FK
        text cover_letter
        text resume_url
        enum status
    }
```

## 🎯 Next Steps

After setting up the database:

1. **Test the application locally**
2. **Deploy to Vercel** with the same environment variables
3. **Set up production environment variables** in Vercel dashboard
4. **Configure production redirect URLs** in Supabase

## 📞 Support

If you encounter any issues:

1. Check the Supabase logs in your dashboard
2. Verify your environment variables
3. Test the database connection
4. Check the browser console for errors 