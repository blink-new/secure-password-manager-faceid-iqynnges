
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Plus, Search, Eye, EyeOff, Copy, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { getPasswords, savePassword, deletePassword } from '@/utils/passwordStorage';
import { PasswordItem } from '@/components/PasswordItem';
import { AddPasswordModal } from '@/components/AddPasswordModal';
import { AuthScreen } from '@/components/AuthScreen';

export default function PasswordsScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const authenticate = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to access your passwords',
          fallbackLabel: 'Use passcode',
        });
        
        if (result.success) {
          setIsAuthenticated(true);
          loadPasswords();
        }
      } else {
        // Fallback for devices without biometrics
        Alert.alert(
          'Authentication Required',
          'Your device does not support biometric authentication. Please set up Face ID or Touch ID in your device settings.',
          [{ text: 'OK' }]
        );
        // For demo purposes, we'll authenticate anyway
        setIsAuthenticated(true);
        loadPasswords();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate. Please try again.');
    }
  };

  const loadPasswords = async () => {
    try {
      setIsLoading(true);
      const storedPasswords = await getPasswords();
      setPasswords(storedPasswords || []);
    } catch (error) {
      console.error('Error loading passwords:', error);
      Alert.alert('Error', 'Failed to load passwords');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        authenticate();
      } else {
        loadPasswords();
      }
    }, [isAuthenticated])
  );

  const handleAddPassword = async (newPassword) => {
    try {
      await savePassword(newPassword);
      loadPasswords();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Error saving password:', error);
      Alert.alert('Error', 'Failed to save password');
    }
  };

  const handleDeletePassword = async (id) => {
    try {
      await deletePassword(id);
      loadPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
      Alert.alert('Error', 'Failed to delete password');
    }
  };

  const filteredPasswords = passwords.filter(
    (item) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticate={authenticate} />;
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.searchContainer}
        entering={FadeInDown.duration(400)}
      >
        <Search size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search passwords..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Loading passwords...</Text>
        </View>
      ) : filteredPasswords.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? 'No passwords match your search' : 'No passwords saved yet'}
          </Text>
          {!searchQuery && (
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first password
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredPasswords}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
              <PasswordItem
                item={item}
                onDelete={() => handleDeletePassword(item.id)}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <AddPasswordModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleAddPassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});