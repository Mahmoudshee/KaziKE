import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockCandidates, mockCompanyJobs, type Candidate, type CompanyJob } from "@/mocks/candidates";

export interface EmployerProfile {
  companyName: string;
  email: string;
  phone: string;
  kraPin: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website?: string;
  logo?: string;
}

export interface JobPosting extends Omit<CompanyJob, 'id'> {
  id?: string;
  benefits: string[];
  applicationDeadline: string;
  contactEmail: string;
  isActive: boolean;
}

export interface CandidateInteraction {
  candidateId: string;
  type: 'viewed' | 'contacted' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  date: string;
  notes?: string;
  jobId?: string;
}

interface EmployerState {
  profile: EmployerProfile | null;
  jobs: CompanyJob[];
  candidates: Candidate[];
  interactions: CandidateInteraction[];
  analytics: EmployerAnalytics;
  isLoading: boolean;
  
  // Actions
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<EmployerProfile>) => Promise<void>;
  
  // Job Management
  loadJobs: () => Promise<void>;
  createJob: (job: Omit<JobPosting, 'id' | 'postedAt' | 'applicants' | 'views'>) => Promise<void>;
  updateJob: (jobId: string, updates: Partial<CompanyJob>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  
  // Candidate Management
  loadCandidates: () => Promise<void>;
  searchCandidates: (filters: CandidateFilters) => Promise<Candidate[]>;
  addInteraction: (interaction: Omit<CandidateInteraction, 'date'>) => Promise<void>;
  getCandidateInteractions: (candidateId: string) => CandidateInteraction[];
  
  // Analytics
  loadAnalytics: () => Promise<void>;
}

export interface CandidateFilters {
  skills?: string[];
  experience?: string;
  location?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  availability?: boolean;
}

export interface EmployerAnalytics {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalViews: number;
  averageApplicationsPerJob: number;
  topPerformingJobs: {
    jobId: string;
    title: string;
    applications: number;
    views: number;
  }[];
  candidateEngagement: {
    profileViews: number;
    contacted: number;
    interviewed: number;
    hired: number;
  };
  monthlyStats: {
    month: string;
    applications: number;
    hires: number;
  }[];
}

const PROFILE_STORAGE_KEY = "@employer_profile";
const JOBS_STORAGE_KEY = "@employer_jobs";
const INTERACTIONS_STORAGE_KEY = "@employer_interactions";

// Mock profile data
const mockEmployerProfile: EmployerProfile = {
  companyName: "TechCorp Kenya",
  email: "hr@techcorp.ke",
  phone: "+254700123456",
  kraPin: "A123456789B",
  industry: "Technology",
  size: "50-200 employees",
  location: "Nairobi, Kenya",
  description: "Leading technology company in Kenya specializing in fintech solutions and digital transformation.",
  website: "https://techcorp.ke",
};

// Mock analytics data
const mockAnalytics: EmployerAnalytics = {
  totalJobs: 8,
  activeJobs: 5,
  totalApplications: 234,
  totalViews: 1456,
  averageApplicationsPerJob: 29,
  topPerformingJobs: [
    { jobId: "job_1", title: "Senior Software Developer", applications: 45, views: 234 },
    { jobId: "job_2", title: "Product Manager", applications: 38, views: 189 },
    { jobId: "job_3", title: "UI/UX Designer", applications: 32, views: 156 }
  ],
  candidateEngagement: {
    profileViews: 89,
    contacted: 23,
    interviewed: 12,
    hired: 3
  },
  monthlyStats: [
    { month: "Jan 2024", applications: 89, hires: 2 },
    { month: "Dec 2023", applications: 76, hires: 1 },
    { month: "Nov 2023", applications: 69, hires: 0 }
  ]
};

export const useEmployerStore = create<EmployerState>((set, get) => ({
  profile: null,
  jobs: [],
  candidates: [],
  interactions: [],
  analytics: mockAnalytics,
  isLoading: false,
  
  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = stored ? JSON.parse(stored) : mockEmployerProfile;
      set({ profile });
    } catch (error) {
      console.error('Failed to load employer profile:', error);
      set({ profile: mockEmployerProfile });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (updates: Partial<EmployerProfile>) => {
    const { profile } = get();
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    set({ profile: updatedProfile });
    
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Failed to update employer profile:', error);
    }
  },
  
  loadJobs: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
      const jobs = stored ? JSON.parse(stored) : mockCompanyJobs;
      set({ jobs });
    } catch (error) {
      console.error('Failed to load jobs:', error);
      set({ jobs: mockCompanyJobs });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createJob: async (jobData: Omit<JobPosting, 'id' | 'postedAt' | 'applicants' | 'views'>) => {
    const { jobs } = get();
    
    const newJob: CompanyJob = {
      ...jobData,
      id: `job_${Date.now()}`,
      postedAt: new Date().toISOString(),
      applicants: 0,
      views: 0
    };
    
    const updatedJobs = [...jobs, newJob];
    set({ jobs: updatedJobs });
    
    try {
      await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
      // Refresh analytics
      await get().loadAnalytics();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  },
  
  updateJob: async (jobId: string, updates: Partial<CompanyJob>) => {
    const { jobs } = get();
    
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    );
    
    set({ jobs: updatedJobs });
    
    try {
      await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  },
  
  deleteJob: async (jobId: string) => {
    const { jobs } = get();
    
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    set({ jobs: updatedJobs });
    
    try {
      await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
      // Refresh analytics
      await get().loadAnalytics();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  },
  
  loadCandidates: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would fetch from API with employer's access permissions
      set({ candidates: mockCandidates });
    } catch (error) {
      console.error('Failed to load candidates:', error);
      set({ candidates: mockCandidates });
    } finally {
      set({ isLoading: false });
    }
  },
  
  searchCandidates: async (filters: CandidateFilters) => {
    const { candidates } = get();
    
    let filtered = [...candidates];
    
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(candidate =>
        filters.skills!.some(skill =>
          candidate.skills.some(candidateSkill =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }
    
    if (filters.experience) {
      filtered = filtered.filter(candidate =>
        candidate.experience.includes(filters.experience!)
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.verificationStatus) {
      filtered = filtered.filter(candidate =>
        candidate.verificationStatus === filters.verificationStatus
      );
    }
    
    return filtered;
  },
  
  addInteraction: async (interaction: Omit<CandidateInteraction, 'date'>) => {
    const { interactions } = get();
    
    const newInteraction: CandidateInteraction = {
      ...interaction,
      date: new Date().toISOString()
    };
    
    const updatedInteractions = [...interactions, newInteraction];
    set({ interactions: updatedInteractions });
    
    try {
      await AsyncStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(updatedInteractions));
    } catch (error) {
      console.error('Failed to save interaction:', error);
    }
  },
  
  getCandidateInteractions: (candidateId: string) => {
    const { interactions } = get();
    return interactions
      .filter(interaction => interaction.candidateId === candidateId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  loadAnalytics: async () => {
    const { jobs, interactions } = get();
    
    // Calculate real-time analytics based on current data
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const totalApplications = jobs.reduce((sum, job) => sum + job.applicants, 0);
    const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);
    
    const candidateEngagement = {
      profileViews: interactions.filter(i => i.type === 'viewed').length,
      contacted: interactions.filter(i => i.type === 'contacted').length,
      interviewed: interactions.filter(i => i.type === 'interviewed').length,
      hired: interactions.filter(i => i.type === 'hired').length
    };
    
    const topPerformingJobs = jobs
      .sort((a, b) => (b.applicants + b.views) - (a.applicants + a.views))
      .slice(0, 3)
      .map(job => ({
        jobId: job.id,
        title: job.title,
        applications: job.applicants,
        views: job.views
      }));
    
    const updatedAnalytics: EmployerAnalytics = {
      ...mockAnalytics,
      totalJobs: jobs.length,
      activeJobs,
      totalApplications,
      totalViews,
      averageApplicationsPerJob: jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0,
      topPerformingJobs,
      candidateEngagement
    };
    
    set({ analytics: updatedAnalytics });
  }
}));