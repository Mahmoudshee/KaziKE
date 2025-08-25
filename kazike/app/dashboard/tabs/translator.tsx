import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Languages, FileText, Copy, Download, Upload, File } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Colors from '../constants/colors';

type Language = {
  code: string;
  name: string;
};

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
];

type UploadedFile = {
  name: string;
  uri: string;
  size: number;
  mimeType: string;
};

export default function CVTranslatorScreen() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [targetLang, setTargetLang] = useState<string>('sw');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showTargetLangPicker, setShowTargetLangPicker] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setUploadedFile({
          name: file.name,
          uri: file.uri,
          size: file.size || 0,
          mimeType: file.mimeType || '',
        });
        setCurrentStep(2);
        await extractTextFromFile(file);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const extractTextFromFile = async (file: any) => {
    setIsExtracting(true);
    
    try {
      // Mock text extraction - in a real app, you'd use a PDF/DOCX parsing library
      // For demo purposes, we'll simulate text extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCVText = `John Doe
Software Engineer

EXPERIENCE
Senior Software Developer at TechCorp (2020-2023)
• Developed mobile applications using React Native
• Led a team of 5 developers
• Implemented CI/CD pipelines

Software Developer at StartupXYZ (2018-2020)
• Built web applications using React and Node.js
• Collaborated with cross-functional teams
• Optimized application performance

EDUCATION
Bachelor of Science in Computer Science
University of Nairobi (2014-2018)

SKILLS
• React Native, React, Node.js
• JavaScript, TypeScript, Python
• Git, Docker, AWS
• Agile methodologies`;
      
      setExtractedText(mockCVText);
      setCurrentStep(3);
    } catch (error) {
      console.error('Text extraction error:', error);
      Alert.alert('Error', 'Failed to extract text from document. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const translateCV = async () => {
    if (!extractedText.trim()) {
      Alert.alert('Error', 'No text to translate');
      return;
    }

    setIsTranslating(true);
    
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a professional CV/Resume translator. Translate the given CV text to ${getLanguageName(targetLang)}. Maintain the professional format and structure. Only return the translated text, nothing else.`
            },
            {
              role: 'user',
              content: extractedText
            }
          ]
        })
      });

      const data = await response.json();
      setTranslatedText(data.completion);
      setCurrentStep(4);
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Error', 'Failed to translate CV. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const downloadTranslatedCV = async () => {
    if (!translatedText) {
      Alert.alert('Error', 'No translated text to download');
      return;
    }

    try {
      // Mock download functionality
      Alert.alert(
        'Download Ready',
        'In a real app, this would save the translated CV as a PDF file to your device.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download translated CV.');
    }
  };

  const resetProcess = () => {
    setUploadedFile(null);
    setExtractedText('');
    setTranslatedText('');
    setCurrentStep(1);
  };

  const getLanguageName = (code: string): string => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const copyToClipboard = async (text: string) => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(text);
        Alert.alert('Success', 'Text copied to clipboard');
      } catch (error) {
        Alert.alert('Error', 'Failed to copy text');
      }
    } else {
      // For mobile, we'd use expo-clipboard but it's not available in this setup
      Alert.alert('Info', 'Copy functionality not available on mobile in this demo');
    }
  };



  const renderLanguagePicker = () => {
    const currentLang = targetLang;
    const setLang = setTargetLang;
    const showPicker = showTargetLangPicker;
    const setShowPicker = setShowTargetLangPicker;

    return (
      <View style={styles.languagePickerContainer}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={styles.languageButtonText}>
            {getLanguageName(currentLang)}
          </Text>
          <Languages color={Colors.gray} size={16} />
        </TouchableOpacity>
        
        {showPicker && (
          <View style={styles.languageDropdown}>
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    currentLang === lang.code && styles.selectedLanguageOption
                  ]}
                  onPress={() => {
                    setLang(lang.code);
                    setShowPicker(false);
                  }}
                >
                  <Text style={[
                    styles.languageOptionText,
                    currentLang === lang.code && styles.selectedLanguageOptionText
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Upload CV', active: currentStep >= 1 },
      { number: 2, title: 'Extract Text', active: currentStep >= 2 },
      { number: 3, title: 'Translate', active: currentStep >= 3 },
      { number: 4, title: 'Download', active: currentStep >= 4 },
    ];

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step.number} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              step.active && styles.stepCircleActive
            ]}>
              <Text style={[
                styles.stepNumber,
                step.active && styles.stepNumberActive
              ]}>
                {step.number}
              </Text>
            </View>
            <Text style={[
              styles.stepTitle,
              step.active && styles.stepTitleActive
            ]}>
              {step.title}
            </Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                step.active && styles.stepLineActive
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <FileText color={Colors.red} size={24} />
          <Text style={styles.headerTitle}>CV Translator</Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>How it works:</Text>
          <Text style={styles.instructionsText}>
            1. Upload your CV (PDF or DOCX format){"\n"}
            2. We'll extract the text automatically{"\n"}
            3. Choose your target language{"\n"}
            4. Get your translated CV ready for download
          </Text>
        </View>

        {renderStepIndicator()}

        {/* Step 1: Upload CV */}
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Upload color={Colors.white} size={24} />
              <Text style={styles.uploadButtonText}>Upload CV</Text>
              <Text style={styles.uploadButtonSubtext}>PDF or DOCX files only</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Text Extraction */}
        {currentStep === 2 && uploadedFile && (
          <View style={styles.stepContent}>
            <View style={styles.fileInfo}>
              <File color={Colors.green} size={20} />
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{uploadedFile.name}</Text>
                <Text style={styles.fileSize}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </Text>
              </View>
            </View>
            
            {isExtracting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.red} size="large" />
                <Text style={styles.loadingText}>Extracting text from CV...</Text>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>✓ Text extracted successfully!</Text>
              </View>
            )}
          </View>
        )}

        {/* Step 3: Translation */}
        {currentStep >= 3 && extractedText && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Select Target Language</Text>
            {renderLanguagePicker()}
            
            <View style={styles.textPreview}>
              <Text style={styles.previewTitle}>Extracted CV Text:</Text>
              <ScrollView style={styles.previewContainer}>
                <Text style={styles.previewText}>{extractedText}</Text>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[
                styles.translateButton,
                isTranslating && styles.translateButtonDisabled
              ]}
              onPress={translateCV}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.translateButtonText}>
                  Translate to {getLanguageName(targetLang)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Download */}
        {currentStep === 4 && translatedText && (
          <View style={styles.stepContent}>
            <View style={styles.translationResult}>
              <Text style={styles.resultTitle}>Translated CV:</Text>
              <ScrollView style={styles.resultContainer}>
                <Text style={styles.resultText}>{translatedText}</Text>
              </ScrollView>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={downloadTranslatedCV}
              >
                <Download color={Colors.white} size={20} />
                <Text style={styles.downloadButtonText}>Download Translated CV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetProcess}
              >
                <Text style={styles.resetButtonText}>Translate Another CV</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Support for PDF and DOCX files</Text>
            <Text style={styles.featureItem}>• Automatic text extraction</Text>
            <Text style={styles.featureItem}>• Professional CV translation</Text>
            <Text style={styles.featureItem}>• Multiple target languages</Text>
            <Text style={styles.featureItem}>• Download as PDF</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  instructions: {
    padding: 20,
    backgroundColor: Colors.lightGray,
    margin: 20,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: Colors.red,
  },
  stepNumber: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepTitle: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: Colors.black,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 15,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: Colors.gray,
  },
  stepLineActive: {
    backgroundColor: Colors.red,
  },
  stepContent: {
    padding: 20,
  },
  uploadButton: {
    backgroundColor: Colors.red,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  uploadButtonSubtext: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  fileDetails: {
    marginLeft: 10,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  fileSize: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 15,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: '600',
  },
  textPreview: {
    marginVertical: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 10,
  },
  previewContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 15,
    maxHeight: 150,
  },
  previewText: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 20,
  },
  translationResult: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 15,
    maxHeight: 200,
  },
  resultText: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 20,
  },
  actionButtons: {
    gap: 15,
  },
  downloadButton: {
    backgroundColor: Colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  downloadButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.red,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: Colors.red,
    fontSize: 16,
    fontWeight: '600',
  },
  languagePickerContainer: {
    flex: 1,
    position: 'relative',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  languageButtonText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  languageDropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  languageList: {
    maxHeight: 200,
  },
  languageOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedLanguageOption: {
    backgroundColor: Colors.lightRed,
  },
  languageOptionText: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedLanguageOptionText: {
    color: Colors.red,
    fontWeight: '600',
  },
  swapButton: {
    marginHorizontal: 15,
    padding: 10,
    backgroundColor: Colors.red,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationContainer: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
    position: 'relative',
  },
  outputSection: {
    marginTop: 20,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
    minHeight: 120,
    maxHeight: 200,
  },
  translationOutput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 15,
    backgroundColor: Colors.lightGray,
    minHeight: 120,
    position: 'relative',
  },
  translatedText: {
    fontSize: 16,
    color: Colors.black,
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  copyButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  translateButton: {
    backgroundColor: Colors.red,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  translateButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  translateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    padding: 20,
    backgroundColor: Colors.lightGray,
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 15,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
});