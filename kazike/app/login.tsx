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
import { ArrowLeft, Mail, Lock } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import ErrorMessage from "@/components/ErrorMessage";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, error, clearError } = useAuthStore();

  // Auto clear error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      console.log("Attempting login with:", email);
      const user = await signIn(email, password);
      console.log("Login successful, user role:", user.role);

      router.replace(`/dashboard/${user.role}`);
    } catch (err) {
      console.error("Login error:", err);
      // Error is shown in <ErrorMessage>, but keep fallback alert
      Alert.alert(
        "Login Failed",
        err instanceof Error ? err.message : "Please try again."
      );
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
                onPress={() => router.back()}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <ArrowLeft color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Sign In</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
                <Text style={styles.subtitle}>
                  Welcome back! Sign in to access your .KE digital identity.
                </Text>

                {/* Error message */}
                <ErrorMessage
                  message={error || ""}
                  onDismiss={clearError}
                  type="error"
                />

                <View style={styles.form}>
                  {/* Email */}
                  <View style={styles.inputContainer}>
                    <Mail color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email or Phone"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (error) clearError();
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      accessibilityLabel="Email or phone input"
                    />
                  </View>

                  {/* Password */}
                  <View style={styles.inputContainer}>
                    <Lock color="rgba(255, 255, 255, 0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (error) clearError();
                      }}
                      secureTextEntry
                      accessibilityLabel="Password input"
                    />
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      { opacity: isLoading ? 0.7 : 1 },
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    accessibilityLabel="Sign in button"
                    accessibilityRole="button"
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                  </TouchableOpacity>

                  {/* Signup Prompt */}
                  <View style={styles.signupPrompt}>
                    <Text style={styles.signupPromptText}>
                      Don&apos;t have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/profile-selection")}
                    >
                      <Text style={styles.signupLink}>Get Started</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
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
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },

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
  placeholder: { width: width > 768 ? 48 : 40 },

  content: {
    flex: 1,
    paddingHorizontal: width > 768 ? 32 : 24,
    paddingTop: height > 800 ? 20 : 10,
    paddingBottom: 20,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: width > 768 ? 18 : 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: height > 800 ? 40 : 30,
    paddingHorizontal: width > 768 ? 40 : 20,
  },
  form: { gap: height > 800 ? 24 : 20 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: width > 768 ? 20 : 16,
    paddingVertical: width > 768 ? 18 : 16,
    gap: 12,
  },
  input: { flex: 1, fontSize: width > 768 ? 17 : 16, color: "#FFFFFF" },

  forgotPassword: { alignSelf: "flex-end" },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: width > 768 ? 15 : 14,
    textDecorationLine: "underline",
  },

  loginButton: {
    backgroundColor: "#CE1126",
    paddingVertical: width > 768 ? 18 : 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: width > 768 ? 17 : 16,
    fontWeight: "600",
  },

  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupPromptText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: width > 768 ? 15 : 14,
  },
  signupLink: {
    color: "#CE1126",
    fontSize: width > 768 ? 15 : 14,
    fontWeight: "600",
  },
});
