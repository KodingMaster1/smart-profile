import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'user' | 'admin' | 'premium'
          avatar_url: string | null
          timezone: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'user' | 'admin' | 'premium'
          avatar_url?: string | null
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'user' | 'admin' | 'premium'
          avatar_url?: string | null
          timezone?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          headline: string | null
          bio: string | null
          skills: string[] | null
          experience: any | null
          education: any | null
          certifications: any | null
          languages: any | null
          cv_url: string | null
          portfolio_url: string | null
          linkedin_url: string | null
          github_url: string | null
          website_url: string | null
          location: any | null
          availability: boolean
          salary_range: any | null
          remote_preference: string | null
          work_authorization: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          headline?: string | null
          bio?: string | null
          skills?: string[] | null
          experience?: any | null
          education?: any | null
          certifications?: any | null
          languages?: any | null
          cv_url?: string | null
          portfolio_url?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          website_url?: string | null
          location?: any | null
          availability?: boolean
          salary_range?: any | null
          remote_preference?: string | null
          work_authorization?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          headline?: string | null
          bio?: string | null
          skills?: string[] | null
          experience?: any | null
          education?: any | null
          certifications?: any | null
          languages?: any | null
          cv_url?: string | null
          portfolio_url?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          website_url?: string | null
          location?: any | null
          availability?: boolean
          salary_range?: any | null
          remote_preference?: string | null
          work_authorization?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          source: string
          external_id: string | null
          title: string
          company: string
          company_logo: string | null
          location: any | null
          description: string | null
          requirements: string[] | null
          benefits: string[] | null
          salary_range: any | null
          job_type: string | null
          experience_level: string | null
          remote_option: boolean | null
          link: string | null
          posted_at: string | null
          expires_at: string | null
          match_score: number | null
          ai_analysis: any | null
          created_at: string
        }
        Insert: {
          id?: string
          source: string
          external_id?: string | null
          title: string
          company: string
          company_logo?: string | null
          location?: any | null
          description?: string | null
          requirements?: string[] | null
          benefits?: string[] | null
          salary_range?: any | null
          job_type?: string | null
          experience_level?: string | null
          remote_option?: boolean | null
          link?: string | null
          posted_at?: string | null
          expires_at?: string | null
          match_score?: number | null
          ai_analysis?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: string
          external_id?: string | null
          title?: string
          company?: string
          company_logo?: string | null
          location?: any | null
          description?: string | null
          requirements?: string[] | null
          benefits?: string[] | null
          salary_range?: any | null
          job_type?: string | null
          experience_level?: string | null
          remote_option?: boolean | null
          link?: string | null
          posted_at?: string | null
          expires_at?: string | null
          match_score?: number | null
          ai_analysis?: any | null
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
          cover_letter: string | null
          resume_version: string | null
          applied_at: string
          updated_at: string
          notes: string | null
          follow_up_date: string | null
          interview_notes: any | null
          salary_negotiation: any | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          status?: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
          cover_letter?: string | null
          resume_version?: string | null
          applied_at?: string
          updated_at?: string
          notes?: string | null
          follow_up_date?: string | null
          interview_notes?: any | null
          salary_negotiation?: any | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          status?: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
          cover_letter?: string | null
          resume_version?: string | null
          applied_at?: string
          updated_at?: string
          notes?: string | null
          follow_up_date?: string | null
          interview_notes?: any | null
          salary_negotiation?: any | null
        }
      }
    }
  }
} 