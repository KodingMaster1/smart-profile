import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import InterviewPrep from '@/components/InterviewPrep'
import MockInterview from '@/components/MockInterview'

export default async function InterviewPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get interview history
  const { data: interviewHistory } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Interview Preparation</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ace Your Interviews</h2>
          <p className="text-gray-600">
            Prepare for interviews with AI-powered question generation and mock interview simulations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interview Preparation Tools */}
          <div>
            <InterviewPrep userProfile={profile} />
          </div>

          {/* Mock Interview */}
          <div>
            <MockInterview 
              userProfile={profile}
              interviewHistory={interviewHistory || []}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 