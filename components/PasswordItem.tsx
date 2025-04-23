
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export function PasswordItem({ item, onDelete }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const copyToClipboard = async (text, label) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert(`${label} Copied`, `${label} has been copied to clipboard`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Password',
      `Are you sure you want to delete the password for ${item.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value} numberOfLines={1}>{item.username}</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => copyToClipboard(item.username, 'Username')}
          >
            <Copy size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value} numberOfLines={1}>
            {isPasswordVisible ? item.password : '•'.repeat(Math.min(12, item.password.length))}
          </Text>
          <View style={styles.passwordActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <EyeOff size={16} color="#6366F1" />
              ) : (
                <Eye size={16} color="#6366F1" />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => copyToClipboard(item.password, 'Password')}
            >
              <Copy size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {item.notes ? (
        <View style={styles.field}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.notes}>{item.notes}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1E293B',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  passwordActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  notes: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});