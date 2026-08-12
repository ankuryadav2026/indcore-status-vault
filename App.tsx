import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTab, setCurrentTab] = useState<'overview' | 'activity' | 'settings'>('overview');
  const [securityScore, setSecurityScore] = useState('98');

  useEffect(() => {
    const allowCaptureOnLogin = async () => {
      try {
        await ScreenCapture.allowScreenCaptureAsync();
      } catch (e) {
        console.log(e);
      }
    };
    allowCaptureOnLogin();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('त्रुटि', 'बायोमेट्रिक उपलब्ध नहीं है।');
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
    }
  };

  if (!isUnlocked) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.lockCard}>
          <Text style={styles.brandTitle}>INDCORE</Text>
          <Text style={styles.brandSubtitle}>SECURITY COMMAND CENTER</Text>
          
          <TouchableOpacity style={styles.bioUnlockBtn} onPress={handleBiometricAuth}>
            <Text style={styles.bioUnlockText}>🔒 टैप करके अनलॉक करें (Biometric)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* मुख्य स्क्रीन कंटेंट */}
      <View style={styles.contentArea}>
        {currentTab === 'overview' && (
          <View style={styles.screenView}>
            <View style={styles.topHeader}>
              <View>
                <Text style={styles.greeting}>Good evening, Boss</Text>
                <Text style={styles.subGreeting}>System Status: Fully Operational</Text>
              </View>
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreNumber}>{securityScore}</Text>
                <View style={styles.encryptedBadge}>
                  <Text style={styles.encryptedText}>🔒 ENCRYPTED</Text>
                </View>
              </View>
              <Text style={styles.scoreTitle}>Security score</Text>
              <Text style={styles.scoreDesc}>Excellent protection across your workspace</Text>
              <View style={styles.progressBar} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active safeguards</Text>
            </View>

            <TouchableOpacity style={styles.cardItem} onPress={() => setCurrentTab('activity')}>
              <Text style={styles.cardItemText}>🛡️ Identity & Vault Protection</Text>
              <Text style={styles.cardStatus}>Active ✓</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentTab === 'activity' && <VaultScreen onBack={() => setCurrentTab('overview')} />}
        {currentTab === 'settings' && <SettingsScreen onBack={() => setCurrentTab('overview')} />}
      </View>

      {/* स्क्रीनशॉट में दिखाए गए स्टाइल जैसा बॉटम नेविगेशन बार */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => setCurrentTab('overview')}>
          <Text style={[styles.navIcon, currentTab === 'overview' && styles.activeNavText]}>🏠</Text>
          <Text style={[styles.navLabel, currentTab === 'overview' && styles.activeNavText]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setCurrentTab('activity')}>
          <Text style={[styles.navIcon, currentTab === 'activity' && styles.activeNavText]}>⚡</Text>
          <Text style={[styles.navLabel, currentTab === 'activity' && styles.activeNavText]}>Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setCurrentTab('settings')}>
          <Text style={[styles.navIcon, currentTab === 'settings' && styles.activeNavText]}>⚙️</Text>
          <Text style={[styles.navLabel, currentTab === 'settings' && styles.activeNavText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e' },
  lockContainer: { flex: 1, backgroundColor: '#0b0f0e', justifyContent: 'center', alignItems: 'center', padding: 20 },
  lockCard: { width: '100%', backgroundColor: '#131b18', padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1b2d26' },
  brandTitle: { color: '#00ffcc', fontSize: 26, fontWeight: 'bold', letterSpacing: 2 },
  brandSubtitle: { color: '#667770', fontSize: 11, marginBottom: 30, letterSpacing: 1 },
  bioUnlockBtn: { backgroundColor: '#00ffcc', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 12, width: '100%', alignItems: 'center' },
  bioUnlockText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  
  contentArea: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  screenView: { flex: 1 },
  topHeader: { marginBottom: 20 },
  greeting: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subGreeting: { color: '#667770', fontSize: 12, marginTop: 3 },
  
  scoreCard: { backgroundColor: '#131b18', borderRadius: 16, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#1b2d26' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  scoreNumber: { color: '#00ffcc', fontSize: 42, fontWeight: 'bold' },
  encryptedBadge: { backgroundColor: '#112922', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  encryptedText: { color: '#00ffcc', fontSize: 10, fontWeight: 'bold' },
  scoreTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  scoreDesc: { color: '#667770', fontSize: 12, marginBottom: 15 },
  progressBar: { height: 4, backgroundColor: '#00ffcc', borderRadius: 2, width: '100%' },
  
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  cardItem: { backgroundColor: '#131b18', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#1b2d26', marginBottom: 10 },
  cardItemText: { color: '#fff', fontSize: 14 },
  cardStatus: { color: '#00ffcc', fontSize: 12, fontWeight: 'bold' },

  bottomNav: { flexDirection: 'row', backgroundColor: '#0e1412', borderTopWidth: 1, borderTopColor: '#1b2d26', paddingVertical: 10, justifyContent: 'space-around' },
  navButton: { alignItems: 'center' },
  navIcon: { fontSize: 20, color: '#556660' },
  navLabel: { fontSize: 11, color: '#556660', marginTop: 3 },
  activeNavText: { color: '#00ffcc', fontWeight: 'bold' }
});
