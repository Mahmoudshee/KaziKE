import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  onDismiss, 
  type = 'error' 
}: ErrorMessageProps) {
  if (!message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return 'rgba(255, 193, 7, 0.1)';
      case 'info':
        return 'rgba(13, 202, 240, 0.1)';
      default:
        return 'rgba(220, 53, 69, 0.1)';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#0dcaf0';
      default:
        return '#dc3545';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#0dcaf0';
      default:
        return '#dc3545';
    }
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor()
      }
    ]}>
      <View style={styles.content}>
        <AlertCircle size={20} color={getIconColor()} />
        <Text style={[styles.message, { color: getIconColor() }]}>
          {message}
        </Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <X size={16} color={getIconColor()} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width > 768 ? 16 : 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: width > 768 ? 24 : 16,
    marginVertical: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  message: {
    fontSize: width > 768 ? 15 : 14,
    fontWeight: '500',
    flex: 1,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});
