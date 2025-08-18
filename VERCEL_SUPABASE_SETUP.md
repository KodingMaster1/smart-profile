# 🚀 Vercel + Supabase Setup Guide
## Complete Integration for Smart Profile App

### 🎯 Overview
This guide will walk you through setting up Vercel for deployment and Supabase for backend services (database, authentication, storage) for your Smart Profile application.

---

## 📋 Prerequisites

### **Required Accounts**
- [Vercel Account](https://vercel.com/signup) (Free tier available)
- [Supabase Account](https://supabase.com/signup) (Free tier available)
- [GitHub Account](https://github.com) (for repository hosting)

### **Local Development Tools**
- Node.js (v18 or higher)
- Git
- Code editor (VS Code recommended)

---

## 🗄️ Step 1: Supabase Setup

### **1.1 Create Supabase Project**

1. **Sign up/Login to Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project" or "New Project"

2. **Create New Project**
   ```
   Organization: [Your Organization]
   Project Name: smart-profile-app
   Database Password: [Generate strong password]
   Region: [Choose closest to your users]
   Pricing Plan: Free tier
   ```

3. **Wait for Setup**
   - Database provisioning takes 2-3 minutes
   - You'll receive an email when ready

### **1.2 Get Supabase Credentials**

1. **Navigate to Settings**
   - Go to Project Settings → API
   - Copy the following credentials:
   ```
   Project URL: https://your-project-id.supabase.co
   Project API Key (anon/public): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Project API Key (service_role): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Save Credentials Securely**
   - These will be used in your environment variables

### **1.3 Set Up Database Schema**

1. **Open SQL Editor**
   - Go to SQL Editor in Supabase Dashboard
   - Create the following tables:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    headline TEXT,
    bio TEXT,
    skills TEXT[],
    experience JSONB,
    education JSONB,
    certifications JSONB,
    languages JSONB,
    cv_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    location JSONB,
    availability BOOLEAN DEFAULT true,
    salary_range JSONB,
    remote_preference TEXT,
    work_authorization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    external_id TEXT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location JSONB,
    description TEXT,
    requirements TEXT[],
    benefits TEXT[],
    salary_range JSONB,
    job_type TEXT,
    experience_level TEXT,
    remote_option BOOLEAN,
    link TEXT,
    posted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    match_score DECIMAL(5,2),
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source, external_id)
);

-- Applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'offer', 'rejected', 'withdrawn')),
    cover_letter TEXT,
    resume_version TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    interview_notes JSONB,
    salary_negotiation JSONB
);

-- Job Alerts table
CREATE TABLE public.job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    keywords TEXT[],
    locations TEXT[],
    job_types TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    remote_only BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    notification_frequency TEXT DEFAULT 'daily',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    sent_via TEXT[],
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Premium Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT,
    plan_type TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Interactions table
CREATE TABLE public.ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    tokens_used INTEGER,
    cost DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Set Up Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

### **1.4 Configure Authentication**

1. **Set Up Auth Providers**
   - Go to Authentication → Settings
   - Enable Email/Password authentication
   - Configure OAuth providers (Google, GitHub, LinkedIn)

2. **Configure Email Templates**
   - Go to Authentication → Email Templates
   - Customize confirmation and reset emails

3. **Set Up Redirect URLs**
   - Add your Vercel domain: `https://your-app.vercel.app/auth/callback`

---

## 🚀 Step 2: Vercel Setup

### **2.1 Create Vercel Account**

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Install Vercel CLI (Optional)**
   ```bash
   npm i -g vercel
   ```

### **2.2 Prepare Your Project**

1. **Initialize Next.js Project**
   ```bash
   npx create-next-app@latest smart-profile-app --typescript --tailwind --app
   cd smart-profile-app
   ```

2. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install @supabase/auth-helpers-react
   npm install @supabase/auth-ui-react @supabase/auth-ui-shared
   npm install zustand
   npm install @types/node @types/react @types/react-dom
   ```

3. **Create Environment Variables**
   Create `.env.local` file:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # OpenAI (for AI features)
   OPENAI_API_KEY=your-openai-api-key

   # Other APIs
   GOOGLE_JOBS_API_KEY=your-google-jobs-api-key
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-token
   ```

### **2.3 Set Up Supabase Client**

1. **Create Supabase Client**
   ```typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

2. **Create Server-Side Client**
   ```typescript
   // lib/supabase-server.ts
   import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
   import { cookies } from 'next/headers'

   export const createServerSupabaseClient = () =>
     createServerComponentClient({ cookies })
   ```

### **2.4 Deploy to Vercel**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/smart-profile-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     ```
     Framework Preset: Next.js
     Root Directory: ./
     Build Command: npm run build
     Output Directory: .next
     Install Command: npm install
     ```

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Set production environment

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

---

## 🔧 Step 3: Integration Setup

### **3.1 Authentication Setup**

1. **Create Auth Context**
   ```typescript
   // contexts/AuthContext.tsx
   import { createContext, useContext, useEffect, useState } from 'react'
   import { User } from '@supabase/supabase-js'
   import { supabase } from '@/lib/supabase'

   interface AuthContextType {
     user: User | null
     loading: boolean
     signIn: (email: string, password: string) => Promise<void>
     signUp: (email: string, password: string) => Promise<void>
     signOut: () => Promise<void>
   }

   const AuthContext = createContext<AuthContextType | undefined>(undefined)

   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true)

     useEffect(() => {
       // Get initial session
       supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null)
         setLoading(false)
       })

       // Listen for auth changes
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (event, session) => {
           setUser(session?.user ?? null)
           setLoading(false)
         }
       )

       return () => subscription.unsubscribe()
     }, [])

     const signIn = async (email: string, password: string) => {
       const { error } = await supabase.auth.signInWithPassword({ email, password })
       if (error) throw error
     }

     const signUp = async (email: string, password: string) => {
       const { error } = await supabase.auth.signUp({ email, password })
       if (error) throw error
     }

     const signOut = async () => {
       const { error } = await supabase.auth.signOut()
       if (error) throw error
     }

     return (
       <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
         {children}
       </AuthContext.Provider>
     )
   }

   export const useAuth = () => {
     const context = useContext(AuthContext)
     if (context === undefined) {
       throw new Error('useAuth must be used within an AuthProvider')
     }
     return context
   }
   ```

2. **Create Auth Pages**
   ```typescript
   // app/auth/login/page.tsx
   'use client'
   import { useState } from 'react'
   import { useAuth } from '@/contexts/AuthContext'
   import { useRouter } from 'next/navigation'

   export default function LoginPage() {
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [loading, setLoading] = useState(false)
     const { signIn } = useAuth()
     const router = useRouter()

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault()
       setLoading(true)
       try {
         await signIn(email, password)
         router.push('/dashboard')
       } catch (error) {
         console.error('Login error:', error)
       } finally {
         setLoading(false)
       }
     }

     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8">
           <div>
             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
               Sign in to your account
             </h2>
           </div>
           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
             <div className="rounded-md shadow-sm -space-y-px">
               <div>
                 <input
                   type="email"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Email address"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
               <div>
                 <input
                   type="password"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
             </div>

             <div>
               <button
                 type="submit"
                 disabled={loading}
                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                 {loading ? 'Signing in...' : 'Sign in'}
               </button>
             </div>
           </form>
         </div>
       </div>
     )
   }
   ```

### **3.2 Database Operations**

1. **Create Database Hooks**
   ```typescript
   // hooks/useProfile.ts
   import { useState, useEffect } from 'react'
   import { supabase } from '@/lib/supabase'
   import { useAuth } from '@/contexts/AuthContext'

   export function useProfile() {
     const { user } = useAuth()
     const [profile, setProfile] = useState(null)
     const [loading, setLoading] = useState(true)

     useEffect(() => {
       if (user) {
         fetchProfile()
       }
     }, [user])

     const fetchProfile = async () => {
       try {
         const { data, error } = await supabase
           .from('profiles')
           .select('*')
           .eq('user_id', user?.id)
           .single()

         if (error) throw error
         setProfile(data)
       } catch (error) {
         console.error('Error fetching profile:', error)
       } finally {
         setLoading(false)
       }
     }

     const updateProfile = async (updates: any) => {
       try {
         const { data, error } = await supabase
           .from('profiles')
           .upsert({ user_id: user?.id, ...updates })
           .select()
           .single()

         if (error) throw error
         setProfile(data)
         return data
       } catch (error) {
         console.error('Error updating profile:', error)
         throw error
       }
     }

     return { profile, loading, updateProfile, fetchProfile }
   }
   ```

### **3.3 Storage Setup**

1. **Configure Storage Buckets**
   - Go to Storage in Supabase Dashboard
   - Create buckets:
     - `avatars` (for profile pictures)
     - `resumes` (for CV uploads)
     - `portfolios` (for portfolio files)

2. **Set Storage Policies**
   ```sql
   -- Allow users to upload their own avatar
   CREATE POLICY "Users can upload own avatar" ON storage.objects
     FOR INSERT WITH CHECK (
       bucket_id = 'avatars' AND 
       auth.uid()::text = (storage.foldername(name))[1]
     );

   -- Allow users to view their own avatar
   CREATE POLICY "Users can view own avatar" ON storage.objects
     FOR SELECT USING (
       bucket_id = 'avatars' AND 
       auth.uid()::text = (storage.foldername(name))[1]
     );

   -- Similar policies for resumes and portfolios
   ```

---

## 🔄 Step 4: Continuous Deployment

### **4.1 GitHub Actions (Optional)**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### **4.2 Environment Variables in GitHub**

Add these secrets to your GitHub repository:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 🧪 Step 5: Testing

### **5.1 Local Testing**

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Visit `http://localhost:3000/auth/login`
   - Create an account
   - Test login/logout

3. **Test Database Operations**
   - Create a profile
   - Update profile information
   - Test file uploads

### **5.2 Production Testing**

1. **Deploy to Vercel**
   - Push changes to GitHub
   - Verify deployment on Vercel

2. **Test Production Features**
   - Authentication flow
   - Database operations
   - File uploads
   - Email notifications

---

## 🔒 Step 6: Security & Optimization

### **6.1 Security Measures**

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use Vercel's environment variable system
   - Rotate API keys regularly

2. **Database Security**
   - Enable RLS on all tables
   - Use service role key only on server
   - Validate all user inputs

3. **Authentication Security**
   - Enable MFA for admin accounts
   - Set up proper redirect URLs
   - Monitor auth events

### **6.2 Performance Optimization**

1. **Vercel Optimizations**
   - Enable Edge Functions for API routes
   - Use Image Optimization
   - Enable caching headers

2. **Supabase Optimizations**
   - Use database indexes
   - Implement connection pooling
   - Monitor query performance

---

## 📊 Step 7: Monitoring & Analytics

### **7.1 Vercel Analytics**

1. **Enable Analytics**
   - Go to Project Settings → Analytics
   - Enable Web Analytics
   - Set up custom events

### **7.2 Supabase Monitoring**

1. **Database Monitoring**
   - Monitor query performance
   - Set up alerts for errors
   - Track usage metrics

2. **Auth Monitoring**
   - Monitor login attempts
   - Track user registration
   - Set up security alerts

---

## 🎉 Success Checklist

- [ ] Supabase project created and configured
- [ ] Database schema created with RLS policies
- [ ] Authentication providers configured
- [ ] Vercel project deployed
- [ ] Environment variables set
- [ ] Local development working
- [ ] Production deployment successful
- [ ] Authentication flow tested
- [ ] Database operations working
- [ ] File uploads functional
- [ ] Security measures implemented
- [ ] Monitoring configured

Your Smart Profile app is now fully set up with Vercel and Supabase! 🚀 