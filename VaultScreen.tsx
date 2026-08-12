import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Secure Vault</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.vaultCard}>
          <Text style={styles.vaultStatus}>🔒 Encryption Active</Text>
          <Text style={styles.vaultData}>ID: IND-9982-X</Text>
          <Text style={styles.vaultLabel}>Master Key Loaded</Text>
        </View>

        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>View Sensitive Logs</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  backBtn: { color: '#00ffcc', fontSize: 16, marginRight: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  vaultCard: { backgroundColor: '#131b18', padding: 25, borderRadius: 16, borderWidth: 1, borderColor: '#00ffcc', marginBottom: 20 },
  vaultStatus: { color: '#00ffcc', fontWeight: 'bold', marginBottom: 10 },
  vaultData: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  vaultLabel: { color: '#667770', fontSize: 12, marginTop: 5 },
  actionBtn: { backgroundColor: '#1b2d26', padding: 15, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: '#00ffcc', fontWeight: 'bold' }
});
