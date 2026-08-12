import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function VaultScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'vault' | 'logs'>('vault');
  const [photos, setPhotos] = useState<string[]>([
    '🔒 सुरक्षित फोटो #1 (एनक्रिप्टेड)',
    '🔒 सुरक्षित फोटो #2 (एनक्रिप्टेड)'
  ]);
  const [logs, setLogs] = useState<string[]>([
    '[12:05 PM] वॉल्ट एक्सेस किया गया',
    '[12:00 PM] पिन सफलतापूर्वक सत्यापित हुआ'
  ]);

  const addPhoto = () => {
    const newPhotoName = `🔒 नई फोटो #${photos.length + 1} (सुरक्षित)`;
    setPhotos([newPhotoName, ...photos]);
    setLogs([`[${new Date().toLocaleTimeString()}] नई फोटो वॉल्ट में जोड़ी गई`, ...logs]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INDCORE VAULT</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'vault' && styles.activeTab]}
          onPress={() => setActiveTab('vault')}
        >
          <Text style={[styles.tabText, activeTab === 'vault' && styles.activeTabText]}>Photo Vault</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'logs' && styles.activeTab]}
          onPress={() => setActiveTab('logs')}
        >
          <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>Audit Logs</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'vault' ? (
        <View style={styles.content}>
          <TouchableOpacity style={styles.actionButton} onPress={addPhoto}>
            <Text style={styles.actionButtonText}>+ सुरक्षित फोटो जोड़ें</Text>
          </TouchableOpacity>
          <ScrollView style={styles.list}>
            {photos.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Activity & Audit Logs</Text>
          {logs.map((log, index) => (
            <View key={index} style={styles.logCard}>
              <Text style={styles.logText}>{log}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#161616',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  backButtonText: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00ffcc',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#00ffcc',
  },
  content: {
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#00ffcc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardText: {
    color: '#fff',
    fontSize: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  logCard: {
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00ffcc',
  },
  logText: {
    color: '#aaa',
    fontFamily: 'monospace',
    fontSize: 13,
  },
});
