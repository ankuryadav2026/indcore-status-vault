import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';
import { StorageService } from './StorageService';

// सुरक्षित बायोमेट्रिक लोडर
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
      // अगर कोई पिन सेट नहीं है, तो डिफ़ॉल्ट रूप से '1234' मान सकते हैं या डायरेक्ट खोल सकते हैं
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
      <Text style={styles.title}>INDCORE LOCKED</Text>
      <Text style={styles.subtitle}>सुरक्षा के लिए ऑथेंटिकेशन आवश्यक है</Text>

      <TouchableOpacity style={styles.bioBtn} onPress={checkBiometric}>
        <Text style={styles.bioBtnText}>फिंगरप्रिंट / बायोमेट्रिक से खोलें</Text>
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
        <Text style={styles.pinBtnText}>पिन से अनलॉक करें</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentTab === 'overview' && (
        <View style={styles.content}>
          <Text style={styles.header}>INDCORE COMMAND CENTER</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Status</Text>
            <Text style={styles.cardText}>System Fully Secured & Encrypted</Text>
          </View>
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
  title: { color: '#00ffcc', fontSize: 24, fontWeight: 'bold', marginBottom: 5, letterSpacing: 2 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 30 },
  bioBtn: { backgroundColor: '#131b18', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc', width: '100%', alignItems: 'center', marginBottom: 20 },
  bioBtnText: { color: '#00ffcc', fontWeight: 'bold' },
  divider: { marginVertical: 10 },
  dividerText: { color: '#555', fontSize: 12 },
  input: { backgroundColor: '#131b18', color: '#fff', padding: 15, borderRadius: 10, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: '#1b2d26', textAlign: 'center' },
  pinBtn: { backgroundColor: '#00ffcc', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  pinBtnText: { color: '#0b0f0e', fontWeight: 'bold' },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  header: { color: '#00ffcc', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#131b18', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#1b2d26' },
  cardTitle: { color: '#888', fontSize: 12, marginBottom: 5 },
  cardText: { color: '#fff', fontSize: 16 },
  navBar: { flexDirection: 'row', backgroundColor: '#0f1714', paddingVertical: 15, borderTopWidth: 1, borderColor: '#1b2d26' },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { color: '#666' }
});
