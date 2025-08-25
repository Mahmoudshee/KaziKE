import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

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
  error: string | null;
  setSelectedRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  signUp: (userData: Partial<User> & { password: string }) => Promise<User>;
  signIn: (identifier: string, password: string) => Promise<User>;
  generateDomain: (name: string, role: UserRole) => string;
  clearError: () => void;
  setError: (error: string) => void;
}

const STORAGE_KEY = "@ke_identity_user";
const USERS_MAP_KEY = "@ke_identity_users"; // Record<userId, User>
const CREDENTIALS_KEY = "@ke_identity_credentials"; // { byEmail: Record<string,{id:string,password:string}>, byPhone: Record<string,{id:string,password:string}> }

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  selectedRole: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  setSelectedRole: (role: UserRole) => {
    console.log("Setting selected role:", role);
    set({ selectedRole: role, error: null });
  },

  setUser: async (user: User) => {
    console.log("Setting user:", user.email, user.role);
    set({ user, error: null });
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
    try {
      await supabase.auth.signOut();        
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ user: null, selectedRole: null });
      
      router.replace("/");             
    } catch (error) {
      console.error("Failed to logout:", error);
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

  clearError: () => {
    set({ error: null });
  },

  setError: (error: string) => {
    set({ error });
  },

  signUp: async (userData: Partial<User> & { password: string }) => {
    set({ isLoading: true, error: null });
    
    try {
      // Youth flow: create user in Supabase Auth with email verification
      if (userData.role === "youth") {
        const fullName = userData.profile?.fullName || "user";
        const phone = userData.profile?.phone || "";
        const nationalId = userData.profile?.nationalId || "";
        const dateOfBirth = userData.profile?.dateOfBirth || "";
        const domain = get().generateDomain(fullName, "youth");

        const { data, error } = await supabase.auth.signUp({
          email: userData.email!,
          password: userData.password,
          options: {
            data: { fullName, phone, nationalId, dateOfBirth, domain, role: "youth" },
            emailRedirectTo: process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL,
          },
        });

        if (error) {
          throw error;
        }

        console.log("Supabase signUp initiated for youth:", data.user?.email);

        // Do NOT authenticate locally yet; wait for email confirmation
        const tempUser: User = {
          id: data.user?.id || `pending_${Date.now()}`,
          email: userData.email!,
          role: "youth",
          isVerified: false,
          profile: { fullName, phone, nationalId, dateOfBirth },
          domain,
          createdAt: new Date().toISOString(),
        };

        return tempUser;
      }

      // Use Supabase sign up for other roles as well (email verification required)
      const name = userData.profile?.fullName || userData.profile?.orgName || userData.profile?.institutionName || "user";
      const role = userData.role!;
      const domain = get().generateDomain(name, role);

      const metadata: Record<string, any> = {
        role,
        domain,
        fullName: userData.profile?.fullName,
        phone: userData.profile?.phone,
        nationalId: userData.profile?.nationalId,
        dateOfBirth: userData.profile?.dateOfBirth,
        orgName: userData.profile?.orgName,
        kraPin: userData.profile?.kraPin,
        institutionName: userData.profile?.institutionName,
        ministry: userData.profile?.ministry,
      };

      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password,
        options: {
          data: metadata,
          emailRedirectTo: process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL,
        },
      });

      if (error) {
        throw error;
      }

      const tempUser: User = {
        id: data.user?.id || `pending_${Date.now()}`,
        email: userData.email!,
        role,
        isVerified: false,
        profile: userData.profile || {},
        domain,
        createdAt: new Date().toISOString(),
      };

      // Do not set user locally yet; wait for email confirmation and verification flow
      return tempUser;
    } catch (error: any) {
      console.error("Sign up failed:", error);
      const errorMessage = error?.message || "Sign up failed. Please try again.";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Try Supabase (youth email/password) first
      if (identifier.includes("@")) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        if (error && error.message) {
          // Fall through to local if Supabase fails with specific message
          console.warn("Supabase signIn failed:", error.message);
        }
        if (data?.user) {
          const meta = (data.user as any).user_metadata || {};
          const role: UserRole = meta.role || "youth";
          const fullName: string | undefined = meta.fullName;
          const phone: string | undefined = meta.phone;
          const nationalId: string | undefined = meta.nationalId;
          const dateOfBirth: string | undefined = meta.dateOfBirth;
          const domain: string = meta.domain || get().generateDomain(fullName || "user", role);
          const isVerified = Boolean((data.user as any).email_confirmed_at);

          const signedInUser: User = {
            id: data.user.id,
            email: data.user.email || identifier,
            role,
            isVerified,
            profile: { fullName, phone, nationalId, dateOfBirth },
            domain,
            createdAt: (data.user as any).created_at || new Date().toISOString(),
          };
          await get().setUser(signedInUser);
          return signedInUser;
        }
      }

      // Fallback: existing local mock flow for other roles and phone sign-in
      await new Promise(resolve => setTimeout(resolve, 300));

      const rawCreds = (await AsyncStorage.getItem(CREDENTIALS_KEY)) || "{}";
      const creds: { byEmail?: Record<string,{id:string,password:string}>, byPhone?: Record<string,{id:string,password:string}> } = JSON.parse(rawCreds);
      const byEmail = creds.byEmail || {};
      const byPhone = creds.byPhone || {};
      const identifierLower = identifier.toLowerCase();
      const asPhone = identifier.replace(/\D/g, "");

      let credential = byEmail[identifierLower];
      if (!credential && asPhone) {
        credential = byPhone[asPhone];
      }
      if (!credential) {
        throw new Error("Account not found");
      }
      if (credential.password !== password) {
        throw new Error("Invalid credentials");
      }

      const rawUsers = (await AsyncStorage.getItem(USERS_MAP_KEY)) || "{}";
      const usersMap: Record<string, User> = JSON.parse(rawUsers);
      const user = usersMap[credential.id];
      if (!user) {
        throw new Error("User data missing");
      }

      await get().setUser(user);
      return user;
    } catch (error: any) {
      console.error("Sign in failed:", error);
      const errorMessage = error?.message || "Sign in failed. Please try again.";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));