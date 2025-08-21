import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GovernmentProfile {
  officialName: string;
  email: string;
  ministry: string;
  department: string;
  role: string;
  phone: string;
  location: string;
}

export interface VerificationRequest {
  id: string;
  type: 'youth_identity' | 'employer_company' | 'institution_accreditation';
  applicantId: string;
  applicantName: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  documents: VerificationDocument[];
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface PolicyInsight {
  id: string;
  title: string;
  category: 'employment' | 'education' | 'skills' | 'verification';
  description: string;
  metrics: {
    totalUsers: number;
    verifiedUsers: number;
    jobMatches: number;
    skillsGap: string[];
  };
  recommendations: string[];
  createdAt: string;
}

export interface GovernmentAnalytics {
  totalRegistrations: number;
  verifiedIdentities: number;
  pendingVerifications: number;
  jobPlacements: number;
  skillsAnalysis: {
    mostDemanded: string[];
    leastAvailable: string[];
    emergingSkills: string[];
  };
  regionalData: {
    region: string;
    registrations: number;
    verifications: number;
    jobMatches: number;
  }[];
  monthlyTrends: {
    month: string;
    registrations: number;
    verifications: number;
    jobPlacements: number;
  }[];
}

interface GovernmentState {
  profile: GovernmentProfile | null;
  verificationRequests: VerificationRequest[];
  policyInsights: PolicyInsight[];
  analytics: GovernmentAnalytics;
  isLoading: boolean;
  
  // Actions
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<GovernmentProfile>) => Promise<void>;
  
  // Verification Management
  loadVerificationRequests: () => Promise<void>;
  reviewVerification: (requestId: string, status: 'approved' | 'rejected', notes?: string) => Promise<void>;
  getVerificationsByStatus: (status: VerificationRequest['status']) => VerificationRequest[];
  
  // Analytics & Insights
  loadAnalytics: () => Promise<void>;
  loadPolicyInsights: () => Promise<void>;
  generateInsight: (category: PolicyInsight['category']) => Promise<void>;
}

const PROFILE_STORAGE_KEY = "@government_profile";
const VERIFICATIONS_STORAGE_KEY = "@government_verifications";
const INSIGHTS_STORAGE_KEY = "@government_insights";

// Mock data
const mockGovernmentProfile: GovernmentProfile = {
  officialName: "Jane Smith",
  email: "j.smith@education.go.ke",
  ministry: "Ministry of Education",
  department: "Digital Skills Development",
  role: "Senior Policy Analyst",
  phone: "+254700987654",
  location: "Nairobi, Kenya"
};

const mockVerificationRequests: VerificationRequest[] = [
  {
    id: "ver_1",
    type: "youth_identity",
    applicantId: "user_1",
    applicantName: "John Doe",
    submittedAt: "2024-01-16T10:30:00Z",
    status: "pending",
    documents: [
      {
        id: "doc_1",
        name: "National ID",
        type: "image/jpeg",
        url: "https://example.com/id.jpg",
        uploadedAt: "2024-01-16T10:30:00Z"
      }
    ]
  },
  {
    id: "ver_2",
    type: "employer_company",
    applicantId: "emp_1",
    applicantName: "TechCorp Kenya",
    submittedAt: "2024-01-15T14:20:00Z",
    status: "under_review",
    documents: [
      {
        id: "doc_2",
        name: "Certificate of Incorporation",
        type: "application/pdf",
        url: "https://example.com/cert.pdf",
        uploadedAt: "2024-01-15T14:20:00Z"
      }
    ]
  }
];

const mockPolicyInsights: PolicyInsight[] = [
  {
    id: "insight_1",
    title: "Digital Skills Gap Analysis",
    category: "skills",
    description: "Analysis of the current digital skills gap in the Kenyan job market",
    metrics: {
      totalUsers: 15420,
      verifiedUsers: 12340,
      jobMatches: 8760,
      skillsGap: ["React Native", "Data Science", "Cloud Computing", "Cybersecurity"]
    },
    recommendations: [
      "Increase funding for digital skills training programs",
      "Partner with tech companies for practical training",
      "Develop certification programs for emerging technologies"
    ],
    createdAt: "2024-01-15T00:00:00Z"
  }
];

const mockAnalytics: GovernmentAnalytics = {
  totalRegistrations: 15420,
  verifiedIdentities: 12340,
  pendingVerifications: 234,
  jobPlacements: 8760,
  skillsAnalysis: {
    mostDemanded: ["Software Development", "Data Analysis", "Digital Marketing", "Project Management"],
    leastAvailable: ["Machine Learning", "Blockchain", "IoT Development", "Cybersecurity"],
    emergingSkills: ["AI/ML", "Cloud Native", "DevOps", "Mobile Development"]
  },
  regionalData: [
    { region: "Nairobi", registrations: 6780, verifications: 5890, jobMatches: 4320 },
    { region: "Mombasa", registrations: 2340, verifications: 1980, jobMatches: 1450 },
    { region: "Kisumu", registrations: 1890, verifications: 1560, jobMatches: 1120 },
    { region: "Nakuru", registrations: 1560, verifications: 1290, jobMatches: 890 }
  ],
  monthlyTrends: [
    { month: "Jan 2024", registrations: 1240, verifications: 980, jobPlacements: 720 },
    { month: "Dec 2023", registrations: 1180, verifications: 920, jobPlacements: 680 },
    { month: "Nov 2023", registrations: 1090, verifications: 850, jobPlacements: 620 }
  ]
};

export const useGovernmentStore = create<GovernmentState>((set, get) => ({
  profile: null,
  verificationRequests: [],
  policyInsights: [],
  analytics: mockAnalytics,
  isLoading: false,
  
  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = stored ? JSON.parse(stored) : mockGovernmentProfile;
      set({ profile });
    } catch (error) {
      console.error('Failed to load government profile:', error);
      set({ profile: mockGovernmentProfile });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (updates: Partial<GovernmentProfile>) => {
    const { profile } = get();
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    set({ profile: updatedProfile });
    
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Failed to update government profile:', error);
    }
  },
  
  loadVerificationRequests: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(VERIFICATIONS_STORAGE_KEY);
      const requests = stored ? JSON.parse(stored) : mockVerificationRequests;
      set({ verificationRequests: requests });
    } catch (error) {
      console.error('Failed to load verification requests:', error);
      set({ verificationRequests: mockVerificationRequests });
    } finally {
      set({ isLoading: false });
    }
  },
  
  reviewVerification: async (requestId: string, status: 'approved' | 'rejected', notes?: string) => {
    const { verificationRequests, profile } = get();
    
    const updatedRequests = verificationRequests.map(request =>
      request.id === requestId
        ? {
            ...request,
            status,
            reviewedBy: profile?.officialName || 'Government Official',
            reviewedAt: new Date().toISOString(),
            notes
          }
        : request
    );
    
    set({ verificationRequests: updatedRequests });
    
    try {
      await AsyncStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(updatedRequests));
      // Refresh analytics after verification update
      await get().loadAnalytics();
    } catch (error) {
      console.error('Failed to update verification:', error);
    }
  },
  
  getVerificationsByStatus: (status: VerificationRequest['status']) => {
    const { verificationRequests } = get();
    return verificationRequests.filter(request => request.status === status);
  },
  
  loadAnalytics: async () => {
    const { verificationRequests } = get();
    
    // Calculate real-time analytics
    const pendingVerifications = verificationRequests.filter(r => r.status === 'pending').length;
    const verifiedIdentities = verificationRequests.filter(r => r.status === 'approved').length;
    
    const updatedAnalytics: GovernmentAnalytics = {
      ...mockAnalytics,
      pendingVerifications,
      verifiedIdentities: mockAnalytics.verifiedIdentities + verifiedIdentities
    };
    
    set({ analytics: updatedAnalytics });
  },
  
  loadPolicyInsights: async () => {
    try {
      const stored = await AsyncStorage.getItem(INSIGHTS_STORAGE_KEY);
      const insights = stored ? JSON.parse(stored) : mockPolicyInsights;
      set({ policyInsights: insights });
    } catch (error) {
      console.error('Failed to load policy insights:', error);
      set({ policyInsights: mockPolicyInsights });
    }
  },
  
  generateInsight: async (category: PolicyInsight['category']) => {
    const { policyInsights, analytics } = get();
    
    // Generate insight based on current analytics
    const newInsight: PolicyInsight = {
      id: `insight_${Date.now()}`,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Analysis Report`,
      category,
      description: `Automated analysis of ${category} trends and patterns`,
      metrics: {
        totalUsers: analytics.totalRegistrations,
        verifiedUsers: analytics.verifiedIdentities,
        jobMatches: analytics.jobPlacements,
        skillsGap: analytics.skillsAnalysis.leastAvailable
      },
      recommendations: [
        "Implement targeted training programs",
        "Strengthen industry partnerships",
        "Improve verification processes"
      ],
      createdAt: new Date().toISOString()
    };
    
    const updatedInsights = [newInsight, ...policyInsights];
    set({ policyInsights: updatedInsights });
    
    try {
      await AsyncStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(updatedInsights));
    } catch (error) {
      console.error('Failed to save insight:', error);
    }
  }
}));