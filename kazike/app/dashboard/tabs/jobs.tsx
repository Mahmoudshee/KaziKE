import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '../constants/colors';
import { mockJobs, mockCompany } from '../data/mockData';
import JobCard from '../components/JobCard';

export default function JobsTab() {
  const handlePostJob = () => {
    router.push('/post-job');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>My Job Postings</Text>
            <TouchableOpacity 
              style={[styles.postButton, !mockCompany.verified && styles.disabledButton]} 
              onPress={handlePostJob}
            >
              <Plus color={Colors.white} size={20} />
              <Text style={styles.postButtonText}>Post Job</Text>
            </TouchableOpacity>
          </View>
          
          {mockJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  postButton: {
    backgroundColor: Colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  disabledButton: {
    backgroundColor: Colors.gray,
  },
  postButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});