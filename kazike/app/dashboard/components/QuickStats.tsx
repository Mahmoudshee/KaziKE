import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Briefcase, Users, FileText, UserCheck } from 'lucide-react-native';
import Colors from "../constants/colors";

interface QuickStatsProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    shortlistedCandidates: number;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: stats.totalJobs,
      color: Colors.red,
    },
    {
      icon: FileText,
      label: 'Active Jobs',
      value: stats.activeJobs,
      color: Colors.green,
    },
    {
      icon: Users,
      label: 'Applications',
      value: stats.totalApplications,
      color: Colors.black,
    },
    {
      icon: UserCheck,
      label: 'Shortlisted',
      value: stats.shortlistedCandidates,
      color: Colors.gray,
    },
  ];

  return (
    <View style={styles.container}>
      {statItems.map((item, index) => (
        <View key={index} style={styles.statCard}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <item.icon color={Colors.white} size={24} />
          </View>
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
});