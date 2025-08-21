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
  BarChart3,
  Shield,
  FileText,
  Settings,
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react-native";

export default function GovernmentDashboard() {
  const quickStats = [
    { label: "Total Users", value: "12.5K", icon: Users, color: "#00C65A" },
    { label: "Verified IDs", value: "8.2K", icon: CheckCircle, color: "#4A90E2" },
    { label: "Pending Reviews", value: "45", icon: AlertTriangle, color: "#FF6B35" },
  ];

  const menuItems = [
    { title: "Analytics Dashboard", icon: BarChart3, description: "System metrics & insights" },
    { title: "Verification Oversight", icon: Shield, description: "ID verification management" },
    { title: "System Reports", icon: FileText, description: "Generate compliance reports" },
    { title: "Integration Management", icon: TrendingUp, description: "API & system integrations" },
    { title: "Settings", icon: Settings, description: "System configuration" },
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
                <Text style={styles.greeting}>Government Portal</Text>
                <Text style={styles.departmentName}>Ministry of ICT</Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <Shield color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

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

            {/* System Status */}
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>System Status</Text>
              <View style={styles.statusItem}>
                <CheckCircle color="#00C65A" size={16} />
                <Text style={styles.statusText}>ID Verification Service: Online</Text>
              </View>
              <View style={styles.statusItem}>
                <CheckCircle color="#00C65A" size={16} />
                <Text style={styles.statusText}>KRA Integration: Active</Text>
              </View>
              <View style={styles.statusItem}>
                <AlertTriangle color="#FF6B35" size={16} />
                <Text style={styles.statusText}>NHIF Integration: Maintenance</Text>
              </View>
            </View>

            {/* Recent Alerts */}
            <View style={styles.alertsCard}>
              <Text style={styles.alertsTitle}>Recent Alerts</Text>
              <View style={styles.alertItem}>
                <View style={styles.alertIcon}>
                  <AlertTriangle color="#FF6B35" size={16} />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertText}>
                    45 verification requests pending review
                  </Text>
                  <Text style={styles.alertTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.alertItem}>
                <View style={styles.alertIcon}>
                  <CheckCircle color="#00C65A" size={16} />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertText}>
                    Monthly compliance report generated
                  </Text>
                  <Text style={styles.alertTime}>1 day ago</Text>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  accessibilityLabel={item.title}
                  accessibilityRole="button"
                >
                  <View style={styles.menuIcon}>
                    <item.icon color="rgba(255, 255, 255, 0.7)" size={20} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
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
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  departmentName: {
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
  statusCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  alertsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  alertIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
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
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
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
  menuDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
});