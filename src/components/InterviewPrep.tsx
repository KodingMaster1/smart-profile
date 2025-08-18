'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Target,
  Clock,
  Star,
  CheckCircle
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

interface InterviewPrepProps {
  userProfile?: Profile | null
}

export default function InterviewPrep({ userProfile }: InterviewPrepProps) {
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('questions')

  const commonRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer',
    'Project Manager',
    'Sales Representative'
  ]

  const generateQuestions = async () => {
    if (!selectedRole) {
      alert('Please select a role first')
      return
    }

    setIsGenerating(true)
    setGeneratedQuestions([])

    try {
      // Mock AI question generation (in real app, this would call OpenAI API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockQuestions = [
        `Tell me about a challenging project you worked on as a ${selectedRole}.`,
        `How do you stay updated with the latest technologies in your field?`,
        `Describe a situation where you had to work with a difficult team member.`,
        `What are your salary expectations for this ${selectedRole} position?`,
        `Where do you see yourself in 5 years?`,
        `Why are you interested in working at ${selectedCompany || 'our company'}?`,
        `What are your greatest strengths and weaknesses?`,
        `How do you handle tight deadlines and pressure?`,
        `Tell me about a time you failed and what you learned from it.`,
        `Do you have any questions for us?`
      ]

      setGeneratedQuestions(mockQuestions)
    } catch (error) {
      console.error('Failed to generate questions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const interviewTips = [
    {
      category: 'Before the Interview',
      tips: [
        'Research the company thoroughly',
        'Review the job description',
        'Prepare your elevator pitch',
        'Plan your outfit and route',
        'Practice common questions'
      ]
    },
    {
      category: 'During the Interview',
      tips: [
        'Arrive 10-15 minutes early',
        'Maintain good eye contact',
        'Listen carefully to questions',
        'Use the STAR method for behavioral questions',
        'Ask thoughtful questions'
      ]
    },
    {
      category: 'After the Interview',
      tips: [
        'Send a thank-you email within 24 hours',
        'Follow up if you haven\'t heard back',
        'Reflect on what went well and what to improve',
        'Update your application status',
        'Continue your job search'
      ]
    }
  ]

  const commonQuestions = {
    'Software Engineer': [
      'Explain the difference between REST and GraphQL APIs.',
      'How would you optimize a slow database query?',
      'Describe your experience with version control systems.',
      'How do you handle code reviews?',
      'What\'s your approach to debugging complex issues?'
    ],
    'Frontend Developer': [
      'Explain the difference between React and Vue.js.',
      'How do you optimize website performance?',
      'Describe your experience with responsive design.',
      'How do you handle browser compatibility issues?',
      'What\'s your approach to state management?'
    ],
    'Product Manager': [
      'How do you prioritize features in a product roadmap?',
      'Describe a product you launched from concept to market.',
      'How do you handle conflicting stakeholder requirements?',
      'What metrics do you use to measure product success?',
      'How do you gather and analyze user feedback?'
    ]
  }

  return (
    <div className="space-y-6">
      {/* AI Question Generator */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">AI Question Generator</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a role</option>
              {commonRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              placeholder="Enter company name for personalized questions"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={generateQuestions}
            disabled={isGenerating || !selectedRole}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
          </button>
        </div>

        {generatedQuestions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Generated Questions</h4>
            <div className="space-y-2">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{question}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interview Preparation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'questions', label: 'Common Questions', icon: MessageSquare },
              { id: 'tips', label: 'Interview Tips', icon: BookOpen },
              { id: 'prep', label: 'Preparation Guide', icon: Target }
            ].map((tab) => {
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
          {/* Common Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Common Interview Questions</h3>
              
              {Object.entries(commonQuestions).map(([role, questions]) => (
                <div key={role} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{role}</h4>
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <div key={index} className="flex items-start">
                        <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interview Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Tips</h3>
              
              {interviewTips.map((section) => (
                <div key={section.category} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {section.category}
                  </h4>
                  <ul className="space-y-2">
                    {section.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Preparation Guide Tab */}
          {activeTab === 'prep' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Preparation Guide</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Research Checklist</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Company history and mission</li>
                    <li>• Recent news and developments</li>
                    <li>• Company culture and values</li>
                    <li>• Products/services offered</li>
                    <li>• Competitors and market position</li>
                    <li>• Interviewer's background (if known)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">What to Bring</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Multiple copies of your resume</li>
                    <li>• Portfolio or work samples</li>
                    <li>• List of references</li>
                    <li>• Pen and notepad</li>
                    <li>• Questions for the interviewer</li>
                    <li>• Business cards (if applicable)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Practice your answers out loud</li>
                  <li>• Record yourself to identify areas for improvement</li>
                  <li>• Prepare specific examples from your experience</li>
                  <li>• Research common questions for your role</li>
                  <li>• Plan your route and arrive early</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 