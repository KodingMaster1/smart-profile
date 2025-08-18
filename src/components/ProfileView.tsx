import { User } from '@supabase/supabase-js'
import { ExternalLink, MapPin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react'

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

interface ProfileViewProps {
  profile?: Profile | null
  user: User
}

export default function ProfileView({ profile, user }: ProfileViewProps) {
  if (!profile) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Briefcase className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Yet</h3>
        <p className="text-gray-600">
          Fill out the form to create your professional profile
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user.email}</h2>
        {profile.headline && (
          <p className="text-gray-600 mt-1">{profile.headline}</p>
        )}
        {profile.availability !== undefined && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
            profile.availability 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {profile.availability ? 'Available' : 'Not Available'}
          </span>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
          <p className="text-sm text-gray-600">{profile.bio}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      {(profile.remote_preference || profile.work_authorization) && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Preferences</h3>
          <div className="space-y-1">
            {profile.remote_preference && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                <span className="capitalize">{profile.remote_preference.replace('_', ' ')}</span>
              </div>
            )}
            {profile.work_authorization && (
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 mr-2 text-gray-400" />
                <span className="capitalize">{profile.work_authorization.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      {(profile.linkedin_url || profile.github_url || profile.portfolio_url || profile.website_url) && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Links</h3>
          <div className="space-y-2">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub
              </a>
            )}
            {profile.portfolio_url && (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Portfolio
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Experience Preview */}
      {profile.experience && profile.experience.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Experience</h3>
          <div className="space-y-2">
            {profile.experience.slice(0, 2).map((exp, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-gray-900">{exp.title}</div>
                <div className="text-gray-600">{exp.company}</div>
                <div className="text-gray-500 text-xs">{exp.duration}</div>
              </div>
            ))}
            {profile.experience.length > 2 && (
              <div className="text-xs text-gray-500">
                +{profile.experience.length - 2} more experiences
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education Preview */}
      {profile.education && profile.education.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Education</h3>
          <div className="space-y-2">
            {profile.education.slice(0, 2).map((edu, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-gray-900">{edu.degree}</div>
                <div className="text-gray-600">{edu.institution}</div>
                <div className="text-gray-500 text-xs">{edu.year}</div>
              </div>
            ))}
            {profile.education.length > 2 && (
              <div className="text-xs text-gray-500">
                +{profile.education.length - 2} more education entries
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certifications Preview */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Certifications</h3>
          <div className="space-y-1">
            {profile.certifications.slice(0, 3).map((cert, index) => (
              <div key={index} className="text-sm text-gray-600">
                {cert.name}
              </div>
            ))}
            {profile.certifications.length > 3 && (
              <div className="text-xs text-gray-500">
                +{profile.certifications.length - 3} more certifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 