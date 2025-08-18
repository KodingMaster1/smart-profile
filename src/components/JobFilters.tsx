'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'

interface JobFiltersProps {
  currentType?: string
  currentExperience?: string
  currentRemote?: string
}

export default function JobFilters({ 
  currentType, 
  currentExperience, 
  currentRemote 
}: JobFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`/jobs?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('type')
    params.delete('experience')
    params.delete('remote')
    router.push(`/jobs?${params.toString()}`)
  }

  const hasActiveFilters = currentType || currentExperience || currentRemote

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Job Type Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Job Type</h4>
        <div className="space-y-2">
          {[
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' },
            { value: 'Freelance', label: 'Freelance' }
          ].map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={currentType === type.value}
                onChange={(e) => updateFilter('type', e.target.checked ? e.target.value : '')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h4>
        <div className="space-y-2">
          {[
            { value: 'Entry-level', label: 'Entry-level' },
            { value: 'Mid-level', label: 'Mid-level' },
            { value: 'Senior', label: 'Senior' },
            { value: 'Lead', label: 'Lead' },
            { value: 'Executive', label: 'Executive' }
          ].map((level) => (
            <label key={level.value} className="flex items-center">
              <input
                type="radio"
                name="experience"
                value={level.value}
                checked={currentExperience === level.value}
                onChange={(e) => updateFilter('experience', e.target.checked ? e.target.value : '')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Remote Work Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Remote Work</h4>
        <div className="space-y-2">
          {[
            { value: 'Remote', label: 'Remote' },
            { value: 'Hybrid', label: 'Hybrid' },
            { value: 'On-site', label: 'On-site' }
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="remote"
                value={option.value}
                checked={currentRemote === option.value}
                onChange={(e) => updateFilter('remote', e.target.checked ? e.target.value : '')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Salary Range</h4>
        <div className="space-y-2">
          {[
            { value: '0-50k', label: 'Under $50k' },
            { value: '50k-100k', label: '$50k - $100k' },
            { value: '100k-150k', label: '$100k - $150k' },
            { value: '150k+', label: '$150k+' }
          ].map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {currentType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Type: {currentType}
                <button
                  onClick={() => updateFilter('type', '')}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentExperience && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Experience: {currentExperience}
                <button
                  onClick={() => updateFilter('experience', '')}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentRemote && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Remote: {currentRemote}
                <button
                  onClick={() => updateFilter('remote', '')}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 