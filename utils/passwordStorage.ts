
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORDS_KEY = 'secure_passwords';
const STORAGE_VERSION = 'v1';
const STORAGE_VERSION_KEY = 'password_storage_version';

// Initialize storage with version check
export const initStorage = async () => {
  try {
    const version = await AsyncStorage.getItem(STORAGE_VERSION_KEY);
    if (version !== STORAGE_VERSION) {
      // If version changes, we might need migration logic here
      await AsyncStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all passwords
export const getPasswords = async () => {
  try {
    const encryptedData = await SecureStore.getItemAsync(PASSWORDS_KEY);
    if (!encryptedData) {
      return [];
    }
    return JSON.parse(encryptedData);
  } catch (error) {
    console.error('Error getting passwords:', error);
    // Fallback to AsyncStorage if SecureStore fails (for web platform)
    try {
      const data = await AsyncStorage.getItem(PASSWORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (fallbackError) {
      console.error('Fallback storage error:', fallbackError);
      return [];
    }
  }
};

// Save a new password
export const savePassword = async (password) => {
  try {
    const passwords = await getPasswords();
    const updatedPasswords = [...passwords, password];
    
    // Try to use SecureStore first
    try {
      await SecureStore.setItemAsync(
        PASSWORDS_KEY,
        JSON.stringify(updatedPasswords)
      );
    } catch (secureStoreError) {
      // Fallback to AsyncStorage (for web platform)
      await AsyncStorage.setItem(
        PASSWORDS_KEY,
        JSON.stringify(updatedPasswords)
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error saving password:', error);
    throw error;
  }
};

// Update an existing password
export const updatePassword = async (updatedPassword) => {
  try {
    const passwords = await getPasswords();
    const updatedPasswords = passwords.map(p => 
      p.id === updatedPassword.id ? updatedPassword : p
    );
    
    // Try to use SecureStore first
    try {
      await SecureStore.setItemAsync(
        PASSWORDS_KEY,
        JSON.stringify(updatedPasswords)
      );
    } catch (secureStoreError) {
      // Fallback to AsyncStorage (for web platform)
      await AsyncStorage.setItem(
        PASSWORDS_KEY,
        JSON.stringify(updatedPasswords)
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Delete a password
export const deletePassword = async (id) => {
  try {
    const passwords = await getPasswords();
    const updatedPasswords = passwords.filter(p => p.id !== id);
    
    // Try to use SecureStore first
    try {
      await SecureStore.setItemAsync(
        PASSWORDS_KEY,
        JSON.stringify(updatedPasswords)
      );
    } catch (secureStoreError) {
      // Fallback to AsyncStorage (for web platform)
      await AsyncStorage.setItem(
        PASSWORDS_KEY,
        JSON.stringify(updatedPasswords)
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
};

// Clear all passwords
export const clearAllPasswords = async () => {
  try {
    // Try to use SecureStore first
    try {
      await SecureStore.deleteItemAsync(PASSWORDS_KEY);
    } catch (secureStoreError) {
      // Fallback to AsyncStorage (for web platform)
      await AsyncStorage.removeItem(PASSWORDS_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing passwords:', error);
    throw error;
  }
};