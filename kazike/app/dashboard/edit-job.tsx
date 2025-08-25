import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, DollarSign, Users, FileText, Building } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import Colors from "./constants/colors";
import { useAuthStore } from '@/stores/auth-store';

type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';

export default function EditJobPage() {
  const { user } = useAuthStore();
  const { job: jobParam } = useLocalSearchParams<{ job: string }>();
  const job = JSON.parse(jobParam); 

  const [jobData, setJobData] = useState({
    title: job.title,
    description: job.description,
    requirements: job.requirements || '',
    location: job.location,
    salaryMin: job.salary.split('-')[0]?.replace(/\D/g, '') || '',
    salaryMax: job.salary.split('-')[1]?.replace(/\D/g, '') || '',
    type: job.type as JobType,
    experienceLevel: job.experienceLevel || 'Mid Level',
    skills: job.skills || '',
    benefits: job.benefits || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobTypes: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels: ExperienceLevel[] = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!jobData.title.trim()) newErrors.title = 'Job title is required';
    if (!jobData.description.trim()) newErrors.description = 'Job description is required';
    if (!jobData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!jobData.location.trim()) newErrors.location = 'Location is required';
    if (!jobData.salaryMin.trim()) newErrors.salaryMin = 'Minimum salary is required';
    if (!jobData.salaryMax.trim()) newErrors.salaryMax = 'Maximum salary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateJobInFile = async () => {
    try {
      const jobsFilePath = `${FileSystem.documentDirectory}jobs.json`;
      let existingJobs = [];
      try {
        const data = await FileSystem.readAsStringAsync(jobsFilePath);
        existingJobs = JSON.parse(data);
      } catch {
        existingJobs = [];
      }

     
      const updatedJobs = existingJobs.map((j: any) =>
        j.id === job.id
          ? {
              ...j,
              ...jobData,
              salary: `KSh ${jobData.salaryMin} - ${jobData.salaryMax}`,
              updatedAt: new Date().toISOString(),
            }
          : j
      );

      await FileSystem.writeAsStringAsync(jobsFilePath, JSON.stringify(updatedJobs, null, 2));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateJob = async () => {
    if (!validateForm()) return;

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsSubmitting(true);
    const success = await updateJobInFile();

    if (success) {
      Alert.alert('Success', 'Job updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/dashboard/tabs/jobs') }
      ]);
    } else {
      Alert.alert('Error', 'Failed to update job');
    }
    setIsSubmitting(false);
  };

  const handleSalaryChange = (field: 'salaryMin' | 'salaryMax', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setJobData(prev => ({ ...prev, [field]: formatted }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Edit Job',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.black,
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={Colors.black} size={24} />
            </TouchableOpacity>
          )
        }} 
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>

          {/* Job Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Job Title *</Text>
            <View style={styles.inputContainer}>
              <Building color={Colors.gray} size={20} />
              <TextInput
                style={styles.input}
                value={jobData.title}
                onChangeText={(text) => setJobData(prev => ({ ...prev, title: text }))}
              />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Job Type & Experience */}
          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Job Type *</Text>
              <View style={styles.pickerContainer}>
                {jobTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.pickerOption,
                      jobData.type === type && styles.pickerOptionSelected
                    ]}
                    onPress={() => setJobData(prev => ({ ...prev, type }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      jobData.type === type && styles.pickerOptionTextSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Experience Level *</Text>
              <View style={styles.pickerContainer}>
                {experienceLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.pickerOption,
                      jobData.experienceLevel === level && styles.pickerOptionSelected
                    ]}
                    onPress={() => setJobData(prev => ({ ...prev, experienceLevel: level }))}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      jobData.experienceLevel === level && styles.pickerOptionTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputContainer}>
              <MapPin color={Colors.gray} size={20} />
              <TextInput
                style={styles.input}
                value={jobData.location}
                onChangeText={(text) => setJobData(prev => ({ ...prev, location: text }))}
              />
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          {/* Salary */}
          <View style={styles.section}>
            <Text style={styles.label}>Salary Range (KSh) *</Text>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <DollarSign color={Colors.gray} size={20} />
                <TextInput
                  style={styles.input}
                  value={jobData.salaryMin}
                  onChangeText={(text) => handleSalaryChange('salaryMin', text)}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.toText}>to</Text>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <DollarSign color={Colors.gray} size={20} />
                <TextInput
                  style={styles.input}
                  value={jobData.salaryMax}
                  onChangeText={(text) => handleSalaryChange('salaryMax', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Job Description *</Text>
            <View style={styles.textAreaContainer}>
              <FileText color={Colors.gray} size={20} style={styles.textAreaIcon} />
              <TextInput
                style={styles.textArea}
                value={jobData.description}
                onChangeText={(text) => setJobData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.label}>Requirements *</Text>
            <View style={styles.textAreaContainer}>
              <Users color={Colors.gray} size={20} style={styles.textAreaIcon} />
              <TextInput
                style={styles.textArea}
                value={jobData.requirements}
                onChangeText={(text) => setJobData(prev => ({ ...prev, requirements: text }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.label}>Required Skills</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={jobData.skills}
                onChangeText={(text) => setJobData(prev => ({ ...prev, skills: text }))}
              />
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.label}>Benefits & Perks</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                value={jobData.benefits}
                onChangeText={(text) => setJobData(prev => ({ ...prev, benefits: text }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Update Job Button */}
          <TouchableOpacity 
            style={[
              styles.postButton, 
              isSubmitting && styles.disabledButton
            ]} 
            onPress={handleUpdateJob}
            disabled={isSubmitting}
          >
            <Text style={styles.postButtonText}>
              {isSubmitting ? 'Updating...' : 'Update Job'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
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
      backButton: {
        padding: 8,
      },
      scrollView: {
        flex: 1,
      },
      content: {
        padding: 16,
      },
      
      section: {
        marginBottom: 20,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
        marginBottom: 8,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: Colors.black,
      },
      textAreaContainer: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 100,
      },
      textAreaIcon: {
        position: 'absolute',
        top: 12,
        left: 12,
      },
      textArea: {
        fontSize: 16,
        color: Colors.black,
        marginLeft: 28,
        flex: 1,
      },
      skillsIcon: {
        fontSize: 18,
      },
      benefitsIcon: {
        fontSize: 18,
        position: 'absolute',
        top: 12,
        left: 12,
      },
      toText: {
        color: Colors.gray,
        fontSize: 16,
        marginHorizontal: 8,
      },
      pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      },
      pickerOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
      },
      pickerOptionSelected: {
        backgroundColor: Colors.red,
        borderColor: Colors.red,
      },
      pickerOptionText: {
        fontSize: 14,
        color: Colors.gray,
      },
      pickerOptionTextSelected: {
        color: Colors.white,
        fontWeight: '600',
      },
      errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: 4,
      },
      postButton: {
        backgroundColor: Colors.red,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
      disabledButton: {
        backgroundColor: Colors.gray,
      },
      postButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
      },
      bottomSpacing: {
        height: 20,
      },
});
