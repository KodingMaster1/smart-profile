# 🚀 Vercel Deployment Guide
## Deploy Smart Profile App to Vercel

### 📋 Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [Supabase Project](https://supabase.com) (already set up)
- [GitHub Repository](https://github.com) (your code)

---

## 🔧 Step 1: Prepare Your Project

### **1.1 Install Dependencies**
```bash
npm install
```

### **1.2 Create Environment File**
Copy the example environment file and fill in your values:
```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your-openai-api-key-here
```

### **1.3 Test Locally**
```bash
npm run dev
```
Visit `http://localhost:3000` to verify everything works.

---

## 🚀 Step 2: Deploy to Vercel

### **2.1 Connect to Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Connect your GitHub account if not already connected
   - Select your `smart-profile-app` repository
   - Click "Import"

### **2.2 Configure Project Settings**

1. **Project Configuration**
   ```
   Project Name: smart-profile-app
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

2. **Environment Variables**
   - Click "Environment Variables"
   - Add each variable from your `.env.local`:
   
   **Production Environment:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=your-openai-key
   ```

   **Preview Environment:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=your-openai-key
   ```

### **2.3 Deploy**
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- Your app will be live at `https://your-app.vercel.app`

---

## 🔗 Step 3: Configure Supabase

### **3.1 Update Redirect URLs**
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Settings
3. Add your Vercel domain to Site URL:
   ```
   https://your-app.vercel.app
   ```
4. Add redirect URLs:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/auth/login
   https://your-app.vercel.app/auth/register
   ```

### **3.2 Test Authentication**
1. Visit your deployed app
2. Try to register/login
3. Verify redirects work properly

---

## 🔄 Step 4: Set Up Continuous Deployment

### **4.1 Automatic Deployments**
- Every push to `main` branch will trigger a deployment
- Pull requests will create preview deployments
- Vercel automatically handles builds and deployments

### **4.2 Custom Domain (Optional)**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

---

## 📊 Step 5: Monitoring & Analytics

### **5.1 Vercel Analytics**
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View performance metrics

### **5.2 Supabase Monitoring**
1. Monitor database usage in Supabase Dashboard
2. Check authentication logs
3. Monitor API usage

---

## 🔒 Step 6: Security Checklist

### **6.1 Environment Variables**
- [ ] All sensitive keys are in Vercel environment variables
- [ ] No secrets in code or public repositories
- [ ] Different keys for production/preview environments

### **6.2 Supabase Security**
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Proper authentication policies configured
- [ ] Service role key only used server-side

### **6.3 Domain Security**
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Proper CORS settings configured
- [ ] Security headers configured

---

## 🧪 Step 6: Testing Your Deployment

### **6.1 Functionality Tests**
- [ ] Homepage loads correctly
- [ ] Authentication works (register/login)
- [ ] Database operations work
- [ ] File uploads function
- [ ] API endpoints respond

### **6.2 Performance Tests**
- [ ] Page load times are acceptable
- [ ] Images optimize correctly
- [ ] API responses are fast
- [ ] No console errors

### **6.3 Mobile Tests**
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Mobile navigation functions

---

## 🚨 Troubleshooting

### **Common Issues**

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   npm install --legacy-peer-deps
   # or
   npm run build --debug
   ```

2. **Environment Variables Not Working**
   - Verify variables are set in Vercel dashboard
   - Check variable names match exactly
   - Ensure variables are set for correct environment

3. **Supabase Connection Issues**
   - Verify Supabase URL and keys
   - Check CORS settings in Supabase
   - Ensure redirect URLs are configured

4. **Authentication Problems**
   - Check Supabase redirect URLs
   - Verify site URL in Supabase settings
   - Test with different browsers

### **Getting Help**
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🎉 Success Checklist

- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Supabase redirect URLs updated
- [ ] Authentication working
- [ ] Database operations functional
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Security measures implemented
- [ ] Performance optimized
- [ ] Mobile responsive tested

Your Smart Profile app is now live and ready for users! 🚀

---

## 🔄 Next Steps

1. **Set up monitoring and alerts**
2. **Configure backup strategies**
3. **Implement CI/CD pipelines**
4. **Add performance monitoring**
5. **Set up error tracking**
6. **Plan scaling strategies**

For advanced deployment options, check out the [VERCEL_SUPABASE_SETUP.md](./VERCEL_SUPABASE_SETUP.md) file for detailed configuration instructions. 