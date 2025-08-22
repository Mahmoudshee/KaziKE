import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/colors';
import { mockCandidates } from '../data/mockData';
import CandidateCard from '../components/CandidateCard';

export default function CandidatesTab() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Job Applicants</Text>
        <Text style={styles.subtitle}>
          {mockCandidates.length} candidates have applied to your jobs
        </Text>
        
        {mockCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 20,
  },
});