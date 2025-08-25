import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockJobs, mockApplications, type Job, type Application } from "@/mocks/jobs";

export interface YouthProfile {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  location: string;
  bio: string;
  skills: string[];
  experience: string;
  education: string;
  languages: string[];
  portfolio: PortfolioItem[];
  preferences: JobPreferences;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'certificate' | 'achievement';
  url?: string;
  date: string;
  skills: string[];
}

export interface JobPreferences {
  jobTypes: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  salaryRange: { min: number; max: number };
  locations: string[];
  remoteWork: boolean;
  industries: string[];
}

export interface JobMatch extends Job {
  matchScore: number;
  matchReasons: string[];
}

interface YouthState {
  profile: YouthProfile | null;
  jobMatches: JobMatch[];
  applications: Application[];
  savedJobs: string[];
  isLoading: boolean;
  
  // Actions
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<YouthProfile>) => Promise<void>;
  addSkill: (skill: string) => Promise<void>;
  removeSkill: (skill: string) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  removePortfolioItem: (id: string) => Promise<void>;
  updateJobPreferences: (preferences: Partial<JobPreferences>) => Promise<void>;
  
  // Job Actions
  loadJobMatches: () => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  loadApplications: () => Promise<void>;
}

const PROFILE_STORAGE_KEY = "@youth_profile";
const APPLICATIONS_STORAGE_KEY = "@youth_applications";
const SAVED_JOBS_STORAGE_KEY = "@youth_saved_jobs";

// Mock profile data
const mockProfile: YouthProfile = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+254712345678",
  nationalId: "12345678",
  dateOfBirth: "1995-06-15",
  location: "Nairobi, Kenya",
  bio: "Passionate software developer with experience in mobile and web development. Looking for opportunities to grow and contribute to innovative projects.",
  skills: ["React Native", "TypeScript", "Node.js", "Python", "MongoDB", "Git"],
  experience: "3 years",
  education: "BSc Computer Science - University of Nairobi (2018-2022)",
  languages: ["English", "Swahili", "French"],
  portfolio: [
    {
      id: "portfolio_1",
      title: "E-commerce Mobile App",
      description: "React Native app for local marketplace with payment integration",
      type: "project",
      url: "https://github.com/johndoe/ecommerce-app",
      date: "2024-01-15",
      skills: ["React Native", "TypeScript", "Firebase"]
    },
    {
      id: "portfolio_2",
      title: "AWS Cloud Practitioner",
      description: "Certified AWS Cloud Practitioner",
      type: "certificate",
      date: "2023-11-20",
      skills: ["AWS", "Cloud Computing"]
    }
  ],
  preferences: {
    jobTypes: ["full-time", "contract"],
    salaryRange: { min: 80000, max: 150000 },
    locations: ["Nairobi", "Remote"],
    remoteWork: true,
    industries: ["Technology", "Fintech", "E-commerce"]
  }
};

// Calculate job match score based on profile
const calculateJobMatch = (job: Job, profile: YouthProfile): JobMatch => {
  let score = 0;
  const reasons: string[] = [];
  
  // Skill matching
  const matchingSkills = job.requirements.filter(req => 
    profile.skills.some(skill => 
      skill.toLowerCase().includes(req.toLowerCase()) || 
      req.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  if (matchingSkills.length > 0) {
    score += (matchingSkills.length / job.requirements.length) * 40;
    reasons.push(`${matchingSkills.length} matching skills: ${matchingSkills.join(', ')}`);
  }
  
  // Job type preference
  if (profile.preferences.jobTypes.includes(job.type)) {
    score += 20;
    reasons.push(`Matches preferred job type: ${job.type}`);
  }
  
  // Location preference
  if (profile.preferences.locations.some(loc => 
    job.location.toLowerCase().includes(loc.toLowerCase())
  )) {
    score += 15;
    reasons.push(`Matches location preference`);
  }
  
  // Salary range (basic estimation)
  const salaryNumbers = job.salary.match(/\d+/g);
  if (salaryNumbers && salaryNumbers.length >= 2) {
    const minSalary = parseInt(salaryNumbers[0]) * 1000;
    const maxSalary = parseInt(salaryNumbers[1]) * 1000;
    
    if (maxSalary >= profile.preferences.salaryRange.min && 
        minSalary <= profile.preferences.salaryRange.max) {
      score += 15;
      reasons.push(`Salary range matches expectations`);
    }
  }
  
  // Company reputation (mock)
  const topCompanies = ['Safaricom', 'Equity Bank', 'KCB', 'Co-operative Bank'];
  if (topCompanies.some(company => job.company.includes(company))) {
    score += 10;
    reasons.push(`Top-tier company`);
  }
  
  return {
    ...job,
    matchScore: Math.min(Math.round(score), 100),
    matchReasons: reasons
  };
};

export const useYouthStore = create<YouthState>((set, get) => ({
  profile: null,
  jobMatches: [],
  applications: [],
  savedJobs: [],
  isLoading: false,
  
  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = stored ? JSON.parse(stored) : mockProfile;
      set({ profile });
      
      // Auto-load job matches when profile is loaded
      await get().loadJobMatches();
    } catch (error) {
      console.error('Failed to load profile:', error);
      set({ profile: mockProfile });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (updates: Partial<YouthProfile>) => {
    const { profile } = get();
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    set({ profile: updatedProfile });
    
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      // Recalculate job matches when profile changes
      await get().loadJobMatches();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  },
  
  addSkill: async (skill: string) => {
    const { profile } = get();
    if (!profile || profile.skills.includes(skill)) return;
    
    await get().updateProfile({
      skills: [...profile.skills, skill]
    });
  },
  
  removeSkill: async (skill: string) => {
    const { profile } = get();
    if (!profile) return;
    
    await get().updateProfile({
      skills: profile.skills.filter(s => s !== skill)
    });
  },
  
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id'>) => {
    const { profile } = get();
    if (!profile) return;
    
    const newItem: PortfolioItem = {
      ...item,
      id: `portfolio_${Date.now()}`
    };
    
    await get().updateProfile({
      portfolio: [...profile.portfolio, newItem]
    });
  },
  
  removePortfolioItem: async (id: string) => {
    const { profile } = get();
    if (!profile) return;
    
    await get().updateProfile({
      portfolio: profile.portfolio.filter(item => item.id !== id)
    });
  },
  
  updateJobPreferences: async (preferences: Partial<JobPreferences>) => {
    const { profile } = get();
    if (!profile) return;
    
    await get().updateProfile({
      preferences: { ...profile.preferences, ...preferences }
    });
  },
  
  loadJobMatches: async () => {
    const { profile } = get();
    if (!profile) return;
    
    set({ isLoading: true });
    try {
      // Calculate matches for all jobs
      const matches = mockJobs
        .map(job => calculateJobMatch(job, profile))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20); // Top 20 matches
      
      set({ jobMatches: matches });
    } catch (error) {
      console.error('Failed to load job matches:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  applyToJob: async (jobId: string) => {
    const { applications, jobMatches } = get();
    
    // Check if already applied
    if (applications.some(app => app.jobId === jobId)) {
      throw new Error('Already applied to this job');
    }
    
    const job = jobMatches.find(j => j.id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    
    const newApplication: Application = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedApplications = [...applications, newApplication];
    set({ applications: updatedApplications });
    
    try {
      await AsyncStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updatedApplications));
    } catch (error) {
      console.error('Failed to save application:', error);
    }
  },
  
  saveJob: async (jobId: string) => {
    const { savedJobs } = get();
    if (savedJobs.includes(jobId)) return;
    
    const updatedSavedJobs = [...savedJobs, jobId];
    set({ savedJobs: updatedSavedJobs });
    
    try {
      await AsyncStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(updatedSavedJobs));
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  },
  
  unsaveJob: async (jobId: string) => {
    const { savedJobs } = get();
    const updatedSavedJobs = savedJobs.filter(id => id !== jobId);
    set({ savedJobs: updatedSavedJobs });
    
    try {
      await AsyncStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(updatedSavedJobs));
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  },
  
  loadApplications: async () => {
    try {
      const [storedApplications, storedSavedJobs] = await Promise.all([
        AsyncStorage.getItem(APPLICATIONS_STORAGE_KEY),
        AsyncStorage.getItem(SAVED_JOBS_STORAGE_KEY)
      ]);
      
      const applications = storedApplications ? JSON.parse(storedApplications) : mockApplications;
      const savedJobs = storedSavedJobs ? JSON.parse(storedSavedJobs) : [];
      
      set({ applications, savedJobs });
    } catch (error) {
      console.error('Failed to load applications:', error);
      set({ applications: mockApplications, savedJobs: [] });
    }
  }
}));