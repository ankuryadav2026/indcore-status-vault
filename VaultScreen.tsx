import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StorageService } from './StorageService'; // हमने जो नई सर्विस बनाई

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  const [vaultData, setVaultData] = useState<string>('Loading...');

  useEffect(() => {
    loadVault();
  }, []);

  const loadVault = async () => {
    const data = await StorageService.getData('secure_key');
    setVaultData(data || 'कोई डेटा अभी उपलब्ध नहीं है।');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Secure Vault</Text>
      </View>

      <ScrollView style={styles.vaultCard}>
        <Text style={styles.vaultText}>{vaultData}</Text>
      </ScrollView>
    </View>
  );
}

// स्टाइल्स वही पुराने वाले रखें, ये एकदम स्टेबल हैं।
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backBtn: { color: '#00ffcc', fontSize: 16, marginRight: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  vaultCard: { backgroundColor: '#131b18', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#1b2d26' },
  vaultText: { color: '#fff', fontSize: 16 }
});
