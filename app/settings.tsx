
import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Fingerprint, Lock, Trash2, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [requireAuth, setRequireAuth] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Security</Text>
      
      <Animated.View 
        style={styles.card}
        entering={FadeInDown.duration(400)}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Fingerprint size={22} color="#6366F1" style={styles.settingIcon} />
            <View>
              <Text style={styles.settingTitle}>Use Face ID</Text>
              <Text style={styles.settingDescription}>
                Unlock the app using Face ID
              </Text>
            </View>
          </View>
          <Switch
            value={requireAuth}
            onValueChange={setRequireAuth}
            trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
            thumbColor={requireAuth ? '#6366F1' : '#FFFFFF'}
          />
        </View>

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
            onValueChange={setAutoLock}
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
        <TouchableOpacity style={styles.settingRow}>
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
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  settingDescription: {
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
    fontSize: 14,
    color: '#4338CA',
    flex: 1,
  },
});