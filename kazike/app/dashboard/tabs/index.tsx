

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Colors from '../constants/colors';
import QuickStats from '../components/QuickStats';
import DomainCard from '../components/DomainCard';
import ActivityItem from '../components/ActivityItem';
import { useAuthStore } from '@/stores/auth-store';

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
  description: string;
  employerId: string;
  createdAt: string;
}

export default function HomeTab() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // load jobs from storage
  useEffect(() => {
    const loadJobs = async () => {
      try {
        let data: Job[] = [];
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('jobs');
          if (stored) data = JSON.parse(stored);
        } else {
          const path = `${FileSystem.documentDirectory}jobs.json`;
          const json = await FileSystem.readAsStringAsync(path);
          data = JSON.parse(json);
        }
        setJobs(data);
      } catch (e) {
        console.log('No jobs found yet, starting fresh');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // calculate stats from jobs
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'Active').length,
    totalApplications: jobs.reduce((sum, j) => sum + (j.applications || 0), 0),
    shortlistedCandidates: 0, 
  };

  const displayName =
    user?.profile?.orgName ||
    user?.profile?.institutionName ||
    user?.profile?.fullName ||
    (user?.email ? user.email.split('@')[0] : 'Employer');

  const domain = user?.domain || '';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, {displayName}!</Text>

        <QuickStats stats={stats} />

        <DomainCard domain={domain} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {!loading && jobs.slice(-3).reverse().map(job => (
            <ActivityItem key={job.id} activity={{
              id: job.id,
              type: job.type,
              message: `${job.title} – ${job.description}`,
              time: job.postedDate,
            }} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  content: { padding: 16 },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 20,
  },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
});
