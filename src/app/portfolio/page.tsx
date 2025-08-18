import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PortfolioBuilder from '@/components/PortfolioBuilder'
import PortfolioAnalytics from '@/components/PortfolioAnalytics'

export default async function PortfolioPage() {
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

  // Get portfolio data
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get portfolio views
  const { data: portfolioViews } = await supabase
    .from('portfolio_views')
    .select('*')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Portfolio</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Professional Portfolio</h2>
          <p className="text-gray-600">
            Showcase your projects, skills, and achievements with a stunning portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Builder */}
          <div className="lg:col-span-2">
            <PortfolioBuilder 
              userProfile={profile}
              portfolio={portfolio}
              projects={projects || []}
            />
          </div>

          {/* Analytics Sidebar */}
          <div className="lg:col-span-1">
            <PortfolioAnalytics 
              portfolioViews={portfolioViews || []}
              projects={projects || []}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 