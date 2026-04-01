import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAnnouncements } from '../../src/services/announcementService';
import { Ionicons } from '@expo/vector-icons';

export default function AnnouncementsList() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.pinned && styles.pinnedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>
        {item.pinned && <Ionicons name="pin" size={16} color="#863ceb" />}
      </View>
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
      
      <View style={styles.footer}>
        <View style={styles.authorGroup}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarText}>{item.authorName.substring(0, 1)}</Text>
          </View>
          <Text style={styles.authorName}>{item.authorName}</Text>
        </View>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.heroHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>BULL FEED</Text>
      </View>

      {loading && announcements.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#863ceb" />
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchNews} tintColor="#863ceb" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="megaphone-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>THE FEED IS QUIET</Text>
            </View>
          }
        />
      )}
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
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pinnedCard: {
    backgroundColor: '#f5f3ff',
    borderColor: '#863ceb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#f6d140',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#0d0d0d',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 8,
    lineHeight: 24,
  },
  content: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d0d0d',
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9ca3af',
    letterSpacing: 2,
  },
});
