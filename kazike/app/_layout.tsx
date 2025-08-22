import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/stores/auth-store";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, isLoading, isInitialized, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isInitialized && !isLoading) {
      SplashScreen.hideAsync();
      
      // Auto-navigate authenticated users to their dashboard
      if (user && user.isVerified) {
        console.log("Auto-navigating to dashboard:", user.role);
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, isInitialized, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile-selection" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup/youth" />
      <Stack.Screen name="signup/employer" />
      <Stack.Screen name="signup/government" />
      <Stack.Screen name="signup/institution" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="verify-company" />
      <Stack.Screen name="approval-pending" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="dashboard/youth" />
      <Stack.Screen name="dashboard/employer" />
      <Stack.Screen name="dashboard/government" />
      <Stack.Screen name="dashboard/institution" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}