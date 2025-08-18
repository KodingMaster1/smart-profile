'use client'

import Link from 'next/link'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Star,
  ExternalLink,
  TrendingUp
} from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  experience: string
  remote: string
  salary: string
  description: string
  requirements: string[]
  posted_date: string
  match_score: number
}

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

interface JobListProps {
  jobs: Job[]
  userProfile?: Profile | null
}

export default function JobList({ jobs, userProfile }: JobListProps) {
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Great Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Building className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or filters
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link href={`/jobs/${job.id}`} className="hover:text-indigo-600">
                    {job.title}
                  </Link>
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchColor(job.match_score)}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {job.match_score}%
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Star className="h-5 w-5" />
              </button>
              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
              >
                View Details
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.requirements.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  userProfile?.skills?.includes(skill)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {skill}
                {userProfile?.skills?.includes(skill) && (
                  <Star className="h-3 w-3 ml-1 text-green-600" />
                )}
              </span>
            ))}
            {job.requirements.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{job.requirements.length - 4} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(job.posted_date)}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {job.type}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                {job.remote}
              </span>
            </div>
          </div>

          {/* AI Match Insights */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{getMatchLabel(job.match_score)}</span>
                <span className="text-gray-600 ml-2">
                  Based on your skills and preferences
                </span>
              </div>
              <Link
                href={`/jobs/${job.id}/apply`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 