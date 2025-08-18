import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  Building,
  TrendingUp
} from 'lucide-react'

export default async function ApplicationsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user's applications
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('applied_at', { ascending: false })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'text-blue-600 bg-blue-100'
      case 'reviewing':
        return 'text-yellow-600 bg-yellow-100'
      case 'interview':
        return 'text-purple-600 bg-purple-100'
      case 'accepted':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <FileText className="h-4 w-4" />
      case 'reviewing':
        return <Clock className="h-4 w-4" />
      case 'interview':
        return <Calendar className="h-4 w-4" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getApplicationStats = () => {
    if (!applications) return { total: 0, submitted: 0, reviewing: 0, interview: 0, accepted: 0, rejected: 0 }
    
    return {
      total: applications.length,
      submitted: applications.filter(app => app.status === 'submitted').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      interview: applications.filter(app => app.status === 'interview').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    }
  }

  const stats = getApplicationStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">My Applications</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-lg font-semibold text-gray-900">{stats.submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Reviewing</p>
                <p className="text-lg font-semibold text-gray-900">{stats.reviewing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Interview</p>
                <p className="text-lg font-semibold text-gray-900">{stats.interview}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-lg font-semibold text-gray-900">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-lg font-semibold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
          </div>

          {!applications || applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">
                Start applying to jobs to track your applications here
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.job_title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status || 'Submitted'}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Building className="h-4 w-4 mr-2" />
                        {application.company_name}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Applied on {formatDate(application.applied_at)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/applications/${application.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Application Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Follow Up</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Send a follow-up email 1 week after applying</li>
                <li>• Connect with hiring managers on LinkedIn</li>
                <li>• Keep track of application deadlines</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Stay Organized</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Update your application status regularly</li>
                <li>• Save important contact information</li>
                <li>• Document interview feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 