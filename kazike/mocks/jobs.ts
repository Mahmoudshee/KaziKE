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

export const mockJobs: Job[] = [];

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
}

export const mockApplications: Application[] = [];