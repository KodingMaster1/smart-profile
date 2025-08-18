'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Eye, 
  Star, 
  Users, 
  Globe,
  Calendar,
  MapPin,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react'

interface PortfolioView {
  id?: string
  user_id: string
  viewer_ip?: string
  viewer_location?: string
  viewer_device?: string
  viewed_at?: string
  referrer?: string
}

interface Project {
  id?: string
  user_id: string
  title: string
  description: string
  image_url?: string
  github_url?: string
  live_url?: string
  technologies: string[]
  featured: boolean
  created_at?: string
}

interface PortfolioAnalyticsProps {
  portfolioViews: PortfolioView[]
  projects: Project[]
}

export default function PortfolioAnalytics({ portfolioViews, projects }: PortfolioAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')

  const getAnalyticsData = () => {
    const now = new Date()
    const timeRanges = {
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    }

    const filteredViews = portfolioViews.filter(view => 
      new Date(view.viewed_at || '') >= timeRanges[timeRange as keyof typeof timeRanges]
    )

    return {
      totalViews: filteredViews.length,
      uniqueVisitors: new Set(filteredViews.map(v => v.viewer_ip)).size,
      featuredProjects: projects.filter(p => p.featured).length,
      totalProjects: projects.length,
      viewsByDay: getViewsByDay(filteredViews),
      topReferrers: getTopReferrers(filteredViews),
      deviceBreakdown: getDeviceBreakdown(filteredViews),
      locationBreakdown: getLocationBreakdown(filteredViews)
    }
  }

  const getViewsByDay = (views: PortfolioView[]) => {
    const days: { [key: string]: number } = {}
    views.forEach(view => {
      const date = new Date(view.viewed_at || '').toLocaleDateString()
      days[date] = (days[date] || 0) + 1
    })
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  }

  const getTopReferrers = (views: PortfolioView[]) => {
    const referrers: { [key: string]: number } = {}
    views.forEach(view => {
      const referrer = view.referrer || 'Direct'
      referrers[referrer] = (referrers[referrer] || 0) + 1
    })
    return Object.entries(referrers)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const getDeviceBreakdown = (views: PortfolioView[]) => {
    const devices: { [key: string]: number } = {}
    views.forEach(view => {
      const device = view.viewer_device || 'Unknown'
      devices[device] = (devices[device] || 0) + 1
    })
    return Object.entries(devices).map(([device, count]) => ({ device, count }))
  }

  const getLocationBreakdown = (views: PortfolioView[]) => {
    const locations: { [key: string]: number } = {}
    views.forEach(view => {
      const location = view.viewer_location || 'Unknown'
      locations[location] = (locations[location] || 0) + 1
    })
    return Object.entries(locations)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const analytics = getAnalyticsData()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'traffic', label: 'Traffic', icon: Activity },
    { id: 'projects', label: 'Projects', icon: Star }
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Portfolio Analytics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{analytics.totalViews}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.uniqueVisitors}</div>
            <div className="text-sm text-gray-600">Unique Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.totalProjects}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{analytics.featuredProjects}</div>
            <div className="text-sm text-gray-600">Featured Projects</div>
          </div>
        </div>

        {/* Traffic Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Views Over Time</h4>
          <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-between p-4">
            {analytics.viewsByDay.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-indigo-500 rounded-t w-8"
                  style={{ height: `${(day.count / Math.max(...analytics.viewsByDay.map(d => d.count))) * 80}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Top Referrers</h4>
                <div className="space-y-2">
                  {analytics.topReferrers.map((referrer, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{referrer.referrer}</span>
                      <span className="text-sm font-medium text-gray-900">{referrer.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Device Breakdown</h4>
                <div className="space-y-2">
                  {analytics.deviceBreakdown.map((device, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{device.device}</span>
                      <span className="text-sm font-medium text-gray-900">{device.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Traffic Tab */}
          {activeTab === 'traffic' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Top Locations</h4>
                <div className="space-y-2">
                  {analytics.locationBreakdown.map((location, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{location.location}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{location.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Views</h4>
                <div className="space-y-2">
                  {portfolioViews.slice(0, 5).map((view, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          {new Date(view.viewed_at || '').toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-gray-500">{view.viewer_location || 'Unknown'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Project Performance</h4>
                <div className="space-y-3">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{project.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {project.technologies.length} tech
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">View Live Portfolio</span>
            </div>
            <span className="text-xs text-gray-500">Public URL</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Export Analytics</span>
            </div>
            <span className="text-xs text-gray-500">PDF Report</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Share Portfolio</span>
            </div>
            <span className="text-xs text-gray-500">Social Media</span>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Portfolio Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Keep your portfolio updated with latest projects</li>
          <li>• Use high-quality images and screenshots</li>
          <li>• Include live demos when possible</li>
          <li>• Optimize for mobile devices</li>
          <li>• Share your portfolio on social media</li>
        </ul>
      </div>
    </div>
  )
} 