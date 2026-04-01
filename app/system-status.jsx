import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DATA = [
  { id: 1, name: "Core Profiles", status: "WORKING", icon: "people", color: "#fefce8" },
  { id: 2, name: "Attendance Sys", status: "WORKING", icon: "time", color: "#f0fdf4" },
  { id: 3, name: "Vault / Docs", status: "WORKING", icon: "folder", color: "#ecfdf5" },
  { id: 4, name: "Payroll Flow", status: "WORKING", icon: "cash", color: "#fff7ed" },
  { id: 5, name: "Bull Feed", status: "WORKING", icon: "megaphone", color: "#fef2f2" },
  { id: 6, name: "Kudo Wall", status: "WORKING", icon: "ribbon", color: "#fefce8" },
  { id: 7, name: "Bull-Bot AI", status: "WORKING", icon: "hardware-chip", color: "#f5f3ff" },
  { id: 8, name: "Approval Engine", status: "WORKING", icon: "shield-checkmark", color: "#f0f9ff" },
  { id: 9, name: "Task Tracker", status: "WORKING", icon: "list-circle", color: "#fdf2f8" },
];

export default function SystemStatus() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONTROL ROOM</Text>
        <View style={styles.badge}>
           <Text style={styles.badgeText}>LIVE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
           <Text style={styles.heroMain}>SYSTEM HEALTH</Text>
           <View style={styles.heroSecondary}>
              <View style={styles.pulse} />
              <Text style={styles.heroSub}>STABLE & OPERATIONAL (100%)</Text>
           </View>
        </View>

        <View style={styles.grid}>
          {DATA.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
              <View style={styles.cardTop}>
                 <Ionicons name={item.icon} size={20} color="#0d0d0d" />
                 <Text style={styles.workingLabel}>{item.status}</Text>
              </View>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.progressBar}>
                 <View style={styles.progressFill} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footerInfo}>
           <Text style={styles.footerHeading}>LAST PROJECT SYNC</Text>
           <Text style={styles.footerTime}>{new Date().toLocaleString()}</Text>
           <View style={styles.divider} />
           <Text style={styles.footerNote}>ALL 24 PHASES DEPLOYED TO PRODUCTION HUB</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 54, paddingBottom: 20, paddingHorizontal: 20,
    borderBottomWidth: 4, borderColor: '#0d0d0d', flexDirection: 'row', alignItems: 'center', gap: 12
  },
  backButton: { width: 44, height: 44, backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: '#0d0d0d', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#0d0d0d', letterSpacing: 1 },
  badge: { backgroundColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: '#0d0d0d' },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  scroll: { padding: 20 },
  hero: { marginBottom: 30 },
  heroMain: { fontSize: 44, fontWeight: '900', color: '#0d0d0d', letterSpacing: -2, lineHeight: 44 },
  heroSecondary: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  pulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' },
  heroSub: { fontSize: 12, fontWeight: '800', color: '#6b7280' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', borderHeight: 200, borderWidth: 3, borderColor: '#0d0d0d', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  workingLabel: { fontSize: 8, fontWeight: '900', color: '#22c55e' },
  cardName: { fontSize: 14, fontWeight: '900', color: '#0d0d0d', textTransform: 'uppercase' },
  progressBar: { height: 4, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0d0d0d', marginTop: 12, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: '#22c55e', width: '100%' },
  footerInfo: { marginTop: 40, padding: 20, backgroundColor: '#f9fafb', borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', marginBottom: 40 },
  footerHeading: { fontSize: 10, fontWeight: '900', color: '#9ca3af', marginBottom: 6 },
  footerTime: { fontSize: 14, fontWeight: '900', color: '#0d0d0d' },
  divider: { height: 2, backgroundColor: '#e5e7eb', marginVertical: 14 },
  footerNote: { fontSize: 10, fontWeight: '800', color: '#6b7280', textAlign: 'center' }
});
