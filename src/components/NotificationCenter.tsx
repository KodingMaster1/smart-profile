'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Bell, 
  Briefcase, 
  FileText, 
  Calendar, 
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search
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

interface Notification {
  id?: string
  user_id: string
  type: 'job_match' | 'application_update' | 'interview_reminder' | 'profile_view' | 'system'
  title: string
  message: string
  is_read: boolean
  action_url?: string
  created_at?: string
  metadata?: any
}

interface NotificationCenterProps {
  notifications: Notification[]
  userProfile?: Profile | null
}

export default function NotificationCenter({ notifications, userProfile }: NotificationCenterProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return <Briefcase className="h-5 w-5 text-blue-600" />
      case 'application_update':
        return <FileText className="h-5 w-5 text-green-600" />
      case 'interview_reminder':
        return <Calendar className="h-5 w-5 text-purple-600" />
      case 'profile_view':
        return <Eye className="h-5 w-5 text-indigo-600" />
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'job_match':
        return 'border-l-blue-500 bg-blue-50'
      case 'application_update':
        return 'border-l-green-500 bg-green-50'
      case 'interview_reminder':
        return 'border-l-purple-500 bg-purple-50'
      case 'profile_view':
        return 'border-l-indigo-500 bg-indigo-50'
      case 'system':
        return 'border-l-gray-500 bg-gray-50'
      default:
        return 'border-l-gray-500 bg-white'
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    setIsMarkingAllRead(true)
    try {
      const supabase = createClient()
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userProfile?.user_id || '')
        .eq('is_read', false)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || notification.type === activeFilter
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'job_match', label: 'Job Matches', count: notifications.filter(n => n.type === 'job_match').length },
    { id: 'application_update', label: 'Applications', count: notifications.filter(n => n.type === 'application_update').length },
    { id: 'interview_reminder', label: 'Interviews', count: notifications.filter(n => n.type === 'interview_reminder').length },
    { id: 'profile_view', label: 'Profile Views', count: notifications.filter(n => n.type === 'profile_view').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-indigo-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Notification Center</h3>
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              disabled={isMarkingAllRead || unreadCount === 0}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isMarkingAllRead ? 'Marking...' : 'Mark All Read'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </h4>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? 'You\'re all caught up! No new notifications.'
                : `No ${activeFilter.replace('_', ' ')} notifications found.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.is_read ? 'bg-white' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.created_at || '')}
                          </span>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.action_url && (
                        <a
                          href={notification.action_url}
                          className="inline-flex items-center mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          View Details
                          <span className="ml-1">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id || '')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Mark as read"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id || '')}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Job Alerts</div>
              <div className="text-xs text-gray-600">Manage your job preferences</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Calendar className="h-5 w-5 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Interview Reminders</div>
              <div className="text-xs text-gray-600">Set up interview notifications</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <FileText className="h-5 w-5 text-green-600 mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Application Updates</div>
              <div className="text-xs text-gray-600">Track application status</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Eye className="h-5 w-5 text-indigo-600 mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Profile Views</div>
              <div className="text-xs text-gray-600">See who viewed your profile</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
} 