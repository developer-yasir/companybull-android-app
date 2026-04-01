import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState({
    name: 'Yasir Raees',
    email: 'yasir@companybull.com',
    role: 'CTO',
    department: 'Engineering',
    phone: '+1 555-0123',
    joinDate: 'Jan 12, 2024'
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>YG</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{user.role}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user.department}</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joined On</Text>
              <Text style={styles.infoValue}>{user.joinDate}</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f3',
  },
  header: {
    padding: 24,
    backgroundColor: '#f6d140',
    borderBottomWidth: 2.5,
    borderBottomColor: '#0d0d0d',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    backgroundColor: '#fdfdfc',
    borderRadius: 8,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  backText: {
    color: '#0d0d0d',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#fdfdfc',
    padding: 32,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#863ceb',
    borderWidth: 3,
    borderColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  avatarLargeText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#f6d140',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  roleBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#fdfdfc',
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    padding: 20,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  infoSeparator: {
    height: 2,
    backgroundColor: '#0d0d0d',
  },
  logoutButton: {
    backgroundColor: '#fee2e2',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
