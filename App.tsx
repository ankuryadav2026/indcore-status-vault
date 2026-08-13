import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, AppState, AppStateStatus } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';
import { StorageService } from './StorageService';

let LocalAuthentication: any = null;
try { LocalAuthentication = require('expo-local-authentication'); } catch (e) {}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTab, setCurrentTab] = useState<'overview' | 'vault' | 'settings'>('overview');
  const [enteredPin, setEnteredPin] = useState('');
  const appState = useRef(AppState.currentState);

  useEffect(() => { 
    ScreenCapture.preventScreenCaptureAsync(); 
    checkBiometric();

    // पैनिक बटन / ऑटो-लॉक लॉजिक
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // जैसे ही ऐप वापस खुलेगा, लॉक मोड में आएगा
      } else if (nextAppState.match(/inactive|background/)) {
        setIsUnlocked(false); // ऐप बैकग्राउंड में जाते ही लॉक हो जाएगा (Panic Lock)
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const checkBiometric = async () => {
    if (!LocalAuthentication) return;
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return;
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'INDCORE अनलॉक करें' });
    if (result.success) setIsUnlocked(true);
  };

  const verifyPin = async () => {
    const savedPin = await StorageService.getData('app_pin');
    if (enteredPin === (savedPin || '1234')) {
      setIsUnlocked(true);
    } else {
      Alert.alert("Error", "गलत पिन!");
    }
  };

  if (!isUnlocked) return (
    <View style={styles.lockContainer}>
      <Text style={styles.title}>INDCORE LOCKED</Text>
      <TextInput style={styles.input} placeholder="PIN दर्ज करें" secureTextEntry keyboardType="numeric" onChangeText={setEnteredPin} />
      <TouchableOpacity style={styles.pinBtn} onPress={verifyPin}><Text style={styles.pinBtnText}>Unlock Now</Text></TouchableOpacity>
      <TouchableOpacity style={styles.bioBtn} onPress={checkBiometric}><Text style={styles.bioBtnText}>Biometric Unlock</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentTab === 'overview' && (
        <View style={styles.content}>
          <Text style={styles.header}>INDCORE COMMAND CENTER</Text>
          <View style={styles.mainCard}><Text style={styles.statusText}>SYSTEM SECURE: ACTIVE</Text></View>
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
  lockContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050707', padding: 20 },
  title: { color: '#00ffcc', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#131b18', color: '#fff', padding: 15, borderRadius: 10, width: '100%', marginBottom: 15, textAlign: 'center', borderWidth: 1, borderColor: '#00ffcc' },
  pinBtn: { backgroundColor: '#00ffcc', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
  pinBtnText: { color: '#0b0f0e', fontWeight: 'bold' },
  bioBtn: { padding: 15 },
  bioBtnText: { color: '#00ffcc' },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  header: { color: '#00ffcc', fontSize: 20, fontWeight: 'bold' },
  mainCard: { backgroundColor: '#131b18', padding: 20, borderRadius: 14, marginTop: 20 },
  statusText: { color: '#00ffcc' },
  navBar: { flexDirection: 'row', backgroundColor: '#0f1714', paddingVertical: 15, borderTopWidth: 1, borderColor: '#1b2d26' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#666' }
});
