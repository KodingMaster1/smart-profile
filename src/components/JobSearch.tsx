'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

interface JobSearchProps {
  initialQuery?: string
  initialLocation?: string
}

export default function JobSearch({ initialQuery = '', initialLocation = '' }: JobSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    
    if (location.trim()) {
      params.set('location', location.trim())
    } else {
      params.delete('location')
    }
    
    // Clear other filters when searching
    params.delete('type')
    params.delete('experience')
    params.delete('remote')
    
    router.push(`/jobs?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery('')
    setLocation('')
    router.push('/jobs')
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Query */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Job title, keywords, or company"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="City, state, or remote"
            />
          </div>
        </div>

        {/* Search Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {initialQuery || initialLocation ? (
              <span>
                Showing results for "{initialQuery}" {initialLocation && `in ${initialLocation}`}
              </span>
            ) : (
              <span>Search for your next opportunity</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            {(query || location) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Software Engineer',
            'Frontend Developer',
            'Data Scientist',
            'Product Manager',
            'DevOps Engineer',
            'UX Designer'
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion)
                router.push(`/jobs?q=${encodeURIComponent(suggestion)}`)
              }}
              className="px-3 py-1 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 