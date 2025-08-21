import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shield, CheckCircle, Camera, FileText } from "lucide-react-native";

export default function KycScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState({
    idUpload: false,
    dobVerification: false,
    faceMatch: false,
  });

  const handleVerificationStep = (step: keyof typeof verificationSteps) => {
    setVerificationSteps(prev => ({ ...prev, [step]: true }));
  };

  const handleCompleteKyc = () => {
    const allStepsComplete = Object.values(verificationSteps).every(Boolean);
    
    if (!allStepsComplete) {
      Alert.alert("Incomplete", "Please complete all verification steps");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/dashboard/youth");
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B1538", "#A91B47", "#C41E3A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Shield color="#00C65A" size={32} />
              </View>
              <Text style={styles.title}>Identity Verification</Text>
              <Text style={styles.subtitle}>
                Complete these steps to verify your identity and activate your .KE digital ID.
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              <TouchableOpacity
                style={[
                  styles.stepCard,
                  verificationSteps.idUpload && styles.completedStep,
                ]}
                onPress={() => handleVerificationStep("idUpload")}
                accessibilityLabel="Upload ID document"
                accessibilityRole="button"
              >
                <View style={styles.stepIcon}>
                  {verificationSteps.idUpload ? (
                    <CheckCircle color="#00C65A" size={24} />
                  ) : (
                    <FileText color="rgba(255, 255, 255, 0.7)" size={24} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Upload ID Document</Text>
                  <Text style={styles.stepDescription}>
                    Take a clear photo of your National ID
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepCard,
                  verificationSteps.dobVerification && styles.completedStep,
                ]}
                onPress={() => handleVerificationStep("dobVerification")}
                accessibilityLabel="Verify date of birth"
                accessibilityRole="button"
              >
                <View style={styles.stepIcon}>
                  {verificationSteps.dobVerification ? (
                    <CheckCircle color="#00C65A" size={24} />
                  ) : (
                    <Shield color="rgba(255, 255, 255, 0.7)" size={24} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Verify Date of Birth</Text>
                  <Text style={styles.stepDescription}>
                    Confirm your date of birth matches your ID
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepCard,
                  verificationSteps.faceMatch && styles.completedStep,
                ]}
                onPress={() => handleVerificationStep("faceMatch")}
                accessibilityLabel="Take selfie for face matching"
                accessibilityRole="button"
              >
                <View style={styles.stepIcon}>
                  {verificationSteps.faceMatch ? (
                    <CheckCircle color="#00C65A" size={24} />
                  ) : (
                    <Camera color="rgba(255, 255, 255, 0.7)" size={24} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Face Verification</Text>
                  <Text style={styles.stepDescription}>
                    Take a selfie to match with your ID photo
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.completeButton,
                { opacity: isLoading ? 0.7 : 1 },
              ]}
              onPress={handleCompleteKyc}
              disabled={isLoading}
              accessibilityLabel="Complete verification"
              accessibilityRole="button"
            >
              <Text style={styles.completeButtonText}>
                {isLoading ? "Verifying..." : "Complete Verification"}
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  completedStep: {
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    borderColor: "#00C65A",
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  completeButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});