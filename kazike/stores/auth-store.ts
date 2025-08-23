import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

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
  // Institution-specific optional fields
  institutionType?: string;
  accreditationNumber?: string;
  website?: string;
  address?: string;
  principalName?: string;
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
const USERS_MAP_KEY = "@ke_identity_users"; 
const CREDENTIALS_KEY = "@ke_identity_credentials"; 

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
    set({ user: null, selectedRole: null });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
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

  clearError: () => set({ error: null }),
  setError: (error: string) => set({ error }),

  signUp: async (userData: Partial<User> & { password: string }) => {
    set({ isLoading: true, error: null });
    try {
      // Youth => Supabase flow
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

        if (error) throw error;

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

      // Other roles => AsyncStorage mock flow
      const name = userData.profile?.fullName || userData.profile?.orgName || userData.profile?.institutionName || "user";
      const providedDomain = (userData as any).domain as string | undefined;
      const domain = providedDomain?.trim()
        ? providedDomain.trim().toLowerCase()
        : get().generateDomain(name, userData.role!);

      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email!,
        role: userData.role!,
        isVerified: true,
        profile: { ...(userData.profile || {}), domain },
        domain,
        createdAt: new Date().toISOString(),
      };

      const rawUsers = (await AsyncStorage.getItem(USERS_MAP_KEY)) || "{}";
      const usersMap: Record<string, User> = JSON.parse(rawUsers);
      usersMap[newUser.id] = newUser;

      const rawCreds = (await AsyncStorage.getItem(CREDENTIALS_KEY)) || "{}";
      const creds: {
        byEmail?: Record<string, { id: string; password: string }>;
        byPhone?: Record<string, { id: string; password: string }>;
      } = JSON.parse(rawCreds);

      if (!creds.byEmail) creds.byEmail = {};
      if (!creds.byPhone) creds.byPhone = {};

      const emailKey = (newUser.email || "").toLowerCase();
      const phoneKey = (newUser.profile.phone || "").replace(/\D/g, "");

      if (emailKey) {
        if (creds.byEmail[emailKey]) throw new Error("Email already registered");
        creds.byEmail[emailKey] = { id: newUser.id, password: userData.password };
      }
      if (phoneKey) {
        if (creds.byPhone[phoneKey]) throw new Error("Phone already registered");
        creds.byPhone[phoneKey] = { id: newUser.id, password: userData.password };
      }

      await AsyncStorage.multiSet([
        [USERS_MAP_KEY, JSON.stringify(usersMap)],
        [CREDENTIALS_KEY, JSON.stringify(creds)],
      ]);

      await get().setUser(newUser);
      return newUser;
    } catch (error: any) {
      console.error("Sign up failed:", error);
      set({ error: error?.message || "Sign up failed. Please try again." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Try Supabase first for youth emails
      if (identifier.includes("@")) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });

        if (data?.user) {
          const meta = (data.user as any).user_metadata || {};
          const role: UserRole = meta.role || "youth";
          const domain = meta.domain || get().generateDomain(meta.fullName || "user", role);
          const isVerified = Boolean((data.user as any).email_confirmed_at);

          const signedInUser: User = {
            id: data.user.id,
            email: data.user.email || identifier,
            role,
            isVerified,
            profile: {
              fullName: meta.fullName,
              phone: meta.phone,
              nationalId: meta.nationalId,
              dateOfBirth: meta.dateOfBirth,
            },
            domain,
            createdAt: (data.user as any).created_at || new Date().toISOString(),
          };
          await get().setUser(signedInUser);
          return signedInUser;
        }

        if (error) console.warn("Supabase signIn failed:", error.message);
      }

      // Fallback to AsyncStorage for other roles
      const rawCreds = (await AsyncStorage.getItem(CREDENTIALS_KEY)) || "{}";
      const creds: {
        byEmail?: Record<string, { id: string; password: string }>;
        byPhone?: Record<string, { id: string; password: string }>;
      } = JSON.parse(rawCreds);

      const byEmail = creds.byEmail || {};
      const byPhone = creds.byPhone || {};
      const identifierLower = identifier.toLowerCase();
      const asPhone = identifier.replace(/\D/g, "");

      let credential = byEmail[identifierLower];
      if (!credential && asPhone) {
        credential = byPhone[asPhone];
      }
      if (!credential) throw new Error("Account not found");
      if (credential.password !== password) throw new Error("Invalid credentials");

      const rawUsers = (await AsyncStorage.getItem(USERS_MAP_KEY)) || "{}";
      const usersMap: Record<string, User> = JSON.parse(rawUsers);
      const user = usersMap[credential.id];
      if (!user) throw new Error("User data missing");

      await get().setUser(user);
      return user;
    } catch (error: any) {
      console.error("Sign in failed:", error);
      set({ error: error?.message || "Sign in failed. Please try again." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
