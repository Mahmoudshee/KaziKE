///////////////////////////////////////////////////////////////////////
import { router } from "expo-router";
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
import { ArrowLeft } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { Picker } from "@react-native-picker/picker"; // Better picker package

export default function InstitutionSignupScreen() {
  const { signUp, signIn, isLoading, setSelectedRole } = useAuthStore();

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
    if (!institutionName || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSignup = async () => {
    const { institutionName, email, phone, password, institutionType, accreditationNumber, website, address, principalName, domain } = formData;
    if (!institutionType || !accreditationNumber || !address || !principalName) {
      Alert.alert("Error", "Please complete all required fields");
      return;
    }
    try {
      const createdUser = await signUp({
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
      setSelectedRole("institution");
      router.replace("/dashboard/institution");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      if (message.includes("already registered")) {
        if (message.includes("Email already registered")) {
          Alert.alert(
            "Email Already Taken", 
            "This email address is already registered. Please use a different email or try logging in with your existing account.",
            [
              { text: "OK", style: "default" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        } else if (message.includes("Phone already registered")) {
          Alert.alert(
            "Phone Number Already Taken", 
            "This phone number is already registered. Please use a different phone number or try logging in with your existing account.",
            [
              { text: "OK", style: "default" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        } else {
          Alert.alert(
            "Credentials Already Taken", 
            "Some of your credentials are already registered. Please check your email and phone number, or try logging in with your existing account.",
            [
              { text: "OK", style: "default" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        }
        return;
      }
      Alert.alert("Signup Failed", message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => (step === 1 ? router.back() : setStep(step - 1))}>
            <ArrowLeft color="#222" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Institution Signup</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, step >= 1 && styles.progressActive]} />
          <View style={[styles.progressStep, step >= 2 && styles.progressActive]} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Step 1: Account Information</Text>

              <TextInput
                style={styles.input}
                placeholder="Institution Name *"
                placeholderTextColor="#888"
                value={formData.institutionName}
                onChangeText={(v) => handleInputChange("institutionName", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Official Email *"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(v) => handleInputChange("email", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(v) => handleInputChange("phone", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Password *"
                placeholderTextColor="#888"
                secureTextEntry
                value={formData.password}
                onChangeText={(v) => handleInputChange("password", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                placeholderTextColor="#888"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(v) => handleInputChange("confirmPassword", v)}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleNextStep}>
                <Text style={styles.primaryButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.formCard}>
              <Text style={styles.stepTitle}>Step 2: Institutional Details</Text>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.institutionType}
                  onValueChange={(v: string) => handleInputChange("institutionType", v)}
                  style={styles.picker}
                  dropdownIconColor="#333"
                >
                  <Picker.Item label="Select Institution Type *" value="" />
                  <Picker.Item label="University" value="University" />
                  <Picker.Item label="College" value="College" />
                  <Picker.Item label="High School" value="High School" />
                  <Picker.Item label="Vocational" value="Vocational" />
                  <Picker.Item label="Training Center" value="Training Center" />
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Accreditation Number *"
                placeholderTextColor="#888"
                value={formData.accreditationNumber}
                onChangeText={(v) => handleInputChange("accreditationNumber", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Website (optional)"
                placeholderTextColor="#888"
                value={formData.website}
                onChangeText={(v) => handleInputChange("website", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Get .Ke domain name (optional)"
                placeholderTextColor="#888"
                value={formData.domain}
                onChangeText={(v) => handleInputChange("domain", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Physical Address *"
                placeholderTextColor="#888"
                value={formData.address}
                onChangeText={(v) => handleInputChange("address", v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Principal / Admin Name *"
                placeholderTextColor="#888"
                value={formData.principalName}
                onChangeText={(v) => handleInputChange("principalName", v)}
              />

              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: "#006600" }]} onPress={handleSignup} disabled={isLoading}>
                <Text style={styles.primaryButtonText}>{isLoading ? "Registering..." : "Register Institution"}</Text>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                >
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>

              {/* Temporary test button - remove after debugging */}
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: "#4A90E2", marginTop: 10 }]} 
                onPress={() => {
                  console.log("Testing login navigation...");
                  router.push("/login");
                }}
              >
                <Text style={styles.primaryButtonText}>Test: Go to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  progressStep: {
    width: 60,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginHorizontal: 4,
  },
  progressActive: { backgroundColor: "#FF0000" }, // Kenyan red

  content: { flex: 1, paddingHorizontal: 16 },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 20 },

  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  inputFocused: { borderColor: "#006600" },

  pickerWrapper: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  picker: { color: "#111", fontSize: 15 },

  primaryButton: {
    backgroundColor: "#FF0000", // Kenyan red
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 14,
    color: "#555",
  },
  loginLink: {
    color: "#FF0000", // Kenyan red
    fontSize: 14,
    fontWeight: "600",
  },
});





////////////////////////////////////////////////
// import { router } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { ArrowLeft } from "lucide-react-native";
// import { useAuthStore } from "@/stores/auth-store";

// export default function InstitutionSignupScreen() {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     institutionName: "",
//     institutionType: "",
//     accreditationNumber: "",
//     email: "",
//     phone: "",
//     website: "",
//     address: "",
//     principalName: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const { signUp, isLoading } = useAuthStore();

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSignup = async () => {
//     const {
//       institutionName,
//       institutionType,
//       accreditationNumber,
//       email,
//       phone,
//       website,
//       address,
//       principalName,
//       password,
//       confirmPassword,
//     } = formData;

//     if (
//       !institutionName ||
//       !institutionType ||
//       !accreditationNumber ||
//       !email ||
//       !phone ||
//       !website ||
//       !address ||
//       !principalName ||
//       !password ||
//       !confirmPassword
//     ) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     try {
//       await signUp({
//         email,
//         role: "institution",
//         password,
//         profile: {
//           institutionName,
//           institutionType,
//           accreditationNumber,
//           phone,
//           website,
//           address,
//           principalName,
//         },
//       });
//       router.push("/approval-pending");
//     } catch (error) {
//       Alert.alert(
//         "Signup Failed",
//         error instanceof Error ? error.message : "Please try again later."
//       );
//     }
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <>
//             <Text style={styles.sectionTitle}>Institution Info</Text>
//             <CustomInput
//               label="Institution Name"
//               value={formData.institutionName}
//               onChangeText={(v) => handleInputChange("institutionName", v)}
//             />
//             <CustomInput
//               label="Institution Type (e.g. University, College)"
//               value={formData.institutionType}
//               onChangeText={(v) => handleInputChange("institutionType", v)}
//             />
//             <CustomInput
//               label="Accreditation Number"
//               value={formData.accreditationNumber}
//               onChangeText={(v) => handleInputChange("accreditationNumber", v)}
//             />
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <Text style={styles.sectionTitle}>Contact Details</Text>
//             <CustomInput
//               label="Official Email"
//               value={formData.email}
//               onChangeText={(v) => handleInputChange("email", v)}
//               keyboardType="email-address"
//             />
//             <CustomInput
//               label="Phone Number"
//               value={formData.phone}
//               onChangeText={(v) => handleInputChange("phone", v)}
//               keyboardType="phone-pad"
//             />
//             <CustomInput
//               label="Website"
//               value={formData.website}
//               onChangeText={(v) => handleInputChange("website", v)}
//             />
//             <CustomInput
//               label="Address"
//               value={formData.address}
//               onChangeText={(v) => handleInputChange("address", v)}
//             />
//           </>
//         );
//       case 3:
//         return (
//           <>
//             <Text style={styles.sectionTitle}>Admin & Security</Text>
//             <CustomInput
//               label="Principal / Registrar Name"
//               value={formData.principalName}
//               onChangeText={(v) => handleInputChange("principalName", v)}
//             />
//             <CustomInput
//               label="Password"
//               value={formData.password}
//               onChangeText={(v) => handleInputChange("password", v)}
//               secureTextEntry
//             />
//             <CustomInput
//               label="Confirm Password"
//               value={formData.confirmPassword}
//               onChangeText={(v) => handleInputChange("confirmPassword", v)}
//               secureTextEntry
//             />
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={["#000000", "#BB0000", "#006400"]}
//         style={styles.gradient}
//       >
//         <SafeAreaView style={styles.safeArea}>
//           <KeyboardAvoidingView
//             style={styles.keyboardView}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//           >
//             {/* Header */}
//             <View style={styles.header}>
//               <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => (step === 1 ? router.back() : setStep(step - 1))}
//               >
//                 <ArrowLeft color="#FFF" size={22} />
//               </TouchableOpacity>
//               <Text style={styles.headerTitle}>Institution Signup</Text>
//               <View style={{ width: 40 }} />
//             </View>

//             {/* Step Indicator */}
//             <View style={styles.stepIndicator}>
//               {[1, 2, 3].map((s) => (
//                 <View
//                   key={s}
//                   style={[
//                     styles.stepDot,
//                     {
//                       backgroundColor: step === s ? "#006400" : "rgba(255,255,255,0.4)",
//                     },
//                   ]}
//                 />
//               ))}
//             </View>

//             <ScrollView
//               style={styles.content}
//               showsVerticalScrollIndicator={false}
//             >
//               {renderStep()}

//               {/* Navigation */}
//               {step < 3 ? (
//                 <TouchableOpacity
//                   style={styles.nextButton}
//                   onPress={() => setStep(step + 1)}
//                 >
//                   <Text style={styles.buttonText}>Next</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.registerButton, { opacity: isLoading ? 0.7 : 1 }]}
//                   onPress={handleSignup}
//                   disabled={isLoading}
//                 >
//                   <Text style={styles.buttonText}>
//                     {isLoading ? "Registering..." : "Register Institution"}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </SafeAreaView>
//       </LinearGradient>
//     </View>
//   );
// }

// /* ----- Custom Input Component ----- */
// const CustomInput = ({
//   label,
//   value,
//   onChangeText,
//   secureTextEntry,
//   keyboardType,
// }: any) => (
//   <View style={styles.inputWrapper}>
//     <Text style={styles.inputLabel}>{label}</Text>
//     <TextInput
//       style={styles.input}
//       value={value}
//       onChangeText={onChangeText}
//       secureTextEntry={secureTextEntry}
//       keyboardType={keyboardType}
//       placeholder={label}
//       placeholderTextColor="rgba(0,0,0,0.4)"
//     />
//   </View>
// );

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   gradient: { flex: 1 },
//   safeArea: { flex: 1 },
//   keyboardView: { flex: 1 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//     alignItems: "center",
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "700" },
//   stepIndicator: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 8,
//     marginBottom: 16,
//   },
//   stepDot: { width: 10, height: 10, borderRadius: 5 },
//   content: {
//     flex: 1,
//     backgroundColor: "#FFF",
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#006400",
//     marginBottom: 16,
//   },
//   inputWrapper: { marginBottom: 16 },
//   inputLabel: { fontSize: 14, color: "#333", marginBottom: 6 },
//   input: {
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.2)",
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 15,
//     color: "#000",
//   },
//   nextButton: {
//     backgroundColor: "#BB0000",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 10,
//     alignItems: "center",
//   },
//   registerButton: {
//     backgroundColor: "#006400",
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
// });