import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Shield, 
  Globe, 
  Briefcase, 
  FileText,
  ChevronRight 
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const valueHighlights = [
    {
      icon: Shield,
      title: "Verified EduID",
      description: "Government-backed digital identity",
    },
    {
      icon: Globe,
      title: ".KE Subdomain Portfolio",
      description: "Professional online presence",
    },
    {
      icon: Briefcase,
      title: "AI Job Matching",
      description: "Smart career opportunities",
    },
    {
      icon: FileText,
      title: "Multilingual CV",
      description: "Reach global employers",
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B1538", "#A91B47", "#C41E3A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🇰🇪</Text>
              </View>
              
              <Text style={styles.heroTitle}>
                Claim Your .KE Digital Identity
              </Text>
              
              <Text style={styles.heroSubtitle}>
                Get your verified EduID, secure your .KE subdomain, and unlock 
                trusted job opportunities in Kenya and beyond.
              </Text>

              <View style={styles.ctaContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.push("/profile-selection")}
                  accessibilityLabel="Get started with your digital identity"
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <ChevronRight color="#FFFFFF" size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push("/login")}
                  accessibilityLabel="Sign in to your account"
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Value Highlights */}
            <View style={styles.highlightsSection}>
              <Text style={styles.sectionTitle}>Why Choose .KE Identity?</Text>
              
              {valueHighlights.map((item, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.highlightCard,
                    {
                      opacity: scrollY.interpolate({
                        inputRange: [200 + index * 50, 300 + index * 50],
                        outputRange: [0, 1],
                        extrapolate: "clamp",
                      }),
                      transform: [
                        {
                          translateY: scrollY.interpolate({
                            inputRange: [200 + index * 50, 300 + index * 50],
                            outputRange: [30, 0],
                            extrapolate: "clamp",
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.highlightIcon}>
                    <item.icon color="#00C65A" size={24} />
                  </View>
                  <View style={styles.highlightContent}>
                    <Text style={styles.highlightTitle}>{item.title}</Text>
                    <Text style={styles.highlightDescription}>
                      {item.description}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Powered by Kenya Education Network
              </Text>
            </View>
          </Animated.ScrollView>
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    minHeight: height * 0.7,
    justifyContent: "center",
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logoText: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  ctaContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#00C65A",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 200,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  highlightsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 32,
  },
  highlightCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  highlightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 198, 90, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  highlightDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
});