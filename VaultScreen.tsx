import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { StorageService } from './StorageService';

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState('');
  const [inputText, setInputText] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const saved = await StorageService.getData('secure_key');
    if (saved) setData(saved);
  };

  const saveData = async () => {
    const success = await StorageService.saveData('secure_key', inputText);
    if (success) {
      setData(inputText);
      setInputText('');
      Alert.alert("Success", "डेटा सुरक्षित रूप से सेव हो गया!");
    } else {
      Alert.alert("Error", "डेटा सेव करने में समस्या आई।");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Secure Vault</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="यहाँ गुप्त डेटा लिखें..." 
        placeholderTextColor="#555"
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={saveData}>
        <Text style={styles.saveText}>Save to Vault</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>Saved Data:</Text>
        <Text style={styles.text}>{data}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  back: { color: '#00ffcc', marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#131b18', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1b2d26' },
  saveBtn: { backgroundColor: '#00ffcc', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  saveText: { color: '#0b0f0e', fontWeight: 'bold' },
  card: { backgroundColor: '#131b18', padding: 20, borderRadius: 12 },
  label: { color: '#888', marginBottom: 5 },
  text: { color: '#fff', fontSize: 16 }
});
