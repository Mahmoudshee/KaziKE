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
  Globe,
  FileText,
  Bell,
  Settings,
  Briefcase,
  User,
  LogOut,
  Home,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useYouthStore } from "@/stores/youth-store";


type TabType = 'home' | 'jobs' | 'domain' | 'applications' | 'notifications' | 'settings';

export default function YouthDashboard() {
  const { user, logout } = useAuthStore();
  const { 
    profile, 
    jobMatches, 
    applications, 
    savedJobs, 
    loadProfile,
    loadApplications,
    applyToJob,
    saveJob,
    unsaveJob
  } = useYouthStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  React.useEffect(() => {
    loadProfile();
    loadApplications();
  }, [loadProfile, loadApplications]);
  
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  const quickStats = [
    { label: "Job Matches", value: jobMatches.length.toString(), icon: Briefcase, color: "#00C65A" },
    { label: "Profile Views", value: "45", icon: User, color: "#4A90E2" },
    { label: "Applications", value: applications.length.toString(), icon: FileText, color: "#FF6B35" },
  ];

  const tabs = [
    { id: 'home' as TabType, title: 'Home', icon: Home },
    { id: 'jobs' as TabType, title: 'Jobs', icon: Briefcase },
    { id: 'domain' as TabType, title: 'Domain', icon: Globe },
    { id: 'applications' as TabType, title: 'Apps', icon: FileText },
    { id: 'notifications' as TabType, title: 'Alerts', icon: Bell },
    { id: 'settings' as TabType, title: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'jobs':
        return renderJobsTab();
      case 'domain':
        return renderDomainTab();
      case 'applications':
        return renderApplicationsTab();
      case 'notifications':
        return renderNotificationsTab();
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

      {/* Domain Status */}
      <View style={styles.domainCard}>
        <View style={styles.domainHeader}>
          <Globe color="#00C65A" size={24} />
          <Text style={styles.domainTitle}>Your .KE Domain</Text>
        </View>
        <Text style={styles.domainUrl}>{user?.domain || "yourname.ke"}</Text>
        <Text style={styles.domainStatus}>✅ Active & Verified</Text>
        <TouchableOpacity 
          style={styles.viewDomainButton}
          onPress={() => setActiveTab('domain')}
        >
          <Text style={styles.viewDomainText}>View Portfolio</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Job Matches */}
      <View style={styles.jobMatchesCard}>
        <Text style={styles.jobMatchesTitle}>Recent Job Matches</Text>
        {jobMatches.slice(0, 2).map((job) => (
          <View key={job.id} style={styles.jobItem}>
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobSalary}>{job.salary}</Text>
              <View style={styles.matchScore}>
                <Text style={styles.matchScoreText}>{job.matchScore}% match</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => handleApplyToJob(job.id)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={styles.viewAllText}>View All Jobs</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const handleApplyToJob = async (jobId: string) => {
    try {
      await applyToJob(jobId);
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to apply');
    }
  };
  
  const handleSaveJob = async (jobId: string) => {
    try {
      if (savedJobs.includes(jobId)) {
        await unsaveJob(jobId);
      } else {
        await saveJob(jobId);
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error);
    }
  };

  const renderJobsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Job Matches</Text>
      <Text style={styles.tabSubtitle}>AI-powered opportunities tailored for you</Text>
      
      {jobMatches.map((job) => {
        const isApplied = applications.some(app => app.jobId === job.id);
        const isSaved = savedJobs.includes(job.id);
        
        return (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleContainer}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.matchScoreBadge}>
                  <Text style={styles.matchScoreText}>{job.matchScore}%</Text>
                </View>
              </View>
              <Text style={styles.jobType}>{job.type}</Text>
            </View>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <Text style={styles.jobLocation}>{job.location}</Text>
            <Text style={styles.jobSalary}>{job.salary}</Text>
            
            {job.matchReasons.length > 0 && (
              <View style={styles.matchReasons}>
                <Text style={styles.matchReasonsTitle}>Why this matches:</Text>
                {job.matchReasons.slice(0, 2).map((reason, index) => (
                  <Text key={index} style={styles.matchReason}>• {reason}</Text>
                ))}
              </View>
            )}
            
            <View style={styles.jobSkills}>
              {job.requirements.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
            <View style={styles.jobActions}>
              <TouchableOpacity 
                style={[styles.applyButton, isApplied && styles.appliedButton]}
                onPress={() => !isApplied && handleApplyToJob(job.id)}
                disabled={isApplied}
              >
                <Text style={[styles.applyButtonText, isApplied && styles.appliedButtonText]}>
                  {isApplied ? 'Applied' : 'Apply Now'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => handleSaveJob(job.id)}
              >
                <Text style={[styles.saveButtonText, isSaved && styles.savedButtonText]}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.applicantsText}>{job.applicants} applicants</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderDomainTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>My .KE Domain</Text>
      <Text style={styles.tabSubtitle}>Your digital identity and portfolio</Text>
      
      <View style={styles.domainInfoCard}>
        <Text style={styles.domainUrl}>{user?.domain || "yourname.ke"}</Text>
        <Text style={styles.domainDescription}>
          Your verified .KE domain serves as your digital identity and professional portfolio.
        </Text>
        
        <View style={styles.domainFeatures}>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>✅ Verified Identity</Text>
            <Text style={styles.featureDesc}>Government-verified digital ID</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🌐 Professional Portfolio</Text>
            <Text style={styles.featureDesc}>Showcase your skills and experience</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🔒 Secure & Trusted</Text>
            <Text style={styles.featureDesc}>Blockchain-secured credentials</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editDomainButton}>
          <Text style={styles.editDomainText}>Edit Portfolio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderApplicationsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>My Applications</Text>
      <Text style={styles.tabSubtitle}>Track your job application progress</Text>
      
      {applications.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText color="rgba(255, 255, 255, 0.5)" size={48} />
          <Text style={styles.emptyStateText}>No applications yet</Text>
          <Text style={styles.emptyStateSubtext}>Start applying to jobs to see them here</Text>
        </View>
      ) : (
        applications.map((app) => (
          <View key={app.id} style={styles.applicationCard}>
            <View style={styles.applicationHeader}>
              <Text style={styles.applicationTitle}>{app.jobTitle}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                <Text style={styles.statusText}>{app.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.applicationCompany}>{app.company}</Text>
            <Text style={styles.applicationDate}>
              Applied: {new Date(app.appliedAt).toLocaleDateString()}
            </Text>
            {app.notes && (
              <Text style={styles.applicationNotes}>{app.notes}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Notifications</Text>
      <Text style={styles.tabSubtitle}>Stay updated with your activities</Text>
      
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>🎉 New Job Match!</Text>
        <Text style={styles.notificationText}>
          A new Senior Developer position at Safaricom matches your profile.
        </Text>
        <Text style={styles.notificationTime}>2 hours ago</Text>
      </View>
      
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>📝 Application Update</Text>
        <Text style={styles.notificationText}>
          Your application for Frontend Developer at Equity Bank has been reviewed.
        </Text>
        <Text style={styles.notificationTime}>1 day ago</Text>
      </View>
      
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>🔔 Profile Viewed</Text>
        <Text style={styles.notificationText}>
          Your profile was viewed by 5 employers this week.
        </Text>
        <Text style={styles.notificationTime}>3 days ago</Text>
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Settings</Text>
      <Text style={styles.tabSubtitle}>Manage your account preferences</Text>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy Settings</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Job Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Email Preferences</Text>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF6B35';
      case 'reviewed': return '#4A90E2';
      case 'interview': return '#00C65A';
      case 'rejected': return '#FF6B6B';
      case 'accepted': return '#00C65A';
      default: return '#666';
    }
  };

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
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.userName}>{profile?.fullName || user?.profile?.fullName || "User"}</Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <User color="#FFFFFF" size={24} />
              </TouchableOpacity>
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
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
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
  domainCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  domainTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  domainUrl: {
    fontSize: 16,
    color: "#00C65A",
    fontWeight: "500",
    marginBottom: 8,
  },
  domainStatus: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  viewDomainButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  viewDomainText: {
    color: "#FFFFFF",
    fontWeight: "600",
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
  // Job Styles
  jobMatchesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  jobMatchesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  jobItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  jobContent: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 2,
  },
  jobSalary: {
    fontSize: 14,
    color: "#00C65A",
    fontWeight: "500",
  },
  jobLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  jobType: {
    fontSize: 12,
    color: "#00C65A",
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "capitalize",
  },
  applyButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  viewAllButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontWeight: "500",
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
  jobSkills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
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
  jobActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  applicantsText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  // Domain Styles
  domainInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
  },
  domainDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
    lineHeight: 20,
  },
  domainFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  editDomainButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  editDomainText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Application Styles
  applicationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  applicationTitle: {
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
  applicationCompany: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  applicationNotes: {
    fontSize: 14,
    color: "#00C65A",
    fontStyle: "italic",
  },
  // Notification Styles
  notificationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
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
  // New styles for enhanced features
  matchScore: {
    marginTop: 4,
  },
  matchScoreText: {
    fontSize: 12,
    color: "#00C65A",
    fontWeight: "600",
  },
  jobTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  matchScoreBadge: {
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchReasons: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0, 198, 90, 0.1)",
    borderRadius: 8,
  },
  matchReasonsTitle: {
    fontSize: 12,
    color: "#00C65A",
    fontWeight: "600",
    marginBottom: 4,
  },
  matchReason: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 2,
  },
  appliedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  appliedButtonText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  saveButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
  },
  savedButtonText: {
    color: "#00C65A",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});