import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, MapPin, DollarSign, Users, FileText, Building } from 'lucide-react-native';
import Colors from "./constants/colors";
import { mockCompany } from './data/mockData';

type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';

export default function PostJobPage() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    type: 'Full-time' as JobType,
    experienceLevel: 'Mid Level' as ExperienceLevel,
    skills: '',
    benefits: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    
    if (jobData.salaryMin && jobData.salaryMax) {
      const min = parseInt(jobData.salaryMin.replace(/,/g, ''));
      const max = parseInt(jobData.salaryMax.replace(/,/g, ''));
      if (min >= max) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostJob = () => {
    if (!mockCompany.verified) {
      Alert.alert('Verification Required', 'Please complete account verification to post jobs.');
      return;
    }
    
    if (validateForm()) {
      Alert.alert(
        'Job Posted Successfully!', 
        'Your job posting has been submitted and will be reviewed within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }
  };

  const formatSalary = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleSalaryChange = (field: 'salaryMin' | 'salaryMax', value: string) => {
    const formatted = formatSalary(value);
    setJobData(prev => ({ ...prev, [field]: formatted }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Post New Job',
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
          {!mockCompany.verified && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                ⚠️ Account verification pending. Complete verification to post jobs.
              </Text>
            </View>
          )}
          
          {/* Job Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Job Title *</Text>
            <View style={styles.inputContainer}>
              <Building color={Colors.gray} size={20} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Senior Software Engineer"
                value={jobData.title}
                onChangeText={(text) => setJobData(prev => ({ ...prev, title: text }))}
              />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Job Type & Experience Level */}
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
                placeholder="e.g. Nairobi, Kenya"
                value={jobData.location}
                onChangeText={(text) => setJobData(prev => ({ ...prev, location: text }))}
              />
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          {/* Salary Range */}
          <View style={styles.section}>
            <Text style={styles.label}>Salary Range (KSh) *</Text>
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <DollarSign color={Colors.gray} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Min (e.g. 50,000)"
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
                  placeholder="Max (e.g. 80,000)"
                  value={jobData.salaryMax}
                  onChangeText={(text) => handleSalaryChange('salaryMax', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {errors.salaryMin && <Text style={styles.errorText}>{errors.salaryMin}</Text>}
            {errors.salaryMax && <Text style={styles.errorText}>{errors.salaryMax}</Text>}
          </View>

          {/* Job Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Job Description *</Text>
            <View style={styles.textAreaContainer}>
              <FileText color={Colors.gray} size={20} style={styles.textAreaIcon} />
              <TextInput
                style={styles.textArea}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={jobData.description}
                onChangeText={(text) => setJobData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.label}>Requirements *</Text>
            <View style={styles.textAreaContainer}>
              <Users color={Colors.gray} size={20} style={styles.textAreaIcon} />
              <TextInput
                style={styles.textArea}
                placeholder="List the required qualifications, experience, and skills..."
                value={jobData.requirements}
                onChangeText={(text) => setJobData(prev => ({ ...prev, requirements: text }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            {errors.requirements && <Text style={styles.errorText}>{errors.requirements}</Text>}
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.label}>Required Skills</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.skillsIcon}>🔧</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. React, Node.js, Python (comma separated)"
                value={jobData.skills}
                onChangeText={(text) => setJobData(prev => ({ ...prev, skills: text }))}
              />
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.label}>Benefits & Perks</Text>
            <View style={styles.textAreaContainer}>
              <Text style={styles.benefitsIcon}>🎁</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Health insurance, flexible hours, remote work options..."
                value={jobData.benefits}
                onChangeText={(text) => setJobData(prev => ({ ...prev, benefits: text }))}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Post Job Button */}
          <TouchableOpacity 
            style={[
              styles.postButton, 
              !mockCompany.verified && styles.disabledButton
            ]} 
            onPress={handlePostJob}
          >
            <Text style={styles.postButtonText}>Post Job</Text>
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
  warningBanner: {
    backgroundColor: Colors.lightRed,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
  },
  warningText: {
    color: Colors.red,
    fontSize: 14,
    fontWeight: '500',
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