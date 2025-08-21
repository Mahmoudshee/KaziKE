import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  Building2,
  Shield,
  GraduationCap,
  ArrowLeft,
} from "lucide-react-native";
import { useAuthStore, UserRole } from "@/stores/auth-store";

const profileOptions = [
  {
    role: "youth" as UserRole,
    title: "Youth",
    tagline: "Get your .KE EduID and job matches",
    icon: Users,
    color: "#00C65A",
  },
  {
    role: "employer" as UserRole,
    title: "SME/Employer",
    tagline: "Post jobs and discover verified talent",
    icon: Building2,
    color: "#FF6B35",
  },
  {
    role: "government" as UserRole,
    title: "Government",
    tagline: "Analytics and verification oversight",
    icon: Shield,
    color: "#4A90E2",
  },
  {
    role: "institution" as UserRole,
    title: "University/TVET",
    tagline: "Issue and verify certificates",
    icon: GraduationCap,
    color: "#9B59B6",
  },
];

export default function ProfileSelectionScreen() {
  const { setSelectedRole } = useAuthStore();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    router.push(`/signup/${role}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B1538", "#A91B47", "#C41E3A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Your Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Select the option that best describes you to get started with your
              .KE digital identity.
            </Text>

            <View style={styles.cardsContainer}>
              {profileOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.role}
                  style={styles.profileCard}
                  onPress={() => handleRoleSelect(option.role)}
                  accessibilityLabel={`Select ${option.title}: ${option.tagline}`}
                  accessibilityRole="button"
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${option.color}20` },
                      ]}
                    >
                      <option.icon color={option.color} size={28} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.cardTitle}>{option.title}</Text>
                      <Text style={styles.cardTagline}>{option.tagline}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  cardsContainer: {
    gap: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardTagline: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
});