'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  FileText, 
  Send, 
  Sparkles,
  CheckCircle,
  AlertCircle
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

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  companyName: string
  userProfile?: Profile | null
}

export default function JobApplicationForm({ 
  jobId, 
  jobTitle, 
  companyName, 
  userProfile 
}: JobApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const router = useRouter()

  const generateCoverLetter = async () => {
    if (!userProfile) {
      setMessage('Please complete your profile first to generate a cover letter')
      setMessageType('error')
      return
    }

    setIsGeneratingCoverLetter(true)
    setMessage('')

    try {
      // Mock AI cover letter generation (in real app, this would call OpenAI API)
      const mockCoverLetter = `Dear Hiring Manager at ${companyName},

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in ${userProfile.skills?.slice(0, 3).join(', ') || 'software development'}, I am excited about the opportunity to contribute to your team.

${userProfile.bio ? `About me: ${userProfile.bio}` : 'I am a passionate professional with experience in software development and a strong commitment to delivering high-quality solutions.'}

My key qualifications include:
${userProfile.skills?.slice(0, 5).map(skill => `• ${skill}`).join('\n') || '• Strong technical skills\n• Problem-solving abilities\n• Team collaboration'}

I am particularly drawn to this role because it aligns with my career goals and offers the opportunity to work on challenging projects. I am confident that my skills and experience make me a strong candidate for this position.

Thank you for considering my application. I look forward to discussing how I can contribute to ${companyName}'s success.

Best regards,
[Your Name]`

      setCoverLetter(mockCoverLetter)
      setMessage('Cover letter generated successfully! Feel free to customize it.')
      setMessageType('success')
    } catch (error) {
      setMessage('Failed to generate cover letter. Please try again.')
      setMessageType('error')
    } finally {
      setIsGeneratingCoverLetter(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('File size must be less than 5MB')
        setMessageType('error')
        return
      }
      setResumeFile(file)
      setMessage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const supabase = createClient()

      // Upload resume if provided
      let resumeUrl = userProfile?.cv_url || ''
      if (resumeFile) {
        const fileName = `resumes/${Date.now()}_${resumeFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, resumeFile)

        if (uploadError) {
          throw new Error('Failed to upload resume')
        }

        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName)
        
        resumeUrl = urlData.publicUrl
      }

      // Create application record
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: userProfile?.user_id || '',
          job_id: jobId,
          job_title: jobTitle,
          company_name: companyName,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          status: 'submitted',
          applied_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      setMessage('Application submitted successfully!')
      setMessageType('success')
      
      // Redirect to applications page after a short delay
      setTimeout(() => {
        router.push('/applications')
      }, 2000)

    } catch (error) {
      setMessage('Failed to submit application. Please try again.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Letter Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <button
            type="button"
            onClick={generateCoverLetter}
            disabled={isGeneratingCoverLetter || !userProfile}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {isGeneratingCoverLetter ? 'Generating...' : 'AI Generate'}
          </button>
        </div>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={8}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Write or generate a personalized cover letter for this position..."
          required
        />
        {!userProfile && (
          <p className="mt-1 text-xs text-gray-500">
            Complete your profile to enable AI cover letter generation
          </p>
        )}
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Resume/CV
        </label>
        
        {userProfile?.cv_url ? (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Profile Resume</p>
              <p className="text-xs text-green-600">Using resume from your profile</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="resume-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="resume-upload"
                    name="resume-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, or DOCX up to 5MB
              </p>
            </div>
          </div>
        )}

        {resumeFile && (
          <div className="mt-3 flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
            <FileText className="h-5 w-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">{resumeFile.name}</p>
              <p className="text-xs text-blue-600">
                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResumeFile(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-600 border border-green-200' 
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <div className="flex items-center">
            {messageType === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !coverLetter.trim()}
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Submit Application
          </>
        )}
      </button>

      {/* Application Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Application Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Customize your cover letter for this specific role</li>
          <li>• Highlight relevant skills and experience</li>
          <li>• Keep your resume up to date</li>
          <li>• Follow up within a week if you don't hear back</li>
        </ul>
      </div>
    </form>
  )
} 