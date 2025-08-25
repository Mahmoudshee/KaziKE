import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from "react-native";
import { Globe, CheckCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/colors";
import { useAuthStore } from "@/stores/auth-store";

export default function DomainManager() {
  const { user, setUser } = useAuthStore();
  const currentDomain = user?.domain || "";
  const [domain, setDomain] = useState<string>(currentDomain.replace(/\.KaziKE\.ke$/i, ""));
  const fullDomain = useMemo(() => `${domain || "your-domain"}.KaziKE.ke`, [domain]);
  const [showPublish, setShowPublish] = useState(false);

  return (
    <LinearGradient colors={["#000000", "#CE1126", "#006600"]} style={styles.gradientCard}>
      <View style={styles.domainInfoCard}>
        <View style={styles.domainHeader}>
          <Globe color="#00C65A" size={22} />
          <Text style={styles.domainTitle}>Government Domain</Text>
        </View>

        <View style={styles.domainInputContainer}>
          <Text style={styles.domainLabel}>Your Domain:</Text>
          <View style={styles.domainInputRow}>
            <TextInput
              style={styles.domainInput}
              value={domain}
              onChangeText={setDomain}
              placeholder="enter-domain"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              autoCapitalize="none"
            />
            <Text style={styles.domainExtension}>.KaziKE.ke</Text>
          </View>
          <Text style={styles.domainFullUrl}>{fullDomain}</Text>
        </View>

        <Text style={styles.domainDescription}>
          Your official domain for public services, announcements, and engagement.
        </Text>

        <View style={styles.domainFeatures}>
          <View style={styles.featureItem}><CheckCircle color="#00C65A" size={16} /><Text style={styles.featureText}>Official Portal</Text></View>
          <View style={styles.featureItem}><CheckCircle color="#00C65A" size={16} /><Text style={styles.featureText}>Citizen Engagement</Text></View>
          <View style={styles.featureItem}><CheckCircle color="#00C65A" size={16} /><Text style={styles.featureText}>Secure & Verified</Text></View>
          <View style={styles.featureItem}><CheckCircle color="#00C65A" size={16} /><Text style={styles.featureText}>Analytics Dashboard</Text></View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.saveButton} onPress={async () => user && (await setUser({ ...user, domain: fullDomain }))}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton} onPress={() => setShowPublish(true)}>
            <Text style={styles.publishText}>Publish Domain</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showPublish} transparent animationType="fade" onRequestClose={() => setShowPublish(false)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCardDark}>
              <Text style={styles.modalTitleDark}>Publish Domain</Text>
              <Text style={styles.modalSubtitleDark}>Pay to publish {fullDomain}</Text>
              <View style={styles.amountBoxDark}>
                <Text style={styles.amountTextDark}>KES 300 / year</Text>
              </View>
              <Text style={styles.modalHintDark}>Proceeding will open payment and complete publication automatically.</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtnDark} onPress={() => setShowPublish(false)}>
                  <Text style={styles.cancelTextDark}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.payBtnDark} onPress={() => setShowPublish(false)}>
                  <Text style={styles.payTextDark}>Proceed to Pay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientCard: { borderRadius: 16 },
  domainInfoCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
    marginVertical: 8,
  },
  domainHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  domainTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  domainInputContainer: { marginBottom: 12 },
  domainLabel: { color: "rgba(255,255,255,0.9)", marginBottom: 6 },
  domainInputRow: { flexDirection: "row", alignItems: "center" },
  domainInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFFFFF",
  },
  domainExtension: { marginLeft: 8, color: "rgba(255,255,255,0.9)", fontWeight: "600" },
  domainFullUrl: { color: "#00C65A", fontWeight: "700", marginTop: 8 },
  domainDescription: { color: "rgba(255,255,255,0.85)", marginTop: 8 },
  domainFeatures: { marginTop: 12 },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  featureText: { color: "rgba(255,255,255,0.9)" },
  actionsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  saveButton: { backgroundColor: "rgba(255,255,255,0.15)", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  saveText: { color: "#FFFFFF", fontWeight: "700" },
  publishButton: { backgroundColor: "#00C65A", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, flex: 1, alignItems: "center" },
  publishText: { color: "#FFFFFF", fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  modalCardDark: { backgroundColor: "#111", padding: 20, borderRadius: 12, width: "85%" },
  modalTitleDark: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  modalSubtitleDark: { color: "rgba(255,255,255,0.8)", marginBottom: 12 },
  amountBoxDark: { backgroundColor: "rgba(0,198,90,0.15)", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  amountTextDark: { color: "#00C65A", fontWeight: "800" },
  modalHintDark: { color: "rgba(255,255,255,0.7)", marginBottom: 12 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelBtnDark: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)" },
  cancelTextDark: { color: "#FFFFFF" },
  payBtnDark: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: "#00C65A" },
  payTextDark: { color: "#FFFFFF", fontWeight: "700" },
});


