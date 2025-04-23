
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Fingerprint, Shield } from 'lucide-react-native';

export function AuthScreen({ onAuthenticate }) {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(600)}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Shield size={64} color="#6366F1" />
        </View>
        
        <Text style={styles.title}>Secure Password Manager</Text>
        <Text style={styles.subtitle}>
          Your passwords are protected and can only be accessed by you
        </Text>
        
        <TouchableOpacity 
          style={styles.authButton}
          onPress={onAuthenticate}
        >
          <Fingerprint size={28} color="#FFFFFF" style={styles.authIcon} />
          <Text style={styles.authButtonText}>Authenticate to Continue</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footer}>
        All data is encrypted and stored only on your device
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  authButton: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  authIcon: {
    marginRight: 12,
  },
  authButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  footer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});