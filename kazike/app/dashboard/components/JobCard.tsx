import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { MapPin, Clock, Users, MoreVertical } from 'lucide-react-native';
import Colors from "../constants/colors";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  applications: number;
  status: string;
  postedDate: string;
  type: string;
}

interface JobCardProps {
  job: Job;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const handleViewApplications = () => {
    Alert.alert('View Applications', `${job.applications} applications for ${job.title}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: job.status === 'Active' ? Colors.lightGreen : Colors.lightGray }
          ]}>
            <Text style={[
              styles.statusText,
              { color: job.status === 'Active' ? Colors.green : Colors.gray }
            ]}>
              {job.status}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MapPin color={Colors.gray} size={16} />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock color={Colors.gray} size={16} />
          <Text style={styles.detailText}>{job.type}</Text>
        </View>
      </View>
      
      <Text style={styles.salary}>{job.salary}</Text>
      
      <View style={styles.footer}>
        <View style={styles.applicationsContainer}>
          <Users color={Colors.red} size={16} />
          <Text style={styles.applicationsText}>
            {job.applications} applications
          </Text>
        </View>
        <TouchableOpacity style={styles.viewButton} onPress={handleViewApplications}>
          <Text style={styles.viewButtonText}>View Applications</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  applicationsText: {
    fontSize: 14,
    color: Colors.red,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
