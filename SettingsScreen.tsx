import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert('सफलता', 'कैश डेटा साफ़ कर दिया गया है!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>APP SETTINGS</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>डार्क थीम (INDCORE Mode)</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#333', true: '#00ffcc' }}
          thumbColor={isDarkMode ? '#000' : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>सुरक्षा सूचनाएं (Notifications)</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#333', true: '#00ffcc' }}
          thumbColor={notificationsEnabled ? '#000' : '#f4f3f4'}
        />
      </View>

      <TouchableOpacity style={styles.dangerButton} onPress={handleClearCache}>
        <Text style={styles.dangerButtonText}>कैश डेटा साफ़ करें (Clear Cache)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#161616',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  backButtonText: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  dangerButton: {
    marginTop: 20,
    backgroundColor: '#221010',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  dangerButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
