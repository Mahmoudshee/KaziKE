import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Mail, Phone } from "lucide-react-native";

export default function ApprovalPendingScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#CE1126", "#006600"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Clock color="#FF9500" size={32} />
              </View>
              <Text style={styles.title}>Application Under Review</Text>
              <Text style={styles.subtitle}>
                Your application is being reviewed by our verification team. 
                This process typically takes 2-3 business days.
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>What happens next?</Text>
              <View style={styles.stepsList}>
                <Text style={styles.step}>
                  • We'll verify your credentials with relevant authorities
                </Text>
                <Text style={styles.step}>
                  • You'll receive an email notification once approved
                </Text>
                <Text style={styles.step}>
                  • Access to your dashboard will be granted upon approval
                </Text>
              </View>
            </View>

            <View style={styles.contactContainer}>
              <Text style={styles.contactTitle}>Need help?</Text>
              <View style={styles.contactMethods}>
                <View style={styles.contactItem}>
                  <Mail color="rgba(255, 255, 255, 0.7)" size={16} />
                  <Text style={styles.contactText}>support@kenic.or.ke</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone color="rgba(255, 255, 255, 0.7)" size={16} />
                  <Text style={styles.contactText}>+254 20 2750000</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/")}
              accessibilityLabel="Back to home"
              accessibilityRole="button"
            >
              <Text style={styles.backButtonText}>Back to Home</Text>
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
    backgroundColor: "rgba(206, 17, 38, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  stepsList: {
    gap: 8,
  },
  step: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  contactContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  contactMethods: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  backButton: {
    backgroundColor: "#CE1126",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});