import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import NotificationCenter from '@/components/NotificationCenter'
import AlertSettings from '@/components/AlertSettings'

export default async function NotificationsPage() {
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

  // Get notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get alert settings
  const { data: alertSettings } = await supabase
    .from('alert_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Stay Updated</h2>
          <p className="text-gray-600">
            Manage your notifications and job alerts to never miss important opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notification Center */}
          <div className="lg:col-span-2">
            <NotificationCenter 
              notifications={notifications || []}
              userProfile={profile}
            />
          </div>

          {/* Alert Settings */}
          <div className="lg:col-span-1">
            <AlertSettings 
              alertSettings={alertSettings}
              userProfile={profile}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 