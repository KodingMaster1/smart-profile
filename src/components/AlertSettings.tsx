'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Settings, 
  Bell, 
  Mail, 
  Smartphone,
  Globe,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Profile {
  id?: string
  user_id: string
  headline?: string
  bio?: string
  skills?: string[]
  experience?: any[]
  education?: any[]
  certifications?: any[]
  languages?: any[]
  cv_url?: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  website_url?: string
  location?: any
  availability?: boolean
  salary_range?: any
  remote_preference?: string
  work_authorization?: string
}

interface AlertSettings {
  id?: string
  user_id: string
  email_notifications: boolean
  push_notifications: boolean
  job_alerts: boolean
  application_updates: boolean
  interview_reminders: boolean
  profile_views: boolean
  system_notifications: boolean
  daily_digest: boolean
  weekly_summary: boolean
  alert_frequency: 'immediate' | 'daily' | 'weekly'
  created_at?: string
  updated_at?: string
}

interface AlertSettingsProps {
  alertSettings?: AlertSettings | null
  userProfile?: Profile | null
}

export default function AlertSettings({ alertSettings, userProfile }: AlertSettingsProps) {
  const [settings, setSettings] = useState({
    email_notifications: alertSettings?.email_notifications ?? true,
    push_notifications: alertSettings?.push_notifications ?? true,
    job_alerts: alertSettings?.job_alerts ?? true,
    application_updates: alertSettings?.application_updates ?? true,
    interview_reminders: alertSettings?.interview_reminders ?? true,
    profile_views: alertSettings?.profile_views ?? true,
    system_notifications: alertSettings?.system_notifications ?? true,
    daily_digest: alertSettings?.daily_digest ?? false,
    weekly_summary: alertSettings?.weekly_summary ?? true,
    alert_frequency: alertSettings?.alert_frequency ?? 'immediate'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const saveSettings = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('alert_settings')
        .upsert({
          user_id: userProfile?.user_id || '',
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      setMessage('Settings saved successfully!')
    } catch (error) {
      setMessage('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const notificationTypes = [
    {
      key: 'job_alerts',
      label: 'Job Alerts',
      description: 'Get notified about new job opportunities that match your profile',
      icon: Bell
    },
    {
      key: 'application_updates',
      label: 'Application Updates',
      description: 'Receive updates on your job application status',
      icon: CheckCircle
    },
    {
      key: 'interview_reminders',
      label: 'Interview Reminders',
      description: 'Get reminded about upcoming interviews and preparation',
      icon: AlertCircle
    },
    {
      key: 'profile_views',
      label: 'Profile Views',
      description: 'Know when someone views your profile',
      icon: Globe
    },
    {
      key: 'system_notifications',
      label: 'System Notifications',
      description: 'Important updates about your account and platform',
      icon: Settings
    }
  ]

  const deliveryMethods = [
    {
      key: 'email_notifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail
    },
    {
      key: 'push_notifications',
      label: 'Push Notifications',
      description: 'Get instant notifications on your device',
      icon: Smartphone
    }
  ]

  const digestOptions = [
    {
      key: 'daily_digest',
      label: 'Daily Digest',
      description: 'Get a summary of all notifications once per day'
    },
    {
      key: 'weekly_summary',
      label: 'Weekly Summary',
      description: 'Receive a weekly summary of your activity'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Alert Settings</h3>
          </div>
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Delivery Methods */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-900 mb-4">Delivery Methods</h4>
          <div className="space-y-4">
            {deliveryMethods.map((method) => {
              const Icon = method.icon
              return (
                <div key={method.key} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[method.key as keyof typeof settings] as boolean}
                          onChange={(e) => updateSetting(method.key as keyof typeof settings, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notification Types */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Types</h4>
          <div className="space-y-4">
            {notificationTypes.map((type) => {
              const Icon = type.icon
              return (
                <div key={type.key} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[type.key as keyof typeof settings] as boolean}
                          onChange={(e) => updateSetting(type.key as keyof typeof settings, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alert Frequency */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-900 mb-4">Alert Frequency</h4>
          <div className="space-y-3">
            {[
              { value: 'immediate', label: 'Immediate', description: 'Get notifications as soon as they happen' },
              { value: 'daily', label: 'Daily Digest', description: 'Receive a daily summary of all notifications' },
              { value: 'weekly', label: 'Weekly Summary', description: 'Get a weekly summary of your activity' }
            ].map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="alert_frequency"
                  value={option.value}
                  checked={settings.alert_frequency === option.value}
                  onChange={(e) => updateSetting('alert_frequency', e.target.value)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Digest Options */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Digest Options</h4>
          <div className="space-y-4">
            {digestOptions.map((option) => (
              <div key={option.key} className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[option.key as keyof typeof settings] as boolean}
                        onChange={(e) => updateSetting(option.key as keyof typeof settings, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.includes('successfully') ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Test Notifications</span>
            </div>
            <span className="text-xs text-gray-500">Send test</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Email Preferences</span>
            </div>
            <span className="text-xs text-gray-500">Manage</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Mobile Settings</span>
            </div>
            <span className="text-xs text-gray-500">Configure</span>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Notification Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Enable job alerts to never miss relevant opportunities</li>
          <li>• Set up interview reminders to stay prepared</li>
          <li>• Use daily digest to avoid notification overload</li>
          <li>• Keep system notifications on for important updates</li>
          <li>• Test your notification settings regularly</li>
        </ul>
      </div>
    </div>
  )
} 