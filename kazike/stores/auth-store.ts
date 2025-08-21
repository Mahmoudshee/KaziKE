import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "youth" | "employer" | "government" | "institution";

export interface UserProfile {
  fullName?: string;
  phone?: string;
  nationalId?: string;
  dateOfBirth?: string;
  orgName?: string;
  kraPin?: string;
  ministry?: string;
  institutionName?: string;
  domain?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  profile: UserProfile;
  domain: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  selectedRole: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
  setSelectedRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  signUp: (userData: Partial<User>) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  generateDomain: (name: string, role: UserRole) => string;
}

const STORAGE_KEY = "@ke_identity_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  selectedRole: null,
  isLoading: false,
  isInitialized: false,

  setSelectedRole: (role: UserRole) => {
    console.log("Setting selected role:", role);
    set({ selectedRole: role });
  },

  setUser: async (user: User) => {
    console.log("Setting user:", user.email, user.role);
    set({ user });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to storage:", error);
    }
  },

  updateProfile: async (profileUpdate: Partial<UserProfile>) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = {
      ...user,
      profile: { ...user.profile, ...profileUpdate },
    };

    set({ user: updatedUser });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  },

  logout: async () => {
    console.log("Logging out user");
    set({ user: null, selectedRole: null });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear user from storage:", error);
    }
  },

  loadUser: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true });
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        console.log("Loaded user from storage:", user.email, user.role);
        set({ user });
      } else {
        console.log("No user found in storage");
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  generateDomain: (name: string, role: UserRole) => {
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20);
    
    const timestamp = Date.now().toString().slice(-4);
    const rolePrefix = role === "youth" ? "" : role.substring(0, 3);
    
    return `${rolePrefix}${cleanName}${timestamp}.ke`;
  },

  signUp: async (userData: Partial<User>) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const name = userData.profile?.fullName || userData.profile?.orgName || userData.profile?.institutionName || "user";
      const domain = get().generateDomain(name, userData.role!);
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email!,
        role: userData.role!,
        isVerified: false,
        profile: userData.profile || {},
        domain,
        createdAt: new Date().toISOString(),
      };
      
      console.log("Created new user:", newUser.email, newUser.domain);
      await get().setUser(newUser);
      
      return newUser;
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - in real app, this would validate against backend
      const mockUsers: Record<string, User> = {
        "youth@test.com": {
          id: "user_youth",
          email: "youth@test.com",
          role: "youth",
          isVerified: true,
          profile: { fullName: "John Doe", phone: "+254712345678" },
          domain: "johndoe1234.ke",
          createdAt: "2024-01-01T00:00:00Z",
        },
        "employer@test.com": {
          id: "user_employer",
          email: "employer@test.com",
          role: "employer",
          isVerified: true,
          profile: { orgName: "Tech Solutions Ltd", kraPin: "A123456789B" },
          domain: "emptechsolutions5678.ke",
          createdAt: "2024-01-01T00:00:00Z",
        },
        "gov@test.com": {
          id: "user_government",
          email: "gov@test.com",
          role: "government",
          isVerified: true,
          profile: { fullName: "Jane Smith", ministry: "Ministry of Education" },
          domain: "govjanesmith9012.ke",
          createdAt: "2024-01-01T00:00:00Z",
        },
        "uni@test.com": {
          id: "user_institution",
          email: "uni@test.com",
          role: "institution",
          isVerified: true,
          profile: { institutionName: "University of Nairobi" },
          domain: "insuniversityofnairobi3456.ke",
          createdAt: "2024-01-01T00:00:00Z",
        },
      };
      
      const user = mockUsers[email.toLowerCase()];
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      console.log("User signed in:", user.email, user.role);
      await get().setUser(user);
      
      return user;
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));