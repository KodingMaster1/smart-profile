-- Smart Profile App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE notification_type AS ENUM ('job_alert', 'application_update', 'interview_reminder', 'profile_view', 'system');
CREATE TYPE notification_delivery AS ENUM ('email', 'push', 'both');
CREATE TYPE remote_preference AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE availability_status AS ENUM ('available', 'not_available', 'open_to_opportunities');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  headline TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  cv_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  location JSONB,
  availability BOOLEAN DEFAULT true,
  availability_status availability_status DEFAULT 'available',
  salary_range JSONB,
  remote_preference remote_preference DEFAULT 'hybrid',
  work_authorization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  remote TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  posted_date DATE DEFAULT CURRENT_DATE,
  application_deadline DATE,
  company_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status application_status DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  template TEXT DEFAULT 'modern',
  content JSONB NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  score DECIMAL(3,1),
  feedback TEXT,
  questions JSONB DEFAULT '[]',
  answers JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT DEFAULT 'modern',
  custom_domain TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio views analytics
CREATE TABLE IF NOT EXISTS portfolio_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert settings table
CREATE TABLE IF NOT EXISTS alert_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  job_alerts BOOLEAN DEFAULT true,
  application_updates BOOLEAN DEFAULT true,
  interview_reminders BOOLEAN DEFAULT true,
  profile_views BOOLEAN DEFAULT true,
  system_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  alert_frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(remote);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_portfolio_id ON portfolio_views(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_alert_settings_user_id ON alert_settings(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alert_settings_updated_at BEFORE UPDATE ON alert_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Jobs: Everyone can view active jobs
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (is_active = true);

-- Applications: Users can only access their own applications
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);

-- Resumes: Users can only access their own resumes
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Interviews: Users can only access their own interviews
CREATE POLICY "Users can view own interviews" ON interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON interviews FOR DELETE USING (auth.uid() = user_id);

-- Portfolios: Users can view public portfolios and manage their own
CREATE POLICY "Anyone can view public portfolios" ON portfolios FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own portfolio" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolio" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolio" ON portfolios FOR UPDATE USING (auth.uid() = user_id);

-- Projects: Users can view projects from public portfolios and manage their own
CREATE POLICY "Anyone can view projects from public portfolios" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM portfolios WHERE portfolios.id = projects.portfolio_id AND portfolios.is_public = true)
);
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM portfolios WHERE portfolios.id = projects.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM portfolios WHERE portfolios.id = projects.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM portfolios WHERE portfolios.id = projects.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (
  EXISTS (SELECT 1 FROM portfolios WHERE portfolios.id = projects.portfolio_id AND portfolios.user_id = auth.uid())
);

-- Portfolio views: Users can view analytics for their own portfolio
CREATE POLICY "Users can view own portfolio analytics" ON portfolio_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM portfolios WHERE portfolios.id = portfolio_views.portfolio_id AND portfolios.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert portfolio views" ON portfolio_views FOR INSERT WITH CHECK (true);

-- Notifications: Users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Alert settings: Users can only access their own alert settings
CREATE POLICY "Users can view own alert settings" ON alert_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alert settings" ON alert_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alert settings" ON alert_settings FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample data for testing
INSERT INTO jobs (title, company, location, type, experience_level, remote, salary, description, requirements, benefits) VALUES
(
  'Senior Software Engineer',
  'TechCorp Inc.',
  'San Francisco, CA',
  'Full-time',
  'Senior',
  'Hybrid',
  '$120,000 - $150,000',
  'We are looking for a Senior Software Engineer to join our dynamic team at TechCorp Inc. You will be responsible for designing, developing, and maintaining high-quality software solutions that drive our business forward.',
  ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'Kubernetes', 'GraphQL'],
  ARRAY['Competitive salary and equity package', 'Comprehensive health, dental, and vision insurance', 'Flexible work arrangements and remote options', 'Professional development and learning budget', '401(k) matching and financial wellness programs', 'Unlimited PTO and paid parental leave', 'Modern office with great amenities', 'Team events and social activities']
),
(
  'Frontend Developer',
  'StartupXYZ',
  'Remote',
  'Full-time',
  'Mid-level',
  'Remote',
  '$80,000 - $100,000',
  'Join our fast-growing startup as a Frontend Developer and help us build amazing user experiences.',
  ARRAY['React', 'Vue.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
  ARRAY['Remote-first culture', 'Competitive salary', 'Health insurance', 'Flexible hours', 'Stock options']
),
(
  'Product Manager',
  'InnovateTech',
  'New York, NY',
  'Full-time',
  'Senior',
  'Hybrid',
  '$130,000 - $160,000',
  'Lead product strategy and execution for our flagship platform. Work with cross-functional teams to deliver exceptional user experiences.',
  ARRAY['Product Management', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management', 'Technical Background'],
  ARRAY['Competitive salary', 'Health benefits', 'Professional development', 'Flexible work arrangements']
);

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, headline, bio)
  VALUES (NEW.id, 'New User', 'Welcome to Smart Profile!');
  
  INSERT INTO public.alert_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile and alert settings for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 