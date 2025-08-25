
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { User as UserIcon, Globe, Mail, Phone, MapPin, LogOut, Shield } from 'lucide-react-native';
import Colors from '../constants/colors';
import { useAuthStore } from '@/stores/auth-store';

export default function SettingsTab() {
  const { user, logout } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive', 
        onPress: async () => {
          await logout();
        } 
      },
    ]);
  };

  const handleVerification = () => {
    Alert.alert('Account Verification', 'Verification process will be available soon.');
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.gray }}>No user logged in</Text>
      </View>
    );
  }


  const companyName =
    user.profile?.fullName ||
    user.profile?.orgName ||
    user.profile?.fullName ||
    (user.email ? user.email.split('@')[0] : "Unknown");

  const isVerified = user.isVerified;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <UserIcon color={Colors.white} size={32} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.companyName}>{companyName}</Text>
              <View style={styles.verificationStatus}>
                <Shield 
                  color={isVerified ? Colors.green : Colors.red} 
                  size={16} 
                />
                <Text style={[
                  styles.verificationText,
                  { color: isVerified ? Colors.green : Colors.red }
                ]}>
                  {isVerified ? 'Verified' : 'Pending Verification'}
                </Text>
              </View>
            </View>
          </View>
          
          {!isVerified && (
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerification}>
              <Text style={styles.verifyButtonText}>Complete Verification</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Company Information</Text>
          
          <View style={styles.infoItem}>
            <Globe color={Colors.gray} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Domain</Text>
              <Text style={styles.infoValue}>{user.domain || 'N/A'}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Mail color={Colors.gray} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
          
          {user.profile?.phone && (
            <View style={styles.infoItem}>
              <Phone color={Colors.gray} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.profile.phone}</Text>
              </View>
            </View>
          )}
          
          {user.profile?.ministry && (
            <View style={styles.infoItem}>
              <MapPin color={Colors.gray} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ministry</Text>
                <Text style={styles.infoValue}>{user.profile.ministry}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color={Colors.white} size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: Colors.red,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: Colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

