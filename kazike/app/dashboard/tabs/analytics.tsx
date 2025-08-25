// import React from 'react';
// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import Colors from '../constants/colors';
// import { mockStats } from '../data/mockData';

// export default function AnalyticsTab() {
//   const chartData = [
//     { label: 'Job Views', value: 1250, color: Colors.red },
//     { label: 'Applications', value: 156, color: Colors.green },
//     { label: 'Interviews', value: 45, color: Colors.black },
//     { label: 'Hires', value: 12, color: Colors.gray },
//   ];

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Job Performance Analytics</Text>
        
//         <View style={styles.metricsContainer}>
//           {chartData.map((metric, index) => (
//             <View key={index} style={styles.metricCard}>
//               <View style={[styles.metricBar, { backgroundColor: metric.color }]} />
//               <Text style={styles.metricValue}>{metric.value}</Text>
//               <Text style={styles.metricLabel}>{metric.label}</Text>
//             </View>
//           ))}
//         </View>
        
//         <View style={styles.insightsCard}>
//           <Text style={styles.insightsTitle}>Key Insights</Text>
//           <View style={styles.insight}>
//             <Text style={styles.insightText}>• Your jobs receive 15% more applications than average</Text>
//           </View>
//           <View style={styles.insight}>
//             <Text style={styles.insightText}>• Software Engineer positions perform best</Text>
//           </View>
//           <View style={styles.insight}>
//             <Text style={styles.insightText}>• 78% of candidates have EduID verification</Text>
//           </View>
//         </View>
        
//         <View style={styles.trendsCard}>
//           <Text style={styles.trendsTitle}>Monthly Trends</Text>
//           <View style={styles.trendItem}>
//             <Text style={styles.trendLabel}>Applications</Text>
//             <Text style={[styles.trendValue, { color: Colors.green }]}>+23%</Text>
//           </View>
//           <View style={styles.trendItem}>
//             <Text style={styles.trendLabel}>Job Views</Text>
//             <Text style={[styles.trendValue, { color: Colors.green }]}>+18%</Text>
//           </View>
//           <View style={styles.trendItem}>
//             <Text style={styles.trendLabel}>Response Rate</Text>
//             <Text style={[styles.trendValue, { color: Colors.red }]}>-5%</Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.lightGray,
//   },
//   content: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.black,
//     marginBottom: 20,
//   },
//   metricsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 24,
//   },
//   metricCard: {
//     backgroundColor: Colors.white,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     flex: 1,
//     minWidth: '45%',
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   metricBar: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     marginBottom: 8,
//   },
//   metricValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.black,
//     marginBottom: 4,
//   },
//   metricLabel: {
//     fontSize: 14,
//     color: Colors.gray,
//     textAlign: 'center',
//   },
//   insightsCard: {
//     backgroundColor: Colors.white,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   insightsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.black,
//     marginBottom: 12,
//   },
//   insight: {
//     marginBottom: 8,
//   },
//   insightText: {
//     fontSize: 14,
//     color: Colors.gray,
//     lineHeight: 20,
//   },
//   trendsCard: {
//     backgroundColor: Colors.white,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: Colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   trendsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.black,
//     marginBottom: 12,
//   },
//   trendItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.lightGray,
//   },
//   trendLabel: {
//     fontSize: 16,
//     color: Colors.black,
//   },
//   trendValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/colors';
import * as FileSystem from 'expo-file-system';
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

export default function AnalyticsTab() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        let loadedJobs: Job[] = [];

        // Web: use localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedJobs = localStorage.getItem('jobs');
          if (storedJobs) {
            loadedJobs = JSON.parse(storedJobs);
          }
        } else {
          // Mobile: read jobs.json file
          try {
            const jobsFilePath = `${FileSystem.documentDirectory}jobs.json`;
            const data = await FileSystem.readAsStringAsync(jobsFilePath);
            loadedJobs = JSON.parse(data);
          } catch (error) {
            console.log('No jobs.json file yet');
          }
        }

        // Only keep jobs for the logged-in employer
        const employerJobs = loadedJobs.filter(
          job => job.employerId === user?.id
        );
        setJobs(employerJobs);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [user?.id]);

  // --- 📊 Analytics calculations ---
  const totalViews = jobs.length * 100; // placeholder (if you add "views" later, use real field)
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0);
  const totalInterviews = Math.round(totalApplications * 0.3); // sample logic
  const totalHires = jobs.filter(job => job.status === 'Hired').length;

  const chartData = [
    { label: 'Job Views', value: totalViews, color: Colors.red },
    { label: 'Applications', value: totalApplications, color: Colors.green },
    { label: 'Interviews', value: totalInterviews, color: Colors.black },
    { label: 'Hires', value: totalHires, color: Colors.gray },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Job Performance Analytics</Text>
        
        <View style={styles.metricsContainer}>
          {chartData.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={[styles.metricBar, { backgroundColor: metric.color }]} />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Key Insights</Text>
          {jobs.length === 0 ? (
            <Text style={styles.insightText}>No jobs posted yet. Post a job to see insights!</Text>
          ) : (
            <>
              <View style={styles.insight}>
                <Text style={styles.insightText}>
                  • You have {jobs.length} active job posting(s)
                </Text>
              </View>
              <View style={styles.insight}>
                <Text style={styles.insightText}>
                  • Total {totalApplications} applications received
                </Text>
              </View>
              <View style={styles.insight}>
                <Text style={styles.insightText}>
                  • {Math.round((totalApplications / Math.max(jobs.length, 1)))} average applications per job
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.black, marginBottom: 20 },
  metricsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  metricCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricBar: { width: 40, height: 4, borderRadius: 2, marginBottom: 8 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: Colors.black, marginBottom: 4 },
  metricLabel: { fontSize: 14, color: Colors.gray, textAlign: 'center' },
  insightsCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.black, marginBottom: 12 },
  insight: { marginBottom: 8 },
  insightText: { fontSize: 14, color: Colors.gray, lineHeight: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 16, color: Colors.gray },
});

