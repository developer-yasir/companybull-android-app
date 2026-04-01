import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAnnouncements } from '../../src/services/announcementService';
import { Ionicons } from '@expo/vector-icons';

export default function AnnouncementDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const all = await getAnnouncements();
        const found = all.find(a => a._id === id);
        setAnnouncement(found);
      } catch (err) {
        console.error('Detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#863ceb" />
      </View>
    );
  }

  if (!announcement) {
    return (
      <View style={styles.loader}>
        <Text>Announcement not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#863ceb', marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.heroTitle} numberOfLines={1}>BROADCAST</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{announcement.category}</Text>
        </View>
        
        <Text style={styles.title}>{announcement.title}</Text>
        
        <View style={styles.authorCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{announcement.authorName.substring(0, 1)}</Text>
          </View>
          <View>
            <Text style={styles.authorName}>{announcement.authorName}</Text>
            <Text style={styles.date}>{new Date(announcement.createdAt).toDateString()}</Text>
          </View>
        </View>

        <View style={styles.contentWrap}>
          <Text style={styles.contentText}>{announcement.content}</Text>
        </View>
        
        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroHeader: {
    padding: 30,
    backgroundColor: '#f6d140',
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
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  scrollContent: {
    padding: 30,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#863ceb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0d0d0d',
    lineHeight: 38,
    marginBottom: 24,
    letterSpacing: -1,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  contentWrap: {
    backgroundColor: '#f7f7f3',
    padding: 24,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#0d0d0d',
    fontWeight: '500',
  },
  footerSpacing: {
    height: 100,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
