'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'

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

interface ProfileFormProps {
  user: User
  profile?: Profile | null
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [formData, setFormData] = useState<Profile>({
    user_id: user.id,
    headline: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    cv_url: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    location: {},
    availability: true,
    salary_range: {},
    remote_preference: '',
    work_authorization: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      handleInputChange('skills', [...(formData.skills || []), newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills?.filter(skill => skill !== skillToRemove) || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .upsert(formData)
        .select()

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('An error occurred while saving your profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
              Professional Headline
            </label>
            <input
              type="text"
              id="headline"
              value={formData.headline || ''}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
          
          {formData.skills && formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Links</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700">
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              value={formData.github_url || ''}
              onChange={(e) => handleInputChange('github_url', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700">
              Portfolio URL
            </label>
            <input
              type="url"
              id="portfolio_url"
              value={formData.portfolio_url || ''}
              onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
              Personal Website
            </label>
            <input
              type="url"
              id="website_url"
              value={formData.website_url || ''}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="remote_preference" className="block text-sm font-medium text-gray-700">
              Remote Work Preference
            </label>
            <select
              id="remote_preference"
              value={formData.remote_preference || ''}
              onChange={(e) => handleInputChange('remote_preference', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select preference</option>
              <option value="remote">Remote only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site only</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label htmlFor="work_authorization" className="block text-sm font-medium text-gray-700">
              Work Authorization
            </label>
            <select
              id="work_authorization"
              value={formData.work_authorization || ''}
              onChange={(e) => handleInputChange('work_authorization', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select authorization</option>
              <option value="citizen">US Citizen</option>
              <option value="permanent_resident">Permanent Resident</option>
              <option value="visa_holder">Visa Holder</option>
              <option value="requires_sponsorship">Requires Sponsorship</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="availability"
              type="checkbox"
              checked={formData.availability || false}
              onChange={(e) => handleInputChange('availability', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
              Available for new opportunities
            </label>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-600 border border-red-200' 
            : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
} 