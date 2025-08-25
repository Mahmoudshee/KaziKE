import { router } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "@/stores/auth-store";

export default function EmployerDashboard() {
  const { user } = useAuthStore();

  useEffect(() => {
    // Redirect to the new dashboard layout
    router.replace("/dashboard/tabs");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to new dashboard...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});