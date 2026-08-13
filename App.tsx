import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';

// सुरक्षित बायोमेट्रिक लोडर
let LocalAuthentication: any = null;
try { LocalAuthentication = require('expo-local-authentication'); } catch (e) {}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTab, setCurrentTab] = useState<'overview' | 'vault' | 'settings'>('overview');

  useEffect(() => { 
    ScreenCapture.preventScreenCaptureAsync(); 
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!LocalAuthentication) { setIsUnlocked(true); return; }
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) { setIsUnlocked(true); return; }
    
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'INDCORE अनलॉक करें' });
    if (result.success) setIsUnlocked(true);
    else Alert.alert("Authentication Failed", "कृपया पुनः प्रयास करें।");
  };

  if (!isUnlocked) return (
    <View style={styles.lockContainer}>
      <Text style={styles.title}>INDCORE LOCKED</Text>
      <TouchableOpacity style={styles.btn} onPress={checkAuth}><Text style={styles.btnText}>Tap to Unlock</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentTab === 'overview' && <View style={styles.content}><Text style={styles.header}>INDCORE DASHBOARD</Text></View>}
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
  lockContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050707' },
  title: { color: '#00ffcc', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  btn: { backgroundColor: '#131b18', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc' },
  btnText: { color: '#00ffcc' },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  header: { color: '#00ffcc', fontSize: 20, fontWeight: 'bold' },
  navBar: { flexDirection: 'row', backgroundColor: '#0f1714', paddingVertical: 15, borderTopWidth: 1, borderColor: '#1b2d26' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#666' }
});
