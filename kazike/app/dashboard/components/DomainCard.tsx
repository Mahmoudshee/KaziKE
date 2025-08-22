import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Globe, ExternalLink } from 'lucide-react-native';
import Colors from "../constants/colors";

interface DomainCardProps {
  domain: string;
}

export default function DomainCard({ domain }: DomainCardProps) {
  const handleVisitDomain = () => {
    Alert.alert('Visit Domain', `Open ${domain} in browser`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Globe color={Colors.white} size={24} />
        </View>
        <View style={styles.domainInfo}>
          <Text style={styles.title}>Your .ke Domain</Text>
          <Text style={styles.domain}>{domain}</Text>
        </View>
        <TouchableOpacity style={styles.visitButton} onPress={handleVisitDomain}>
          <ExternalLink color={Colors.red} size={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>Benefits of your .ke domain:</Text>
        <Text style={styles.benefitItem}>• Enhanced local credibility</Text>
        <Text style={styles.benefitItem}>• Better search rankings in Kenya</Text>
        <Text style={styles.benefitItem}>• Professional email addresses</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  domainInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  domain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.green,
  },
  visitButton: {
    padding: 8,
  },
  benefits: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: 12,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
    lineHeight: 18,
  },
});