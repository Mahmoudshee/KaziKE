import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Users,
  Briefcase,
  TrendingUp,
  Settings,
  Building2,
  Eye,
  UserCheck,
  Home,
  LogOut,
  BarChart3,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { mockCandidates, mockCompanyJobs } from "@/mocks/candidates";

type TabType = 'home' | 'jobs' | 'candidates' | 'analytics' | 'settings';

export default function EmployerDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await logout();
    router.replace("/");
  };
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const quickStats = [
    { label: "Active Jobs", value: "5", icon: Briefcase, color: "#00C65A" },
    { label: "Applications", value: "127", icon: Users, color: "#4A90E2" },
    { label: "Interviews", value: "23", icon: UserCheck, color: "#FF6B35" },
  ];

  const tabs = [
    { id: 'home' as TabType, title: 'Home', icon: Home },
    { id: 'jobs' as TabType, title: 'Jobs', icon: Briefcase },
    { id: 'candidates' as TabType, title: 'Talent', icon: Users },
    { id: 'analytics' as TabType, title: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, title: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'jobs':
        return renderJobsTab();
      case 'candidates':
        return renderCandidatesTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderHomeTab();
    }
  };

  const renderHomeTab = () => (
    <>
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

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <TouchableOpacity 
          style={styles.primaryAction}
          onPress={() => setActiveTab('jobs')}
        >
          <Plus color="#FFFFFF" size={20} />
          <Text style={styles.primaryActionText}>Post New Job</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryActions}>
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={() => setActiveTab('candidates')}
          >
            <Users color="#00C65A" size={16} />
            <Text style={styles.secondaryActionText}>Browse Candidates</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={() => setActiveTab('analytics')}
          >
            <BarChart3 color="#00C65A" size={16} />
            <Text style={styles.secondaryActionText}>View Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityCard}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Eye color="#4A90E2" size={16} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              15 new applications for Software Developer role
            </Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <UserCheck color="#00C65A" size={16} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              Interview scheduled with John Doe
            </Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderJobsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Job Postings</Text>
      <Text style={styles.tabSubtitle}>Manage your active job listings</Text>
      
      <TouchableOpacity style={styles.postJobButton}>
        <Plus color="#FFFFFF" size={20} />
        <Text style={styles.postJobText}>Post New Job</Text>
      </TouchableOpacity>
      
      {mockCompanyJobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: job.status === 'active' ? '#00C65A' : '#666' }]}>
              <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.jobDepartment}>{job.department}</Text>
          <Text style={styles.jobLocation}>{job.location}</Text>
          <Text style={styles.jobSalary}>{job.salary}</Text>
          
          <View style={styles.jobStats}>
            <View style={styles.jobStat}>
              <Text style={styles.jobStatValue}>{job.applicants}</Text>
              <Text style={styles.jobStatLabel}>Applicants</Text>
            </View>
            <View style={styles.jobStat}>
              <Text style={styles.jobStatValue}>{job.views}</Text>
              <Text style={styles.jobStatLabel}>Views</Text>
            </View>
            <View style={styles.jobStat}>
              <Text style={styles.jobStatValue}>{new Date(job.postedAt).toLocaleDateString()}</Text>
              <Text style={styles.jobStatLabel}>Posted</Text>
            </View>
          </View>
          
          <View style={styles.jobActions}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Applications</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderCandidatesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Talent Pool</Text>
      <Text style={styles.tabSubtitle}>Discover verified candidates</Text>
      
      {mockCandidates.map((candidate) => (
        <View key={candidate.id} style={styles.candidateCard}>
          <View style={styles.candidateHeader}>
            <View style={styles.candidateInfo}>
              <Text style={styles.candidateName}>{candidate.fullName}</Text>
              <Text style={styles.candidateLocation}>{candidate.location}</Text>
            </View>
            <View style={[styles.verificationBadge, { 
              backgroundColor: candidate.verificationStatus === 'verified' ? '#00C65A' : '#FF6B35' 
            }]}>
              <Text style={styles.verificationText}>
                {candidate.verificationStatus === 'verified' ? 'VERIFIED' : 'PENDING'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.candidateEducation}>{candidate.education}</Text>
          <Text style={styles.candidateExperience}>{candidate.experience} experience</Text>
          
          <View style={styles.candidateSkills}>
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.candidateStats}>
            <Text style={styles.candidateStat}>{candidate.profileViews} profile views</Text>
            <Text style={styles.candidateStat}>{candidate.applications} applications</Text>
          </View>
          
          <View style={styles.candidateActions}>
            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Analytics</Text>
      <Text style={styles.tabSubtitle}>Performance insights and metrics</Text>
      
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Job Performance</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>234</Text>
            <Text style={styles.analyticsLabel}>Total Views</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>89</Text>
            <Text style={styles.analyticsLabel}>Applications</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>12</Text>
            <Text style={styles.analyticsLabel}>Interviews</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsValue}>3</Text>
            <Text style={styles.analyticsLabel}>Hires</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Top Performing Jobs</Text>
        {mockCompanyJobs.slice(0, 3).map((job, index) => (
          <View key={job.id} style={styles.performanceItem}>
            <Text style={styles.performanceRank}>#{index + 1}</Text>
            <View style={styles.performanceInfo}>
              <Text style={styles.performanceTitle}>{job.title}</Text>
              <Text style={styles.performanceStats}>{job.applicants} applications • {job.views} views</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Settings</Text>
      <Text style={styles.tabSubtitle}>Manage your company account</Text>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Company Profile</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Company Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Manage Team</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Billing & Subscription</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy Settings</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color="#FF6B6B" size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.companyName}>{user?.profile?.orgName || "Organization"}</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={toggleMenu}>
                <Building2 color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            {isMenuOpen && (
              <View style={styles.profileMenu}>
                <TouchableOpacity style={styles.profileMenuItem} onPress={() => setActiveTab('settings')}>
                  <Text style={styles.profileMenuText}>Company Settings</Text>
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

            {/* Recent Activity */}
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Eye color="#4A90E2" size={16} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    15 new applications for Software Developer role
                  </Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <UserCheck color="#00C65A" size={16} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>
                    Interview scheduled with John Doe
                  </Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
              </View>
            </View>

            {/* Tab Content */}
            {renderTabContent()}
          </ScrollView>
        </SafeAreaView>
        
        {/* Bottom Tab Navigation */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, activeTab === tab.id && styles.activeTabItem]}
              onPress={() => setActiveTab(tab.id)}
              accessibilityLabel={tab.title}
              accessibilityRole="button"
            >
              <tab.icon 
                color={activeTab === tab.id ? "#00C65A" : "rgba(255, 255, 255, 0.6)"} 
                size={20} 
              />
              <Text style={[
                styles.tabText, 
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  companyName: {
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
  activityCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  activityTime: {
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
  // Tab Navigation Styles
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTabItem: {
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
    textAlign: "center",
  },
  activeTabText: {
    color: "#00C65A",
    fontWeight: "600",
  },
  // Tab Content Styles
  tabContent: {
    paddingBottom: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tabSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 24,
  },
  // Quick Actions Styles
  quickActionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00C65A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  // Job Styles
  postJobButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00C65A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  postJobText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  jobCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  jobDepartment: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  jobSalary: {
    fontSize: 14,
    color: "#00C65A",
    fontWeight: "500",
    marginBottom: 12,
  },
  jobStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  jobStat: {
    alignItems: "center",
  },
  jobStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  jobStatLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  jobActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#00C65A",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  // Candidate Styles
  candidateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  candidateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  candidateLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  candidateEducation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  candidateExperience: {
    fontSize: 14,
    color: "#00C65A",
    fontWeight: "500",
    marginBottom: 12,
  },
  candidateSkills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: "#00C65A",
    fontWeight: "500",
  },
  candidateStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  candidateStat: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  candidateActions: {
    flexDirection: "row",
    gap: 12,
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#00C65A",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  // Analytics Styles
  analyticsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  analyticsItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00C65A",
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  performanceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  performanceRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00C65A",
    width: 30,
  },
  performanceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  performanceStats: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  // Settings Styles
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  signOutText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },
});