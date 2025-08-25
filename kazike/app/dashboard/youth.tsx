import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import * as DocumentPicker from "expo-document-picker";
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
  MessageCircle,
  X,
  FileUp,
  Bot,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useYouthStore } from "@/stores/youth-store";

type TabType =
  | "home"
  | "profile"
  | "jobs"
  | "domain"
  | "applications"
  | "cv-services"
  | "notifications"
  | "settings";

interface TranslationMessage {
  id: number;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export default function YouthDashboard() {
  const { user, logout } = useAuthStore();
  const {
    profile,
    jobMatches = [],
    applications = [],
    savedJobs = [],
    loadProfile,
    loadApplications,
    applyToJob,
    saveJob,
    unsaveJob,
  } = useYouthStore();

  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // CV Translation Chatbot State
  const [showTranslationChat, setShowTranslationChat] = useState(false);
  const [translationMessages, setTranslationMessages] = useState<TranslationMessage[]>(
    [
      {
        id: 1,
        type: "bot",
        message:
          "Hello! I'm your CV Translation Assistant. Upload your CV or paste your CV text and tell me which language to translate to.",
        timestamp: new Date(),
      },
    ]
  );
  const [translationInput, setTranslationInput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCV, setUploadedCV] = useState<string | null>(null);
  const [cvContent, setCvContent] = useState<string>("");
  const [cvData, setCvData] = useState<any>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("");

  useEffect(() => {
    loadProfile?.();
    loadApplications?.();
  }, [loadProfile, loadApplications]);

  const handleSignOut = async () => {
    await logout();
    router.replace("/");
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // Utility functions for CV translation chatbot
  const addBotMessage = (message: string) => {
    const botMessage: TranslationMessage = {
      id: Date.now(),
      type: "bot",
      message,
      timestamp: new Date(),
    };
    setTranslationMessages((prev) => [...prev, botMessage]);
  };

  const addUserMessage = (message: string) => {
    const userMessage: TranslationMessage = {
      id: Date.now(),
      type: "user",
      message,
      timestamp: new Date(),
    };
    setTranslationMessages((prev) => [...prev, userMessage]);
  };

  const parseCVContent = (content: string) => {
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    const parsed = {
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      experience: [] as string[],
      education: [] as string[],
      skills: [] as string[],
    };

    let currentSection = "";
    for (const raw of lines) {
      const line = raw;
      const lower = line.toLowerCase();

      if (lower.includes("experience") || lower.includes("work") || lower.includes("employment")) {
        currentSection = "experience";
        continue;
      } else if (lower.includes("education") || lower.includes("academic") || lower.includes("qualification")) {
        currentSection = "education";
        continue;
      } else if (lower.includes("skill") || lower.includes("expertise") || lower.includes("competency")) {
        currentSection = "skills";
        continue;
      } else if (lower.includes("summary") || lower.includes("profile") || lower.includes("objective")) {
        currentSection = "summary";
        continue;
      }

      if (line.includes("@") && line.includes(".")) parsed.personalInfo.email = line;
      else if (line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) parsed.personalInfo.phone = line;
      else if (!parsed.personalInfo.name && line.length > 2 && !line.includes("@") && !line.match(/\d/)) parsed.personalInfo.name = line;

      if (currentSection === "experience" && line.length > 5) parsed.experience.push(line);
      if (currentSection === "education" && line.length > 5) parsed.education.push(line);
      if (currentSection === "skills" && line.length > 1) {
        const items = line.split(/[,;•-]/).map((s) => s.trim()).filter(Boolean);
        parsed.skills.push(...items);
      }
      if (currentSection === "summary" && line.length > 5) parsed.personalInfo.summary += (parsed.personalInfo.summary ? " " : "") + line;
    }

    return parsed;
  };

  const generateTranslatedCV = (language: string) => {
    if (!cvData && !cvContent) return "No CV content available to translate.";

    const translations: any = {
      swahili: {
        title: "📄 CV YA KAZI",
        personalInfo: "Maelezo Binafsi:",
        name: "Jina:",
        email: "Barua pepe:",
        phone: "Simu:",
        location: "Mahali:",
        summary: "Muhtasari:",
        experience: "Uzoefu wa Kazi:",
        education: "Elimu:",
        skills: "Ujuzi:",
      },
      french: {
        title: "📄 CV PROFESSIONNEL",
        personalInfo: "Informations Personnelles:",
        name: "Nom:",
        email: "Email:",
        phone: "Téléphone:",
        location: "Localisation:",
        summary: "Résumé:",
        experience: "Expérience:",
        education: "Formation:",
        skills: "Compétences:",
      },
      // add other languages as needed
    };

    const t = translations[language] || translations["swahili"];
    let output = `${t.title}\n\n`;

    if (cvData?.personalInfo) {
      output += `${t.personalInfo}\n`;
      if (cvData.personalInfo.name) output += `${t.name} ${cvData.personalInfo.name}\n`;
      if (cvData.personalInfo.email) output += `${t.email} ${cvData.personalInfo.email}\n`;
      if (cvData.personalInfo.phone) output += `${t.phone} ${cvData.personalInfo.phone}\n`;
      if (cvData.personalInfo.location) output += `${t.location} ${cvData.personalInfo.location}\n`;
      output += "\n";
    }

    if (cvData?.personalInfo?.summary) {
      output += `${t.summary}\n${cvData.personalInfo.summary}\n\n`;
    }

    if (cvData?.experience?.length) {
      output += `${t.experience}\n`;
      cvData.experience.forEach((e: string, i: number) => (output += `${i + 1}. ${e}\n`));
      output += "\n";
    }

    if (cvData?.education?.length) {
      output += `${t.education}\n`;
      cvData.education.forEach((e: string, i: number) => (output += `${i + 1}. ${e}\n`));
      output += "\n";
    }

    if (cvData?.skills?.length) {
      output += `${t.skills}\n`;
      cvData.skills.forEach((s: string) => (output += `• ${s}\n`));
    }

    return output;
  };

  const handleUploadCV = async () => {
    setIsUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
          "text/rtf",
        ],
        copyToCacheDirectory: true,
      });

      // expo-document-picker v14+ returns { type: 'success'|'cancel', uri, name, size, mimeType }
      if (result.type === "success") {
        const { name, size, uri, mimeType } = result as any;
        if (size && size > 10 * 1024 * 1024) {
          Alert.alert("File Too Large", "Please select a CV file smaller than 10MB.");
          return;
        }
        setUploadedCV(name || "uploaded");
        // attempt to read text for text based files
        if (mimeType && (mimeType.includes("text") || mimeType.includes("rtf"))) {
          try {
            const resp = await fetch(uri);
            const text = await resp.text();
            setCvContent(text);
            const parsed = parseCVContent(text);
            setCvData(parsed);
            addBotMessage(`Uploaded ${name}. Detected ${parsed.experience.length} experience entries and ${parsed.skills.length} skills. Which language to translate to?`);
          } catch (err) {
            console.error(err);
            addBotMessage(`Uploaded ${name}. I couldn't read the file automatically. Please paste the CV text in chat.`);
          }
        } else {
          addBotMessage(`Uploaded ${name}. If it's not a plain text file, please paste your CV text into the chat for translation.`);
        }
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Upload Error", "Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslationRequest = async (message: string) => {
    if (!message.trim()) return;
    addUserMessage(message);
    setTranslationInput("");
    setIsTranslating(true);

    // If user pasted CV content
    if (message.length > 100 && !cvContent && !cvData) {
      setCvContent(message);
      const parsed = parseCVContent(message);
      setCvData(parsed);
      addBotMessage(`Got your CV text. Detected ${parsed.experience.length} experience entries and ${parsed.skills.length} skills. Which language would you like?`);
      setIsTranslating(false);
      return;
    }

    // If user asked for a language
    const lower = message.toLowerCase();
    const languages = ["swahili", "french", "spanish", "german", "chinese", "arabic"];
    const found = languages.find((l) => lower.includes(l));

    if (!cvContent && !cvData && found) {
      addBotMessage(`I see you want ${found} but I don't have your CV text. Paste your CV or upload a text file and then ask again.`);
      setIsTranslating(false);
      return;
    }

    setTimeout(() => {
      if (found) {
        const translated = generateTranslatedCV(found);
        addBotMessage(`Translated to ${found}:\n\n${translated}`);
        setTargetLanguage(found);
      } else {
        addBotMessage("I can translate to Swahili, French, Spanish, German, Chinese, Arabic. Paste your CV or upload a text file and tell me the language.");
      }
      setIsTranslating(false);
    }, 1000);
  };

  const clearUploadedCV = () => {
    setUploadedCV(null);
    setCvContent("");
    setCvData(null);
    setTargetLanguage("");
    addBotMessage("CV cleared. Upload or paste a new CV to continue.");
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      await applyToJob(jobId);
      Alert.alert("Success", "Application submitted successfully!");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to apply");
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      if (savedJobs.includes(jobId)) await unsaveJob(jobId);
      else await saveJob(jobId);
    } catch (err) {
      console.error(err);
    }
  };

  const quickStats = [
    { label: "Job Matches", value: `${jobMatches.length}`, icon: Briefcase, color: "#00C65A" },
    { label: "Profile Views", value: "45", icon: User, color: "#4A90E2" },
    { label: "Applications", value: `${applications.length}`, icon: FileText, color: "#FF6B35" },
  ];

  const tabs = [
    { id: "home" as TabType, title: "Home", icon: Home },
    { id: "profile" as TabType, title: "Profile", icon: User },
    { id: "jobs" as TabType, title: "Jobs", icon: Briefcase },
    { id: "domain" as TabType, title: "Domain", icon: Globe },
    { id: "cv-services" as TabType, title: "CV", icon: FileText },
    { id: "applications" as TabType, title: "Apps", icon: FileText },
    { id: "notifications" as TabType, title: "Alerts", icon: Bell },
    { id: "settings" as TabType, title: "Settings", icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF6B35";
      case "reviewed":
        return "#4A90E2";
      case "interview":
        return "#00C65A";
      case "rejected":
        return "#FF6B6B";
      case "accepted":
        return "#00C65A";
      default:
        return "#666";
    }
  };

  // Render functions (kept concise)
  const renderHomeTab = () => (
    <>
      <View style={styles.statsContainer}>
        {quickStats.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <stat.icon color={stat.color} size={20} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.domainCard}>
        <View style={styles.domainHeader}>
          <Globe color="#00C65A" size={24} />
          <Text style={styles.domainTitle}>Your .KE Domain</Text>
        </View>
        <Text style={styles.domainUrl}>{user?.domain || "yourname.ke"}</Text>
        <Text style={styles.domainStatus}>✅ Active & Verified</Text>
        <TouchableOpacity style={styles.viewDomainButton} onPress={() => setActiveTab("domain")}>
          <Text style={styles.viewDomainText}>View Portfolio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.jobMatchesCard}>
        <Text style={styles.jobMatchesTitle}>Recent Job Matches</Text>
        {jobMatches.slice(0, 2).map((job: any) => (
          <View key={job.id} style={styles.jobItem}>
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company}</Text>
              <Text style={styles.jobSalary}>{job.salary}</Text>
              <View style={styles.matchScore}>
                <Text style={styles.matchScoreText}>{job.matchScore}% match</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={() => handleApplyToJob(job.id)}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.viewAllButton} onPress={() => setActiveTab("jobs")}>
          <Text style={styles.viewAllText}>View All Jobs</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderJobsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Job Matches</Text>
      <Text style={styles.tabSubtitle}>AI-powered opportunities tailored for you</Text>

      {jobMatches.map((job: any) => {
        const isApplied = applications.some((app: any) => app.jobId === job.id);
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

            <View style={styles.jobActions}>
              <TouchableOpacity
                style={[styles.applyButton, isApplied && styles.appliedButton]}
                onPress={() => !isApplied && handleApplyToJob(job.id)}
                disabled={isApplied}
              >
                <Text style={[styles.applyButtonText, isApplied && styles.appliedButtonText]}>
                  {isApplied ? "Applied" : "Apply Now"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveJob(job.id)}>
                <Text style={[styles.saveButtonText, isSaved && styles.savedButtonText]}>{isSaved ? "Saved" : "Save"}</Text>
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
        <Text style={styles.domainDescription}>Your verified .KE domain serves as your digital identity.</Text>
      </View>
    </View>
  );

  const renderApplicationsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>My Applications</Text>
      <Text style={styles.tabSubtitle}>Track your job application progress</Text>
      {applications.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText color="rgba(255,255,255,0.5)" size={48} />
          <Text style={styles.emptyStateText}>No applications yet</Text>
        </View>
      ) : (
        applications.map((app: any) => (
          <View key={app.id} style={styles.applicationCard}>
            <View style={styles.applicationHeader}>
              <Text style={styles.applicationTitle}>{app.jobTitle}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                <Text style={styles.statusText}>{app.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.applicationCompany}>{app.company}</Text>
            <Text style={styles.applicationDate}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</Text>
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
        <Text style={styles.notificationText}>A new Senior Developer position matches your profile.</Text>
        <Text style={styles.notificationTime}>2 hours ago</Text>
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Settings</Text>
      <Text style={styles.tabSubtitle}>Manage your account preferences</Text>
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color="#FF6B6B" size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Profile & Portfolio</Text>
      <Text style={styles.tabSubtitle}>Manage your professional identity</Text>
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
        </View>
      </View>
    </View>
  );

  const renderCVServicesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>CV & Document Services</Text>
      <Text style={styles.tabSubtitle}>Professional CV tools and templates</Text>
      <View style={styles.serviceCard}>
        <Text style={styles.serviceTitle}>🌍 AI CV Translation Assistant</Text>
        <Text style={styles.serviceDescription}>Upload your CV or paste text and translate to multiple languages.</Text>
        <TouchableOpacity style={styles.serviceButton} onPress={() => setShowTranslationChat(true)}>
          <Bot color="#FFFFFF" size={20} />
          <Text style={styles.serviceButtonText}>Start Translation Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab();
      case "profile":
        return renderProfileTab();
      case "jobs":
        return renderJobsTab();
      case "domain":
        return renderDomainTab();
      case "applications":
        return renderApplicationsTab();
      case "cv-services":
        return renderCVServicesTab();
      case "notifications":
        return renderNotificationsTab();
      case "settings":
        return renderSettingsTab();
      default:
        return renderHomeTab();
    }
  };

  const renderTranslationChat = () => (
    <Modal visible={showTranslationChat} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.translationChatContainer}>
        <LinearGradient colors={["#8B1538", "#A91B47", "#C41E3A"]} style={styles.translationChatGradient}>
          <View style={styles.translationChatHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowTranslationChat(false)}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.translationChatTitle}>CV Translation Assistant</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.cvUploadSection}>
            <Text style={styles.cvUploadTitle}>📄 Upload Your CV</Text>
            <Text style={styles.cvUploadDescription}>Supported: PDF, Word, Text, RTF (text files read automatically)</Text>
            <TouchableOpacity style={[styles.uploadCVButton, isUploading && styles.uploadCVButtonDisabled]} onPress={handleUploadCV} disabled={isUploading}>
              {isUploading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <FileUp color="#FFFFFF" size={24} />}
              <Text style={styles.uploadCVButtonText}>{isUploading ? "Uploading..." : "📄 Click to Upload CV"}</Text>
            </TouchableOpacity>

            {uploadedCV && (
              <View style={styles.uploadedCVInfo}>
                <FileText color="#00C65A" size={20} />
                <Text style={styles.uploadedCVText}>{uploadedCV}</Text>
                <View style={styles.cvActionButtons}>
                  <TouchableOpacity style={styles.changeCVButton} onPress={handleUploadCV}>
                    <Text style={styles.changeCVButtonText}>Change CV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clearCVButton} onPress={clearUploadedCV}>
                    <Text style={styles.clearCVButtonText}>Clear CV</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <ScrollView style={styles.translationChatMessages} showsVerticalScrollIndicator={false}>
            {translationMessages.map((msg) => (
              <View key={msg.id} style={[styles.translationMessageContainer, msg.type === "user" ? styles.translationUserMessage : styles.translationBotMessage]}>
                <View style={[styles.translationMessageBubble, msg.type === "user" ? styles.translationUserBubble : styles.translationBotBubble]}>
                  <Text style={[styles.translationMessageText, msg.type === "user" ? styles.translationUserMessageText : styles.translationBotMessageText]}>
                    {msg.message}
                  </Text>
                  <Text style={styles.translationMessageTime}>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
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

          <View style={styles.translationChatInputContainer}>
            <TextInput
              style={styles.translationChatInput}
              value={translationInput}
              onChangeText={setTranslationInput}
              placeholder="Paste your CV text here, or say 'translate to Swahili'..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[styles.translationSendButton, (!translationInput.trim() || isTranslating) && styles.translationSendButtonDisabled]}
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
      <LinearGradient colors={["#8B1538", "#A91B47", "#C41E3A"]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.userName}>{profile?.fullName || user?.profile?.fullName || "User"}</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={toggleMenu}>
                <User color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            {isMenuOpen && (
              <View style={styles.profileMenu}>
                <TouchableOpacity style={styles.profileMenuItem} onPress={() => setActiveTab("settings")}>
                  <Text style={styles.profileMenuText}>Profile & Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileMenuItem} onPress={handleSignOut}>
                  <Text style={styles.profileMenuText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}

            {renderTabContent()}
          </ScrollView>
        </SafeAreaView>

        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, activeTab === tab.id && styles.activeTabItem]}
              onPress={() => setActiveTab(tab.id)}
              accessibilityLabel={tab.title}
              accessibilityRole="button"
            >
              <tab.icon color={activeTab === tab.id ? "#00C65A" : "rgba(255,255,255,0.6)"} size={20} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {renderTranslationChat()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20 },
  greeting: { fontSize: 16, color: "rgba(255,255,255,0.8)" },
  userName: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  profileButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  profileMenu: { backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 12, paddingVertical: 8, marginBottom: 12 },
  profileMenuItem: { paddingVertical: 10, paddingHorizontal: 12 },
  profileMenuText: { color: "#FFFFFF", fontSize: 14 },
  statsContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, alignItems: "center" },
  statIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center" },
  domainCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, marginBottom: 24 },
  domainHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  domainTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  domainUrl: { fontSize: 16, color: "#00C65A", fontWeight: "500", marginBottom: 8 },
  domainStatus: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 },
  viewDomainButton: { backgroundColor: "#00C65A", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignSelf: "flex-start" },
  viewDomainText: { color: "#FFFFFF", fontWeight: "600" },
  tabBar: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.3)", paddingVertical: 8, paddingHorizontal: 16 },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 8, paddingHorizontal: 4 },
  activeTabItem: { backgroundColor: "rgba(0,198,90,0.2)", borderRadius: 8 },
  tabText: { fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 4, textAlign: "center" },
  activeTabText: { color: "#00C65A", fontWeight: "600" },
  tabContent: { paddingBottom: 20 },
  tabTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 8 },
  tabSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 24 },
  jobMatchesCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, marginBottom: 24 },
  jobMatchesTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 16 },
  jobItem: { flexDirection: "row", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  jobContent: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", marginBottom: 4 },
  jobCompany: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 2 },
  jobSalary: { fontSize: 14, color: "#00C65A", fontWeight: "500" },
  jobLocation: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  jobType: { fontSize: 12, color: "#00C65A", backgroundColor: "rgba(0,198,90,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, textTransform: "capitalize" },
  applyButton: { backgroundColor: "#00C65A", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  applyButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 12 },
  viewAllButton: { alignSelf: "center", paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", borderRadius: 8, marginTop: 8 },
  viewAllText: { color: "#FFFFFF", fontWeight: "500" },
  jobCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginBottom: 16 },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  jobSkills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 12 },
  skillTag: { backgroundColor: "rgba(0,198,90,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  skillText: { fontSize: 12, color: "#00C65A", fontWeight: "500" },
  jobActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  applicantsText: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  applicationCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginBottom: 16 },
  applicationHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  applicationTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, color: "#FFFFFF", fontWeight: "600" },
  applicationCompany: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  applicationDate: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 8 },
  notificationCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginBottom: 16 },
  notificationTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", marginBottom: 8 },
  notificationText: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 8, lineHeight: 20 },
  notificationTime: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  settingsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 16 },
  signOutButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,107,107,0.2)", borderRadius: 12, padding: 16, gap: 12 },
  signOutText: { fontSize: 16, color: "#FF6B6B", fontWeight: "600" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  emptyStateText: { fontSize: 18, color: "rgba(255,255,255,0.8)", fontWeight: "600", marginTop: 16, marginBottom: 8 },
  profileSection: { marginBottom: 24 },
  profileCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 },
  profileRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  profileLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  profileValue: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },
  serviceCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginBottom: 16 },
  serviceTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 8 },
  serviceDescription: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 12, lineHeight: 20 },
  serviceButton: { backgroundColor: "#00C65A", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignSelf: "flex-start" },
  serviceButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  // translation chat styles
  translationChatContainer: { flex: 1 },
  translationChatGradient: { flex: 1 },
  translationChatHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  translationChatTitle: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF", flex: 1, textAlign: "center" },
  cvUploadSection: { padding: 20, alignItems: "center", marginBottom: 20 },
  cvUploadTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 8 },
  cvUploadDescription: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 8, textAlign: "center" },
  uploadCVButton: { backgroundColor: "rgba(255,255,255,0.1)", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", borderStyle: "dashed", alignItems: "center", flexDirection: "row", gap: 8 },
  uploadCVButtonDisabled: { backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" },
  uploadedCVInfo: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, width: "100%", marginBottom: 16 },
  uploadedCVText: { color: "#FFFFFF", fontSize: 14, marginLeft: 10, flex: 1 },
  cvActionButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
  changeCVButton: { backgroundColor: "rgba(255,255,255,0.2)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  changeCVButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  clearCVButton: { backgroundColor: "rgba(255,107,107,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,107,107,0.3)" },
  clearCVButtonText: { color: "#FF6B6B", fontSize: 12, fontWeight: "600" },
  translationChatMessages: { flex: 1, paddingHorizontal: 20, paddingBottom: 10 },
  translationMessageContainer: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end" },
  translationUserMessage: { justifyContent: "flex-end" },
  translationBotMessage: { justifyContent: "flex-start" },
  translationMessageBubble: { maxWidth: "80%", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15 },
  translationUserBubble: { backgroundColor: "rgba(255,255,255,0.2)" },
  translationBotBubble: { backgroundColor: "rgba(0,198,90,0.2)" },
  translationMessageText: { fontSize: 14, color: "#FFFFFF", lineHeight: 20 },
  translationUserMessageText: { textAlign: "right" },
  translationBotMessageText: { textAlign: "left" },
  translationMessageTime: { fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 4 },
  translatingIndicator: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  translatingText: { fontSize: 12, color: "#FFFFFF", marginLeft: 8 },
  translationChatInputContainer: { flexDirection: "row", paddingHorizontal: 20, paddingBottom: 20, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" },
  translationChatInput: { flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 15, color: "#FFFFFF", fontSize: 14, minHeight: 40, maxHeight: 100 },
  translationSendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,198,90,0.8)", alignItems: "center", justifyContent: "center", marginLeft: 10 },
  translationSendButtonDisabled: { backgroundColor: "rgba(0,198,90,0.4)" },
  matchScore: { marginTop: 4 },
  matchScoreText: { fontSize: 12, color: "#00C65A", fontWeight: "600" },
  jobTitleContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  matchScoreBadge: { backgroundColor: "rgba(0,198,90,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  matchReasons: { marginVertical: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "rgba(0,198,90,0.1)", borderRadius: 8 },
  matchReasonsTitle: { fontSize: 12, color: "#00C65A", fontWeight: "600", marginBottom: 4 },
  matchReason: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 2 },
  appliedButton: { backgroundColor: "rgba(255,255,255,0.2)" },
  appliedButtonText: { color: "rgba(255,255,255,0.7)" },
  saveButton: { backgroundColor: "rgba(255,255,255,0.1)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 8 },
  saveButtonText: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "500" },
  savedButtonText: { color: "#00C65A" },
});