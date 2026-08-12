import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Secure Vault</Text>
      </View>

      <View style={styles.vaultCard}>
        <Text style={styles.vaultText}>Encrypted Credentials Active</Text>
        <Text style={styles.subText}>No security breaches detected.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backBtn: { color: '#00ffcc', fontSize: 16, marginRight: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  vaultCard: { backgroundColor: '#131b18', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#1b2d26' },
  vaultText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  subText: { color: '#888', fontSize: 14 }
});
