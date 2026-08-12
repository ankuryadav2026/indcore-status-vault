import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Alert } from 'react-native';

export default function App() {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('1234'); // डिफ़ॉल्ट पिन 1234
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSettingNew, setIsSettingNew] = useState(false);

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
      setPin('');
    } else {
      Vibration.vibrate(400);
      Alert.alert('Error', 'गलत पिन दर्ज किया गया है!');
      setPin('');
    }
  };

  if (isUnlocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>INDCORE VAULT</Text>
        <Text style={styles.subtitle}>स्वागत है बॉस! तिजोरी सुरक्षित है।</Text>
        <TouchableOpacity 
          style={styles.lockButton} 
          onPress={() => setIsUnlocked(false)}
        >
          <Text style={styles.lockButtonText}>लॉक करें</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INDCORE SECURITY</Text>
      <Text style={styles.subtitle}>पिन दर्ज करें (4-6 डिजिट)</Text>

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
  lockButton: {
    marginTop: 20,
    backgroundColor: '#00ffcc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  lockButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
