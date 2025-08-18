import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import JobSearch from '@/components/JobSearch'
import JobList from '@/components/JobList'
import JobFilters from '@/components/JobFilters'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get search parameters
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''
  const location = typeof searchParams.location === 'string' ? searchParams.location : ''
  const type = typeof searchParams.type === 'string' ? searchParams.type : ''
  const experience = typeof searchParams.experience === 'string' ? searchParams.experience : ''
  const remote = typeof searchParams.remote === 'string' ? searchParams.remote : ''

  // Get user profile for AI matching
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Mock job data (in real app, this would come from job APIs)
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Senior',
      remote: 'Hybrid',
      salary: '$120,000 - $150,000',
      description: 'We are looking for a Senior Software Engineer to join our team...',
      requirements: ['React', 'Node.js', 'TypeScript', 'AWS'],
      posted_date: '2024-01-15',
      match_score: 95,
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      remote: 'Remote',
      salary: '$80,000 - $100,000',
      description: 'Join our fast-growing startup as a Frontend Developer...',
      requirements: ['React', 'Vue.js', 'JavaScript', 'CSS'],
      posted_date: '2024-01-14',
      match_score: 87,
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Enterprise Solutions',
      location: 'New York, NY',
      type: 'Full-time',
      experience: 'Senior',
      remote: 'On-site',
      salary: '$110,000 - $140,000',
      description: 'We need a Full Stack Developer to work on enterprise applications...',
      requirements: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
      posted_date: '2024-01-13',
      match_score: 78,
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Austin, TX',
      type: 'Full-time',
      experience: 'Mid-level',
      remote: 'Hybrid',
      salary: '$90,000 - $120,000',
      description: 'Help us build and maintain our cloud infrastructure...',
      requirements: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
      posted_date: '2024-01-12',
      match_score: 65,
    },
    {
      id: '5',
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: 'Mid-level',
      remote: 'Remote',
      salary: '$70,000 - $90,000',
      description: 'Create beautiful and intuitive user experiences...',
      requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      posted_date: '2024-01-11',
      match_score: 45,
    },
  ]

  // Filter jobs based on search parameters
  let filteredJobs = mockJobs

  if (query) {
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (location) {
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    )
  }

  if (type) {
    filteredJobs = filteredJobs.filter(job => job.type === type)
  }

  if (experience) {
    filteredJobs = filteredJobs.filter(job => job.experience === experience)
  }

  if (remote) {
    filteredJobs = filteredJobs.filter(job => job.remote === remote)
  }

  // Sort by match score (AI-powered matching)
  filteredJobs.sort((a, b) => b.match_score - a.match_score)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Job Search</h1>
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
        {/* Search and Filters */}
        <div className="mb-8">
          <JobSearch 
            initialQuery={query}
            initialLocation={location}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters 
              currentType={type}
              currentExperience={experience}
              currentRemote={remote}
            />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {filteredJobs.length} jobs found
              </h2>
              <div className="text-sm text-gray-600">
                Sorted by AI match score
              </div>
            </div>
            
            <JobList 
              jobs={filteredJobs}
              userProfile={profile}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 