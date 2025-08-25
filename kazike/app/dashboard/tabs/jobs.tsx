import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Colors from '../constants/colors';
import JobCard from '../components/JobCard';

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
  description?: string;
  employerId?: string;
  createdAt?: string;
}

export default function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadJobs = async () => {
    try {
      let loadedJobs = [];
      console.log('🔄 Loading jobs...');
      
      // Try localStorage first (for web)
      if (typeof window !== 'undefined' && window.localStorage) {
        console.log('🌐 Web detected, checking localStorage...');
        const storedJobs = localStorage.getItem('jobs');
        console.log('📦 Stored jobs from localStorage:', storedJobs);
        if (storedJobs) {
          loadedJobs = JSON.parse(storedJobs);
          console.log('✅ Jobs loaded from localStorage:', loadedJobs.length);
        } else {
          console.log('❌ No jobs found in localStorage, trying backup...');
          // Try backup file if localStorage is empty
          try {
            const backupPath = `${FileSystem.documentDirectory}jobs_backup.json`;
            const backupData = await FileSystem.readAsStringAsync(backupPath);
            loadedJobs = JSON.parse(backupData);
            console.log('✅ Jobs loaded from backup file:', loadedJobs.length);
            // Restore to localStorage
            localStorage.setItem('jobs', JSON.stringify(loadedJobs, null, 2));
          } catch (backupError) {
            console.log('❌ No backup file found');
          }
        }
      } else {
        console.log('📱 Mobile detected, checking file system...');
        // Try main file first, then backup
        try {
          const jobsFilePath = `${FileSystem.documentDirectory}jobs.json`;
          console.log('📁 Main jobs file path:', jobsFilePath);
          const existingData = await FileSystem.readAsStringAsync(jobsFilePath);
          console.log('📄 Main file content:', existingData);
          loadedJobs = JSON.parse(existingData);
          console.log('✅ Jobs loaded from main file:', loadedJobs.length);
        } catch (error) {
          console.log('❌ Main file not found, trying backup...');
          // Try backup file
          try {
            const backupPath = `${FileSystem.documentDirectory}jobs_backup.json`;
            console.log('📁 Backup file path:', backupPath);
            const backupData = await FileSystem.readAsStringAsync(backupPath);
            console.log('📄 Backup file content:', backupData);
            loadedJobs = JSON.parse(backupData);
            console.log('✅ Jobs loaded from backup file:', loadedJobs.length);
            // Restore to main file
            const jobsFilePath = `${FileSystem.documentDirectory}jobs.json`;
            await FileSystem.writeAsStringAsync(jobsFilePath, JSON.stringify(loadedJobs, null, 2));
            console.log('✅ Restored backup to main file');
          } catch (backupError) {
            console.log('❌ No backup file found');
          }
        }
      }
      
      console.log('🎯 Final loaded jobs:', loadedJobs);
      setJobs(loadedJobs);
    } catch (error) {
      console.error('❌ Error loading jobs:', error);
      console.log('No existing jobs or error reading:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);



  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handlePostJob = () => {
    router.push('/dashboard/post-job');
  };

  // const handleEditJob = (job: Job) => {
  //   Alert.alert(
  //     'Edit Job',
  //     `Edit job: ${job.title}`,
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Edit', onPress: () => console.log('Edit job:', job.id) }
  //     ]
  //   );
  // };
  const handleEditJob = (job: Job) => {
    router.push({ pathname: "/dashboard/edit-job", params: { job: JSON.stringify(job) } });
  };
  

  const handleDeleteJob = (job: Job) => {
    Alert.alert(
      'Delete Job',
      `Are you sure you want to delete "${job.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedJobs = jobs.filter(j => j.id !== job.id);
              
                             // Save to localStorage (for web)
               if (typeof window !== 'undefined' && window.localStorage) {
                 localStorage.setItem('jobs', JSON.stringify(updatedJobs));
                 // Also update backup file
                 try {
                   const backupPath = `${FileSystem.documentDirectory}jobs_backup.json`;
                   await FileSystem.writeAsStringAsync(backupPath, JSON.stringify(updatedJobs, null, 2));
                 } catch (backupError) {
                   console.log('Could not update backup file');
                 }
               } else {
                 // Fallback to file system (for mobile)
                 const jobsFilePath = `${FileSystem.documentDirectory}jobs.json`;
                 await FileSystem.writeAsStringAsync(jobsFilePath, JSON.stringify(updatedJobs, null, 2));
                 // Also update backup file
                 const backupPath = `${FileSystem.documentDirectory}jobs_backup.json`;
                 await FileSystem.writeAsStringAsync(backupPath, JSON.stringify(updatedJobs, null, 2));
               }
              
              setJobs(updatedJobs);
              Alert.alert('Success', 'Job deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>My Job Postings</Text>
            <TouchableOpacity 
              style={styles.postButton} 
              onPress={handlePostJob}
            >
              <Plus color={Colors.white} size={20} />
              <Text style={styles.postButtonText}>Post Job</Text>
            </TouchableOpacity>
          </View>
          
                     {jobs.length === 0 ? (
             <View style={styles.emptyState}>
               <Text style={styles.emptyStateTitle}>No Jobs Posted Yet</Text>
               <Text style={styles.emptyStateText}>
                 Start by posting your first job to attract your candidates
               </Text>
             </View>
           ) : (
             jobs.map((job) => (
               <View key={job.id} style={styles.jobContainer}>
                 <JobCard 
                   job={job} 
                   onEdit={() => handleEditJob(job)}
                   onDelete={() => handleDeleteJob(job)}
                 />
               </View>
             ))
           )}
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
  postButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  jobContainer: {
    marginBottom: 16,
  },
});