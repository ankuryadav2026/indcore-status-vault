import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
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

  useEffect(() => { 
    ScreenCapture.preventScreenCaptureAsync(); 
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    if (!LocalAuthentication) return;
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return;
    
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'INDCORE कमांड सेंटर अनलॉक करें' });
    if (result.success) {
      setIsUnlocked(true);
    }
  };

  const verifyPin = async () => {
    const savedPin = await StorageService.getData('app_pin');
    if (!savedPin) {
      if (enteredPin === '1234' || enteredPin === '') {
        setIsUnlocked(true);
      } else {
        Alert.alert("Error", "गलत पिन दर्ज किया गया।");
      }
      return;
    }

    if (enteredPin === savedPin) {
      setIsUnlocked(true);
    } else {
      Alert.alert("Error", "गलत पिन! कृपया पुनः प्रयास करें।");
    }
  };

  if (!isUnlocked) return (
    <View style={styles.lockContainer}>
      <Text style={styles.title}>INDCORE COMMAND</Text>
      <Text style={styles.subtitle}>SECURE ACCESS PROTOCOL</Text>

      <TouchableOpacity style={styles.bioBtn} onPress={checkBiometric}>
        <Text style={styles.bioBtnText}>🛡️ बायोमेट्रिक से अनलॉक करें</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>या पिन दर्ज करें</Text>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="4-अंकों का पिन दर्ज करें" 
        placeholderTextColor="#555"
        keyboardType="numeric" 
        secureTextEntry 
        value={enteredPin}
        onChangeText={setEnteredPin}
      />
      <TouchableOpacity style={styles.pinBtn} onPress={verifyPin}>
        <Text style={styles.pinBtnText}>पिन से लॉगिन करें</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentTab === 'overview' && (
        <ScrollView style={styles.content}>
          <Text style={styles.header}>INDCORE COMMAND CENTER</Text>
          
          {/* स्टेटस कार्ड */}
          <View style={styles.mainCard}>
            <View style={styles.statusRow}>
              <View style={styles.activeDot} />
              <Text style={styles.statusText}>SYSTEM SECURE & ACTIVE</Text>
            </View>
            <Text style={styles.subStatusText}>एन्क्रिप्शन: AES-256 (मिलिट्री ग्रेड)</Text>
          </View>

          {/* फीचर्स ग्रिड / क्विक एक्शन्स */}
          <Text style={styles.sectionTitle}>मोड्यूल पैनल</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={() => setCurrentTab('vault')}>
            <Text style={styles.actionTitle}>🔒 Secure Vault</Text>
            <Text style={styles.actionDesc}>अपने गुप्त पासवर्ड और नोट्स यहाँ सुरक्षित रखें।</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setCurrentTab('settings')}>
            <Text style={styles.actionTitle}>⚙️ System Settings</Text>
            <Text style={styles.actionDesc}>पिन कोड बदलें और सुरक्षा पैरामीटर सेट करें।</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {currentTab === 'vault' && <VaultScreen onBack={() => setCurrentTab('overview')} />}
      {currentTab === 'settings' && <SettingsScreen onBack={() => setCurrentTab('overview')} />}

      {/* नेविगेशन बार */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentTab('overview')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'overview' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('vault')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'vault' && styles.activeNavText]}>Vault</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('settings')} style={styles.navItem}>
          <Text style={[styles.navText, currentTab === 'settings' && styles.activeNavText]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e' },
  lockContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050707', padding: 20 },
  title: { color: '#00ffcc', fontSize: 26, fontWeight: 'bold', marginBottom: 5, letterSpacing: 2, textAlign: 'center' },
  subtitle: { color: '#666', fontSize: 11, marginBottom: 30, letterSpacing: 1.5 },
  bioBtn: { backgroundColor: '#131b18', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc', width: '100%', alignItems: 'center', marginBottom: 20 },
  bioBtnText: { color: '#00ffcc', fontWeight: 'bold', fontSize: 15 },
  divider: { marginVertical: 10 },
  dividerText: { color: '#444', fontSize: 12 },
  input: { backgroundColor: '#131b18', color: '#fff', padding: 15, borderRadius: 10, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: '#1b2d26', textAlign: 'center', fontSize: 16 },
  pinBtn: { backgroundColor: '#00ffcc', padding: 16, borderRadius: 10, width: '100%', alignItems: 'center' },
  pinBtnText: { color: '#0b0f0e', fontWeight: 'bold', fontSize: 16 },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  header: { color: '#00ffcc', fontSize: 20, fontWeight: 'bold', marginBottom: 20, letterSpacing: 1 },
  mainCard: { backgroundColor: '#131b18', padding: 20, borderRadius: 14, borderWidth: 1, borderColor: '#1b2d26', marginBottom: 25 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  activeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00ffcc', marginRight: 10 },
  statusText: { color: '#00ffcc', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  subStatusText: { color: '#888', fontSize: 13 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  actionCard: { backgroundColor: '#131b18', padding: 20, borderRadius: 14, borderWidth: 1, borderColor: '#1b2d26', marginBottom: 15 },
  actionTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 5 },
  actionDesc: { color: '#777', fontSize: 13 },
  navBar: { flexDirection: 'row', backgroundColor: '#0f1714', paddingVertical: 16, borderTopWidth: 1, borderColor: '#1b2d26' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#666', fontSize: 14 },
  activeNavText: { color: '#00ffcc', fontWeight: 'bold' }
});
