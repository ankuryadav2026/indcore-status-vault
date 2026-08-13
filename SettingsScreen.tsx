import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StorageService } from './StorageService';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [pin, setPin] = useState('');

  const savePin = async () => {
    if (pin.length < 4) { Alert.alert("Error", "पिन कम से कम 4 अंकों का होना चाहिए।"); return; }
    await StorageService.saveData('app_pin', pin);
    Alert.alert("Success", "पिन सफलतापूर्वक सेव हो गया!");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Security Settings</Text>
      <TextInput 
        style={styles.input} 
        placeholder="नया पिन सेट करें (4 अंक)" 
        keyboardType="numeric" 
        secureTextEntry 
        onChangeText={setPin}
      />
      <TouchableOpacity style={styles.btn} onPress={savePin}><Text style={styles.btnText}>Save PIN</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  back: { color: '#00ffcc', marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#131b18', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1b2d26' },
  btn: { backgroundColor: '#00ffcc', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#0b0f0e', fontWeight: 'bold' }
});
