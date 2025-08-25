import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GraduationCap,
  Award,
  Users,
  FileCheck,
  LogOut,
  User,
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuthStore } from "@/stores/auth-store";
import DomainManager from "./components/DomainManager";
import Toast, { ToastHandle } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import Colors from "./constants/colors";

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  greeting: { fontSize: 16, color: "rgba(255, 255, 255, 0.9)" },
  institutionName: { fontSize: 24, fontWeight: "bold", color: Colors.white },
  domainText: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileMenu: {
    position: "absolute",
    right: 16,
    top: 70,
    minWidth: 180,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 1000,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  profileMenuText: { color: "#FFFFFF", fontSize: 14 },

  // Stats
  statsContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
  backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "rgba(255, 255, 255, 0.7)", textAlign: "center" },

  // Certificates
  certificatesCard: {
  backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 6,
  },
  certificatesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 12,
    marginBottom: 5,
    paddingHorizontal: 4,
  },
  verifyAllButton: {
  backgroundColor: Colors.green,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  verifyAllButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  certificatesTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 16 },
  certificatesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  certificateItem: {
  flexBasis: "30%",
  backgroundColor: "rgba(255,255,255,0.04)",
  borderRadius: 12,
  padding: 14,
  minWidth: 220,
  marginRight: 8,
  },
  certificateIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  certificateContent: { flex: 1 },
  certificateText: { fontSize: 13, color: "#FFFFFF", marginBottom: 4 },
  certificateYear: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 },
  verifyButton: {
  backgroundColor: Colors.green,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  verifyButtonText: { fontSize: 12, fontWeight: "600", color: "#FFF" },

  // Profile & Certificate Modal Shared
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16, color: Colors.red },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  input: { flex: 1, paddingVertical: 8, fontSize: 14, color: "#333" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 12,
  },
  actionText: { color: "#fff", fontWeight: "600" },
  certificateDetail: { fontSize: 14, color: "#333", marginBottom: 8 },

  // Certificate Design Styles
  certificateContainer: {
  backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateHeader: {
    alignItems: "center",
    marginBottom: 20,
  borderBottomWidth: 2,
  borderBottomColor: Colors.red,
    paddingBottom: 15,
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: "bold",
  color: Colors.red,
    textAlign: "center",
    marginBottom: 8,
  },
  certificateSubtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    fontStyle: "italic",
  },
  certificateBody: {
    marginBottom: 20,
  },
  certificateField: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    width: 120,
  },
  fieldValue: {
    fontSize: 14,
    color: "#212529",
    flex: 1,
  },
  certificateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    paddingTop: 15,
  },
  signatureSection: {
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: "#000",
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    textAlign: "center",
  },
  signatureTitle: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
  },
  certificateNumber: {
    fontSize: 12,
    color: "#6c757d",
    fontStyle: "italic",
  },

  translatorRow: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
  },
  // Tabs
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' },
  tabText: { color: Colors.white, fontWeight: '600' },
  translatorActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  // Badge for notifications / pending items
  badge: {
    position: 'absolute',
    right: -8,
    top: -6,
    backgroundColor: Colors.red,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  // Profile card styles
  profileCardFull: { backgroundColor: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 12 },
  profileTitle: { fontSize: 18, fontWeight: '600', color: Colors.white, marginBottom: 12 },
  profileItem: { color: Colors.white, marginBottom: 8 },
  label: { fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  editBtn: { marginTop: 8, backgroundColor: Colors.green, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  editBtnText: { color: '#FFF', fontWeight: '700' },
  editActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  saveBtn: { backgroundColor: Colors.green, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  saveBtnText: { color: '#FFF', fontWeight: '700' },
  cancelBtn: { backgroundColor: '#999', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  cancelBtnText: { color: '#FFF', fontWeight: '700' },
});

export default function InstitutionDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'verification'|'profile'|'domain'>('verification');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState({
    institutionName: user?.profile?.institutionName || "",
    website: user?.profile?.website || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
    principalName: user?.profile?.principalName || "",
    accreditationNumber: user?.profile?.accreditationNumber || "",
    institutionType: user?.profile?.institutionType || "",
  });

  const handleSignOut = async () => {
    await logout();
  };
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const { updateProfile } = useAuthStore.getState();
  const handleSaveProfile = async () => {
    await updateProfile({
      institutionName: editableProfile.institutionName,
      website: editableProfile.website,
      phone: editableProfile.phone,
      address: editableProfile.address,
      principalName: editableProfile.principalName,
      accreditationNumber: editableProfile.accreditationNumber,
      institutionType: editableProfile.institutionType,
    });
    setIsEditingProfile(false);
    setIsProfileVisible(false);
  };

  const resetProfileEdits = () => {
    setEditableProfile({
      institutionName: user?.profile?.institutionName || "",
      website: user?.profile?.website || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      address: user?.profile?.address || "",
      principalName: user?.profile?.principalName || "",
      accreditationNumber: user?.profile?.accreditationNumber || "",
      institutionType: user?.profile?.institutionType || "",
    });
    setIsEditingProfile(false);
  };

  const [issuedCount, setIssuedCount] = useState(0);
  const [deniedCount, setDeniedCount] = useState(0);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [verifyingIds, setVerifyingIds] = useState<Record<string, boolean>>({});
  const quickStats = [
    { label: "Certificates Issued", value: String(issuedCount), icon: Award, color: "#00C65A" },
    { label: "Total Requests Handled", value: String(issuedCount + deniedCount), icon: FileCheck, color: "#4A90E2" },
    { label: "Certificates Denied", value: String(deniedCount), icon: Users, color: "#FF6B35" },
  ];

  type Cert = { 
    id: string; 
    title: string; 
    year: string; 
    recipientName: string; 
    course: string; 
    certificateNo: string; 
    dateIssued: string; 
    signatoryName: string; 
    signatoryDesignation: string;
    isReal: boolean; // Track if certificate is real or fake
  };

  // Generate 30 certificates - some real, some fake
  const generateCertificates = (): Cert[] => {
    const realInstitutions = [
      "University of Nairobi", "Kenyatta University", "Jomo Kenyatta University", 
      "Moi University", "Egerton University", "Maseno University", "Technical University of Kenya",
      "Kenyatta University of Agriculture", "Pwani University", "Kisii University"
    ];
    
    const fakeInstitutions = [
      "Fake University Kenya", "Bogus College Nairobi", "Counterfeit Institute Mombasa",
      "Phony Academy Kisumu", "Fake Technical College", "Bogus Business School"
    ];
    
    const realNames = [
      "John Kamau", "Mary Wanjiku", "David Ochieng", "Sarah Akinyi", "James Odhiambo",
      "Grace Nyambura", "Peter Kiprop", "Faith Chebet", "Michael Otieno", "Joyce Atieno",
      "Robert Mwangi", "Hannah Njeri", "Daniel Kipchirchir", "Esther Wambui", "Kevin Ouma"
    ];
    
    const fakeNames = [
      "Fake Person", "Bogus Student", "Counterfeit Learner", "Phony Graduate", "Fake Alumni"
    ];
    
    const courses = [
      "Bachelor of Science in Computer Science", "Bachelor of Commerce", "Bachelor of Education",
      "Bachelor of Engineering", "Bachelor of Arts", "Diploma in Business Management",
      "Certificate in Information Technology", "Master of Business Administration",
      "Bachelor of Science in Nursing", "Diploma in Accounting"
    ];
    
    const signatories = [
      { name: "Prof. Peter Mwangi", designation: "Vice Chancellor" },
      { name: "Dr. Sarah Kimani", designation: "Registrar" },
      { name: "Prof. James Otieno", designation: "Dean of Faculty" },
      { name: "Dr. Mary Wambui", designation: "Director of Studies" }
    ];
    
    const certificates: Cert[] = [];
    
    // Generate 20 real certificates
    for (let i = 1; i <= 20; i++) {
      const isReal = true;
      const recipient = realNames[Math.floor(Math.random() * realNames.length)];
      const course = courses[Math.floor(Math.random() * courses.length)];
      const signatory = signatories[Math.floor(Math.random() * signatories.length)];
      const year = String(2020 + Math.floor(Math.random() * 4));
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      
      certificates.push({
        id: `CERT-${String(i).padStart(3, '0')}`,
        title: `${course}`,
        year,
        recipientName: recipient,
        course,
        certificateNo: `CERT-${year}-${String(i).padStart(4, '0')}`,
        dateIssued: `${year}-${month}-${day}`,
        signatoryName: signatory.name,
        signatoryDesignation: signatory.designation,
        isReal
      });
    }
    
    // Generate 10 fake certificates
    for (let i = 21; i <= 30; i++) {
      const isReal = false;
      const recipient = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const course = courses[Math.floor(Math.random() * courses.length)];
      const signatory = signatories[Math.floor(Math.random() * signatories.length)];
      const year = String(2020 + Math.floor(Math.random() * 4));
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      
      certificates.push({
        id: `CERT-${String(i).padStart(3, '0')}`,
        title: `${course}`,
        year,
        recipientName: recipient,
        course,
        certificateNo: `CERT-${year}-${String(i).padStart(4, '0')}`,
        dateIssued: `${year}-${month}-${day}`,
        signatoryName: signatory.name,
        signatoryDesignation: signatory.designation,
        isReal
      });
    }
    
    return certificates.sort(() => Math.random() - 0.5); // Shuffle the array
  };
  
  const [certificates, setCertificates] = useState<Cert[]>(generateCertificates());

  // Domain & accreditation management
  type Accreditation = { id: string; name: string; authority: string; status: 'verified'|'pending'|'rejected' };
  const generateAccreditations = (): Accreditation[] => [
  { id: 'ACC-001', name: 'TVET Accreditation', authority: 'Ministry of Education', status: 'verified' },
  { id: 'ACC-002', name: 'Health & Safety Compliance', authority: 'NEMA', status: 'verified' },
  { id: 'ACC-003', name: 'ICT Training Standard', authority: 'ICT Authority', status: 'verified' },
  { id: 'ACC-004', name: 'Quality Assurance', authority: 'KUQAS', status: 'verified' },
  { id: 'ACC-005', name: 'Industry Board Endorsement', authority: 'Industrial Board', status: 'verified' },
  ];
  const [accreditations, setAccreditations] = useState<Accreditation[]>(generateAccreditations());
  const [domainRequests, setDomainRequests] = useState<{ id: string; domain: string; status: 'approved'|'pending'|'rejected' }[]>([]);
  const [isRequestingDomain, setIsRequestingDomain] = useState(false);

  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Cert | null>(null);

  const [translateOpen, setTranslateOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string>("English");
  const toastRef = React.useRef<ToastHandle | null>(null);

  // Unified verification flow used by single and bulk verify
  const verifyCertificateFlow = async (certificate: Cert) => {
    setVerifyingIds((s) => ({ ...s, [certificate.id]: true }));
    // realistic processing time
    await new Promise((r) => setTimeout(r, 900 + Math.floor(Math.random() * 900)));
    const accepted = certificate.isReal || Math.random() > 0.15; // favor acceptance
    setVerifyingIds((s) => ({ ...s, [certificate.id]: false }));
    if (accepted) {
      setIssuedCount((n) => n + 1);
      // show accept toast
      toastRef.current?.show(`${certificate.certificateNo} — accepted`, 'success');
    } else {
      setDeniedCount((n) => n + 1);
      // show deny toast
      toastRef.current?.show(`${certificate.certificateNo} — denied`, 'error');
    }
    setCertificates((prev) => prev.filter((c) => c.id !== certificate.id));
    // close detail modal if open
    setIsCertificateVisible(false);
    setSelectedCertificate(null);
    return accepted;
  };

  const handleVerifyCertificate = (certificate: Cert) => {
    // run but don't await to keep UI responsive
    verifyCertificateFlow(certificate).catch(() => {});
  };
  
  const handleVerifyAll = () => {
    if (certificates.length === 0) {
      Alert.alert('No Certificates', 'There are no certificates to verify.');
      return;
    }
    Alert.alert(
      "Verify All Certificates",
      `This will run AI verification on all ${certificates.length} certificates. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Verify All With AI",
          onPress: async () => {
            setIsVerifyingAll(true);
            const items = [...certificates];
            for (const c of items) {
              // run unified flow sequentially so each shows loader
              try {
                await verifyCertificateFlow(c);
              } catch (e) {
                // ignore individual failures
              }
            }
            setIsVerifyingAll(false);
            toastRef.current?.show(`Processed ${items.length} certificates.`, 'info');
          }
        }
      ]
    );
  };

  const handleRequestDomain = async (domain: string) => {
    if (!domain) return Alert.alert('Invalid', 'Please enter a .ke domain');
    setIsRequestingDomain(true);
    // simulate quick processing and auto-approve to match requested UX
    await new Promise((r) => setTimeout(r, 800 + Math.floor(Math.random() * 800)));
    const newReq = { id: `DOM-${String(domainRequests.length + 1).padStart(3,'0')}`, domain, status: 'approved' as const };
    // persist domain request + accreditation to Supabase (best-effort)
    try {
      const { data: drData, error: drErr } = await supabase.from('domain_requests').insert([{ domain, status: 'approved', institution_id: user?.id ?? null }]).select();
      if (drErr) throw drErr;
      setDomainRequests((s) => [{ id: drData?.[0]?.id ?? `DOM-${String(domainRequests.length + 1).padStart(3,'0')}`, domain, status: 'approved' }, ...s]);
      const accPayload = { name: `${domain} Subdomain`, authority: 'KE Registry', status: 'verified', institution_id: user?.id ?? null };
      const { data: accData, error: accErr } = await supabase.from('accreditations').insert([accPayload]).select();
      if (accErr) throw accErr;
      setAccreditations((s) => [{ id: accData?.[0]?.id ?? `ACC-DOM-${Date.now().toString().slice(-6)}`, name: accPayload.name, authority: accPayload.authority, status: 'verified' }, ...s]);
    } catch (err) {
      // fallback to client-side if DB fails
      setDomainRequests((s) => [newReq, ...s]);
      const accId = `ACC-DOM-${Date.now().toString().slice(-6)}`;
      setAccreditations((s) => [{ id: accId, name: `${domain} Subdomain`, authority: 'KE Registry', status: 'verified' }, ...s]);
    }
    setIsRequestingDomain(false);
    toastRef.current?.show(`Domain ${domain} added to accreditations.`, 'success');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#CE1126", "#006600"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header - visible logout button */}
            <View style={styles.header}>
              <Text style={styles.greeting}>{user?.email ? `Signed in as ${user.email}` : 'Signed in'}</Text>
              <TouchableOpacity style={styles.profileButton} onPress={handleSignOut} accessibilityRole="button">
                <LogOut color="#FFF" size={16} />
              </TouchableOpacity>
            </View>

            {/* Institution name (kept in-page) */}
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.institutionName}>{user?.profile?.institutionName || 'Institution'}</Text>
            </View>
            {/* Tabs */}
            <View style={styles.tabsRow}>
              <Pressable onPress={() => setActiveTab('verification')} style={[styles.tabButton, activeTab === 'verification' && styles.tabActive]}>
                <Text style={styles.tabText}>Verification</Text>
                {certificates.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{certificates.length}</Text>
                  </View>
                )}
              </Pressable>
              <Pressable onPress={() => setActiveTab('profile')} style={[styles.tabButton, activeTab === 'profile' && styles.tabActive]}>
                <Text style={styles.tabText}>Profile</Text>
              </Pressable>
              <Pressable onPress={() => setActiveTab('domain')} style={[styles.tabButton, activeTab === 'domain' && styles.tabActive]}>
                <Text style={styles.tabText}>Domain</Text>
              </Pressable>
            </View>
            {isMenuOpen && (
              <View style={styles.profileMenu}>
                {/* Profile moved to Profile tab; keep logout here only */}
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={handleSignOut}
                >
                  <LogOut color="#FFF" size={16} style={{ marginRight: 8 }} />
                  <Text style={styles.profileMenuText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Content per tab */}
            {activeTab === 'verification' && (
              <>
                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                  {quickStats.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                      <View
                        style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}
                      >
                        <stat.icon color={stat.color} size={20} />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Certificates Grid */}
                <View style={styles.certificatesCard}>
                  <View style={styles.certificatesHeader}>
                    <Text style={styles.certificatesTitle}>Recent Certificates</Text>
                    <TouchableOpacity style={styles.verifyAllButton} onPress={handleVerifyAll} disabled={isVerifyingAll} accessibilityRole="button">
                      {isVerifyingAll ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <ActivityIndicator size="small" color="#FFF" />
                          <Text style={[styles.verifyAllButtonText, { marginLeft: 8 }]}>Verifying...</Text>
                        </View>
                      ) : (
                        <Text style={styles.verifyAllButtonText}>VERIFY ALL</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.certificatesGrid}>
                    {certificates.map((cert, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.certificateItem}
                        onPress={() => {
                          setSelectedCertificate(cert);
                          setIsCertificateVisible(true);
                        }}
                      >
                        <View style={styles.certificateIcon}>
                          <Award color={cert.isReal ? Colors.green : Colors.red} size={16} />
                        </View>
                        <View style={styles.certificateContent}>
                          <Text style={styles.certificateText}>{cert.title}</Text>
                          <Text style={styles.certificateYear}>Issued: {cert.year}</Text>
                          <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerifyCertificate(cert)} disabled={isVerifyingAll || verifyingIds[cert.id]}>
                            {verifyingIds[cert.id] ? (
                              <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                              <Text style={styles.verifyButtonText}>{isVerifyingAll ? 'Queued' : 'Verify with AI'}</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {activeTab === 'profile' && (
                          <View style={styles.profileCardFull}>
                            <Text style={styles.profileTitle}>Profile Overview</Text>
                            {!isEditingProfile ? (
                              <>
                                <Text style={styles.profileItem}><Text style={styles.label}>Name: </Text>{editableProfile.institutionName || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Website: </Text>{editableProfile.website || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Email: </Text>{editableProfile.email || user?.email || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Phone: </Text>{editableProfile.phone || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Address: </Text>{editableProfile.address || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Admin: </Text>{editableProfile.principalName || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Institution Reg No: </Text>{editableProfile.accreditationNumber || '-'}</Text>
                                <Text style={styles.profileItem}><Text style={styles.label}>Institution Type: </Text>{editableProfile.institutionType || '-'}</Text>
                                <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditingProfile(true)}>
                                  <Text style={styles.editBtnText}>Edit Profile</Text>
                                </TouchableOpacity>
                              </>
                            ) : (
                              <>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.institutionName} onChangeText={(v) => setEditableProfile((p) => ({ ...p, institutionName: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.website} onChangeText={(v) => setEditableProfile((p) => ({ ...p, website: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.email} onChangeText={(v) => setEditableProfile((p) => ({ ...p, email: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.phone} onChangeText={(v) => setEditableProfile((p) => ({ ...p, phone: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.address} onChangeText={(v) => setEditableProfile((p) => ({ ...p, address: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.principalName} onChangeText={(v) => setEditableProfile((p) => ({ ...p, principalName: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.accreditationNumber} onChangeText={(v) => setEditableProfile((p) => ({ ...p, accreditationNumber: v }))} />
                                </View>
                                <View style={styles.inputRow}>
                                  <TextInput style={styles.input} value={editableProfile.institutionType} onChangeText={(v) => setEditableProfile((p) => ({ ...p, institutionType: v }))} />
                                </View>
                                <View style={styles.editActions}>
                                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                                  <TouchableOpacity style={styles.cancelBtn} onPress={resetProfileEdits}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                                </View>
                              </>
                            )}
                          </View>
                        )}

            {activeTab === 'domain' && (
              <View style={styles.certificatesCard}>
                <Text style={styles.certificatesTitle}>Domain</Text>
                <DomainManager />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Profile Modal */}
      <Modal
        visible={isProfileVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Profile</Text>
            {!isEditingProfile ? (
              <>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Institution:</Text><Text>{editableProfile.institutionName || "-"}</Text></View>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Phone:</Text><Text>{editableProfile.phone || "-"}</Text></View>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Website:</Text><Text>{editableProfile.website || "-"}</Text></View>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Address:</Text><Text>{editableProfile.address || "-"}</Text></View>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Principal:</Text><Text>{editableProfile.principalName || "-"}</Text></View>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Accreditation:</Text><Text>{editableProfile.accreditationNumber || "-"}</Text></View>
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>Type:</Text><Text>{editableProfile.institutionType || "-"}</Text></View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#999" }]} onPress={() => setIsProfileVisible(false)}>
                    <Text style={styles.actionText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#00C65A" }]} onPress={() => setIsEditingProfile(true)}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <ScrollView>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Institution Name" value={editableProfile.institutionName} onChangeText={(v) => setEditableProfile((p) => ({ ...p, institutionName: v }))} />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={editableProfile.phone} onChangeText={(v) => setEditableProfile((p) => ({ ...p, phone: v }))} />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Website" value={editableProfile.website} onChangeText={(v) => setEditableProfile((p) => ({ ...p, website: v }))} />
                  </View>
                  {/* .ke domain managed in Domain tab */}
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Physical Address" value={editableProfile.address} onChangeText={(v) => setEditableProfile((p) => ({ ...p, address: v }))} />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Principal / Admin Name" value={editableProfile.principalName} onChangeText={(v) => setEditableProfile((p) => ({ ...p, principalName: v }))} />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Accreditation Number" value={editableProfile.accreditationNumber} onChangeText={(v) => setEditableProfile((p) => ({ ...p, accreditationNumber: v }))} />
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder="Institution Type" value={editableProfile.institutionType} onChangeText={(v) => setEditableProfile((p) => ({ ...p, institutionType: v }))} />
                  </View>
                </ScrollView>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#999" }]} onPress={resetProfileEdits}>
                    <Text style={styles.actionText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#00C65A" }]} onPress={handleSaveProfile}>
                    <Text style={styles.actionText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Certificate Modal */}
      <Modal
        visible={isCertificateVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCertificateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedCertificate ? (
              <>
                <Text style={styles.modalTitle}>Certificate Details</Text>
                <ScrollView>
                  <View style={styles.certificateContainer}>
                    <View style={styles.certificateHeader}>
                      <Text style={styles.certificateTitle}>Certificate of Completion</Text>
                      <Text style={styles.certificateSubtitle}>This is to certify that</Text>
                    </View>
                    
                    <View style={styles.certificateBody}>
                      <View style={styles.certificateField}>
                        <Text style={styles.fieldLabel}>Recipient:</Text>
                        <Text style={styles.fieldValue}>{selectedCertificate.recipientName}</Text>
                      </View>
                      <View style={styles.certificateField}>
                        <Text style={styles.fieldLabel}>Course:</Text>
                        <Text style={styles.fieldValue}>{selectedCertificate.course}</Text>
                      </View>
                      <View style={styles.certificateField}>
                        <Text style={styles.fieldLabel}>Year:</Text>
                        <Text style={styles.fieldValue}>{selectedCertificate.year}</Text>
                      </View>
                      <View style={styles.certificateField}>
                        <Text style={styles.fieldLabel}>Date Issued:</Text>
                        <Text style={styles.fieldValue}>{selectedCertificate.dateIssued}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.certificateFooter}>
                      <View style={styles.signatureSection}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>{selectedCertificate.signatoryName}</Text>
                        <Text style={styles.signatureTitle}>{selectedCertificate.signatoryDesignation}</Text>
                      </View>
                      <Text style={styles.certificateNumber}>{selectedCertificate.certificateNo}</Text>
                    </View>

                  {/* Translator */}
                  <View style={styles.translatorRow}>
                    <Text style={{ fontWeight: "600", marginBottom: 8 }}>AI Translator</Text>
                    <Picker selectedValue={targetLanguage} onValueChange={(v) => setTargetLanguage(v)} dropdownIconColor="#333">
                      <Picker.Item label="English" value="English" />
                      <Picker.Item label="Swahili" value="Swahili" />
                      <Picker.Item label="French" value="French" />
                      <Picker.Item label="Arabic" value="Arabic" />
                      <Picker.Item label="Chinese" value="Chinese" />
                    </Picker>
                    <View style={styles.translatorActions}>
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#4A90E2" }]} onPress={() => Alert.alert("Translation Ready", `Certificate translated to ${targetLanguage}.`, [{ text: "OK" }])}>
                        <Text style={styles.actionText}>Translate</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                </ScrollView>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#999" }]}
                    onPress={() => setIsCertificateVisible(false)}
                  >
                    <Text style={styles.actionText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#00C65A" }]}
                    onPress={() => selectedCertificate && handleVerifyCertificate(selectedCertificate)}
                  >
                    <Text style={styles.actionText}>Verify with AI</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text>No certificate selected</Text>
            )}
          </View>
        </View>
      </Modal>
      {/* Toast (mounted after ref is created) */}
      <Toast ref={toastRef} />
    </View>
  );
}
