import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import ProfileView from '@/components/ProfileView'

export default async function ProfilePage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Build and customize your professional profile to stand out to employers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h2>
            <ProfileForm user={user} profile={profile} />
          </div>

          {/* Profile Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Preview</h2>
            <ProfileView profile={profile} user={user} />
          </div>
        </div>
      </div>
    </div>
  )
} 