import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FileText, Briefcase, User } from 'lucide-react-native';
import Colors from "../constants/colors";



interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
}

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case 'application':
        return FileText;
      case 'job':
        return Briefcase;
      case 'candidate':
        return User;
      default:
        return FileText;
    }
  };

  const getIconColor = () => {
    switch (activity.type) {
      case 'application':
        return Colors.red;
      case 'job':
        return Colors.green;
      case 'candidate':
        return Colors.black;
      default:
        return Colors.gray;
    }
  };

  const Icon = getIcon();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
        <Icon color={Colors.white} size={16} />
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{activity.message}</Text>
        <Text style={styles.time}>{activity.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 2,
    lineHeight: 18,
  },
  time: {
    fontSize: 12,
    color: Colors.gray,
  },
});