import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>System Settings</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Biometric Lock</Text>
        <Switch 
          value={isEnabled} 
          onValueChange={setIsEnabled}
          trackColor={{ false: '#3e3e3e', true: '#00ffcc' }}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Force Dark Mode</Text>
        <Text style={styles.status}>Enabled</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f0e', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backBtn: { color: '#00ffcc', fontSize: 16, marginRight: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  settingItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#131b18', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1b2d26'
  },
  label: { color: '#fff', fontSize: 16 },
  status: { color: '#00ffcc', fontWeight: 'bold' }
});
