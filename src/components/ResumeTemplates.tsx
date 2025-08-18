'use client'

import { useState } from 'react'
import { Eye, Check } from 'lucide-react'

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design with strong visual hierarchy',
    preview: '/api/resume-preview/modern',
    features: ['Professional layout', 'Easy to scan', 'ATS friendly'],
    color: 'bg-blue-500'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and elegant design focusing on content',
    preview: '/api/resume-preview/minimal',
    features: ['Clean typography', 'Minimal distractions', 'Focus on content'],
    color: 'bg-gray-500'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold and creative design for creative professionals',
    preview: '/api/resume-preview/creative',
    features: ['Creative layout', 'Visual elements', 'Portfolio style'],
    color: 'bg-purple-500'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals',
    preview: '/api/resume-preview/executive',
    features: ['Executive style', 'Professional fonts', 'Premium look'],
    color: 'bg-indigo-500'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for technical roles and engineering',
    preview: '/api/resume-preview/technical',
    features: ['Technical focus', 'Skills emphasis', 'Project highlights'],
    color: 'bg-green-500'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal design suitable for academic and research positions',
    preview: '/api/resume-preview/academic',
    features: ['Academic style', 'Publication focus', 'Research emphasis'],
    color: 'bg-red-500'
  }
]

export default function ResumeTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const previewTemplateDesign = (templateId: string) => {
    setPreviewTemplate(templateId)
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Template</h3>
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`w-4 h-4 rounded-full ${template.color} mr-3`}></div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    {selectedTemplate === template.id && (
                      <Check className="h-5 w-5 text-indigo-600 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    previewTemplateDesign(template.id)
                  }}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {templates.find(t => t.id === previewTemplate)?.name} Template Preview
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-8 min-h-[600px]">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                  {/* Mock Resume Preview */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">John Doe</h1>
                    <p className="text-gray-600">Senior Software Engineer</p>
                    <p className="text-sm text-gray-500">john.doe@email.com • (555) 123-4567 • San Francisco, CA</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                    <p className="text-gray-700 text-sm">
                      Experienced software engineer with 5+ years developing scalable web applications. 
                      Proficient in React, Node.js, and cloud technologies. Passionate about clean code 
                      and user experience.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900">Senior Software Engineer</h3>
                        <p className="text-sm text-gray-600">TechCorp Inc. • 2021 - Present</p>
                        <p className="text-sm text-gray-700 mt-1">
                          Led development of microservices architecture and mentored junior developers.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">React</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Node.js</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">TypeScript</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">AWS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedTemplate(previewTemplate)
                    setPreviewTemplate(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Template Features</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">ATS (Applicant Tracking System) friendly</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Professional typography</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Responsive design</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Multiple export formats</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3" />
            <span className="text-sm text-gray-700">Customizable sections</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Resume Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Keep your resume to 1-2 pages maximum</li>
          <li>• Use action verbs to describe your achievements</li>
          <li>• Quantify your accomplishments with numbers</li>
          <li>• Tailor your resume for each job application</li>
          <li>• Proofread carefully for spelling and grammar</li>
        </ul>
      </div>
    </div>
  )
} 