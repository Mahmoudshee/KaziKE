import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GraduationCap,
  Award,
  Users,
  Settings,
  FileCheck,
  UserCheck,
  Building,
  Plus,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";

export default function InstitutionDashboard() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleSignOut = async () => {
    await logout();
  };
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const quickStats = [
    { label: "Certificates Issued", value: "1.2K", icon: Award, color: "#00C65A" },
    { label: "Active Students", value: "3.5K", icon: Users, color: "#4A90E2" },
    { label: "Verification Requests", value: "28", icon: FileCheck, color: "#FF6B35" },
  ];

  const menuItems = [
    { title: "Issue Certificate", icon: Plus, description: "Create new certificates", primary: true },
    { title: "Verify Requests", icon: FileCheck, description: "Handle verification requests" },
    { title: "Student Cohorts", icon: Users, description: "Manage student groups" },
    { title: "Institution Profile", icon: Building, description: "Update institution details" },
    { title: "Settings", icon: Settings, description: "System preferences" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B1538", "#A91B47", "#C41E3A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Institution Portal</Text>
                <Text style={styles.institutionName}>{user?.profile?.institutionName || "Institution"}</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={toggleMenu}>
                <GraduationCap color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            {isMenuOpen && (
              <View style={styles.profileMenu}>
                <TouchableOpacity style={styles.profileMenuItem}>
                  <Text style={styles.profileMenuText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileMenuItem} onPress={handleSignOut}>
                  <Text style={styles.profileMenuText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              {quickStats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <stat.icon color={stat.color} size={20} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Recent Certificates */}
            <View style={styles.certificatesCard}>
              <Text style={styles.certificatesTitle}>Recent Certificates</Text>
              <View style={styles.certificateItem}>
                <View style={styles.certificateIcon}>
                  <Award color="#00C65A" size={16} />
                </View>
                <View style={styles.certificateContent}>
                  <Text style={styles.certificateText}>
                    Bachelor of Computer Science - John Doe
                  </Text>
                  <Text style={styles.certificateTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.certificateItem}>
                <View style={styles.certificateIcon}>
                  <Award color="#00C65A" size={16} />
                </View>
                <View style={styles.certificateContent}>
                  <Text style={styles.certificateText}>
                    Diploma in Engineering - Jane Smith
                  </Text>
                  <Text style={styles.certificateTime}>1 day ago</Text>
                </View>
              </View>
              <View style={styles.certificateItem}>
                <View style={styles.certificateIcon}>
                  <UserCheck color="#4A90E2" size={16} />
                </View>
                <View style={styles.certificateContent}>
                  <Text style={styles.certificateText}>
                    Certificate verified for Michael Johnson
                  </Text>
                  <Text style={styles.certificateTime}>2 days ago</Text>
                </View>
              </View>
            </View>

            {/* Verification Status */}
            <View style={styles.verificationCard}>
              <Text style={styles.verificationTitle}>Institution Status</Text>
              <View style={styles.verificationItem}>
                <UserCheck color="#00C65A" size={16} />
                <Text style={styles.verificationText}>✅ Verified Institution</Text>
              </View>
              <View style={styles.verificationItem}>
                <Award color="#00C65A" size={16} />
                <Text style={styles.verificationText}>✅ Certificate Authority Active</Text>
              </View>
              <View style={styles.verificationItem}>
                <Building color="#00C65A" size={16} />
                <Text style={styles.verificationText}>✅ Accreditation Valid</Text>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    item.primary && styles.primaryMenuItem,
                  ]}
                  accessibilityLabel={item.title}
                  accessibilityRole="button"
                >
                  <View style={[
                    styles.menuIcon,
                    item.primary && styles.primaryMenuIcon,
                  ]}>
                    <item.icon 
                      color={item.primary ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)"} 
                      size={20} 
                    />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={[
                      styles.menuTitle,
                      item.primary && styles.primaryMenuTitle,
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={[
                      styles.menuDescription,
                      item.primary && styles.primaryMenuDescription,
                    ]}>
                      {item.description}
                    </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileMenu: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  profileMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  profileMenuText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  institutionName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  certificatesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  certificatesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  certificateItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  certificateIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  certificateContent: {
    flex: 1,
  },
  certificateText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  certificateTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  verificationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  menuContainer: {
    gap: 12,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  primaryMenuItem: {
    backgroundColor: "#00C65A",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  primaryMenuIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  primaryMenuTitle: {
    color: "#FFFFFF",
  },
  menuDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  primaryMenuDescription: {
    color: "rgba(255, 255, 255, 0.9)",
  },
});