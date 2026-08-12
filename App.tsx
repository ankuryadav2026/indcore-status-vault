import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(true); // सुरक्षा हेतु डिफ़ॉल्ट ट्रू
  const [currentTab, setCurrentTab] = useState<'overview' | 'vault' | 'settings'>('overview');

  useEffect(() => { ScreenCapture.preventScreenCaptureAsync(); }, []);

  return (
    <View style={styles.container}>
      {currentTab === 'overview' && (
        <View style={styles.content}>
          <Text style={styles.headerTitle}>INDCORE COMMAND CENTER</Text>
          <View style={styles.card}><Text style={styles.scoreText}>System Secure</Text></View>
        </View>
      )}
      {currentTab === 'vault' && <VaultScreen onBack={() => setCurrentTab('overview')} />}
      {currentTab === 'settings' && <SettingsScreen onBack={() => setCurrentTab('overview')} />}

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentTab('overview')} style={styles.navItem}><Text style={styles.navText}>Home</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('vault')} style={styles.navItem}><Text style={styles.navText}>Vault</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('settings')} style={styles.navItem}><Text style={styles.navText}>Settings</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e' },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  headerTitle: { color: '#00ffcc', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#131b18', padding: 20, borderRadius: 12, marginTop: 20 },
  scoreText: { color: '#fff', fontSize: 18 },
  navBar: { flexDirection: 'row', backgroundColor: '#0f1714', paddingVertical: 15, borderTopWidth: 1, borderColor: '#1b2d26' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#666' }
});
