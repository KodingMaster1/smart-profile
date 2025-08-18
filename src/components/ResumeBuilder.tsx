'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Download,
  Eye,
  Sparkles,
  Save,
  Plus,
  Trash2
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

interface Resume {
  id?: string
  user_id: string
  title: string
  template: string
  content: any
  created_at?: string
  updated_at?: string
}

interface ResumeBuilderProps {
  userProfile?: Profile | null
  existingResumes: Resume[]
}

export default function ResumeBuilder({ userProfile, existingResumes }: ResumeBuilderProps) {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [resumeData, setResumeData] = useState({
    title: '',
    template: 'modern',
    sections: {
      personal: {
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
      },
      summary: '',
      experience: [] as any[],
      education: [] as any[],
      skills: [] as string[],
      certifications: [] as any[],
      projects: [] as any[]
    }
  })
  const [activeSection, setActiveSection] = useState('personal')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (userProfile) {
      setResumeData(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          personal: {
            name: userProfile.headline || '',
            email: userProfile.user_id || '',
            phone: '',
            location: '',
            linkedin: userProfile.linkedin_url || '',
            website: userProfile.website_url || ''
          },
          summary: userProfile.bio || '',
          skills: userProfile.skills || [],
          experience: userProfile.experience || [],
          education: userProfile.education || [],
          certifications: userProfile.certifications || []
        }
      }))
    }
  }, [userProfile])

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: [
          ...prev.sections.experience,
          {
            id: Date.now(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
          }
        ]
      }
    }))
  }

  const updateExperience = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: prev.sections.experience.map((exp, i) => 
          i === index ? { ...exp, [field]: value } : exp
        )
      }
    }))
  }

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: prev.sections.experience.filter((_, i) => i !== index)
      }
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: [
          ...prev.sections.education,
          {
            id: Date.now(),
            degree: '',
            institution: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            gpa: ''
          }
        ]
      }
    }))
  }

  const updateEducation = (index: number, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: prev.sections.education.map((edu, i) => 
          i === index ? { ...edu, [field]: value } : edu
        )
      }
    }))
  }

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: prev.sections.education.filter((_, i) => i !== index)
      }
    }))
  }

  const addSkill = () => {
    const skill = prompt('Enter a skill:')
    if (skill) {
      setResumeData(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          skills: [...prev.sections.skills, skill]
        }
      }))
    }
  }

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: prev.sections.skills.filter((_, i) => i !== index)
      }
    }))
  }

  const optimizeResume = async () => {
    setIsOptimizing(true)
    setMessage('')

    try {
      // Mock AI optimization (in real app, this would call OpenAI API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate AI improvements
      setResumeData(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          summary: prev.sections.summary + ' (AI optimized for better impact)',
          skills: [...prev.sections.skills, 'AI-Recommended Skill']
        }
      }))
      
      setMessage('Resume optimized successfully!')
    } catch (error) {
      setMessage('Failed to optimize resume. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const saveResume = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('resumes')
        .upsert({
          user_id: userProfile?.user_id || '',
          title: resumeData.title || 'My Resume',
          template: resumeData.template,
          content: resumeData,
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      setMessage('Resume saved successfully!')
    } catch (error) {
      setMessage('Failed to save resume. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const exportResume = (format: 'pdf' | 'docx') => {
    // Mock export functionality
    setMessage(`Exporting resume as ${format.toUpperCase()}...`)
    setTimeout(() => {
      setMessage('Resume exported successfully!')
    }, 2000)
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ]

  return (
    <div className="space-y-6">
      {/* Resume Selection */}
      {existingResumes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Resumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingResumes.map((resume) => (
              <div
                key={resume.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedResume?.id === resume.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedResume(resume)}
              >
                <h4 className="font-medium text-gray-900">{resume.title}</h4>
                <p className="text-sm text-gray-600">
                  {resume.template} template • {new Date(resume.updated_at || '').toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Builder */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Resume Builder</h3>
            <div className="flex space-x-2">
              <button
                onClick={optimizeResume}
                disabled={isOptimizing}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
              </button>
              <button
                onClick={saveResume}
                disabled={isSaving}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Navigation */}
          <div className="lg:col-span-1 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 p-6">
            {/* Personal Information */}
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.sections.personal.name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          personal: { ...prev.sections.personal, name: e.target.value }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={resumeData.sections.personal.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          personal: { ...prev.sections.personal, email: e.target.value }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={resumeData.sections.personal.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          personal: { ...prev.sections.personal, phone: e.target.value }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={resumeData.sections.personal.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          personal: { ...prev.sections.personal, location: e.target.value }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                    <input
                      type="url"
                      value={resumeData.sections.personal.linkedin}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          personal: { ...prev.sections.personal, linkedin: e.target.value }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      value={resumeData.sections.personal.website}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          personal: { ...prev.sections.personal, website: e.target.value }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            {activeSection === 'summary' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Professional Summary</h4>
                <textarea
                  value={resumeData.sections.summary}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    sections: { ...prev.sections, summary: e.target.value }
                  }))}
                  rows={6}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Write a compelling professional summary..."
                />
              </div>
            )}

            {/* Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Work Experience</h4>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.sections.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-medium text-gray-900">Experience {index + 1}</h5>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => updateExperience(index, 'title', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => updateExperience(index, 'location', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                            disabled={exp.current}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">Current Position</label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Education</h4>
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.sections.education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-medium text-gray-900">Education {index + 1}</h5>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            value={edu.location}
                            onChange={(e) => updateEducation(index, 'location', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">GPA</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                            disabled={edu.current}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Skills</h4>
                  <button
                    onClick={addSkill}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.sections.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {activeSection === 'certifications' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Certifications</h4>
                <p className="text-gray-600">
                  Certifications from your profile will be automatically included.
                </p>
                {resumeData.sections.certifications.length > 0 ? (
                  <div className="space-y-2">
                    {resumeData.sections.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{cert.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No certifications found in your profile.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900">Export Resume</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => exportResume('pdf')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => exportResume('docx')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export DOCX
              </button>
            </div>
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