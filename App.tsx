import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Alert } from 'react-native';
import VaultScreen from './VaultScreen';
import SettingsScreen from './SettingsScreen';

export default function App() {
  const [pin, setPin] = useState('');
  const [storedPin] = useState('1234');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'vault' | 'settings'>('main');

  const handlePress = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleVerify = () => {
    if (pin === storedPin) {
      setIsUnlocked(true);
      setCurrentScreen('main');
      setPin('');
    } else {
      Vibration.vibrate(400);
      Alert.alert('Error', 'गलत पिन दर्ज किया गया है!');
      setPin('');
    }
  };

  if (isUnlocked) {
    if (currentScreen === 'vault') {
      return <VaultScreen onBack={() => setCurrentScreen('main')} />;
    }
    if (currentScreen === 'settings') {
      return <SettingsScreen onBack={() => setCurrentScreen('main')} />;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>INDCORE VAULT</Text>
        <Text style={styles.subtitle}>स्वागत है बॉस! तिजोरी सुरक्षित है।</Text>
        
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setCurrentScreen('vault')}
        >
          <Text style={styles.menuButtonText}>📂 Photo Vault & Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setCurrentScreen('settings')}
        >
          <Text style={styles.menuButtonText}>⚙️ App Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.lockButton} 
          onPress={() => setIsUnlocked(false)}
        >
          <Text style={styles.lockButtonText}>🔒 लॉक करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INDCORE SECURITY</Text>
      <Text style={styles.subtitle}>पिन दर्ज करें (डिफ़ॉल्ट: 1234)</Text>

      <View style={styles.pinDisplay}>
        {['1', '2', '3', '4', '5', '6'].map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.pinDot, 
              index < pin.length ? styles.pinDotFilled : null
            ]} 
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.key}
            onPress={() => {
              if (item === 'C') handleDelete();
              else if (item === 'OK') handleVerify();
              else handlePress(item);
            }}
          >
            <Text style={styles.keyText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#00ffcc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 2,
  },
  subtitle: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 30,
  },
  pinDisplay: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: '#00ffcc',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: '#00ffcc',
  },
  keypad: {
    width: '80%',
    maxWidth: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#161616',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222222',
  },
  keyText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  },
  menuButton: {
    width: '80%',
    backgroundColor: '#161616',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00ffcc',
  },
  menuButtonText: {
    color: '#00ffcc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lockButton: {
    marginTop: 10,
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  lockButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
