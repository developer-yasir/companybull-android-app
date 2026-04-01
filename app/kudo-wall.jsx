import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { Platform } from 'react-native';

import apiClient from '../src/api/client';

export default function KudoWall() {
  const router = useRouter();
  const { user } = useAuth();
  const [kudos, setKudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fetchKudos = async () => {
    try {
      const res = await apiClient.get('recognition/kudos');
      setKudos(res.data);
    } catch (err) {
      console.error('Kudo fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchKudos(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchKudos();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#f6d140" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>KUDO WALL</Text>
          <Text style={styles.heroSub}>Celebrate the Team</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/give-kudo')} style={styles.giveBtn}>
           <Ionicons name="sparkles" size={20} color="#0d0d0d" />
           <Text style={styles.giveBtnText}>SHOUTOUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scroll} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f6d140" />}
      >
        {kudos.length === 0 ? (
          <View style={styles.emptyState}>
             <Ionicons name="ribbon-outline" size={48} color="#9ca3af" />
             <Text style={styles.emptyText}>NO KUDOS YET. BE THE FIRST!</Text>
          </View>
        ) : (
          kudos.map(kudo => (
            <KudoCard key={kudo._id} kudo={kudo} currentUserId={user?._id || user?.id} />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function KudoCard({ kudo, currentUserId }) {
  // Simple check for reaction visualization
  const hasReacted = kudo.reactions?.some(r => r.userId === currentUserId);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{kudo.senderId?.name?.substring(0, 2).toUpperCase() || "??"}</Text>
        </View>
        <View style={styles.headerInfo}>
           <Text style={styles.senderName}>{kudo.senderId?.name || "Unknown"}</Text>
           <View style={styles.toRow}>
              <Text style={styles.toText}>GAVE TO</Text>
              <Text style={styles.receiverName}>{kudo.receiverId?.name || "Team"}</Text>
           </View>
        </View>
      </View>
      
      <View style={styles.badgeWrap}>
         <View style={styles.badgeInner}>
           <Ionicons name="star" size={14} color="#f6d140" />
           <Text style={styles.badgeText}>{kudo.badge.toUpperCase()}</Text>
         </View>
      </View>

      <Text style={styles.messageText}>"{kudo.message}"</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.timeText}>{new Date(kudo.createdAt).toLocaleDateString()}</Text>
        <View style={styles.reactionBtn}>
           <Text style={styles.reactionEmoji}>🔥</Text>
           <Text style={styles.reactionCount}>{kudo.reactions?.length || 0}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f3' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: {
    paddingTop: 54, paddingBottom: 20, paddingHorizontal: 20,
    backgroundColor: '#fff', borderBottomWidth: 4, borderColor: '#0d0d0d',
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  backButton: {
    width: 44, height: 44, backgroundColor: '#f3f4f6', borderWidth: 2,
    borderColor: '#0d0d0d', borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#0d0d0d', letterSpacing: -0.5 },
  heroSub: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginTop: 2 },
  giveBtn: { backgroundColor: '#f6d140', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: '#0d0d0d', shadowColor: '#0d0d0d', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  giveBtnText: { color: '#0d0d0d', fontSize: 10, fontWeight: '900' },
  scroll: { padding: 20 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 3, borderColor: '#0d0d0d',
    padding: 20, marginBottom: 16, shadowColor: '#f6d140', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#863ceb', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0d0d0d' },
  avatarText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  headerInfo: { flex: 1 },
  senderName: { fontSize: 16, fontWeight: '900', color: '#0d0d0d', marginBottom: 2 },
  toRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toText: { fontSize: 9, fontWeight: '900', color: '#9ca3af', letterSpacing: 1 },
  receiverName: { fontSize: 12, fontWeight: '800', color: '#863ceb' },
  badgeWrap: { alignSelf: 'flex-start', marginBottom: 16 },
  badgeInner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fefce8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1.5, borderColor: '#f6d140' },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#a16207', letterSpacing: 0.5 },
  messageText: { fontSize: 15, fontWeight: '700', color: '#4b5563', lineHeight: 22, italic: true, marginBottom: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 2, borderTopColor: '#f3f4f6', paddingTop: 16 },
  timeText: { fontSize: 10, fontWeight: '800', color: '#9ca3af' },
  reactionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: '#e5e7eb' },
  reactionEmoji: { fontSize: 12 },
  reactionCount: { fontSize: 12, fontWeight: '900', color: '#0d0d0d' },
  emptyState: { paddingVertical: 60, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 13, fontWeight: '900', color: '#9ca3af' },
});
