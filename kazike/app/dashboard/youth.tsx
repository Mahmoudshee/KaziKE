<<<<<<< HEAD
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
=======
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
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';
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
  CheckCircle,
  Award,
  Upload,
  Download,
  MessageCircle,
  X,
  Languages,
  FileUp,
  Bot,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useYouthStore } from "@/stores/youth-store";

type TabType = 'home' | 'profile' | 'jobs' | 'domain' | 'applications' | 'cv-services' | 'opportunities' | 'notifications' | 'settings';

interface TranslationMessage {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  attachments?: string[];
}

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
  
  // CV Translation Chatbot State
  const [showTranslationChat, setShowTranslationChat] = useState(false);
  const [translationMessages, setTranslationMessages] = useState<TranslationMessage[]>([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm your CV Translation Assistant. I can help you translate your CV to different languages.\n\nTo get started:\n• Upload your CV document\n• Tell me which language you want to translate to\n• I'll provide you with the translated version\n\nWhat language would you like to translate your CV to?",
      timestamp: new Date()
    }
  ]);
  const [translationInput, setTranslationInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCV, setUploadedCV] = useState<string | null>(null);
  const [cvContent, setCvContent] = useState<string>('');
  const [cvData, setCvData] = useState<any>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  React.useEffect(() => {
    loadProfile();
    loadApplications();
  }, [loadProfile, loadApplications]);
  
  const handleSignOut = async () => {
    await logout();
    router.replace("/");
  };

  // CV Translation Functions
  const handleUploadCV = async () => {
    setIsUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/rtf'
        ],
        copyToCacheDirectory: true,
        multiple: false
      });

              if (!result.canceled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          
          // Validate file size (max 10MB)
          if (file.size && file.size > 10 * 1024 * 1024) {
            Alert.alert(
              'File Too Large',
              'Please select a CV file smaller than 10MB.',
              [{ text: 'OK' }]
            );
            return;
          }
          
          setUploadedCV(file.name);
          
          // Read file content (for text-based files)
          if (file.mimeType && (file.mimeType.includes('text') || file.mimeType.includes('rtf'))) {
            try {
              // For text files, we can read the content
              const response = await fetch(file.uri);
              const text = await response.text();
              setCvContent(text);
              const parsedData = parseCVContent(text);
              setCvData(parsedData);
              
              addBotMessage(`Excellent! I've successfully uploaded and analyzed your CV: **${file.name}**\n\n📋 **File Details:**\n• Name: ${file.name}\n• Size: ${file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown'}\n• Type: ${file.mimeType || 'Unknown'}\n\n📄 **CV Content Detected:**\n• Name: ${parsedData.personalInfo.name || 'Not detected'}\n• Email: ${parsedData.personalInfo.email || 'Not detected'}\n• Phone: ${parsedData.personalInfo.phone || 'Not detected'}\n• Experience: ${parsedData.experience.length} entries\n• Education: ${parsedData.education.length} entries\n• Skills: ${parsedData.skills.length} items\n\n🌍 **Now, which language would you like me to translate it to?**\n\nAvailable languages:\n• Swahili (Kiswahili)\n• French (Français)\n• Spanish (Español)\n• German (Deutsch)\n• Chinese (中文)\n• Arabic (العربية)\n\nJust tell me the language and I'll start translating!`);
            } catch (error) {
              console.error('Error reading file:', error);
              addBotMessage(`CV uploaded successfully: **${file.name}**\n\n⚠️ Note: I couldn't read the file content automatically. Please paste your CV text in the chat, and I'll translate it for you.\n\n🌍 **Which language would you like me to translate it to?**`);
            }
          } else {
            // For PDF/Word files, ask user to paste content
            addBotMessage(`CV uploaded successfully: **${file.name}**\n\n📝 **Next Step:** Since this is a ${file.mimeType || 'document'} file, I can't read it automatically.\n\n**Please paste your CV text in the chat below** (just copy and paste your CV content), and then tell me which language you want it translated to.\n\n🌍 **Available languages:**\n• Swahili (Kiswahili)\n• French (Français)\n• Spanish (Español)\n• German (Deutsch)\n• Chinese (中文)\n• Arabic (العربية)\n\n**Example:** Just paste your CV text, then say "translate to Swahili"`);
          }
        }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        'Upload Error',
        'Failed to upload CV. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadedCV = () => {
    setUploadedCV(null);
    setCvContent('');
    setCvData(null);
    setTargetLanguage('');
    addBotMessage('CV has been cleared. You can upload a new CV document to get started.');
  };

  const handleQuickTranslate = (language: string) => {
    if (!cvContent && !cvData) {
      addBotMessage(`I see you want to translate to ${language}, but I don't have your CV content yet!\n\n📝 **Please paste your CV text in the chat below** (just copy and paste your CV content), and then I'll translate it to ${language} immediately!`);
      return;
    }
    
    setIsTranslating(true);
    
    // Simulate translation processing
    setTimeout(() => {
      const translatedCV = generateTranslatedCV(language);
      const languageNames = {
        swahili: 'Swahili (Kiswahili)',
        french: 'French (Français)',
        spanish: 'Spanish (Español)',
        german: 'German (Deutsch)',
        chinese: 'Chinese (中文)',
        arabic: 'Arabic (العربية)'
      };
      
      addBotMessage(`Perfect! I've translated your CV to ${languageNames[language as keyof typeof languageNames]}.\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
      setTargetLanguage(languageNames[language as keyof typeof languageNames]);
      setIsTranslating(false);
    }, 1500);
  };

  // Parse CV content and extract structured data
  const parseCVContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    const cvData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: [] as string[],
      education: [] as string[],
      skills: [] as string[]
    };

    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lowerLine = line.toLowerCase();
      
      // Detect sections
      if (lowerLine.includes('experience') || lowerLine.includes('work') || lowerLine.includes('employment')) {
        currentSection = 'experience';
        continue;
      } else if (lowerLine.includes('education') || lowerLine.includes('academic') || lowerLine.includes('qualification')) {
        currentSection = 'education';
        continue;
      } else if (lowerLine.includes('skill') || lowerLine.includes('expertise') || lowerLine.includes('competency')) {
        currentSection = 'skills';
        continue;
      } else if (lowerLine.includes('summary') || lowerLine.includes('profile') || lowerLine.includes('objective')) {
        currentSection = 'summary';
        continue;
      }
      
      // Extract personal info
      if (line.includes('@') && line.includes('.')) {
        cvData.personalInfo.email = line;
      } else if (line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
        cvData.personalInfo.phone = line;
      } else if (line.length > 3 && line.length < 50 && !cvData.personalInfo.name && !line.includes('@') && !line.match(/\d/)) {
        cvData.personalInfo.name = line;
      }
      
      // Extract content based on current section
      if (currentSection === 'experience' && line.length > 10) {
        cvData.experience.push(line);
      } else if (currentSection === 'education' && line.length > 10) {
        cvData.education.push(line);
      } else if (currentSection === 'skills' && line.length > 2) {
        const skillItems = line.split(/[,;]/).map(skill => skill.trim()).filter(skill => skill.length > 0);
        cvData.skills.push(...skillItems);
      } else if (currentSection === 'summary' && line.length > 10) {
        cvData.personalInfo.summary = line;
      }
    }
    
    return cvData;
  };

  // Generate translated CV based on actual content
  const generateTranslatedCV = (language: string) => {
    if (!cvData && !cvContent) {
      return "No CV content available to translate.";
    }

    const translations = {
      swahili: {
        title: "📄 **CV YA KAZI**",
        personalInfo: "**Maelezo Binafsi:**",
        name: "Jina:",
        email: "Barua pepe:",
        phone: "Simu:",
        location: "Mahali:",
        summary: "**Muhtasari wa Kitaalamu:**",
        experience: "**Uzoefu wa Kazi:**",
        education: "**Elimu:**",
        skills: "**Ujuzi:**"
      },
      french: {
        title: "📄 **CV PROFESSIONNEL**",
        personalInfo: "**Informations Personnelles:**",
        name: "Nom:",
        email: "Email:",
        phone: "Téléphone:",
        location: "Localisation:",
        summary: "**Résumé Professionnel:**",
        experience: "**Expérience Professionnelle:**",
        education: "**Formation:**",
        skills: "**Compétences:**"
      },
      spanish: {
        title: "📄 **CURRÍCULUM VITAE**",
        personalInfo: "**Información Personal:**",
        name: "Nombre:",
        email: "Correo:",
        phone: "Teléfono:",
        location: "Ubicación:",
        summary: "**Resumen Profesional:**",
        experience: "**Experiencia Laboral:**",
        education: "**Educación:**",
        skills: "**Habilidades:**"
      },
      german: {
        title: "📄 **LEBENSLAUF**",
        personalInfo: "**Persönliche Informationen:**",
        name: "Name:",
        email: "E-Mail:",
        phone: "Telefon:",
        location: "Standort:",
        summary: "**Berufliche Zusammenfassung:**",
        experience: "**Berufserfahrung:**",
        education: "**Ausbildung:**",
        skills: "**Fähigkeiten:**"
      },
      chinese: {
        title: "📄 **简历**",
        personalInfo: "**个人信息:**",
        name: "姓名:",
        email: "邮箱:",
        phone: "电话:",
        location: "地点:",
        summary: "**职业概述:**",
        experience: "**工作经验:**",
        education: "**教育背景:**",
        skills: "**技能:**"
      },
      arabic: {
        title: "📄 **السيرة الذاتية**",
        personalInfo: "**المعلومات الشخصية:**",
        name: "الاسم:",
        email: "البريد الإلكتروني:",
        phone: "الهاتف:",
        location: "الموقع:",
        summary: "**الملخص المهني:**",
        experience: "**الخبرة العملية:**",
        education: "**التعليم:**",
        skills: "**المهارات:**"
      }
    };

    const t = translations[language as keyof typeof translations];
    
    let translatedCV = `${t.title}\n\n`;
    
    // Personal Information
    if (cvData?.personalInfo) {
      translatedCV += `${t.personalInfo}\n`;
      if (cvData.personalInfo.name) translatedCV += `${t.name} ${cvData.personalInfo.name}\n`;
      if (cvData.personalInfo.email) translatedCV += `${t.email} ${cvData.personalInfo.email}\n`;
      if (cvData.personalInfo.phone) translatedCV += `${t.phone} ${cvData.personalInfo.phone}\n`;
      if (cvData.personalInfo.location) translatedCV += `${t.location} ${cvData.personalInfo.location}\n`;
      translatedCV += '\n';
    }
    
    // Summary
    if (cvData?.personalInfo?.summary) {
      translatedCV += `${t.summary}\n${cvData.personalInfo.summary}\n\n`;
    }
    
    // Experience
    if (cvData?.experience && cvData.experience.length > 0) {
      translatedCV += `${t.experience}\n`;
      cvData.experience.forEach((exp: string, index: number) => {
        translatedCV += `${index + 1}. ${exp}\n`;
      });
      translatedCV += '\n';
    }
    
    // Education
    if (cvData?.education && cvData.education.length > 0) {
      translatedCV += `${t.education}\n`;
      cvData.education.forEach((edu: string, index: number) => {
        translatedCV += `${index + 1}. ${edu}\n`;
      });
      translatedCV += '\n';
    }
    
    // Skills
    if (cvData?.skills && cvData.skills.length > 0) {
      translatedCV += `${t.skills}\n`;
      cvData.skills.forEach((skill: string, index: number) => {
        translatedCV += `• ${skill}\n`;
      });
    }
    
    return translatedCV;
  };

  const addBotMessage = (message: string) => {
    const botMessage: TranslationMessage = {
      id: Date.now(),
      type: 'bot',
      message,
      timestamp: new Date()
    };
    setTranslationMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (message: string) => {
    const userMessage: TranslationMessage = {
      id: Date.now(),
      type: 'user',
      message,
      timestamp: new Date()
    };
    setTranslationMessages(prev => [...prev, userMessage]);
  };

  const handleTranslationRequest = async (message: string) => {
    if (!message.trim()) return;
    
    addUserMessage(message);
    setTranslationInput('');
    setIsTranslating(true);
    
          // Check if this is CV content being pasted
      if (message.length > 100 && !cvContent && !cvData) {
        // User is pasting CV content
        setCvContent(message);
        const parsedData = parseCVContent(message);
        setCvData(parsedData);
        
        addBotMessage(`Great! I've received your CV content and analyzed it.\n\n📄 **CV Content Detected:**\n• Name: ${parsedData.personalInfo.name || 'Not detected'}\n• Email: ${parsedData.personalInfo.email || 'Not detected'}\n• Phone: ${parsedData.personalInfo.phone || 'Not detected'}\n• Experience: ${parsedData.experience.length} entries\n• Education: ${parsedData.education.length} entries\n• Skills: ${parsedData.skills.length} items\n\n🌍 **Now, which language would you like me to translate it to?**\n\nAvailable languages:\n• Swahili (Kiswahili)\n• French (Français)\n• Spanish (Español)\n• German (Deutsch)\n• Chinese (中文)\n• Arabic (العربية)\n\nJust tell me the language and I'll start translating!`);
        setIsTranslating(false);
        return;
      }
      
      // Check if user is requesting translation without CV content
      if ((!cvContent && !cvData) && (
        message.toLowerCase().includes('swahili') || 
        message.toLowerCase().includes('french') || 
        message.toLowerCase().includes('spanish') || 
        message.toLowerCase().includes('german') || 
        message.toLowerCase().includes('chinese') || 
        message.toLowerCase().includes('arabic')
      )) {
        addBotMessage(`I see you want to translate to ${message}, but I don't have your CV content yet!\n\n📝 **Please do one of these:**\n\n1. **Paste your CV text** in the chat (just copy and paste your CV)\n2. **Or upload a text file** (.txt) that I can read automatically\n\nOnce you provide the CV content, I'll translate it to ${message} immediately!`);
        setIsTranslating(false);
        return;
      }
      
      // Check if CV content is available for translation
      if (!cvContent && !cvData) {
        addBotMessage(`I don't see any CV content to translate yet. Please:\n\n1. **Upload a CV file** using the upload button above, OR\n2. **Paste your CV text** in the chat below (just paste it and I'll detect it automatically)\n\nOnce I have your CV content, I can translate it to any language you want!`);
        setIsTranslating(false);
        return;
      }
    
    // Simulate translation processing
    setTimeout(() => {
      if (message.toLowerCase().includes('swahili') || message.toLowerCase().includes('kiswahili')) {
        const translatedCV = generateTranslatedCV('swahili');
        addBotMessage(`Perfect! I've translated your CV to Swahili (Kiswahili).\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
        setTargetLanguage('Swahili');
      } else if (message.toLowerCase().includes('french') || message.toLowerCase().includes('français')) {
        const translatedCV = generateTranslatedCV('french');
        addBotMessage(`Excellent! I've translated your CV to French (Français).\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
        setTargetLanguage('French');
      } else if (message.toLowerCase().includes('spanish') || message.toLowerCase().includes('español')) {
        const translatedCV = generateTranslatedCV('spanish');
        addBotMessage(`¡Perfecto! I've translated your CV to Spanish (Español).\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
        setTargetLanguage('Spanish');
      } else if (message.toLowerCase().includes('german') || message.toLowerCase().includes('deutsch')) {
        const translatedCV = generateTranslatedCV('german');
        addBotMessage(`Ausgezeichnet! I've translated your CV to German (Deutsch).\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
        setTargetLanguage('German');
      } else if (message.toLowerCase().includes('chinese') || message.toLowerCase().includes('中文')) {
        const translatedCV = generateTranslatedCV('chinese');
        addBotMessage(`太好了！I've translated your CV to Chinese (中文).\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
        setTargetLanguage('Chinese');
      } else if (message.toLowerCase().includes('arabic') || message.toLowerCase().includes('العربية')) {
        const translatedCV = generateTranslatedCV('arabic');
        addBotMessage(`ممتاز! I've translated your CV to Arabic (العربية).\n\nHere's your translated CV:\n\n${translatedCV}\n\nWould you like me to translate it to another language or help you with anything else?`);
        setTargetLanguage('Arabic');
      } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('what can you do')) {
        addBotMessage(`I'm here to help you translate your CV! Here's what I can do:\n\n🌍 **Language Support:**\n• Swahili (Kiswahili)\n• French (Français)\n• Spanish (Español)\n• German (Deutsch)\n• Chinese (中文)\n• Arabic (العربية)\n\n📄 **How it works:**\n1. Upload your CV document OR paste CV text\n2. Tell me your target language\n3. I'll provide the translated version\n4. You can download or copy the translation\n\n💡 **Tips:**\n• Make sure your CV is clear and well-formatted\n• Specify the language you want\n• I can also help with language-specific CV formatting\n\nWhat would you like me to help you with?`);
      } else if (message.toLowerCase().includes('show cv') || message.toLowerCase().includes('view cv') || message.toLowerCase().includes('current cv')) {
        if (cvData) {
          let cvDisplay = "📄 **Your Current CV Content:**\n\n";
          cvDisplay += `**Personal Information:**\n`;
          if (cvData.personalInfo.name) cvDisplay += `Name: ${cvData.personalInfo.name}\n`;
          if (cvData.personalInfo.email) cvDisplay += `Email: ${cvData.personalInfo.email}\n`;
          if (cvData.personalInfo.phone) cvDisplay += `Phone: ${cvData.personalInfo.phone}\n`;
          if (cvData.personalInfo.location) cvDisplay += `Location: ${cvData.personalInfo.location}\n`;
          if (cvData.personalInfo.summary) cvDisplay += `Summary: ${cvData.personalInfo.summary}\n`;
          
          if (cvData.experience.length > 0) {
            cvDisplay += `\n**Experience:**\n`;
            cvData.experience.forEach((exp: string, index: number) => {
              cvDisplay += `${index + 1}. ${exp}\n`;
            });
          }
          
          if (cvData.education.length > 0) {
            cvDisplay += `\n**Education:**\n`;
            cvData.education.forEach((edu: string, index: number) => {
              cvDisplay += `${index + 1}. ${edu}\n`;
            });
          }
          
          if (cvData.skills.length > 0) {
            cvDisplay += `\n**Skills:**\n`;
            cvData.skills.forEach((skill: string) => {
              cvDisplay += `• ${skill}\n`;
            });
          }
          
          addBotMessage(cvDisplay);
        } else {
          addBotMessage("No CV content available yet. Please upload a CV file or paste CV text in the chat.");
        }
      } else if (message.toLowerCase().includes('download') || message.toLowerCase().includes('save')) {
        addBotMessage(`Great! I can help you with that. Here are your options:\n\n📥 **Download Options:**\n• Copy the translated text to your clipboard\n• Save as a new document\n• Export in different formats (PDF, Word)\n\n🔧 **Next Steps:**\n1. Copy the translated CV text above\n2. Paste it into your preferred document editor\n3. Format it according to your needs\n4. Save it with a new filename\n\nWould you like me to translate your CV to another language, or do you need help with anything else?`);
      } else {
        addBotMessage(`I understand you're asking about "${message}". Let me help you with CV translation!\n\nTo get started:\n1. **Upload your CV** using the upload button above\n2. **Choose your target language** (Swahili, French, Spanish, German, Chinese, Arabic)\n3. **I'll translate it** and provide you with the result\n\nWhat language would you like me to translate your CV to?`);
      }
      setIsTranslating(false);
    }, 2000);
  };

  const quickStats = [
    { label: "Job Matches", value: jobMatches.length.toString(), icon: Briefcase, color: "#00C65A" },
    { label: "Profile Views", value: "45", icon: User, color: "#4A90E2" },
    { label: "Applications", value: applications.length.toString(), icon: FileText, color: "#FF6B35" },
  ];

  const tabs = [
    { id: 'home' as TabType, title: 'Home', icon: Home },
    { id: 'profile' as TabType, title: 'Profile', icon: User },
    { id: 'jobs' as TabType, title: 'Jobs', icon: Briefcase },
    { id: 'domain' as TabType, title: 'Domain', icon: Globe },
    { id: 'cv-services' as TabType, title: 'CV', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'profile':
        return renderProfileTab();
      case 'jobs':
        return renderJobsTab();
      case 'domain':
        return renderDomainTab();
      case 'applications':
        return renderApplicationsTab();
      case 'cv-services':
        return renderCVServicesTab();
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

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => setActiveTab('profile')}
          >
            <View style={styles.quickActionIcon}>
              <User color="#00C65A" size={20} />
            </View>
            <Text style={styles.quickActionText}>Update Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => setActiveTab('applications')}
          >
            <View style={styles.quickActionIcon}>
              <CheckCircle color="#00C65A" size={20} />
            </View>
            <Text style={styles.quickActionText}>Track Applications</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Job Matches */}
      <View style={styles.jobMatchesCard}>
        <Text style={styles.jobMatchesTitle}>Recent Job Matches</Text>
        {jobMatches.length > 0 ? (
          <>
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
          </>
        ) : (
          <View style={styles.emptyState}>
            <Briefcase color="rgba(255, 255, 255, 0.5)" size={32} />
            <Text style={styles.emptyStateText}>No job matches yet</Text>
            <Text style={styles.emptyStateSubtext}>Complete your profile to get personalized job recommendations</Text>
          </View>
        )}
      </View>

      {/* Notifications Section */}
      <View style={styles.notificationsCard}>
        <Text style={styles.notificationsTitle}>Recent Notifications</Text>
        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <Bell color="#00C65A" size={16} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>Your profile was viewed by 3 employers this week</Text>
            <Text style={styles.notificationTime}>2 hours ago</Text>
          </View>
        </View>
        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <CheckCircle color="#4A90E2" size={16} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>New CV template available: Tech Professional</Text>
            <Text style={styles.notificationTime}>1 day ago</Text>
          </View>
        </View>
        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <Award color="#FF6B35" size={16} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>Certificate verification completed: AWS Cloud Practitioner</Text>
            <Text style={styles.notificationTime}>3 days ago</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.viewAllNotificationsButton}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={styles.viewAllNotificationsText}>View All Notifications</Text>
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
      
      {/* AI-Powered Matching Section */}
      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>🤖 Smart Job Matching</Text>
        <Text style={styles.aiDescription}>
          Our AI analyzes your skills and preferences to find the best opportunities.
        </Text>
        <View style={styles.aiFeatures}>
          <Text style={styles.aiFeature}>• Real-time job scanning</Text>
          <Text style={styles.aiFeature}>• Skill-based matching</Text>
          <Text style={styles.aiFeature}>• Auto-apply options</Text>
          <Text style={styles.aiFeature}>• Email & push notifications</Text>
        </View>
        <TouchableOpacity style={styles.aiButton}>
          <Text style={styles.aiButtonText}>Enable Auto-Matching</Text>
        </TouchableOpacity>
      </View>

      {/* Job Listings */}
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

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Profile & Portfolio</Text>
      <Text style={styles.tabSubtitle}>Manage your professional identity</Text>
      
      {/* Personal Info Section */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Full Name:</Text>
            <Text style={styles.profileValue}>{profile?.fullName || "Not set"}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Email:</Text>
            <Text style={styles.profileValue}>{profile?.email || "Not set"}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Phone:</Text>
            <Text style={styles.profileValue}>{profile?.phone || "Not set"}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Location:</Text>
            <Text style={styles.profileValue}>{profile?.location || "Not set"}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Skills Section */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Skills & Expertise</Text>
        <View style={styles.skillsContainer}>
          {profile?.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addSkillButton}>
            <Text style={styles.addSkillText}>+ Add Skill</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Portfolio Section */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Portfolio & Projects</Text>
        {profile?.portfolio.map((item) => (
          <View key={item.id} style={styles.portfolioItem}>
            <View style={styles.portfolioHeader}>
              <Text style={styles.portfolioTitle}>{item.title}</Text>
              <View style={[styles.portfolioType, { backgroundColor: item.type === 'certificate' ? '#00C65A' : '#4A90E2' }]}>
                <Text style={styles.portfolioTypeText}>{item.type.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.portfolioDescription}>{item.description}</Text>
            <Text style={styles.portfolioDate}>{item.date}</Text>
            {item.url && (
              <TouchableOpacity style={styles.portfolioLink}>
                <Text style={styles.portfolioLinkText}>View {item.type}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={styles.addPortfolioButton}>
          <Text style={styles.addPortfolioText}>+ Add Portfolio Item</Text>
        </TouchableOpacity>
      </View>

      {/* Credential Verification */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Credential Verification</Text>
        <View style={styles.verificationCard}>
          <View style={styles.verificationItem}>
            <Text style={styles.verificationTitle}>✅ National ID Verified</Text>
            <Text style={styles.verificationDesc}>Government-verified identity</Text>
          </View>
          <View style={styles.verificationItem}>
            <Text style={styles.verificationTitle}>🎓 Education Verified</Text>
            <Text style={styles.verificationDesc}>University of Nairobi - BSc Computer Science</Text>
          </View>
          <View style={styles.verificationItem}>
            <Text style={styles.verificationTitle}>📜 Certificates Verified</Text>
            <Text style={styles.verificationDesc}>AWS Cloud Practitioner, React Native</Text>
          </View>
        </View>
      </View>

      {/* Sign Out Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color="#FF6B6B" size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCVServicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>CV & Document Services</Text>
      <Text style={styles.tabSubtitle}>Professional CV tools and templates</Text>
      
      {/* CV Translation Chatbot */}
      <View style={styles.serviceCard}>
        <Text style={styles.serviceTitle}>🌍 AI CV Translation Assistant</Text>
        <Text style={styles.serviceDescription}>
          Get your CV translated to multiple languages with our AI-powered translation chatbot.
        </Text>
        <View style={styles.serviceFeatures}>
          <Text style={styles.serviceFeature}>• Upload your CV document</Text>
          <Text style={styles.serviceFeature}>• AI-powered translation to 6+ languages</Text>
          <Text style={styles.serviceFeature}>• Interactive chat interface</Text>
          <Text style={styles.serviceFeature}>• Download translated versions</Text>
        </View>
        <TouchableOpacity 
          style={styles.serviceButton}
          onPress={() => setShowTranslationChat(true)}
        >
          <Bot color="#FFFFFF" size={20} />
          <Text style={styles.serviceButtonText}>Start Translation Chat</Text>
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

  const renderTranslationChat = () => (
    <Modal
      visible={showTranslationChat}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.translationChatContainer}>
        <LinearGradient
          colors={["#8B1538", "#A91B47", "#C41E3A"]}
          style={styles.translationChatGradient}
        >
          {/* Header */}
          <View style={styles.translationChatHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowTranslationChat(false)}
            >
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.translationChatTitle}>CV Translation Assistant</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* CV Upload Section */}
          <View style={styles.cvUploadSection}>
            <Text style={styles.cvUploadTitle}>📄 Upload Your CV</Text>
            <Text style={styles.cvUploadDescription}>
              Upload your CV document to get started with translation
            </Text>
            <Text style={styles.cvUploadFormats}>
              Supported formats: PDF, Word (.doc/.docx), Text (.txt), RTF
            </Text>
            <Text style={styles.cvUploadSizeLimit}>
              Maximum file size: 10MB
            </Text>
            <Text style={styles.cvUploadInstructions}>
              💡 **Tip:** You can also paste your CV text directly in the chat below!
            </Text>
            <Text style={styles.cvUploadInstructions}>
              📋 **How to use:** 1) Upload CV file OR paste CV text → 2) Say "translate to [language]"
            </Text>
            
            {/* Upload Button */}
            <TouchableOpacity 
              style={[styles.uploadCVButton, isUploading && styles.uploadCVButtonDisabled]}
              onPress={handleUploadCV}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <FileUp color="#FFFFFF" size={24} />
              )}
              <Text style={styles.uploadCVButtonText}>
                {isUploading ? 'Uploading...' : '📄 Click to Upload CV'}
              </Text>
            </TouchableOpacity>
            
            {/* CV Status Display */}
            {uploadedCV && (
              <View style={styles.uploadedCVInfo}>
                <FileText color="#00C65A" size={20} />
                <Text style={styles.uploadedCVText}>{uploadedCV}</Text>
                <View style={styles.cvActionButtons}>
                  <TouchableOpacity 
                    style={styles.changeCVButton}
                    onPress={handleUploadCV}
                  >
                    <Text style={styles.changeCVButtonText}>Change CV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.clearCVButton}
                    onPress={clearUploadedCV}
                  >
                    <Text style={styles.clearCVButtonText}>Clear CV</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Chat Messages */}
          <ScrollView 
            style={styles.translationChatMessages}
            showsVerticalScrollIndicator={false}
            ref={(ref) => {
              if (ref) {
                setTimeout(() => ref.scrollToEnd({ animated: true }), 100);
              }
            }}
          >
            {translationMessages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.translationMessageContainer,
                  msg.type === 'user' ? styles.translationUserMessage : styles.translationBotMessage
                ]}
              >
                <View style={[
                  styles.translationMessageBubble,
                  msg.type === 'user' ? styles.translationUserBubble : styles.translationBotBubble
                ]}>
                  <Text style={[
                    styles.translationMessageText,
                    msg.type === 'user' ? styles.translationUserMessageText : styles.translationBotMessageText
                  ]}>
                    {msg.message}
                  </Text>
                  <Text style={styles.translationMessageTime}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
            
            {isTranslating && (
              <View style={styles.translationMessageContainer}>
                <View style={[styles.translationMessageBubble, styles.translationBotBubble]}>
                  <View style={styles.translatingIndicator}>
                    <ActivityIndicator color="#00C65A" size="small" />
                    <Text style={styles.translatingText}>Translating your CV...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          
          {/* Chat Input */}
          <View style={styles.translationChatInputContainer}>
            <TextInput
              style={styles.translationChatInput}
              value={translationInput}
              onChangeText={setTranslationInput}
              placeholder="Paste your CV text here, or say 'translate to Swahili'..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.translationSendButton, !translationInput.trim() && styles.translationSendButtonDisabled]}
              onPress={() => handleTranslationRequest(translationInput)}
              disabled={!translationInput.trim() || isTranslating}
            >
              <MessageCircle color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
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
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.userName}>{profile?.fullName || user?.profile?.fullName || "User"}</Text>
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
      
      {/* CV Translation Chat Modal */}
      {renderTranslationChat()}
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
  // Profile Tab Styles
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  profileLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  profileValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addSkillButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
  },
  addSkillText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  portfolioItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  portfolioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  portfolioType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  portfolioTypeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  portfolioDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  portfolioDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  portfolioLink: {
    alignSelf: "flex-start",
  },
  portfolioLinkText: {
    color: "#00C65A",
    fontSize: 12,
    fontWeight: "500",
  },
  addPortfolioButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
  },
  addPortfolioText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  verificationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  verificationItem: {
    marginBottom: 16,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  verificationDesc: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  // CV Services Styles
  serviceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceFeatures: {
    marginBottom: 16,
  },
  serviceFeature: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  serviceButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  serviceButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  languageOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  templateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  templateItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: "45%",
  },
  templateName: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  
  aiCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  aiFeatures: {
    marginBottom: 16,
  },
  aiFeature: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  aiButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  aiButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
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
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  // Notifications Styles for Home Tab
  notificationsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  viewAllNotificationsButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllNotificationsText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  // CV Translation Chat Modal Styles
  translationChatContainer: {
    flex: 1,
  },
  translationChatGradient: {
    flex: 1,
  },
  translationChatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  translationChatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  cvUploadSection: {
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  cvUploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cvUploadDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    textAlign: "center",
  },
  cvUploadFormats: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  cvUploadSizeLimit: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 8,
    textAlign: "center",
  },
  cvUploadInstructions: {
    fontSize: 12,
    color: "#00C65A",
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  uploadedCVInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 16,
  },
  uploadedCVText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  changeCVButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  changeCVButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  uploadCVButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  uploadCVButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  uploadCVButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  translationChatMessages: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  translationMessageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  translationUserMessage: {
    justifyContent: "flex-end",
  },
  translationBotMessage: {
    justifyContent: "flex-start",
  },
  translationMessageBubble: {
    maxWidth: "80%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  translationUserBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  translationBotBubble: {
    backgroundColor: "rgba(0, 198, 90, 0.2)",
  },
  translationMessageText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  translationUserMessageText: {
    textAlign: "right",
  },
  translationBotMessageText: {
    textAlign: "left",
  },
  translationMessageTime: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  translatingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  translatingText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  translationChatInputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  translationChatInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 14,
    minHeight: 40,
    maxHeight: 100,
  },
  translationSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 198, 90, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  translationSendButtonDisabled: {
    backgroundColor: "rgba(0, 198, 90, 0.4)",
  },
  // CV Upload Action Styles
  cvActionButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  clearCVButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  clearCVButtonText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
  },
  // Quick Translate Styles
  quickTranslateSection: {
    marginTop: 16,
    width: "100%",
  },
  quickTranslateTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  languageButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  languageButton: {
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 198, 90, 0.4)",
  },
  languageButtonText: {
    color: "#00C65A",
    fontSize: 12,
    fontWeight: "600",
  },
>>>>>>> 535aff7 (WIP: youth dashboard changes)
});