import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StorageService } from './StorageService';

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState('Vault Empty');
  useEffect(() => { StorageService.getData('secure_key').then(d => d && setData(d)); }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>Secure Vault</Text>
      <ScrollView style={styles.card}><Text style={styles.text}>{data}</Text></ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  back: { color: '#00ffcc', marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#131b18', padding: 20, borderRadius: 12 },
  text: { color: '#fff' }
});
