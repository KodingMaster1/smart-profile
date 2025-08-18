import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Star,
  ArrowLeft,
  Calendar,
  Users,
  Globe,
  Award,
  CheckCircle,
  XCircle
} from 'lucide-react'
import JobApplicationForm from '@/components/JobApplicationForm'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  experience: string
  remote: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  posted_date: string
  match_score: number
  company_description?: string
  application_deadline?: string
}

// Mock job data (in real app, this would come from database/API)
const mockJobs: { [key: string]: Job } = {
  '1': {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experience: 'Senior',
    remote: 'Hybrid',
    salary: '$120,000 - $150,000',
    description: `We are looking for a Senior Software Engineer to join our dynamic team at TechCorp Inc. You will be responsible for designing, developing, and maintaining high-quality software solutions that drive our business forward.

As a Senior Software Engineer, you will:
• Lead technical projects from conception to completion
• Collaborate with cross-functional teams to deliver innovative solutions
• Mentor junior developers and contribute to team growth
• Participate in code reviews and maintain high code quality standards
• Stay up-to-date with emerging technologies and industry best practices

Our ideal candidate has:
• 5+ years of experience in software development
• Strong proficiency in modern programming languages and frameworks
• Experience with cloud platforms and microservices architecture
• Excellent problem-solving and communication skills
• A passion for learning and continuous improvement`,
    requirements: [
      'React',
      'Node.js', 
      'TypeScript',
      'AWS',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'GraphQL'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible work arrangements and remote options',
      'Professional development and learning budget',
      '401(k) matching and financial wellness programs',
      'Unlimited PTO and paid parental leave',
      'Modern office with great amenities',
      'Team events and social activities'
    ],
    posted_date: '2024-01-15',
    match_score: 95,
    company_description: 'TechCorp Inc. is a leading technology company focused on building innovative solutions that transform industries. We are committed to creating a diverse and inclusive workplace where everyone can thrive.',
    application_deadline: '2024-02-15'
  },
  '2': {
    id: '2',
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Full-time',
    experience: 'Mid-level',
    remote: 'Remote',
    salary: '$80,000 - $100,000',
    description: 'Join our fast-growing startup as a Frontend Developer and help us build amazing user experiences...',
    requirements: ['React', 'Vue.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
    benefits: [
      'Remote-first culture',
      'Competitive salary',
      'Health insurance',
      'Flexible hours',
      'Stock options'
    ],
    posted_date: '2024-01-14',
    match_score: 87
  }
}

export default async function JobDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const job = mockJobs[params.id]
  
  if (!job) {
    notFound()
  }

  // Get user profile for AI matching
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Check if user has already applied
  const { data: existingApplication } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .eq('job_id', params.id)
    .single()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Great Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/jobs"
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Jobs
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Job Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-lg text-gray-600 mb-3">
                    <Building className="h-5 w-5 mr-2" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.match_score)}`}>
                    <Star className="h-4 w-4 mr-1" />
                    {job.match_score}% Match
                  </span>
                  <div className="text-sm text-gray-600 mt-1">{getMatchLabel(job.match_score)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {job.type}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {job.experience}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="h-4 w-4 mr-2" />
                  {job.remote}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {job.salary}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Posted {formatDate(job.posted_date)}
                </div>
                {job.application_deadline && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Apply by {formatDate(job.application_deadline)}
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center">
                    {profile?.skills?.includes(requirement) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <span className={`text-sm ${
                      profile?.skills?.includes(requirement) 
                        ? 'text-green-700 font-medium' 
                        : 'text-gray-700'
                    }`}>
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company Description */}
            {job.company_description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About {job.company}</h2>
                <p className="text-gray-700">{job.company_description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Application Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this position</h3>
              
              {existingApplication ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Application Submitted</h4>
                  <p className="text-gray-600 mb-4">
                    You've already applied for this position on{' '}
                    {formatDate(existingApplication.created_at)}
                  </p>
                  <div className="text-sm text-gray-500">
                    Status: {existingApplication.status || 'Under Review'}
                  </div>
                </div>
              ) : (
                <JobApplicationForm 
                  jobId={job.id}
                  jobTitle={job.title}
                  companyName={job.company}
                  userProfile={profile}
                />
              )}
            </div>

            {/* Match Analysis */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Match Analysis</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Match</span>
                    <span className="text-sm font-bold text-gray-900">{job.match_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${job.match_score}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Skills Match</span>
                    <span className="text-sm text-gray-900">
                      {profile?.skills?.filter((skill: string) => job.requirements.includes(skill)).length || 0}/{job.requirements.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${((profile?.skills?.filter((skill: string) => job.requirements.includes(skill)).length || 0) / job.requirements.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {profile?.remote_preference && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Remote Preference</span>
                      <span className={`text-sm ${
                        profile.remote_preference === job.remote.toLowerCase() 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`}>
                        {profile.remote_preference === job.remote.toLowerCase() ? '✓ Match' : '✗ Mismatch'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {profile?.skills?.filter(skill => !job.requirements.includes(skill)).length > 0 && (
                    <li>• Consider highlighting your additional skills</li>
                  )}
                  {profile?.skills?.filter(skill => job.requirements.includes(skill)).length < job.requirements.length / 2 && (
                    <li>• Focus on learning missing key skills</li>
                  )}
                  <li>• Customize your cover letter for this role</li>
                  <li>• Update your portfolio with relevant projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 