import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

export interface ToastHandle {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

const Toast = forwardRef<ToastHandle>((_, ref) => {
  const [msg, setMsg] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const anim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    show(message: string, t: ToastType = 'info', duration = 2600) {
      setMsg(message);
      setType(t);
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.delay(duration),
        Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    },
  }));

  const backgroundColor = type === 'success' ? '#1BB934' : type === 'error' ? '#E55353' : '#4A90E2';

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }] }>
      <View style={[styles.toast, { backgroundColor }]}> 
        <Text style={styles.text}>{msg}</Text>
      </View>
    </Animated.View>
  );
});

// give the forwardRef a display name for React DevTools and linting
Toast.displayName = 'Toast';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 36,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10000,
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: '60%'
  },
  text: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});

export default Toast;
