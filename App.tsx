import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ScreenCapture from 'expo-screen-capture';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';

type AuthMode = 'pin' | 'password';

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('pin');
  const [inputVal, setInputVal] = useState('');
  const [storedSecret, setStoredSecret] = useState('1234');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'vault' | 'settings'>('main');

  // डेटा और पासवर्ड लोड करें
  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const savedSecret = await AsyncStorage.getItem('userSecret');
        const savedMode = await AsyncStorage.getItem('userAuthMode');
        if (savedSecret) setStoredSecret(savedSecret);
        if (savedMode) setAuthMode(savedMode as AuthMode);
      } catch (e) {
        console.log(e);
      }
    };
    loadSecuritySettings();
  }, []);

  // लॉक स्क्रीन पर स्क्रीनशॉट की अनुमति दें ताकि ट्रांसलेशन में दिक्कत न हो, 
  // लेकिन वॉल्ट (प्राइवेट) स्क्रीन पर यह ब्लॉक रहेगा।
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

  // बायोमेट्रिक (फिंगरप्रिंट/फेस) अनलॉक फंक्शन
  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('त्रुटि', 'आपके डिवाइस पर बायोमेट्रिक सेंसर उपलब्ध नहीं है।');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'INDCORE VAULT अनलॉक करने के लिए प्रमाणित करें',
        fallbackLabel: 'पिन/पासवर्ड दर्ज करें',
      });

      if (result.success) {
        setIsUnlocked(true);
        setCurrentScreen('main');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleVerify = () => {
    if (inputVal === storedSecret) {
      setIsUnlocked(true);
      setCurrentScreen('main');
      setInputVal('');
    } else {
      Vibration.vibrate(600);
      Alert.alert('एक्सेस अस्वीकृत', 'गलत पिन या पासवर्ड दर्ज किया गया है!');
      setInputVal('');
    }
  };

  const handleKeyPress = (char: string) => {
    if (inputVal.length < 25) {
      setInputVal(prev => prev + char);
    }
  };

  const handleDelete = () => {
    setInputVal(prev => prev.slice(0, -1));
  };

  if (isUnlocked) {
    if (currentScreen === 'vault') return <VaultScreen onBack={() => setCurrentScreen('main')} />;
    if (currentScreen === 'settings') return <SettingsScreen onBack={() => setCurrentScreen('main')} />;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>INDCORE DASHBOARD</Text>
        <Text style={styles.subtitle}>बॉस, सिस्टम पूरी तरह सुरक्षित है।</Text>

        <TouchableOpacity style={styles.menuButton} onPress={() => setCurrentScreen('vault')}>
          <Text style={styles.menuText}>📂 Photo Vault & Audit Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => setCurrentScreen('settings')}>
          <Text style={styles.menuText}>⚙️ App Settings & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.lockButton} onPress={() => setIsUnlocked(false)}>
          <Text style={styles.lockText}>🔒 लॉक करें (Lock App)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INDCORE SECURITY</Text>
      <Text style={styles.subtitle}>फिंगरप्रिंट या पासवर्ड से लॉगिन करें</Text>

      {/* बायोमेट्रिक बटन */}
      <TouchableOpacity style={styles.bioButton} onPress={handleBiometricAuth}>
        <Text style={styles.bioButtonText}>👆 बायोमेट्रिक (Fingerprint/Face) अनलॉक</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>--- या पासवर्ड / पिन उपयोग करें ---</Text>

      {/* मोड स्विचर */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeTab, authMode === 'pin' && styles.activeModeTab]}
          onPress={() => { setAuthMode('pin'); setInputVal(''); }}
        >
          <Text style={[styles.modeText, authMode === 'pin' && styles.activeModeText]}>PIN Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, authMode === 'password' && styles.activeModeTab]}
          onPress={() => { setAuthMode('password'); setInputVal(''); }}
        >
          <Text style={[styles.modeText, authMode === 'password' && styles.activeModeText]}>Password Mode</Text>
        </TouchableOpacity>
      </View>

      {authMode === 'pin' ? (
        <View style={styles.authSection}>
          <View style={styles.pinDisplay}>
            {['', '', '', '', '', ''].map((_, idx) => (
              <View
                key={idx}
                style={[styles.pinDot, idx < inputVal.length ? styles.pinDotFilled : null]}
              />
            ))}
          </View>

          <View style={styles.keypad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.key}
                onPress={() => {
                  if (item === 'C') handleDelete();
                  else if (item === 'OK') handleVerify();
                  else handleKeyPress(item);
                }}
              >
                <Text style={styles.keyText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.authSection}>
          <TextInput
            style={styles.textInput}
            value={inputVal}
            onChangeText={setInputVal}
            placeholder="अपना पासवर्ड यहाँ टाइप करें..."
            placeholderTextColor="#555"
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleVerify}>
            <Text style={styles.submitBtnText}>अनलॉक करें (Verify)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#00ffcc', fontSize: 24, fontWeight: 'bold', marginBottom: 5, letterSpacing: 2 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 20 },
  bioButton: { backgroundColor: '#161616', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc', marginBottom: 15 },
  bioButtonText: { color: '#00ffcc', fontWeight: 'bold', fontSize: 15 },
  orText: { color: '#555', fontSize: 12, marginBottom: 15 },
  modeContainer: { flexDirection: 'row', backgroundColor: '#161616', borderRadius: 10, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#222' },
  modeTab: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  activeModeTab: { backgroundColor: '#00ffcc' },
  modeText: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  activeModeText: { color: '#000', fontWeight: 'bold' },
  authSection: { width: '100%', alignItems: 'center' },
  pinDisplay: { flexDirection: 'row', marginBottom: 25 },
  pinDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#00ffcc', marginHorizontal: 6 },
  pinDotFilled: { backgroundColor: '#00ffcc' },
  keypad: { width: 260, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: { width: 65, height: 65, margin: 8, backgroundColor: '#161616', borderRadius: 32.5, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#222' },
  keyText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  textInput: { width: '85%', backgroundColor: '#161616', color: '#00ffcc', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  submitBtn: { backgroundColor: '#00ffcc', paddingVertical: 14, paddingHorizontal: 35, borderRadius: 10 },
  submitBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  menuButton: { padding: 15, backgroundColor: '#161616', width: '80%', marginBottom: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc' },
  menuText: { color: '#00ffcc', fontWeight: 'bold', fontSize: 16 },
  lockButton: { marginTop: 15, padding: 14, backgroundColor: '#ff4444', width: '80%', alignItems: 'center', borderRadius: 10 },
  lockText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
               
