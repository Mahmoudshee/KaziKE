import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, User, Mail, Phone, CreditCard, Calendar } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import ErrorMessage from "@/components/ErrorMessage";

const { width, height } = Dimensions.get('window');

export default function YouthSignupScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    dob: "",
    password: "",
  });
  const { signUp, isLoading, error, clearError } = useAuthStore();

  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000); // Auto-clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSignup = async () => {
    const { fullName, email, phone, nationalId, dob, password } = formData;
    
    if (!fullName || !email || !phone || !nationalId || !dob || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const user = await signUp({
        email,
        password,
        role: "youth",
        profile: {
          fullName,
          phone,
          nationalId,
          dateOfBirth: dob,
        },
      });
      
      console.log("User created with domain:", user.domain);
      
      // Navigate to KYC for verification
      router.push("/kyc");
    } catch (error) {
      // Error is now handled by the auth store and displayed via ErrorMessage component
      console.log("Signup error caught:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#CE1126", "#006600"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <ArrowLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Youth Signup</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView 
              style={styles.content} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.subtitle}>
                Create your .KE digital identity and unlock job opportunities.
              </Text>

              {/* Error Message Display */}
              <ErrorMessage 
                message={error || ""} 
                onDismiss={clearError}
                type="error"
              />

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <User color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange("fullName", value)}
                    accessibilityLabel="Full name input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Mail color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Email input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Phone color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange("phone", value)}
                    keyboardType="phone-pad"
                    accessibilityLabel="Phone number input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <CreditCard color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="National ID Number"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.nationalId}
                    onChangeText={(value) => handleInputChange("nationalId", value)}
                    accessibilityLabel="National ID input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Calendar color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (DD/MM/YYYY)"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.dob}
                    onChangeText={(value) => handleInputChange("dob", value)}
                    accessibilityLabel="Date of birth input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <User color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange("password", value)}
                    secureTextEntry
                    accessibilityLabel="Password input"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.signupButton,
                    { opacity: isLoading ? 0.7 : 1 },
                  ]}
                  onPress={handleSignup}
                  disabled={isLoading}
                  accessibilityLabel="Create account button"
                  accessibilityRole="button"
                >
                  <Text style={styles.signupButtonText}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width > 768 ? 32 : 24,
    paddingVertical: 16,
  },
  backButton: {
    width: width > 768 ? 48 : 40,
    height: width > 768 ? 48 : 40,
    borderRadius: width > 768 ? 24 : 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: width > 768 ? 20 : 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: width > 768 ? 48 : 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: width > 768 ? 32 : 24,
  },
  scrollContent: {
    paddingTop: height > 800 ? 20 : 10,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: width > 768 ? 18 : 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: height > 800 ? 40 : 30,
    paddingHorizontal: width > 768 ? 40 : 20,
  },
  form: {
    gap: height > 800 ? 24 : 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: width > 768 ? 20 : 16,
    paddingVertical: width > 768 ? 18 : 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: width > 768 ? 17 : 16,
    color: "#FFFFFF",
  },
  signupButton: {
    backgroundColor: "#CE1126",
    paddingVertical: width > 768 ? 18 : 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: width > 768 ? 17 : 16,
    fontWeight: "600",
  },
});