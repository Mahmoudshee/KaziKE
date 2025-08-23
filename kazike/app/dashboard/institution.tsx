import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
  Alert,
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
  greeting: { fontSize: 16, color: "rgba(255, 255, 255, 0.8)" },
  institutionName: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  domainText: { fontSize: 14, color: "rgba(255,255,255,0.7)" },
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
  statValue: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "rgba(255, 255, 255, 0.7)", textAlign: "center" },

  // Certificates
  certificatesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
    backgroundColor: "#006400",
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
  },
  certificateIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  certificateContent: { flex: 1 },
  certificateText: { fontSize: 13, color: "#FFFFFF", marginBottom: 4 },
  certificateYear: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 },
  verifyButton: {
    backgroundColor: "#00C65A",
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16, color: "#8B1538" },
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
    backgroundColor: "#f8f9fa",
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
    borderBottomColor: "#8B1538",
    paddingBottom: 15,
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B1538",
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
    backgroundColor: "#f2f4f7",
    borderRadius: 10,
  },
  translatorActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
});

export default function InstitutionDashboard() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState({
    institutionName: user?.profile?.institutionName || "",
    website: user?.profile?.website || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    domain: user?.profile?.domain || user?.domain || "",
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
      domain: editableProfile.domain,
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
      domain: user?.profile?.domain || user?.domain || "",
      address: user?.profile?.address || "",
      principalName: user?.profile?.principalName || "",
      accreditationNumber: user?.profile?.accreditationNumber || "",
      institutionType: user?.profile?.institutionType || "",
    });
    setIsEditingProfile(false);
  };

  const [issuedCount, setIssuedCount] = useState(0);
  const [deniedCount, setDeniedCount] = useState(0);
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

  const [isCertificateVisible, setIsCertificateVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Cert | null>(null);

  const [translateOpen, setTranslateOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string>("English");

  const handleVerifyCertificate = (certificate: Cert) => {
    setTimeout(() => {
      if (certificate.isReal) {
        Alert.alert(
          "✅ Certificate Validated",
          `Certificate ${certificate.certificateNo} has been verified as authentic.`,
          [{ text: "OK" }]
        );
        setIssuedCount((n) => n + 1);
      } else {
        Alert.alert(
          "❌ Certificate Denied",
          `Certificate ${certificate.certificateNo} has been identified as counterfeit.`,
          [{ text: "OK" }]
        );
        setDeniedCount((n) => n + 1);
      }
      setCertificates((prev) => prev.filter((c) => c.id !== certificate.id));
      setIsCertificateVisible(false);
      setSelectedCertificate(null);
    }, 800);
  };
  
  const handleVerifyAll = () => {
    Alert.alert(
      "Verify All Certificates",
      `This will verify all ${certificates.length} remaining certificates. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Verify All", 
          onPress: () => {
            const realCerts = certificates.filter(c => c.isReal);
            const fakeCerts = certificates.filter(c => !c.isReal);
            setIssuedCount(prev => prev + realCerts.length);
            setDeniedCount(prev => prev + fakeCerts.length);
            setCertificates([]);
            Alert.alert(
              "Verification Complete",
              `Validated: ${realCerts.length} | Denied: ${fakeCerts.length}`,
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
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
                <Text style={styles.greeting}>Institution Portal</Text>
                <Text style={styles.institutionName}>
                  {user?.profile?.institutionName || "Institution"}
                </Text>
                <Text style={styles.domainText}>
                  {user?.profile?.domain || user?.domain || "example.ke"}
                </Text>
              </View>

              <TouchableOpacity style={styles.profileButton} onPress={toggleMenu}>
                <GraduationCap color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>

            {isMenuOpen && (
              <View style={styles.profileMenu}>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={() => {
                    setIsProfileVisible(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <User color="#FFF" size={16} style={{ marginRight: 8 }} />
                  <Text style={styles.profileMenuText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileMenuItem}
                  onPress={handleSignOut}
                >
                  <LogOut color="#FFF" size={16} style={{ marginRight: 8 }} />
                  <Text style={styles.profileMenuText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            )}

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
                <TouchableOpacity style={styles.verifyAllButton} onPress={handleVerifyAll}>
                  <Text style={styles.verifyAllButtonText}>VERIFY ALL</Text>
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
                      <Award color="#00C65A" size={16} />
                    </View>
                    <View style={styles.certificateContent}>
                      <Text style={styles.certificateText}>{cert.title}</Text>
                      <Text style={styles.certificateYear}>Issued: {cert.year}</Text>
                      <TouchableOpacity style={styles.verifyButton} onPress={() => { setSelectedCertificate(cert); setIsCertificateVisible(true); }}>
                        <Text style={styles.verifyButtonText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
                <View style={styles.inputRow}><Text style={{ fontWeight: "600", marginRight: 8 }}>.ke Domain:</Text><Text>{editableProfile.domain || "-"}</Text></View>
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
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} placeholder=".ke Domain" autoCapitalize="none" value={editableProfile.domain} onChangeText={(v) => setEditableProfile((p) => ({ ...p, domain: v }))} />
                  </View>
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
    </View>
  );
}
