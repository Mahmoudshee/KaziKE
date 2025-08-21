export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  applicants: number;
  status: 'active' | 'closed' | 'draft';
}

export const mockJobs: Job[] = [
  {
    id: 'job_1',
    title: 'Senior Software Developer',
    company: 'Safaricom PLC',
    location: 'Nairobi, Kenya',
    type: 'full-time',
    salary: 'KSh 150,000 - 200,000',
    description: 'We are looking for a senior software developer to join our digital transformation team.',
    requirements: ['React Native', 'TypeScript', '5+ years experience', 'Mobile development'],
    postedAt: '2024-01-15T10:00:00Z',
    applicants: 45,
    status: 'active'
  },
  {
    id: 'job_2',
    title: 'Frontend Developer',
    company: 'Equity Bank',
    location: 'Nairobi, Kenya',
    type: 'full-time',
    salary: 'KSh 80,000 - 120,000',
    description: 'Join our fintech team to build innovative banking solutions.',
    requirements: ['React', 'JavaScript', '3+ years experience', 'Banking domain knowledge'],
    postedAt: '2024-01-14T14:30:00Z',
    applicants: 32,
    status: 'active'
  },
  {
    id: 'job_3',
    title: 'Data Analyst Intern',
    company: 'Kenya Airways',
    location: 'Nairobi, Kenya',
    type: 'internship',
    salary: 'KSh 25,000 - 35,000',
    description: 'Learn data analytics in the aviation industry.',
    requirements: ['Python', 'SQL', 'Statistics', 'Fresh graduate'],
    postedAt: '2024-01-13T09:15:00Z',
    applicants: 78,
    status: 'active'
  },
  {
    id: 'job_4',
    title: 'DevOps Engineer',
    company: 'Twiga Foods',
    location: 'Nairobi, Kenya',
    type: 'full-time',
    salary: 'KSh 120,000 - 160,000',
    description: 'Scale our agricultural technology platform.',
    requirements: ['AWS', 'Docker', 'Kubernetes', '4+ years experience'],
    postedAt: '2024-01-12T16:45:00Z',
    applicants: 23,
    status: 'active'
  },
  {
    id: 'job_5',
    title: 'UI/UX Designer',
    company: 'M-Shule',
    location: 'Remote',
    type: 'contract',
    salary: 'KSh 60,000 - 90,000',
    description: 'Design educational mobile applications for African students.',
    requirements: ['Figma', 'Mobile design', '2+ years experience', 'Education sector'],
    postedAt: '2024-01-11T11:20:00Z',
    applicants: 56,
    status: 'active'
  }
];

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
}

export const mockApplications: Application[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    jobTitle: 'Senior Software Developer',
    company: 'Safaricom PLC',
    appliedAt: '2024-01-16T08:30:00Z',
    status: 'interview',
    notes: 'Technical interview scheduled for next week'
  },
  {
    id: 'app_2',
    jobId: 'job_2',
    jobTitle: 'Frontend Developer',
    company: 'Equity Bank',
    appliedAt: '2024-01-15T14:20:00Z',
    status: 'reviewed'
  },
  {
    id: 'app_3',
    jobId: 'job_3',
    jobTitle: 'Data Analyst Intern',
    company: 'Kenya Airways',
    appliedAt: '2024-01-14T10:15:00Z',
    status: 'pending'
  }
];