import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MapPin, Briefcase, GraduationCap, Shield, Mail } from 'lucide-react-native';
import Colors from "../constants/colors";

interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: string;
  education: string;
  skills: string[];
  eduIdVerified: boolean;
  location: string;
  appliedFor: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const handleViewProfile = () => {
    Alert.alert('View Profile', `View full profile for ${candidate.name}`);
  };

  const handleContact = () => {
    Alert.alert('Contact Candidate', `Send message to ${candidate.name}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.candidateInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.candidateName}>{candidate.name}</Text>
            {candidate.eduIdVerified && (
              <View style={styles.verifiedBadge}>
                <Shield color={Colors.green} size={14} />
                <Text style={styles.verifiedText}>EduID</Text>
              </View>
            )}
          </View>
          <Text style={styles.candidateTitle}>{candidate.title}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Briefcase color={Colors.gray} size={16} />
          <Text style={styles.detailText}>{candidate.experience} experience</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin color={Colors.gray} size={16} />
          <Text style={styles.detailText}>{candidate.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <GraduationCap color={Colors.gray} size={16} />
          <Text style={styles.detailText}>{candidate.education}</Text>
        </View>
      </View>
      
      <View style={styles.skillsContainer}>
        <Text style={styles.skillsLabel}>Skills:</Text>
        <View style={styles.skills}>
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {candidate.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{candidate.skills.length - 3} more</Text>
          )}
        </View>
      </View>
      
      <Text style={styles.appliedFor}>Applied for: {candidate.appliedFor}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Mail color={Colors.white} size={16} />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton} onPress={handleViewProfile}>
          <Text style={styles.viewButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  candidateInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.green,
    fontWeight: '600',
  },
  candidateTitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray,
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 6,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: Colors.black,
  },
  moreSkills: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  appliedFor: {
    fontSize: 14,
    color: Colors.red,
    fontWeight: '600',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    backgroundColor: Colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    color: Colors.red,
    fontSize: 14,
    fontWeight: '600',
  },
});