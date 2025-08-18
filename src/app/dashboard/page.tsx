import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Briefcase, 
  Search, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  TrendingUp,
  Calendar
} from 'lucide-react'

export default async function DashboardPage() {
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

  // Get recent applications count
  const { count: applicationsCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Smart Profile Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex space-x-8 mb-8">
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600"
          >
            <User className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Profile
          </Link>
          <Link
            href="/jobs"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <Search className="h-4 w-4 mr-2" />
            Job Search
          </Link>
          <Link
            href="/applications"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FileText className="h-4 w-4 mr-2" />
            Applications
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </nav>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Completion</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {profile ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applicationsCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Profile</h2>
              <p className="text-sm text-gray-600 mt-1">
                {profile ? 'Your profile is complete' : 'Complete your profile to get started'}
              </p>
            </div>
            <div className="p-6">
              {profile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{profile.headline || 'No headline'}</h3>
                      <p className="text-sm text-gray-600">{profile.bio || 'No bio added'}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.availability 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.availability ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  >
                    Edit Profile
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <User className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Profile</h3>
                  <p className="text-gray-600 mb-4">
                    Add your professional information to start getting job recommendations
                  </p>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Profile
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Welcome to Smart Profile!</p>
                    <p className="text-sm text-gray-600">Get started by completing your profile</p>
                  </div>
                </div>
                
                {applicationsCount > 0 && (
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Applications Submitted</p>
                      <p className="text-sm text-gray-600">{applicationsCount} total applications</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/jobs"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Search className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Search Jobs</h3>
                <p className="text-sm text-gray-600">Find your next opportunity</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Briefcase className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-600">Keep your information current</p>
              </div>
            </Link>

            <Link
              href="/applications"
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <FileText className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">View Applications</h3>
                <p className="text-sm text-gray-600">Track your job applications</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 