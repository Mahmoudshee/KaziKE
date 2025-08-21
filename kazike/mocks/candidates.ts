export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  domain: string;
  skills: string[];
  experience: string;
  education: string;
  location: string;
  profileViews: number;
  applications: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  lastActive: string;
}

export const mockCandidates: Candidate[] = [
  {
    id: 'candidate_1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254712345678',
    domain: 'johndoe1234.ke',
    skills: ['React Native', 'TypeScript', 'Node.js', 'MongoDB'],
    experience: '5 years',
    education: 'BSc Computer Science - University of Nairobi',
    location: 'Nairobi, Kenya',
    profileViews: 156,
    applications: 12,
    verificationStatus: 'verified',
    lastActive: '2024-01-16T10:30:00Z'
  },
  {
    id: 'candidate_2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+254723456789',
    domain: 'janesmith5678.ke',
    skills: ['Python', 'Data Analysis', 'SQL', 'Machine Learning'],
    experience: '3 years',
    education: 'MSc Data Science - Strathmore University',
    location: 'Nairobi, Kenya',
    profileViews: 89,
    applications: 8,
    verificationStatus: 'verified',
    lastActive: '2024-01-15T14:20:00Z'
  },
  {
    id: 'candidate_3',
    fullName: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '+254734567890',
    domain: 'michaeljohnson9012.ke',
    skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
    experience: '2 years',
    education: 'Diploma in Graphic Design - Kenya Institute of Mass Communication',
    location: 'Mombasa, Kenya',
    profileViews: 67,
    applications: 15,
    verificationStatus: 'pending',
    lastActive: '2024-01-14T09:45:00Z'
  },
  {
    id: 'candidate_4',
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+254745678901',
    domain: 'sarahwilson3456.ke',
    skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    experience: '4 years',
    education: 'BSc Information Technology - Jomo Kenyatta University',
    location: 'Kisumu, Kenya',
    profileViews: 134,
    applications: 6,
    verificationStatus: 'verified',
    lastActive: '2024-01-16T08:15:00Z'
  }
];

export interface CompanyJob {
  id: string;
  title: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  location: string;
  description: string;
  requirements: string[];
  postedAt: string;
  applicants: number;
  status: 'active' | 'closed' | 'draft';
  views: number;
}

export const mockCompanyJobs: CompanyJob[] = [
  {
    id: 'company_job_1',
    title: 'Senior Software Developer',
    department: 'Engineering',
    type: 'full-time',
    salary: 'KSh 150,000 - 200,000',
    location: 'Nairobi, Kenya',
    description: 'Lead our mobile development team in building next-generation fintech solutions.',
    requirements: ['React Native', 'TypeScript', '5+ years experience', 'Team leadership'],
    postedAt: '2024-01-15T10:00:00Z',
    applicants: 45,
    status: 'active',
    views: 234
  },
  {
    id: 'company_job_2',
    title: 'Product Manager',
    department: 'Product',
    type: 'full-time',
    salary: 'KSh 180,000 - 250,000',
    location: 'Nairobi, Kenya',
    description: 'Drive product strategy and roadmap for our digital banking platform.',
    requirements: ['Product Management', 'Agile', '3+ years experience', 'Fintech background'],
    postedAt: '2024-01-14T14:30:00Z',
    applicants: 28,
    status: 'active',
    views: 189
  },
  {
    id: 'company_job_3',
    title: 'Marketing Intern',
    department: 'Marketing',
    type: 'internship',
    salary: 'KSh 20,000 - 30,000',
    location: 'Nairobi, Kenya',
    description: 'Support digital marketing campaigns and content creation.',
    requirements: ['Digital Marketing', 'Content Creation', 'Social Media', 'Fresh graduate'],
    postedAt: '2024-01-13T09:15:00Z',
    applicants: 67,
    status: 'active',
    views: 156
  }
];