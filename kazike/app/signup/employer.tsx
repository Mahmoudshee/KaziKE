import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Building2, Mail, Phone, FileText } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";

export default function EmployerSignupScreen() {
  const [formData, setFormData] = useState({
    orgName: "",
    kraPin: "",
    email: "",
    phone: "",
    password: "",
  });
  const { signUp, isLoading } = useAuthStore();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const { orgName, kraPin, email, phone, password } = formData;
    
    if (!orgName || !kraPin || !email || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const user = await signUp({
        email,
        role: "employer",
        password,
        profile: { orgName, kraPin, phone },
      });
      // After signup, navigate to company verification
      router.push("/verify-company");
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error instanceof Error ? error.message : "Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B1538", "#A91B47", "#C41E3A"]}
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
              <Text style={styles.headerTitle}>Employer Signup</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <Text style={styles.subtitle}>
                Register your organization to access verified talent pool.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Building2 color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Organization Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.orgName}
                    onChangeText={(value) => handleInputChange("orgName", value)}
                    accessibilityLabel="Organization name input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FileText color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="KRA PIN"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.kraPin}
                    onChangeText={(value) => handleInputChange("kraPin", value)}
                    autoCapitalize="characters"
                    accessibilityLabel="KRA PIN input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Mail color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Business Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Business email input"
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
                  accessibilityLabel="Register organization button"
                  accessibilityRole="button"
                >
                  <Text style={styles.signupButtonText}>
                    {isLoading ? "Registering..." : "Register Organization"}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    gap: 16,
    paddingBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  signupButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});