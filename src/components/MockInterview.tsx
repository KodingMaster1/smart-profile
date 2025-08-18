'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff,
  MessageSquare,
  Clock,
  Star,
  TrendingUp,
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

interface Interview {
  id?: string
  user_id: string
  role: string
  company: string
  duration: number
  score: number
  feedback: string
  created_at?: string
}

interface MockInterviewProps {
  userProfile?: Profile | null
  interviewHistory: Interview[]
}

export default function MockInterview({ userProfile, interviewHistory }: MockInterviewProps) {
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [interviewDuration, setInterviewDuration] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [interviewFeedback, setInterviewFeedback] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')

  const interviewQuestions = [
    'Tell me about yourself and your background.',
    'Why are you interested in this position?',
    'What are your greatest strengths and weaknesses?',
    'Describe a challenging project you worked on.',
    'How do you handle tight deadlines and pressure?',
    'Where do you see yourself in 5 years?',
    'Why should we hire you?',
    'Do you have any questions for us?'
  ]

  const startInterview = () => {
    if (!selectedRole) {
      alert('Please select a role first')
      return
    }

    setIsInterviewActive(true)
    setQuestionIndex(0)
    setAnswers([])
    setInterviewDuration(0)
    setCurrentQuestion(interviewQuestions[0])
    
    // Start timer
    const timer = setInterval(() => {
      setInterviewDuration(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }

  const stopInterview = () => {
    setIsInterviewActive(false)
    setIsRecording(false)
    analyzeInterview()
  }

  const nextQuestion = () => {
    if (questionIndex < interviewQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1)
      setCurrentQuestion(interviewQuestions[questionIndex + 1])
    } else {
      stopInterview()
    }
  }

  const recordAnswer = () => {
    setIsRecording(!isRecording)
    // Mock recording functionality
    setTimeout(() => {
      setAnswers(prev => [...prev, 'Mock recorded answer'])
      setIsRecording(false)
    }, 3000)
  }

  const analyzeInterview = async () => {
    setIsAnalyzing(true)
    
    try {
      // Mock AI analysis (in real app, this would call OpenAI API)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockFeedback = `
        Overall Score: 8.5/10

        Strengths:
        • Good communication skills
        • Relevant experience examples
        • Professional demeanor
        • Clear and concise answers

        Areas for Improvement:
        • Could provide more specific examples
        • Consider asking more questions
        • Practice STAR method for behavioral questions

        Recommendations:
        • Research the company more thoroughly
        • Prepare more detailed project examples
        • Practice common interview questions
      `
      
      setInterviewFeedback(mockFeedback)

      // Save interview to database
      const supabase = createClient()
      await supabase
        .from('interviews')
        .insert({
          user_id: userProfile?.user_id || '',
          role: selectedRole,
          company: selectedCompany || 'Mock Company',
          duration: interviewDuration,
          score: 8.5,
          feedback: mockFeedback
        })

    } catch (error) {
      console.error('Failed to analyze interview:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getInterviewStats = () => {
    if (interviewHistory.length === 0) return { total: 0, avgScore: 0, avgDuration: 0 }
    
    const total = interviewHistory.length
    const avgScore = interviewHistory.reduce((sum, interview) => sum + interview.score, 0) / total
    const avgDuration = interviewHistory.reduce((sum, interview) => sum + interview.duration, 0) / total
    
    return { total, avgScore: avgScore.toFixed(1), avgDuration: Math.round(avgDuration / 60) }
  }

  const stats = getInterviewStats()

  return (
    <div className="space-y-6">
      {/* Interview Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.avgScore}</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.avgDuration}m</div>
            <div className="text-sm text-gray-600">Avg Duration</div>
          </div>
        </div>
      </div>

      {/* Mock Interview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mock Interview</h3>
        
        {!isInterviewActive ? (
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
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="UX Designer">UX Designer</option>
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
                placeholder="Enter company name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <button
              onClick={startInterview}
              disabled={!selectedRole}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Mock Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Interview Timer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-lg font-mono">{formatTime(interviewDuration)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Question {questionIndex + 1} of {interviewQuestions.length}
                </span>
                <button
                  onClick={stopInterview}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <Stop className="h-4 w-4 mr-2" />
                  End Interview
                </button>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Question:</h4>
              <p className="text-gray-700">{currentQuestion}</p>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={recordAnswer}
                disabled={isRecording}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  isRecording
                    ? 'text-white bg-red-600'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                } disabled:opacity-50`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record Answer
                  </>
                )}
              </button>

              <button
                onClick={nextQuestion}
                disabled={questionIndex === interviewQuestions.length - 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next Question
              </button>
            </div>

            {/* Progress */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((questionIndex + 1) / interviewQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Interview Analysis */}
      {isAnalyzing && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <span className="text-gray-700">Analyzing your interview...</span>
          </div>
        </div>
      )}

      {interviewFeedback && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Interview Analysis</h3>
          <div className="prose max-w-none text-sm">
            <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
              {interviewFeedback}
            </pre>
          </div>
        </div>
      )}

      {/* Recent Interviews */}
      {interviewHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Interviews</h3>
          <div className="space-y-3">
            {interviewHistory.slice(0, 5).map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{interview.role}</h4>
                  <p className="text-sm text-gray-600">{interview.company}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(interview.created_at || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-gray-900">{interview.score}/10</span>
                  </div>
                  <p className="text-sm text-gray-600">{Math.round(interview.duration / 60)}m</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Mock Interview Tips</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Use specific examples from your experience</li>
          <li>• Practice the STAR method for behavioral questions</li>
          <li>• Take time to think before answering</li>
          <li>• Ask clarifying questions if needed</li>
        </ul>
      </div>
    </div>
  )
} 