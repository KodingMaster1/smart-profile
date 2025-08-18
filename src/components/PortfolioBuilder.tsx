'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Globe, 
  Github, 
  ExternalLink, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Star,
  Code,
  Palette,
  Save,
  Sparkles,
  Link,
  Image
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

interface Portfolio {
  id?: string
  user_id: string
  title: string
  description: string
  theme: string
  custom_domain?: string
  is_published: boolean
  created_at?: string
  updated_at?: string
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

interface PortfolioBuilderProps {
  userProfile?: Profile | null
  portfolio?: Portfolio | null
  projects: Project[]
}

export default function PortfolioBuilder({ userProfile, portfolio, projects }: PortfolioBuilderProps) {
  const [portfolioData, setPortfolioData] = useState({
    title: portfolio?.title || userProfile?.headline || 'My Portfolio',
    description: portfolio?.description || userProfile?.bio || '',
    theme: portfolio?.theme || 'modern',
    custom_domain: portfolio?.custom_domain || '',
    is_published: portfolio?.is_published || false
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const themes = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'creative', name: 'Creative', description: 'Bold and artistic' },
    { id: 'professional', name: 'Professional', description: 'Corporate and formal' },
    { id: 'dark', name: 'Dark', description: 'Dark theme with high contrast' }
  ]

  const savePortfolio = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('portfolios')
        .upsert({
          user_id: userProfile?.user_id || '',
          title: portfolioData.title,
          description: portfolioData.description,
          theme: portfolioData.theme,
          custom_domain: portfolioData.custom_domain,
          is_published: portfolioData.is_published,
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      setMessage('Portfolio saved successfully!')
    } catch (error) {
      setMessage('Failed to save portfolio. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const importFromGithub = async () => {
    if (!githubUsername) {
      alert('Please enter your GitHub username')
      return
    }

    setIsImporting(true)
    setMessage('')

    try {
      // Mock GitHub API call (in real app, this would call GitHub API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockProjects = [
        {
          title: 'Smart Profile App',
          description: 'A comprehensive job search and portfolio management application',
          github_url: `https://github.com/${githubUsername}/smart-profile-app`,
          live_url: 'https://smart-profile-app.vercel.app',
          technologies: ['React', 'Next.js', 'TypeScript', 'Supabase'],
          featured: true
        },
        {
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration',
          github_url: `https://github.com/${githubUsername}/ecommerce-platform`,
          live_url: 'https://ecommerce-demo.vercel.app',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          featured: true
        },
        {
          title: 'Task Management App',
          description: 'Collaborative task management with real-time updates',
          github_url: `https://github.com/${githubUsername}/task-manager`,
          technologies: ['Vue.js', 'Firebase', 'Vuex'],
          featured: false
        }
      ]

      // Save imported projects
      const supabase = createClient()
      for (const project of mockProjects) {
        await supabase
          .from('projects')
          .insert({
            user_id: userProfile?.user_id || '',
            ...project
          })
      }

      setMessage(`Successfully imported ${mockProjects.length} projects from GitHub!`)
    } catch (error) {
      setMessage('Failed to import projects. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const addProject = () => {
    // Mock project addition (in real app, this would open a modal)
    setMessage('Project addition feature coming soon!')
  }

  const publishPortfolio = async () => {
    setPortfolioData(prev => ({ ...prev, is_published: true }))
    await savePortfolio()
    setMessage('Portfolio published successfully!')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'customization', label: 'Customization', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Globe }
  ]

  return (
    <div className="space-y-6">
      {/* Portfolio Builder */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Portfolio Builder</h3>
            <div className="flex space-x-2">
              <button
                onClick={savePortfolio}
                disabled={isSaving}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={publishPortfolio}
                disabled={portfolioData.is_published}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Globe className="h-4 w-4 mr-2" />
                {portfolioData.is_published ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Navigation */}
          <div className="lg:col-span-1 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Portfolio Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Title</label>
                      <input
                        type="text"
                        value={portfolioData.title}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Domain (Optional)</label>
                      <input
                        type="text"
                        value={portfolioData.custom_domain}
                        onChange={(e) => setPortfolioData(prev => ({ ...prev, custom_domain: e.target.value }))}
                        placeholder="yourdomain.com"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={portfolioData.description}
                    onChange={(e) => setPortfolioData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Describe your portfolio and what you do..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          portfolioData.theme === theme.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPortfolioData(prev => ({ ...prev, theme: theme.id }))}
                      >
                        <h5 className="font-medium text-gray-900">{theme.name}</h5>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Preview */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Preview</h5>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{portfolioData.title}</h2>
                    <p className="text-gray-600 mb-4">{portfolioData.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Theme: {themes.find(t => t.id === portfolioData.theme)?.name}</span>
                      {portfolioData.custom_domain && (
                        <span className="text-sm text-gray-500">Domain: {portfolioData.custom_domain}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Projects</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={addProject}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </button>
                  </div>
                </div>

                {/* GitHub Integration */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-3 flex items-center">
                    <Github className="h-5 w-5 mr-2" />
                    Import from GitHub
                  </h5>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="Enter GitHub username"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={importFromGithub}
                      disabled={isImporting || !githubUsername}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isImporting ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-4">
                        Add your projects to showcase your work
                      </p>
                      <button
                        onClick={addProject}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Project
                      </button>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h5 className="font-medium text-gray-900">{project.title}</h5>
                              {project.featured && (
                                <Star className="h-4 w-4 text-yellow-500 ml-2" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                                >
                                  <Github className="h-4 w-4 mr-1" />
                                  GitHub
                                </a>
                              )}
                              {project.live_url && (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Live Demo
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Customization Tab */}
            {activeTab === 'customization' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900">Customization</h4>
                <p className="text-gray-600">
                  Advanced customization options coming soon! You'll be able to:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Customize colors and typography</li>
                  <li>• Add custom CSS</li>
                  <li>• Configure layout options</li>
                  <li>• Add custom sections</li>
                  <li>• Integrate with external services</li>
                </ul>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-900">Portfolio Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio URL
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        value={portfolioData.custom_domain || `${userProfile?.user_id}.smartprofile.app`}
                        className="flex-1 rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Settings
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Meta title"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <textarea
                        placeholder="Meta description"
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Settings
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Allow search engines to index my portfolio</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show analytics to visitors</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="text-green-600">{message}</div>
          </div>
        </div>
      )}
    </div>
  )
} 