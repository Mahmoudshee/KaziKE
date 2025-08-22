import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Building, FileText, CheckCircle, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get('window');

export default function VerifyGovernmentScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState({
    appointmentLetter: false,
    workId: false,
    ministryApproval: false,
  });

  const pickImage = async (key: keyof typeof docs) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets?.length) {
      setDocs((d)=>({ ...d, [key]: true }));
    }
  };

  const handleSubmit = () => {
    const allDone = Object.values(docs).every(Boolean);
    if (!allDone) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/approval-pending");
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#CE1126", "#006600"]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Building color="#00C65A" size={32} />
                </View>
                <Text style={styles.title}>Government Verification</Text>
                <Text style={styles.subtitle}>Upload documents to verify your government credentials.</Text>
              </View>

              <View style={styles.steps}>
                <View style={[styles.stepCard, docs.appointmentLetter && styles.stepDone]}>
                  <View style={styles.stepIcon}><FileText color="#FFFFFF" size={18} /></View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Official Appointment Letter</Text>
                    <Text style={styles.stepDesc}>Government appointment confirmation</Text>
                    {!docs.appointmentLetter && (
                      <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage('appointmentLetter')}>
                        <Upload color="#FFFFFF" size={16} />
                        <Text style={styles.actionText}>Choose File</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {docs.appointmentLetter && <CheckCircle color="#00C65A" size={20} />}
                </View>

                <View style={[styles.stepCard, docs.workId && styles.stepDone]}>
                  <View style={styles.stepIcon}><FileText color="#FFFFFF" size={18} /></View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Government Work ID</Text>
                    <Text style={styles.stepDesc}>Official government employee ID</Text>
                    {!docs.workId && (
                      <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage('workId')}>
                        <Upload color="#FFFFFF" size={16} />
                        <Text style={styles.actionText}>Choose File</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {docs.workId && <CheckCircle color="#00C65A" size={20} />}
                </View>

                <View style={[styles.stepCard, docs.ministryApproval && styles.stepDone]}>
                  <View style={styles.stepIcon}><FileText color="#FFFFFF" size={18} /></View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Ministry Approval Memo</Text>
                    <Text style={styles.stepDesc}>Approval from relevant ministry</Text>
                    {!docs.ministryApproval && (
                      <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage('ministryApproval')}>
                        <Upload color="#FFFFFF" size={16} />
                        <Text style={styles.actionText}>Choose File</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {docs.ministryApproval && <CheckCircle color="#00C65A" size={20} />}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, { opacity: isLoading ? 0.7 : Object.values(docs).every(Boolean) ? 1 : 0.7 }]}
                disabled={isLoading || !Object.values(docs).every(Boolean)}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>{isLoading ? 'Submitting...' : 'Submit for Review'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  content: { 
    flex: 1, 
    paddingHorizontal: width > 768 ? 32 : 24, 
    paddingTop: height > 800 ? 20 : 10,
    paddingBottom: 20,
    justifyContent: 'center' 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: height > 800 ? 40 : 30 
  },
  iconContainer: { 
    width: width > 768 ? 80 : 64, 
    height: width > 768 ? 80 : 64, 
    borderRadius: width > 768 ? 40 : 32, 
    backgroundColor: 'rgba(206, 17, 38, 0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 16 
  },
  title: { 
    fontSize: width > 768 ? 28 : 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: width > 768 ? 18 : 16, 
    color: 'rgba(255,255,255,0.9)', 
    textAlign: 'center', 
    lineHeight: 24,
    paddingHorizontal: width > 768 ? 40 : 20,
  },
  steps: { 
    gap: height > 800 ? 16 : 12, 
    marginBottom: 32 
  },
  stepCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    padding: width > 768 ? 20 : 16, 
    borderRadius: 12 
  },
  stepDone: { 
    borderWidth: 1, 
    borderColor: '#006600', 
    backgroundColor: 'rgba(0, 102, 0, 0.15)' 
  },
  stepIcon: { 
    width: width > 768 ? 48 : 40, 
    height: width > 768 ? 48 : 40, 
    borderRadius: width > 768 ? 24 : 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    marginRight: 12 
  },
  stepContent: { flex: 1 },
  stepTitle: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: width > 768 ? 18 : 16, 
    marginBottom: 4 
  },
  stepDesc: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: width > 768 ? 15 : 14 
  },
  actionBtn: { 
    marginTop: 10, 
    backgroundColor: '#CE1126', 
    paddingVertical: width > 768 ? 12 : 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 8,
    alignSelf: 'stretch',
    width: '100%',
  },
  actionText: { 
    color: '#FFFFFF', 
    fontWeight: '600',
    fontSize: width > 768 ? 15 : 14,
  },
  submitBtn: { 
    backgroundColor: '#CE1126', 
    paddingVertical: width > 768 ? 18 : 16, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: width > 768 ? 18 : 16 
  },
});


