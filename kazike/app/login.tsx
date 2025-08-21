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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const user = await signIn(email, password);
      
      // Navigate to appropriate dashboard based on role
      router.replace(`/dashboard/${user.role}`);
    } catch (error) {
      Alert.alert(
        "Login Failed", 
        error instanceof Error ? error.message : "Please check your credentials and try again."
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
              <Text style={styles.headerTitle}>Sign In</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Welcome back! Sign in to access your .KE digital identity.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mail color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email or Phone"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Email or phone input"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock color="rgba(255, 255, 255, 0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    accessibilityLabel="Password input"
                  />
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

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
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  form: {
    gap: 20,
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
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#00C65A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
    fontSize: 14,
  },
  signupLink: {
    color: "#00C65A",
    fontSize: 14,
    fontWeight: "600",
  },
});