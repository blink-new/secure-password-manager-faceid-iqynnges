
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fingerprint, Lock, Shield, Trash2, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { clearAllPasswords } from '@/utils/passwordStorage';

export default function SettingsScreen() {
  const [biometricType, setBiometricType] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [requireAuth, setRequireAuth] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  useEffect(() => {
    checkBiometrics();
    loadSettings();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (hasHardware) {
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricAvailable(isEnrolled);
        
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        } else {
          setBiometricType('Biometric');
        }
      }
    } catch (error) {
      console.error('Error checking biometrics:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const requireAuthSetting = await AsyncStorage.getItem('requireAuth');
      if (requireAuthSetting !== null) {
        setRequireAuth(requireAuthSetting === 'true');
      }
      
      const autoLockSetting = await AsyncStorage.getItem('autoLock');
      if (autoLockSetting !== null) {
        setAutoLock(autoLockSetting === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleRequireAuthToggle = (value) => {
    setRequireAuth(value);
    saveSettings('requireAuth', value);
  };

  const handleAutoLockToggle = (value) => {
    setAutoLock(value);
    saveSettings('autoLock', value);
  };

  const handleClearAllPasswords = () => {
    Alert.alert(
      'Clear All Passwords',
      'Are you sure you want to delete all saved passwords? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllPasswords();
              Alert.alert('Success', 'All passwords have been deleted');
            } catch (error) {
              console.error('Error clearing passwords:', error);
              Alert.alert('Error', 'Failed to clear passwords');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Security</Text>
      
      <Animated.View 
        style={styles.card}
        entering={FadeInDown.duration(400)}
      >
        {isBiometricAvailable ? (
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Fingerprint size={22} color="#6366F1" style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>Use {biometricType}</Text>
                <Text style={styles.settingDescription}>
                  Unlock the app using {biometricType}
                </Text>
              </View>
            </View>
            <Switch
              value={requireAuth}
              onValueChange={handleRequireAuthToggle}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={requireAuth ? '#6366F1' : '#FFFFFF'}
            />
          </View>
        ) : (
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Lock size={22} color="#94A3B8" style={styles.settingIcon} />
              <View>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>
                  Not available on this device
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Lock size={22} color="#6366F1" style={styles.settingIcon} />
            <View>
              <Text style={styles.settingTitle}>Auto-Lock</Text>
              <Text style={styles.settingDescription}>
                Lock app when in background
              </Text>
            </View>
          </View>
          <Switch
            value={autoLock}
            onValueChange={handleAutoLockToggle}
            trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
            thumbColor={autoLock ? '#6366F1' : '#FFFFFF'}
          />
        </View>
      </Animated.View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Data</Text>
      
      <Animated.View 
        style={styles.card}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={handleClearAllPasswords}
        >
          <View style={styles.settingInfo}>
            <Trash2 size={22} color="#EF4444" style={styles.settingIcon} />
            <View>
              <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                Clear All Passwords
              </Text>
              <Text style={styles.settingDescription}>
                Delete all saved passwords
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={styles.infoCard}
        entering={FadeInDown.duration(400).delay(200)}
      >
        <Info size={18} color="#6366F1" style={{ marginRight: 8 }} />
        <Text style={styles.infoText}>
          All passwords are encrypted and stored only on your device
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#4338CA',
    flex: 1,
  },
});