import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import apiClient from '../../src/api/client';


export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [badgeCounts, setBadgeCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBadges = async () => {
      try {
        const id = user?._id || user?.id;
        if (!id) return;
        const res = await apiClient.get(`recognition/kudos?receiverId=${id}`);
        const data = res.data;
        
        // Count occurrences
        const counts = {};
        data.forEach(k => {
          counts[k.badge] = (counts[k.badge] || 0) + 1;
        });
        
        const badgeArray = Object.keys(counts).map(key => ({
           id: key, name: key, count: counts[key]
        }));
        
        setBadgeCounts(badgeArray);
      } catch (err) {
        console.error("Failed to load badges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBadges();
  }, [user]);

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <View style={styles.heroHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{user?.name?.[0] || '?'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{user?.role || 'Company Member'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Data</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user?.department || 'N/A'}</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Joined On</Text>
              <Text style={styles.infoValue}>{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</Text>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.infoCard}>
            {loading ? (
              <ActivityIndicator color="#f6d140" />
            ) : badgeCounts.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                 <Ionicons name="ribbon-outline" size={32} color="#d1d5db" />
                 <Text style={{ fontSize: 11, fontWeight: '900', color: '#9ca3af', marginTop: 8 }}>NO BADGES YET</Text>
              </View>
            ) : (
              <View style={styles.badgeGrid}>
                {badgeCounts.map((b) => (
                  <View key={b.id} style={styles.badgeItem}>
                    <View style={styles.badgeIconWrap}>
                       <Ionicons name="star" size={20} color="#f6d140" />
                       <View style={styles.badgeCountPill}>
                         <Text style={styles.badgeCountText}>{b.count}</Text>
                       </View>
                    </View>
                    <Text style={styles.badgeName}>{b.name.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.statusButton} 
          onPress={() => router.push('/system-status')}
        >
          <Ionicons name="pulse" size={20} color="#0d0d0d" style={{ marginRight: 10 }} />
          <Text style={styles.statusButtonText}>System Health</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.logoutButton} 
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Sign Out</Text>
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
  heroHeader: {
    padding: 30,
    backgroundColor: '#863ceb',
    borderBottomWidth: 4,
    borderColor: '#0d0d0d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  scrollContent: {
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#f6d140',
    borderWidth: 3,
    borderColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  avatarLargeText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  userName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: '#863ceb',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  infoSeparator: {
    height: 2,
    backgroundColor: '#f3f4f6',
  },
  logoutButton: {
    backgroundColor: '#0d0d0d',
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#f6d140',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  statusButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  statusButtonText: {
    color: '#0d0d0d',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  badgeItem: {
    alignItems: 'center',
    width: 80,
  },
  badgeIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fffbeb',
    borderWidth: 2,
    borderColor: '#f6d140',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeCountPill: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#0d0d0d',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeCountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  badgeName: {
    fontSize: 8,
    fontWeight: '900',
    color: '#4b5563',
    textAlign: 'center',
  },
});
