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
  FileText,
  Briefcase,
  User,
  LogOut,
  Home,
  MessageCircle,
  X,
  FileUp,
  Bot,
} from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useYouthStore } from "@/stores/youth-store";
import { mockJobs as baseMockJobs } from "@/mocks/jobs";
import DomainManager from "./components/DomainManager";

type TabType = "portfolio" | "profile" | "jobs" | "cv";

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

  const [activeTab, setActiveTab] = useState<TabType>("portfolio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [showCerts, setShowCerts] = useState(false);
  const [showHustles, setShowHustles] = useState(false);
  const [showCVSummary, setShowCVSummary] = useState(false);

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
    { label: "Job Matches", value: `${(matchedJobs.length || jobMatches.length)}`, icon: Briefcase, color: "#00C65A" },
    { label: "Profile Views", value: "45", icon: User, color: "#4A90E2" },
    { label: "Applications", value: `${applications.length}`, icon: FileText, color: "#FF6B35" },
  ];

  const tabs = [
    { id: "portfolio" as TabType, title: "Portfolio", icon: Home },
    { id: "profile" as TabType, title: "Profile", icon: User },
    { id: "jobs" as TabType, title: "Jobs", icon: Briefcase },
    { id: "cv" as TabType, title: "CV", icon: FileText },
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

  // Render functions
  const renderPortfolioTab = () => (
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

      <TouchableOpacity style={styles.sectionCard} onPress={() => setShowProjects(true)}>
        <Text style={styles.sectionTitle}>Personal Projects</Text>
        <Text style={styles.sectionHint}>Showcase your best work. Tap to view examples.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sectionCard} onPress={() => setShowCerts(true)}>
        <Text style={styles.sectionTitle}>Certificates & Accreditations</Text>
        <Text style={styles.sectionHint}>Upload or link verified certificates to boost credibility.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sectionCard} onPress={() => setShowHustles(true)}>
        <Text style={styles.sectionTitle}>Side Hustles</Text>
        <Text style={styles.sectionHint}>List side gigs and freelance work you are proud of.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sectionCard} onPress={() => setShowCVSummary(true)}>
        <Text style={styles.sectionTitle}>CV</Text>
        <Text style={styles.sectionHint}>Manage and translate your CV in the CV tab.</Text>
      </TouchableOpacity>

      {/* Portfolio embeds Domain manager for edit/save/publish with payment */}
      <View style={{ marginTop: 8 }}>
        <Text style={styles.sectionTitle}>profile-domain</Text>
        <DomainManager />
      </View>
    </>
  );

  const handleAIMatch = async () => {
    setIsMatching(true);
    await new Promise((r) => setTimeout(r, 1500));
    const safeMock = Array.isArray(baseMockJobs) && baseMockJobs.length
      ? baseMockJobs
      : [
          { id: "j1", title: "Junior Frontend Developer", company: "Nairobi Tech", location: "Nairobi", type: "full-time", salary: "KES 80,000", applicants: 12 },
          { id: "j2", title: "Mobile App Intern", company: "Mombasa Labs", location: "Mombasa", type: "internship", salary: "KES 20,000", applicants: 5 },
          { id: "j3", title: "Data Entry Assistant", company: "Gov Services", location: "Remote", type: "contract", salary: "KES 50,000", applicants: 9 },
          { id: "j4", title: "Backend Developer", company: "CloudKenya", location: "Remote", type: "full-time", salary: "KES 150,000", applicants: 3 },
          { id: "j5", title: "Graphic Designer", company: "Creative Hub", location: "Nakuru", type: "part-time", salary: "KES 40,000", applicants: 6 },
          { id: "j6", title: "IT Support", company: "EduNet", location: "Kisumu", type: "full-time", salary: "KES 60,000", applicants: 7 },
        ];
    const fromStore = (jobMatches && jobMatches.length ? jobMatches : safeMock.slice(0, 6)).map((j: any) => ({ ...j, applied: false }));
    setMatchedJobs(fromStore);
    setIsMatching(false);
  };

  const handleApplyOne = async (jobId: string) => {
    setApplyingId(jobId);
    try { await applyToJob(jobId); } catch {}
    await new Promise(r => setTimeout(r, 500));
    setMatchedJobs((arr) => arr.map(j => j.id === jobId ? { ...j, applied: true } : j));
    setApplyingId(null);
  };

  const handleAutoApplyAll = async () => {
    const list = (matchedJobs.length ? matchedJobs : []).map(j => j.id);
    for (const id of list) {
      await handleApplyOne(id);
    }
    Alert.alert("Applications Sent", "Check your email for job feedback.");
  };

  const renderJobsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Jobs</Text>
      <Text style={styles.tabSubtitle}>AI job matching and one-click auto-apply</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={[styles.aiMatchButton, { flex: 1 }]} onPress={handleAIMatch} disabled={isMatching}>
          <Text style={styles.aiMatchText}>{isMatching ? "Matching..." : "AI Job Matching"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.autoApplyAllBtn, { flex: 1 }]} onPress={handleAutoApplyAll} disabled={isMatching || (!matchedJobs.length && !jobMatches.length)}>
          <Text style={styles.autoApplyAllText}>Auto Apply</Text>
        </TouchableOpacity>
      </View>

      {isMatching && (
        <View style={styles.aiLoader}>
          <ActivityIndicator color="#00C65A" />
          <Text style={styles.aiLoaderText}>Analyzing your skills and preferences...</Text>
        </View>
      )}

      {(matchedJobs.length ? matchedJobs : []).map((job: any) => {
        const isApplied = job.applied;
        const isSaved = savedJobs.includes(job.id);
        return (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleContainer}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.matchScoreBadge}>
                  <Text style={styles.matchScoreText}>{job.matchScore || 85}%</Text>
                </View>
              </View>
              <Text style={styles.jobType}>{job.type}</Text>
            </View>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <Text style={styles.jobLocation}>{job.location}</Text>
            <Text style={styles.jobSalary}>{job.salary}</Text>

            <View style={styles.jobActions}>
              <TouchableOpacity
                style={[styles.applyButton, (isApplied || applyingId === job.id) && styles.appliedButton]}
                onPress={() => !isApplied && handleApplyOne(job.id)}
                disabled={isApplied}
              >
                <Text style={[styles.applyButtonText, (isApplied || applyingId === job.id) && styles.appliedButtonText]}>
                  {isApplied ? "Applied" : applyingId === job.id ? "Applying..." : "Apply Now"}
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

  // removed domain/applications/alerts/settings tabs in new 4-tab layout

  

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
      <Text style={styles.tabTitle}>Profile</Text>
      <Text style={styles.tabSubtitle}>Your personal credentials (PII)</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileRow}><Text style={styles.profileLabel}>Full Name</Text><Text style={styles.profileValue}>{profile?.fullName || user?.profile?.fullName || '-'}</Text></View>
        <View style={styles.profileRow}><Text style={styles.profileLabel}>Email</Text><Text style={styles.profileValue}>{profile?.email || user?.email || '-'}</Text></View>
        <View style={styles.profileRow}><Text style={styles.profileLabel}>Phone</Text><Text style={styles.profileValue}>{profile?.phone || user?.profile?.phone || '-'}</Text></View>
        <View style={styles.profileRow}><Text style={styles.profileLabel}>National ID</Text><Text style={styles.profileValue}>{profile?.nationalId || user?.profile?.nationalId || '-'}</Text></View>
        <View style={styles.profileRow}><Text style={styles.profileLabel}>Date of Birth</Text><Text style={styles.profileValue}>{profile?.dateOfBirth || user?.profile?.dateOfBirth || '-'}</Text></View>
      </View>
    </View>
  );

  const renderCVTab = () => (
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
      case "portfolio":
        return renderPortfolioTab();
      case "profile":
        return renderProfileTab();
      case "jobs":
        return renderJobsTab();
      case "cv":
        return renderCVTab();
      default:
        return renderPortfolioTab();
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
                <TouchableOpacity style={styles.profileMenuItem} onPress={() => setActiveTab("profile")}>
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

      {/* Portfolio dummy data modals */}
      <Modal visible={showProjects} transparent animationType="fade" onRequestClose={() => setShowProjects(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLight}>
            <Text style={styles.modalTitleLight}>Personal Projects</Text>
            <Text style={styles.modalText}>• E-Commerce App (React Native)
• School Portal (Next.js)
• Chatbot Assistant (Python)</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowProjects(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCerts} transparent animationType="fade" onRequestClose={() => setShowCerts(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLight}>
            <Text style={styles.modalTitleLight}>Certificates & Accreditations</Text>
            <Text style={styles.modalText}>• Google IT Support Fundamentals
• AWS Cloud Practitioner
• KENET Verified Student ID</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCerts(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showHustles} transparent animationType="fade" onRequestClose={() => setShowHustles(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLight}>
            <Text style={styles.modalTitleLight}>Side Hustles</Text>
            <Text style={styles.modalText}>• Freelance Graphic Design (Canva)
• Phone Repair & Maintenance
• Social Media Content Editing</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowHustles(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCVSummary} transparent animationType="fade" onRequestClose={() => setShowCVSummary(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCardLight}>
            <Text style={styles.modalTitleLight}>CV Summary</Text>
            <Text style={styles.modalText}>• Name: {profile?.fullName || user?.profile?.fullName || 'User'}
• Email: {profile?.email || user?.email || 'user@example.com'}
• Skills: React Native, JavaScript, UI/UX, Git
• Experience: 1-2 years internship/freelance</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCVSummary(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // portfolio sections
  sectionCard: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionHint: { color: "rgba(255,255,255,0.8)", marginTop: 6 },
  // AI jobs
  aiMatchButton: { backgroundColor: "#00C65A", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  aiMatchText: { color: "#FFFFFF", fontWeight: "700" },
  aiLoader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  aiLoaderText: { color: "rgba(255,255,255,0.85)" },
  autoApplyAllBtn: { backgroundColor: "rgba(0,198,90,0.2)", paddingVertical: 10, borderRadius: 8, alignItems: "center", marginTop: 8 },
  autoApplyAllText: { color: "#00C65A", fontWeight: "700" },
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
  // generic light modal styles
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  modalCardLight: { backgroundColor: "#fff", width: '85%', borderRadius: 12, padding: 16 },
  modalTitleLight: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#111' },
  modalText: { color: '#333', lineHeight: 20, marginBottom: 12 },
  modalCloseBtn: { alignSelf: 'flex-end', backgroundColor: '#CE1126', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  modalCloseText: { color: '#fff', fontWeight: '700' },
});