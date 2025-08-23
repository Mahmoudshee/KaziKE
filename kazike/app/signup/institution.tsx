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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, GraduationCap, Building, Mail, Phone, Lock, MapPin, User, Globe, FileText } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get('window');

export default function InstitutionSignupScreen() {
  const { signUp, isLoading, setSelectedRole } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institutionName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    institutionType: "",
    accreditationNumber: "",
    website: "",
    domain: "",
    address: "",
    principalName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { institutionName, email, phone, password, confirmPassword } = formData;
    console.log("Validating step 1 with data:", { institutionName, email, phone, password: password ? "***" : "", confirmPassword: confirmPassword ? "***" : "" });
    
    if (!institutionName || !email || !phone || !password || !confirmPassword) {
      console.log("Missing required fields");
      Alert.alert("Validation Error", "Please fill in all required fields");
      return false;
    }
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      console.log("Password too short");
      Alert.alert("Validation Error", "Password must be at least 6 characters long");
      return false;
    }
    console.log("Step 1 validation passed");
    return true;
  };

  const validateStep2 = () => {
    const { institutionType, accreditationNumber, address, principalName } = formData;
    
    if (!institutionType) {
      Alert.alert("Validation Error", "Please select an institution type");
      return false;
    }
    if (!accreditationNumber) {
      Alert.alert("Validation Error", "Please enter the accreditation number");
      return false;
    }
    if (!address) {
      Alert.alert("Validation Error", "Please enter the physical address");
      return false;
    }
    if (!principalName) {
      Alert.alert("Validation Error", "Please enter the principal/admin name");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    console.log("handleNextStep called, current step:", step);
    console.log("validateStep1 result:", validateStep1());
    if (step === 1 && validateStep1()) {
      console.log("Moving to step 2");
      setStep(2);
    } else {
      console.log("Validation failed or wrong step");
    }
  };

  const handleSignup = async () => {
    if (!validateStep2()) {
      return;
    }

    const {
      institutionName,
      email,
      phone,
      password,
      institutionType,
      accreditationNumber,
      website,
      address,
      principalName,
      domain,
    } = formData;

    try {
      console.log("Starting institution registration...");
      const user = await signUp({
        email,
        role: "institution",
        password,
        profile: {
          institutionName,
          phone,
          institutionType,
          accreditationNumber,
          website,
          address,
          principalName,
        },
        domain,
      });

      console.log("Registration successful, user:", user);
      
      // Set role and navigate to verification
      setSelectedRole("institution");
      router.push("/verify-institution");
    } catch (error) {
      console.error("Registration error:", error);
      const message = error instanceof Error ? error.message : "Please try again later.";
      
      if (message.includes("already registered")) {
        if (message.includes("Email already registered")) {
          Alert.alert("Email Already Taken",
            "This email address is already registered. Please use a different email or try logging in with your existing account.",
            [
              { text: "OK", style: "default" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        } else if (message.includes("Phone already registered")) {
          Alert.alert("Phone Number Already Taken",
            "This phone number is already registered. Please use a different phone number or try logging in with your existing account.",
            [
              { text: "OK", style: "default" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        } else {
          Alert.alert("Credentials Already Taken",
            "Some of your credentials are already registered. Please check your email and phone number, or try logging in with your existing account.",
            [
              { text: "OK", style: "default" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        }
        return;
      }
      Alert.alert("Registration Failed", message);
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
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => (step === 1 ? router.back() : setStep(step - 1))}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <ArrowLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Institution Signup</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Step indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, step >= 1 && styles.progressActive]} />
              <View style={[styles.progressStep, step >= 2 && styles.progressActive]} />
            </View>

            {/* Debug info */}
            <Text style={styles.debugText}>Current Step: {step}</Text>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {step === 1 && (
                <View style={styles.formCard}>
                  <View style={styles.stepHeader}>
                    <GraduationCap color="#00C65A" size={24} />
                    <Text style={styles.stepTitle}>Step 1: Account Information</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Building color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Institution Name *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={formData.institutionName}
                      onChangeText={(v) => handleInputChange("institutionName", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Mail color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Official Email *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={(v) => handleInputChange("email", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Phone color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      keyboardType="phone-pad"
                      value={formData.phone}
                      onChangeText={(v) => handleInputChange("phone", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Lock color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      secureTextEntry
                      value={formData.password}
                      onChangeText={(v) => handleInputChange("password", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Lock color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      secureTextEntry
                      value={formData.confirmPassword}
                      onChangeText={(v) => handleInputChange("confirmPassword", v)}
                    />
                  </View>

                  <TouchableOpacity style={styles.primaryButton} onPress={handleNextStep}>
                    <Text style={styles.primaryButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}

              {step === 2 && (
                <View style={styles.formCard}>
                  <View style={styles.stepHeader}>
                    <Building color="#00C65A" size={24} />
                    <Text style={styles.stepTitle}>Step 2: Institutional Details</Text>
                  </View>

                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={formData.institutionType}
                      onValueChange={(v: string) => handleInputChange("institutionType", v)}
                      style={styles.picker}
                      dropdownIconColor="#FFFFFF"
                      itemStyle={{ color: "#FFFFFF" }}
                    >
                      <Picker.Item label="Select Institution Type *" value="" color="#FFFFFF" />
                      <Picker.Item label="University" value="University" color="#FFFFFF" />
                      <Picker.Item label="College" value="College" color="#FFFFFF" />
                      <Picker.Item label="High School" value="High School" color="#FFFFFF" />
                      <Picker.Item label="Vocational" value="Vocational" color="#FFFFFF" />
                      <Picker.Item label="Training Center" value="Training Center" color="#FFFFFF" />
                    </Picker>
                  </View>

                  <View style={styles.inputContainer}>
                    <FileText color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Accreditation Number *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={formData.accreditationNumber}
                      onChangeText={(v) => handleInputChange("accreditationNumber", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Globe color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Website (optional)"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={formData.website}
                      onChangeText={(v) => handleInputChange("website", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Globe color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Get .Ke domain name (optional)"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={formData.domain}
                      onChangeText={(v) => handleInputChange("domain", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <MapPin color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Physical Address *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={formData.address}
                      onChangeText={(v) => handleInputChange("address", v)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <User color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Principal / Admin Name *"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={formData.principalName}
                      onChangeText={(v) => handleInputChange("principalName", v)}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: "#CE1126" }]}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    <Text style={[styles.primaryButtonText, { color: "#FFFFFF" }]}>
                      {isLoading ? "Registering..." : "Register Institution"}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.loginPrompt}>
                    <Text style={styles.loginPromptText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                      <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF" },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  progressStep: {
    width: 60,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    marginHorizontal: 4,
  },
  progressActive: { backgroundColor: "#FFFFFF" },

  content: { flex: 1, paddingHorizontal: 16 },

  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF", marginLeft: 8 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 0,
  },

  pickerWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: { 
    color: "#FFFFFF", 
    fontSize: 15,
    backgroundColor: "transparent",
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: { color: "#CE1126", fontSize: 16, fontWeight: "600" },

  loginPrompt: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  loginPromptText: { fontSize: 14, color: "#FFFFFF" },
  loginLink: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  debugText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});
