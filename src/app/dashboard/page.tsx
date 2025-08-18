import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Smart Profile Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Hello, {user.email}! You're successfully logged in.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Profile Builder</h3>
              <p className="text-blue-700 text-sm">Create and customize your professional profile</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Job Search</h3>
              <p className="text-green-700 text-sm">Find and apply to relevant job opportunities</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">AI Assistant</h3>
              <p className="text-purple-700 text-sm">Get AI-powered career guidance and tips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 