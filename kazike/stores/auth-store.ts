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
  signUp: (userData: Partial<User> & { password: string }) => Promise<User>;
  signIn: (identifier: string, password: string) => Promise<User>;
  generateDomain: (name: string, role: UserRole) => string;
}

const STORAGE_KEY = "@ke_identity_user";
const USERS_MAP_KEY = "@ke_identity_users"; // Record<userId, User>
const CREDENTIALS_KEY = "@ke_identity_credentials"; // { byEmail: Record<string,{id:string,password:string}>, byPhone: Record<string,{id:string,password:string}> }

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
      // On web, force a hard navigation to landing to reset router state
      if (typeof window !== 'undefined') {
        window.location.href = '/';
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

  signUp: async (userData: Partial<User> & { password: string }) => {
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
        isVerified: true,
        profile: userData.profile || {},
        domain,
        createdAt: new Date().toISOString(),
      };
      
      // Persist into users map and credentials index
      const rawUsers = (await AsyncStorage.getItem(USERS_MAP_KEY)) || "{}";
      const usersMap: Record<string, User> = JSON.parse(rawUsers);
      usersMap[newUser.id] = newUser;

      const rawCreds = (await AsyncStorage.getItem(CREDENTIALS_KEY)) || "{}";
      const creds: { byEmail?: Record<string,{id:string,password:string}>, byPhone?: Record<string,{id:string,password:string}> } = JSON.parse(rawCreds);
      if (!creds.byEmail) creds.byEmail = {};
      if (!creds.byPhone) creds.byPhone = {};

      const emailKey = (newUser.email || "").toLowerCase();
      const phoneKey = (newUser.profile.phone || "").replace(/\D/g, "");

      if (emailKey) {
        if (creds.byEmail[emailKey]) {
          throw new Error("Email already registered");
        }
        creds.byEmail[emailKey] = { id: newUser.id, password: userData.password };
      }
      if (phoneKey) {
        if (creds.byPhone[phoneKey]) {
          throw new Error("Phone already registered");
        }
        creds.byPhone[phoneKey] = { id: newUser.id, password: userData.password };
      }

      await AsyncStorage.multiSet([
        [USERS_MAP_KEY, JSON.stringify(usersMap)],
        [CREDENTIALS_KEY, JSON.stringify(creds)],
      ]);

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

  signIn: async (identifier: string, password: string) => {
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

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
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));