import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
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
  Globe,
  Bell,
  Home,
  LogOut,
  Award,
  DollarSign,
  GraduationCap,
  Building,
  PieChart,
  Target,
  Eye,
  Clock,
  Mail,
  Brain,
  Zap,
  Edit3,
  ExternalLink,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";

type TabType = 'home' | 'certificates' | 'employment' | 'analytics' | 'domain' | 'notifications' | 'settings';

export default function GovernmentDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmploymentLoading, setIsEmploymentLoading] = useState(false);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [isCertificatesLoading, setIsCertificatesLoading] = useState(false);
  const [employmentData, setEmploymentData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [certificatesData, setCertificatesData] = useState<any>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [domainName, setDomainName] = useState(user?.profile?.ministry?.toLowerCase().replace(/\s+/g, '') || "ministry");
  const [isDomainPublished, setIsDomainPublished] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [portfolioContent, setPortfolioContent] = useState({
    title: "Government Services Portal",
    description: "Official government services and citizen engagement platform",
    services: ["Certificate Verification", "Employment Tracking", "Youth Programs", "Public Announcements"],
    contact: "info@ministry.ke"
  });
  
  const handleSignOut = async () => {
    await logout();
    router.replace("/");
  };
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // AI-powered Employment data loading
  const loadEmploymentData = async () => {
    setIsEmploymentLoading(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock AI-generated employment insights
    const aiEmploymentData = {
      insights: [
        "AI Analysis: Technology sector shows 15% growth potential",
        "Machine Learning predicts 2,500 new jobs in Q2",
        "Skills gap analysis reveals high demand for AI/ML professionals",
        "Geographic optimization suggests Nairobi and Mombasa as hotspots"
      ],
      predictions: [
        { metric: "Q2 Employment Growth", value: "+12.5%", confidence: "95%" },
        { metric: "Skills Demand", value: "AI/ML +45%", confidence: "92%" },
        { metric: "Salary Trends", value: "+8.3%", confidence: "88%" }
      ]
    };
    
    setEmploymentData(aiEmploymentData);
    setIsEmploymentLoading(false);
  };

  // AI-powered Analytics data loading
  const loadAnalyticsData = async () => {
    setIsAnalyticsLoading(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock AI-generated analytics insights
    const aiAnalyticsData = {
      patterns: [
        "AI detected 23% increase in remote work preferences",
        "Machine learning identified 5 emerging skill trends",
        "Predictive analysis shows 18% growth in tech sector",
        "AI correlation analysis reveals education-employment patterns"
      ],
      recommendations: [
        "Focus on digital skills training programs",
        "Increase investment in tech infrastructure",
        "Develop remote work policies and support",
        "Strengthen partnerships with tech companies"
      ]
    };
    
    setAnalyticsData(aiAnalyticsData);
    setIsAnalyticsLoading(false);
  };

  // AI-powered Certificates data loading
  const loadCertificatesData = async () => {
    setIsCertificatesLoading(true);
    
    // Simulate loading certificates one by one
    const allCertificates = [
      {
        id: 1,
        institution: "University of Nairobi",
        certificateType: "Bachelor of Computer Science",
        studentName: "John Doe",
        status: "pending",
        submittedAt: "2024-01-15",
        priority: "high"
      },
      {
        id: 2,
        institution: "Jomo Kenyatta University",
        certificateType: "Master of Business Administration",
        studentName: "Jane Smith",
        status: "pending",
        submittedAt: "2024-01-14",
        priority: "medium"
      },
      {
        id: 3,
        institution: "Technical University of Kenya",
        certificateType: "Diploma in Engineering",
        studentName: "Mike Johnson",
        status: "pending",
        submittedAt: "2024-01-13",
        priority: "low"
      },
      {
        id: 4,
        institution: "Kenyatta University",
        certificateType: "Bachelor of Education",
        studentName: "Sarah Wilson",
        status: "approved",
        approvedAt: "2024-01-10",
        approvedBy: "Human Review",
        approvalReason: "All verification checks passed successfully"
      },
      {
        id: 5,
        institution: "Moi University",
        certificateType: "Bachelor of Commerce",
        studentName: "David Brown",
        status: "rejected",
        rejectedAt: "2024-01-08",
        rejectedBy: "Human Review",
        rejectionReason: "Document authenticity could not be verified"
      }
    ];
    
    // Load certificates one by one with animation
    const loadedCertificates = [];
    for (let i = 0; i < allCertificates.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay between each
      loadedCertificates.push(allCertificates[i]);
      setCertificatesData({
        pending: loadedCertificates.filter(c => c.status === 'pending'),
        approved: loadedCertificates.filter(c => c.status === 'approved'),
        rejected: loadedCertificates.filter(c => c.status === 'rejected')
      });
    }
    
    setIsCertificatesLoading(false);
  };

  // Handle certificate approval
  const handleCertificateApproval = (certificateId: number) => {
    if (!approvalReason.trim()) {
      Alert.alert("Error", "Please provide a reason for approval");
      return;
    }
    
    // Update certificate status
    if (certificatesData) {
      const updatedData = { ...certificatesData };
      const certificate = updatedData.pending.find((c: any) => c.id === certificateId);
      if (certificate) {
        certificate.status = "approved";
        certificate.approvedAt = new Date().toISOString().split('T')[0];
        certificate.approvedBy = "AI System + Human Review";
        certificate.approvalReason = approvalReason;
        
        // Move to approved array
        updatedData.approved.push(certificate);
        updatedData.pending = updatedData.pending.filter((c: any) => c.id !== certificateId);
        
        setCertificatesData(updatedData);
        setApprovalReason("");
        setShowApprovalModal(false);
        Alert.alert("Success", "Certificate approved successfully!");
      }
    }
  };

  // Handle certificate rejection
  const handleCertificateRejection = (certificateId: number) => {
    if (!rejectionReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }
    
    // Update certificate status
    if (certificatesData) {
      const updatedData = { ...certificatesData };
      const certificate = updatedData.pending.find((c: any) => c.id === certificateId);
      if (certificate) {
        certificate.status = "rejected";
        certificate.rejectedAt = new Date().toISOString().split('T')[0];
        certificate.rejectedBy = "AI System + Human Review";
        certificate.rejectionReason = rejectionReason;
        
        // Move to rejected array
        updatedData.rejected.push(certificate);
        updatedData.pending = updatedData.pending.filter((c: any) => c.id !== certificateId);
        
        setCertificatesData(updatedData);
        setRejectionReason("");
        setShowRejectionModal(false);
        Alert.alert("Success", "Certificate rejected successfully!");
      }
    }
  };

  // Publish domain - show payment modal
  const handlePublishDomain = () => {
    if (!domainName.trim()) {
      Alert.alert("Error", "Please enter a domain name");
      return;
    }
    setShowPublishModal(true);
  };

  // Confirm domain publication
  const confirmDomainPublication = () => {
    setIsDomainPublished(true);
    setShowPublishModal(false);
    Alert.alert("Success", "Domain payment completed! Your domain will be active shortly.");
  };

  // Save portfolio changes
  const savePortfolioChanges = () => {
    setShowEditModal(false);
    Alert.alert("Success", "Portfolio updated successfully!");
  };

  // Navigate to different sections from alerts
  const navigateToSection = (section: TabType) => {
    setActiveTab(section);
  };

  // Mock data for government dashboard
  const quickStats = [
    { label: "Total Youth", value: "45.2K", icon: Users, color: "#CE1126" },
    { label: "Employed Youth", value: "28.7K", icon: CheckCircle, color: "#006600" },
    { label: "Pending Certificates", value: "156", icon: AlertTriangle, color: "#FF6B35" },
    { label: "Funds Disbursed", value: "KSH 2.1B", icon: DollarSign, color: "#4A90E2" },
  ];

  const tabs = [
    { id: 'home' as TabType, title: 'Home', icon: Home },
    { id: 'certificates' as TabType, title: 'Certificates', icon: GraduationCap },
    { id: 'employment' as TabType, title: 'Employment', icon: Building },
    { id: 'analytics' as TabType, title: 'Analytics', icon: BarChart3 },
    { id: 'profile' as TabType, title: 'Profile', icon: Globe },
    { id: 'notifications' as TabType, title: 'Alerts', icon: Bell },
    { id: 'settings' as TabType, title: 'Settings', icon: Settings },
  ];

  const certificateNotifications = [
    {
      id: 1,
      institution: "University of Nairobi",
      certificateType: "Bachelor of Computer Science",
      studentName: "John Doe",
      status: "pending",
      submittedAt: "2024-01-15",
      priority: "high"
    },
    {
      id: 2,
      institution: "Jomo Kenyatta University",
      certificateType: "Master of Business Administration",
      studentName: "Jane Smith",
      status: "pending",
      submittedAt: "2024-01-14",
      priority: "medium"
    },
    {
      id: 3,
      institution: "Technical University of Kenya",
      certificateType: "Diploma in Engineering",
      studentName: "Mike Johnson",
      status: "approved",
      submittedAt: "2024-01-13",
      priority: "low"
    }
  ];

  const employmentMetrics = [
    { sector: "Technology", employed: 8500, total: 12000, percentage: 71 },
    { sector: "Healthcare", employed: 6200, total: 8000, percentage: 78 },
    { sector: "Education", employed: 5400, total: 7000, percentage: 77 },
    { sector: "Agriculture", employed: 3200, total: 5000, percentage: 64 },
    { sector: "Manufacturing", employed: 4800, total: 7500, percentage: 64 },
  ];

  const youthEmploymentData = [
    { month: "Jan", employed: 28000, target: 30000 },
    { month: "Feb", employed: 29500, target: 30000 },
    { month: "Mar", employed: 31000, target: 30000 },
    { month: "Apr", employed: 32500, target: 30000 },
    { month: "May", employed: 34000, target: 30000 },
    { month: "Jun", employed: 35500, target: 30000 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'certificates':
        return renderCertificatesTab();
      case 'employment':
        return renderEmploymentTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'profile':
        return renderProfileTab();
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

      {/* System Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>System Status</Text>
        <View style={styles.statusItem}>
          <CheckCircle color="#006600" size={16} />
          <Text style={styles.statusText}>Certificate Verification: Online</Text>
        </View>
        <View style={styles.statusItem}>
          <CheckCircle color="#006600" size={16} />
          <Text style={styles.statusText}>Employment Tracking: Active</Text>
        </View>
        <View style={styles.statusItem}>
          <CheckCircle color="#006600" size={16} />
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
              156 certificate verification requests pending
            </Text>
            <Text style={styles.alertTime}>2 hours ago</Text>
          </View>
        </View>
        <View style={styles.alertItem}>
          <View style={styles.alertIcon}>
            <CheckCircle color="#006600" size={16} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertText}>
              Employment target exceeded for Q1 2024
            </Text>
            <Text style={styles.alertTime}>1 day ago</Text>
          </View>
        </View>
        <View style={styles.alertItem}>
          <View style={styles.alertIcon}>
            <DollarSign color="#4A90E2" size={16} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertText}>
              KSH 500M youth fund disbursed successfully
            </Text>
            <Text style={styles.alertTime}>3 days ago</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('certificates')}>
            <GraduationCap color="#CE1126" size={24} />
            <Text style={styles.quickActionText}>Verify Certificates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('employment')}>
            <Users color="#006600" size={24} />
            <Text style={styles.quickActionText}>Track Employment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('analytics')}>
            <BarChart3 color="#4A90E2" size={24} />
            <Text style={styles.quickActionText}>View Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => setActiveTab('domain')}>
            <Globe color="#FF6B35" size={24} />
            <Text style={styles.quickActionText}>Manage Domain</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderCertificatesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Certificate Verification</Text>
      <Text style={styles.tabSubtitle}>Review and approve university-issued certificates</Text>
      
      {isCertificatesLoading ? (
        <View style={styles.certificatesLoadingContainer}>
          <View style={styles.certificatesLoadingHeader}>
            <FileText color="#00C65A" size={32} />
            <Text style={styles.certificatesLoadingTitle}>Loading Certificates</Text>
          </View>
          <Text style={styles.certificatesLoadingSubtitle}>
            Fetching certificates that need verification...
          </Text>
          <ActivityIndicator size="large" color="#00C65A" style={styles.loadingSpinner} />
          <Text style={styles.certificatesLoadingText}>
            Loading certificates one by one...
          </Text>
        </View>
      ) : certificatesData ? (
        <>
          <View style={styles.certificateStats}>
            <View style={styles.certStatCard}>
              <Text style={styles.certStatNumber}>{certificatesData.pending.length}</Text>
              <Text style={styles.certStatLabel}>Pending</Text>
            </View>
            <View style={styles.certStatCard}>
              <Text style={styles.certStatNumber}>{certificatesData.approved.length}</Text>
              <Text style={styles.certStatLabel}>Approved Today</Text>
            </View>
            <View style={styles.certStatCard}>
              <Text style={styles.certStatNumber}>{certificatesData.rejected.length}</Text>
              <Text style={styles.certStatLabel}>Rejected</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Certificate Requests</Text>
          
          {certificatesData.pending.map((cert: any) => (
            <View key={cert.id} style={styles.certificateCard}>
              <View style={styles.certificateHeader}>
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateInstitution}>{cert.institution}</Text>
                  <Text style={styles.certificateType}>{cert.certificateType}</Text>
                  <Text style={styles.certificateStudent}>{cert.studentName}</Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: cert.status === 'approved' ? '#006600' : '#FF6B35' }
                ]}>
                  <Text style={styles.statusBadgeText}>{cert.status.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.certificateFooter}>
                <Text style={styles.certificateDate}>Submitted: {cert.submittedAt}</Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: cert.priority === 'high' ? '#CE1126' : cert.priority === 'medium' ? '#FF6B35' : '#4A90E2' }
                ]}>
                  <Text style={styles.priorityText}>{cert.priority.toUpperCase()}</Text>
                </View>
              </View>
              

              {cert.status === 'pending' && (
                <View style={styles.certificateActions}>
                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => { setSelectedCertificate(cert); setShowApprovalModal(true); }}>
                    <CheckCircle color="#FFFFFF" size={16} />
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => { setSelectedCertificate(cert); setShowRejectionModal(true); }}>
                    <AlertTriangle color="#FFFFFF" size={16} />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </>
      ) : (
        <TouchableOpacity style={styles.aiStartButton} onPress={loadCertificatesData}>
          <FileText color="#FFFFFF" size={24} />
          <Text style={styles.aiStartButtonText}>Load Certificates</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmploymentTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>AI-Powered Employment Tracking</Text>
      <Text style={styles.tabSubtitle}>Machine Learning insights and predictive analytics</Text>
      
      {/* AI Loading State */}
      {isEmploymentLoading ? (
        <View style={styles.aiLoadingContainer}>
          <View style={styles.aiLoadingHeader}>
            <Brain color="#00C65A" size={32} />
            <Text style={styles.aiLoadingTitle}>AI Analysis in Progress</Text>
          </View>
          <Text style={styles.aiLoadingSubtitle}>
            Our AI is analyzing employment patterns, skills gaps, and market trends...
          </Text>
          <ActivityIndicator size="large" color="#00C65A" style={styles.loadingSpinner} />
          <View style={styles.aiProcessingSteps}>
            <View style={styles.processingStep}>
              <Zap color="#FFD700" size={16} />
              <Text style={styles.processingText}>Processing employment data...</Text>
            </View>
            <View style={styles.processingStep}>
              <Brain color="#FFD700" size={16} />
              <Text style={styles.processingText}>Running ML algorithms...</Text>
            </View>
            <View style={styles.processingStep}>
              <TrendingUp color="#FFD700" size={16} />
              <Text style={styles.processingText}>Generating insights...</Text>
            </View>
          </View>
        </View>
      ) : employmentData ? (
        <>
          {/* AI Insights */}
          <View style={styles.aiInsightsCard}>
            <View style={styles.aiInsightsHeader}>
              <Brain color="#00C65A" size={24} />
              <Text style={styles.aiInsightsTitle}>AI-Generated Insights</Text>
            </View>
            {employmentData.insights.map((insight: string, index: number) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightText}>• {insight}</Text>
              </View>
            ))}
          </View>

          {/* AI Predictions */}
          <View style={styles.aiPredictionsCard}>
            <Text style={styles.aiPredictionsTitle}>AI Predictions</Text>
            <View style={styles.predictionsGrid}>
              {employmentData.predictions.map((prediction: any, index: number) => (
                <View key={index} style={styles.predictionCard}>
                  <Text style={styles.predictionMetric}>{prediction.metric}</Text>
                  <Text style={styles.predictionValue}>{prediction.value}</Text>
                  <Text style={styles.predictionConfidence}>{prediction.confidence} confidence</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Traditional Employment Data */}
          <Text style={styles.sectionTitle}>Employment Overview</Text>
          <View style={styles.employmentOverview}>
            <View style={styles.employmentStat}>
              <Text style={styles.employmentNumber}>28,700</Text>
              <Text style={styles.employmentLabel}>Youth Employed</Text>
            </View>
            <View style={styles.employmentStat}>
              <Text style={styles.employmentNumber}>KSH 2.1B</Text>
              <Text style={styles.employmentLabel}>Funds Disbursed</Text>
            </View>
            <View style={styles.employmentStat}>
              <Text style={styles.employmentNumber}>85%</Text>
              <Text style={styles.employmentLabel}>Success Rate</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Employment by Sector</Text>
          {employmentMetrics.map((metric, index) => (
            <View key={index} style={styles.sectorCard}>
              <View style={styles.sectorHeader}>
                <Text style={styles.sectorName}>{metric.sector}</Text>
                <Text style={styles.sectorPercentage}>{metric.percentage}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${metric.percentage}%` }]} />
              </View>
              <Text style={styles.sectorDetails}>
                {metric.employed.toLocaleString()} / {metric.total.toLocaleString()} employed
              </Text>
            </View>
          ))}
        </>
      ) : (
        <TouchableOpacity style={styles.aiStartButton} onPress={loadEmploymentData}>
          <Brain color="#FFFFFF" size={24} />
          <Text style={styles.aiStartButtonText}>Start AI Analysis</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>AI-Powered Analytics</Text>
      <Text style={styles.tabSubtitle}>Machine Learning insights and predictive trends</Text>
      
      {/* AI Loading State */}
      {isAnalyticsLoading ? (
        <View style={styles.aiLoadingContainer}>
          <View style={styles.aiLoadingHeader}>
            <Brain color="#00C65A" size={32} />
            <Text style={styles.aiLoadingTitle}>AI Analytics Processing</Text>
          </View>
          <Text style={styles.aiLoadingSubtitle}>
            Our AI is analyzing patterns, correlations, and generating insights...
          </Text>
          <ActivityIndicator size="large" color="#00C65A" style={styles.loadingSpinner} />
          <View style={styles.aiProcessingSteps}>
            <View style={styles.processingStep}>
              <BarChart3 color="#FFD700" size={16} />
              <Text style={styles.processingText}>Analyzing data patterns...</Text>
            </View>
            <View style={styles.processingStep}>
              <Brain color="#FFD700" size={16} />
              <Text style={styles.processingText}>Running correlation analysis...</Text>
            </View>
            <View style={styles.processingStep}>
              <TrendingUp color="#FFD700" size={16} />
              <Text style={styles.processingText}>Generating recommendations...</Text>
            </View>
          </View>
        </View>
      ) : analyticsData ? (
        <>
          {/* AI Patterns */}
          <View style={styles.aiPatternsCard}>
            <View style={styles.aiPatternsHeader}>
              <Brain color="#00C65A" size={24} />
              <Text style={styles.aiPatternsTitle}>AI-Detected Patterns</Text>
            </View>
            {analyticsData.patterns.map((pattern: string, index: number) => (
              <View key={index} style={styles.patternItem}>
                <Text style={styles.patternText}>• {pattern}</Text>
              </View>
            ))}
          </View>

          {/* AI Recommendations */}
          <View style={styles.aiRecommendationsCard}>
            <Text style={styles.aiRecommendationsTitle}>AI Recommendations</Text>
            {analyticsData.recommendations.map((recommendation: string, index: number) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>• {recommendation}</Text>
              </View>
            ))}
          </View>

          {/* Traditional Analytics */}
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Employment Rate</Text>
              <Text style={styles.analyticsValue}>63.5%</Text>
              <Text style={styles.analyticsChange}>+5.2% from last month</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Average Salary</Text>
              <Text style={styles.analyticsValue}>KSH 85,000</Text>
              <Text style={styles.analyticsChange}>+12% from last quarter</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Job Retention</Text>
              <Text style={styles.analyticsValue}>78%</Text>
              <Text style={styles.analyticsChange}>+3.1% from last year</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Skills Gap</Text>
              <Text style={styles.analyticsValue}>22%</Text>
              <Text style={styles.analyticsChange}>-8% from last quarter</Text>
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity style={styles.aiStartButton} onPress={loadAnalyticsData}>
          <Brain color="#FFFFFF" size={24} />
          <Text style={styles.aiStartButtonText}>Start AI Analytics</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Profile</Text>
      <Text style={styles.tabSubtitle}>Ministry details and official domain</Text>
      
      <View style={styles.domainInfoCard}>
        <View style={styles.domainInputContainer}>
          <Text style={styles.domainLabel}>Your Domain:</Text>
          <View style={styles.domainInputRow}>
            <TextInput
              style={styles.domainInput}
              value={domainName}
              onChangeText={setDomainName}
              placeholder="Enter domain name"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            <Text style={styles.domainExtension}>.KaziKE.ke</Text>
          </View>
          <Text style={styles.domainFullUrl}>
            {domainName}.KaziKE.ke
          </Text>
        </View>
        
        <Text style={styles.domainDescription}>
          Your official government domain for public services, announcements, and citizen engagement.
        </Text>
        
        <View style={styles.domainFeatures}>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>✅ Official Government Portal</Text>
            <Text style={styles.featureDesc}>Trusted government services and information</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🌐 Citizen Engagement</Text>
            <Text style={styles.featureDesc}>Direct communication with citizens</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>🔒 Secure & Verified</Text>
            <Text style={styles.featureDesc}>Government-verified and secure</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>📊 Analytics Dashboard</Text>
            <Text style={styles.featureDesc}>Track citizen engagement and service usage</Text>
          </View>
        </View>
        
        <View style={styles.domainActionsContainer}>
          <TouchableOpacity style={styles.editDomainButton} onPress={() => setShowEditModal(true)}>
            <Edit3 color="#FFFFFF" size={20} />
            <Text style={styles.editDomainText}>Edit Portfolio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.publishDomainButton} onPress={handlePublishDomain}>
            <ExternalLink color="#FFFFFF" size={20} />
            <Text style={styles.publishDomainText}>
              {isDomainPublished ? "Manage Portal" : "Publish Domain"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.domainStatsCard}>
        <Text style={styles.domainStatsTitle}>Portal Statistics</Text>
        <View style={styles.domainStatsGrid}>
          <View style={styles.domainStat}>
            <Text style={styles.domainStatNumber}>45.2K</Text>
            <Text style={styles.domainStatLabel}>Monthly Visitors</Text>
          </View>
          <View style={styles.domainStat}>
            <Text style={styles.domainStatNumber}>12.8K</Text>
            <Text style={styles.domainStatLabel}>Services Accessed</Text>
          </View>
          <View style={styles.domainStat}>
            <Text style={styles.domainStatNumber}>98%</Text>
            <Text style={styles.domainStatLabel}>Uptime</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Notifications</Text>
      <Text style={styles.tabSubtitle}>Stay updated with system alerts and updates</Text>
      
      {/* Certificate Verification Alerts */}
      {certificatesData && (
        <>
          {certificatesData.pending.length > 0 && (
            <TouchableOpacity style={styles.notificationCard} onPress={() => navigateToSection('certificates')}>
              <Text style={styles.notificationTitle}>🎓 Certificate Verification Alert</Text>
              <Text style={styles.notificationText}>
                {certificatesData.pending.length} new certificate verification requests require your attention.
              </Text>
              <Text style={styles.notificationTime}>Just now</Text>
            </TouchableOpacity>
          )}
          
          {certificatesData.approved.length > 0 && (
            <TouchableOpacity style={styles.notificationCard} onPress={() => navigateToSection('certificates')}>
              <Text style={styles.notificationTitle}>✅ Certificate Approved</Text>
              <Text style={styles.notificationText}>
                {certificatesData.approved.length} certificate(s) have been approved and verified.
              </Text>
              <Text style={styles.notificationTime}>Recently</Text>
            </TouchableOpacity>
          )}
          
          {certificatesData.rejected.length > 0 && (
            <TouchableOpacity style={styles.notificationCard} onPress={() => navigateToSection('certificates')}>
              <Text style={styles.notificationTitle}>❌ Certificate Rejected</Text>
              <Text style={styles.notificationText}>
                {certificatesData.rejected.length} certificate(s) have been rejected and require follow-up.
              </Text>
              <Text style={styles.notificationTime}>Recently</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      
      <TouchableOpacity style={styles.notificationCard} onPress={() => navigateToSection('employment')}>
        <Text style={styles.notificationTitle}>📈 Employment Target Achieved</Text>
        <Text style={styles.notificationText}>
          Q1 2024 employment target exceeded by 15%. Great progress!
        </Text>
        <Text style={styles.notificationTime}>1 day ago</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.notificationCard} onPress={() => navigateToSection('home')}>
        <Text style={styles.notificationTitle}>💰 Fund Disbursement Complete</Text>
        <Text style={styles.notificationText}>
          KSH 500M youth employment fund successfully disbursed to 2,500 beneficiaries.
        </Text>
        <Text style={styles.notificationTime}>3 days ago</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.notificationCard} onPress={() => navigateToSection('settings')}>
        <Text style={styles.notificationTitle}>🔔 System Maintenance</Text>
        <Text style={styles.notificationText}>
          Scheduled maintenance for NHIF integration will occur tonight at 2 AM.
        </Text>
        <Text style={styles.notificationTime}>5 days ago</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Settings</Text>
      <Text style={styles.tabSubtitle}>Manage your government portal preferences</Text>
      
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
          <Text style={styles.settingText}>Certificate Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Employment Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>System Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>System</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>API Integrations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Data Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Backup & Restore</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <LogOut color="#FFFFFF" size={20} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#CE1126", "#006600"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Government Portal</Text>
                <Text style={styles.departmentName}>{user?.profile?.ministry || "Ministry"}</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={toggleMenu}>
                <Shield color="#FFFFFF" size={24} />
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

            {/* Tab Content */}
            {renderTabContent()}
          </ScrollView>
          
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
        </SafeAreaView>
      </LinearGradient>

      {/* Modals for certificate actions */}
      <Modal
        visible={showApprovalModal}
        onRequestClose={() => setShowApprovalModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Approve Certificate</Text>
            <Text style={styles.modalSubtitle}>Please provide a reason for approving this certificate.</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Approval Reason"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={approvalReason}
              onChangeText={setApprovalReason}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.modalButton} onPress={() => handleCertificateApproval(selectedCertificate.id)}>
              <Text style={styles.modalButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowApprovalModal(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRejectionModal}
        onRequestClose={() => setShowRejectionModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Certificate</Text>
            <Text style={styles.modalSubtitle}>Please provide a reason for rejecting this certificate.</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Rejection Reason"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={4}
            />
                         <TouchableOpacity style={styles.modalButtonReject} onPress={() => handleCertificateRejection(selectedCertificate.id)}>
               <Text style={styles.modalButtonText}>Reject</Text>
             </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowRejectionModal(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

             {/* Modals for domain actions */}
       <Modal
         visible={showPublishModal}
         onRequestClose={() => setShowPublishModal(false)}
         animationType="slide"
         transparent={true}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Globe color="#00C65A" size={32} />
               <Text style={styles.modalTitle}>Unlock Your Government Domain</Text>
             </View>
             
             <View style={styles.paymentInfoContainer}>
               <Text style={styles.paymentTitle}>Domain: {domainName}.KaziKE.ke</Text>
               <Text style={styles.paymentSubtitle}>
                 Your government portal is ready for publication. To unlock public access and establish your digital presence, a nominal verification fee is required.
               </Text>
               
               <View style={styles.paymentDetails}>
                 <View style={styles.paymentDetail}>
                   <Text style={styles.paymentDetailLabel}>✓ Government Verification</Text>
                   <Text style={styles.paymentDetailText}>Official domain authentication</Text>
                 </View>
                 <View style={styles.paymentDetail}>
                   <Text style={styles.paymentDetailLabel}>✓ Public Accessibility</Text>
                   <Text style={styles.paymentDetailText}>Citizen portal activation</Text>
                 </View>
                 <View style={styles.paymentDetail}>
                   <Text style={styles.paymentDetailLabel}>✓ Security Certificate</Text>
                   <Text style={styles.paymentDetailText}>SSL encryption included</Text>
                 </View>
               </View>
               
               <View style={styles.paymentAmount}>
                 <Text style={styles.paymentAmountLabel}>Verification Fee:</Text>
                 <Text style={styles.paymentAmountValue}>KSH 300</Text>
                 <Text style={styles.paymentAmountNote}>One-time payment</Text>
               </View>
             </View>
             
             <View style={styles.modalActions}>
               <TouchableOpacity style={styles.paymentButton} onPress={confirmDomainPublication}>
                 <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPublishModal(false)}>
                 <Text style={styles.cancelButtonText}>Cancel</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>

             <Modal
         visible={showEditModal}
         onRequestClose={() => setShowEditModal(false)}
         animationType="slide"
         transparent={true}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Edit3 color="#CE1126" size={32} />
               <Text style={styles.modalTitle}>Edit Government Portfolio</Text>
             </View>
             
             <Text style={styles.modalSubtitle}>
               Update your government services and contact information for your public portal.
             </Text>
             
             <View style={styles.portfolioForm}>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Portal Title</Text>
                 <TextInput
                   style={styles.modalInput}
                   placeholder="Enter portal title"
                   placeholderTextColor="rgba(255, 255, 255, 0.6)"
                   value={portfolioContent.title}
                   onChangeText={(text) => setPortfolioContent(prev => ({ ...prev, title: text }))}
                 />
               </View>
               
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Portal Description</Text>
                 <TextInput
                   style={styles.modalInput}
                   placeholder="Describe your government services"
                   placeholderTextColor="rgba(255, 255, 255, 0.6)"
                   value={portfolioContent.description}
                   onChangeText={(text) => setPortfolioContent(prev => ({ ...prev, description: text }))}
                   multiline
                   numberOfLines={3}
                   textAlignVertical="top"
                 />
               </View>
               
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Contact Email</Text>
                 <TextInput
                   style={styles.modalInput}
                   placeholder="Enter contact email"
                   placeholderTextColor="rgba(255, 255, 255, 0.6)"
                   value={portfolioContent.contact}
                   onChangeText={(text) => setPortfolioContent(prev => ({ ...prev, contact: text }))}
                   keyboardType="email-address"
                 />
               </View>
             </View>
             
             <View style={styles.modalActions}>
               <TouchableOpacity style={styles.modalButton} onPress={savePortfolioChanges}>
                 <Text style={styles.modalButtonText}>Save Changes</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                 <Text style={styles.cancelButtonText}>Cancel</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
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
    paddingBottom: 100,
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTabItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  activeTab: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  tabContent: {
    paddingBottom: 32,
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
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
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
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  quickActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    marginTop: 24,
  },
  certificateStats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  certStatCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  certStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  certStatLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  certificateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  certificateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateInstitution: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  certificateType: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  certificateStudent: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  certificateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  certificateDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  certificateActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: "#006600",
  },
  rejectButton: {
    backgroundColor: "#CE1126",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  employmentOverview: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  employmentStat: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  employmentNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  employmentLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  sectorCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectorPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#006600",
    borderRadius: 4,
  },
  sectorDetails: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  trendsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  trendCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  trendMonth: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  trendNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  trendTarget: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  trendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  analyticsTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  analyticsChange: {
    fontSize: 12,
    color: "#006600",
  },
  sectorPerformance: {
    marginBottom: 24,
  },
  performanceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  performanceRank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CE1126",
    marginRight: 16,
    width: 20,
  },
  performanceSector: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  performanceRate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#006600",
  },
  geographicStats: {
    marginBottom: 24,
  },
  geoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  geoRegion: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  geoCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#006600",
  },
  domainInfoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  domainUrl: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  domainInputContainer: {
    marginBottom: 20,
  },
  domainLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  domainInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  domainInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  domainExtension: {
    fontSize: 16,
    color: "#00C65A",
    fontWeight: "600",
  },
  domainFullUrl: {
    fontSize: 18,
    color: "#00C65A",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  domainDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  domainFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    marginBottom: 12,
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
    backgroundColor: "#CE1126",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  editDomainText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  domainStatsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
  },
  domainStatsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  domainStatsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  domainStat: {
    flex: 1,
    alignItems: "center",
  },
  domainStatNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  domainStatLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  notificationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
  settingsSection: {
    marginBottom: 24,
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
  logoutButton: {
    backgroundColor: "#CE1126",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  aiLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    marginVertical: 20,
  },
  aiLoadingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  aiLoadingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  aiLoadingSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  aiProcessingSteps: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  processingStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  processingText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 5,
  },
  aiInsightsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aiInsightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  aiInsightsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  aiPredictionsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aiPredictionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  predictionsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  predictionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  predictionMetric: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  predictionConfidence: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  aiStartButton: {
    backgroundColor: "#006600",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },
  aiStartButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  aiPatternsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aiPatternsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  aiPatternsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  patternItem: {
    marginBottom: 8,
  },
  patternText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  aiRecommendationsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aiRecommendationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  recommendationItem: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 20,
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#006600",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonReject: {
    backgroundColor: "#CE1126",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  aiAnalysisContainer: {
    backgroundColor: "rgba(0, 198, 101, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  aiAnalysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiAnalysisTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00C65A",
    marginLeft: 6,
  },
  aiAnalysisText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 16,
  },
  certificatesLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    marginVertical: 20,
  },
  certificatesLoadingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  certificatesLoadingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  certificatesLoadingSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  certificatesLoadingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 10,
  },
  domainActionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  publishDomainButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  publishDomainText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  paymentInfoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00C65A",
    textAlign: "center",
    marginBottom: 12,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  paymentDetails: {
    marginBottom: 20,
  },
  paymentDetail: {
    marginBottom: 12,
  },
  paymentDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  paymentDetailText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  paymentAmount: {
    backgroundColor: "rgba(0, 198, 101, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  paymentAmountLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  paymentAmountValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00C65A",
    marginBottom: 4,
  },
  paymentAmountNote: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  modalActions: {
    width: "100%",
    gap: 12,
  },
  paymentButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  portfolioForm: {
    width: "100%",
    marginBottom: 20,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
});