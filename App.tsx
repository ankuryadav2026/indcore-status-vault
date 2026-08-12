import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';

// सुरक्षित LocalAuthentication लोडर (वेब और मोबाइल दोनों के लिए)
let LocalAuthentication: any = {
  hasHardwareAsync: async () => false,
  authenticateAsync: async () => ({ success: false })
};
try {
  LocalAuthentication = require('expo-local-authentication');
} catch (e) {
  // वेब प्रीव्यू फॉलबैक
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTab, setCurrentTab] = useState<'overview' | 'activity' | 'settings'>('overview');
  const [securityScore, setSecurityScore] = useState(94);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync();
    handleBiometricAuth();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setIsUnlocked(true);
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'INDCORE Command Center अनलॉक करें',
        fallbackLabel: 'पिन का उपयोग करें',
      });
      if (result.success) {
        setIsUnlocked(true);
      }
    } catch (e) {
      console.log(e);
      setIsUnlocked(true);
    }
  };

  if (!isUnlocked) {
    return (
      <View style={styles.lockContainer}>
        <Text style={styles.lockTitle}>INDCORE SECURITY</Text>
        <Text style={styles.lockSubtitle}>सुरक्षित कमांड सेंटर</Text>
        <TouchableOpacity style={styles.unlockBtn} onPress={handleBiometricAuth}>
          <Text style={styles.unlockText}>अनलॉक करने के लिए टैप करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentTab === 'overview' && (
        <View style={styles.content}>
          <Text style={styles.headerTitle}>INDCORE DASHBOARD</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Security Score</Text>
            <Text style={styles.scoreText}>{securityScore}% Secure</Text>
          </View>
        </View>
      )}

      {currentTab === 'activity' && <VaultScreen onBack={() => setCurrentTab('overview')} />}
      {currentTab === 'settings' && <SettingsScreen onBack={() => setCurrentTab('overview')} />}

      {/* बॉटम नेविगेशन बार */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentTab('overview')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'overview' && styles.activeText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('activity')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'activity' && styles.activeText]}>Vault</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('settings')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'settings' && styles.activeText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e' },
  lockContainer: { flex: 1, backgroundColor: '#050707', justifyContent: 'center', alignItems: 'center', padding: 20 },
  lockTitle: { color: '#00ffcc', fontSize: 24, fontWeight: 'bold', marginBottom: 10, letterSpacing: 2 },
  lockSubtitle: { color: '#888', fontSize: 14, marginBottom: 30 },
  unlockBtn: { backgroundColor: '#131b18', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc' },
  unlockText: { color: '#00ffcc', fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#131b18', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#1b2d26' },
  cardTitle: { color: '#888', fontSize: 14, marginBottom: 5 },
  scoreText: { color: '#00ffcc', fontSize: 28, fontWeight: 'bold' },
  navBar: { flexDirection: 'row', backgroundColor: '#0f1714', borderTopWidth: 1, borderTopColor: '#1b2d26', paddingVertical: 12 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#666', fontSize: 14 },
  activeText: { color: '#00ffcc', fontWeight: 'bold' }
});
