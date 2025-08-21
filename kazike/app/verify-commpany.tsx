import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Building2, CheckCircle } from "lucide-react-native";

export default function VerifyCompanyScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/dashboard/employer");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B1538", "#A91B47", "#C41E3A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Building2 color="#00C65A" size={32} />
              </View>
              <Text style={styles.title}>Company Verification</Text>
              <Text style={styles.subtitle}>
                We're verifying your company details with KRA and other official records.
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <CheckCircle color="#00C65A" size={20} />
                <Text style={styles.statusText}>KRA PIN Validated</Text>
              </View>
              <View style={styles.statusItem}>
                <CheckCircle color="#00C65A" size={20} />
                <Text style={styles.statusText}>Business Registration Confirmed</Text>
              </View>
              <View style={styles.statusItem}>
                <CheckCircle color="#00C65A" size={20} />
                <Text style={styles.statusText}>Email Domain Verified</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                { opacity: isLoading ? 0.7 : 1 },
              ]}
              onPress={handleVerification}
              disabled={isLoading}
              accessibilityLabel="Continue to dashboard"
              accessibilityRole="button"
            >
              <Text style={styles.continueButtonText}>
                {isLoading ? "Setting up..." : "Continue to Dashboard"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  statusContainer: {
    gap: 16,
    marginBottom: 40,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});