import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}><Text style={styles.back}>← Back</Text></TouchableOpacity>
      <Text style={styles.title}>System Settings</Text>
      <View style={styles.item}><Text style={styles.text}>Encryption: Active (AES-256)</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  back: { color: '#00ffcc', marginBottom: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  item: { backgroundColor: '#131b18', padding: 20, borderRadius: 12, marginTop: 15 },
  text: { color: '#fff' }
});
