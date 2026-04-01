import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getAllEmployees } from '../../src/services/employeeService';
import { getAnnouncements } from '../../src/services/announcementService';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../src/api/client';

export default function Dashboard() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [taskStats, setTaskStats] = useState({ active: 0, high: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const id = user?._id || user?.id;
      const [empData, newsData, tasksRes] = await Promise.all([
        getAllEmployees(),
        getAnnouncements(),
        apiClient.get(`tasks?assigneeId=${id}`)
      ]);
      const tasksData = tasksRes.data;
      setEmployeeCount(empData.length);
      setAnnouncements(newsData);
      
      const active = tasksData.filter(t => t.status !== 'Done').length;
      const high = tasksData.filter(t => t.priority === 'High' && t.status !== 'Done').length;
      setTaskStats({ active, high });
    } catch (err) {
      console.error('Dashboard sync error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const QuickAction = ({ title, icon, color, onPress }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={styles.actionWrapper}
      onPress={onPress}
    >
      <View style={[styles.actionCard, { backgroundColor: color }]}>
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text style={styles.actionText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} tintColor="#f6d140" />}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.greetingText}>HELLO,</Text>
              <Text style={styles.userNameText}>
                {user?.name?.split(' ')[0] || 'Member'}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{user?.role || 'Company Member'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellButton} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications" size={22} color="#f6d140" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#f6d140' }]}>
            <Text style={styles.statLabel}>STAFF</Text>
            <Text style={styles.statNumber}>{employeeCount}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#863ceb' }]}>
            <Text style={[styles.statLabel, { color: '#fff' }]}>LEAVE</Text>
            <Text style={[styles.statNumber, { color: '#fff' }]}>12</Text>
          </View>
        </View>

        {/* BULL FEED - NEW ANNOUNCEMENTS SECTION */}
        <View style={styles.feedHeader}>
          <Text style={styles.sectionTitleSmall}>BULL FEED</Text>
          <TouchableOpacity onPress={() => router.push('/announcements')}>
            <Text style={styles.viewAllText}>VIEW ALL →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.feedScroll}
        >
          {announcements.length === 0 ? (
            <View style={styles.emptyFeedCard}>
              <Text style={styles.emptyFeedText}>NO NEWS TODAY</Text>
            </View>
          ) : (
            announcements.map((item) => (
              <TouchableOpacity 
                key={item._id}
                style={[styles.feedCard, item.pinned && styles.pinnedCard]}
                onPress={() => router.push(`/announcements/${item._id}`)}
              >
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.feedTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.feedFooter}>
                  <Text style={styles.feedAuthor}>{item.authorName}</Text>
                  {item.pinned && <Ionicons name="pin" size={12} color="#863ceb" />}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Today's Focus Hero Card */}
        <TouchableOpacity 
          style={styles.focusCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/tasks')}
        >
          <View style={styles.focusHeader}>
            <View style={styles.focusIcon}>
              <Ionicons name="flash" size={18} color="#f6d140" />
            </View>
            <Text style={styles.focusTitle}>TODAY'S FOCUS</Text>
          </View>
          <View style={styles.focusContent}>
            <View>
              <Text style={styles.focusCount}>{taskStats.active} Active Tasks</Text>
              <Text style={styles.focusSub}>{taskStats.high} High Priority Items</Text>
            </View>
            <TouchableOpacity style={styles.standupAction} onPress={() => router.push('/standup')}>
               <Text style={styles.standupActionText}>SEND STAND-UP</Text>
               <Ionicons name="arrow-forward" size={14} color="#863ceb" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <QuickAction
            title="Attendance"
            icon="⏱️"
            color="#dcfce7"
            onPress={() => router.push('/attendance')}
          />
          <QuickAction
            title="Time Off"
            icon="✈️"
            color="#fce7f3"
            onPress={() => router.push('/leave')}
          />
          <QuickAction
            title="Directory"
            icon="👥"
            color="#e0e7ff"
            onPress={() => router.push('/employees')}
          />
          <QuickAction
            title="Org Chart"
            icon="🕸️"
            color="#ffedd5"
            onPress={() => router.push('/org')}
          />
          <QuickAction
            title="Pay Slip"
            icon="💰"
            color="#f0fdf4"
            onPress={() => router.push('/payroll')}
          />
          <QuickAction
            title="Alerts"
            icon="🔔"
            color="#fdf4ff"
            onPress={() => router.push('/notifications')}
          />
          <QuickAction
            title="Kudo Wall"
            icon="⭐"
            color="#fffbeb"
            onPress={() => router.push('/kudo-wall')}
          />
          <QuickAction
            title="My Vault"
            icon="📁"
            color="#ecfdf5"
            onPress={() => router.push('/vault')}
          />
          <QuickAction
            title="Bull-Bot"
            icon="🤖"
            color="#f3e8ff"
            onPress={() => router.push('/assistant')}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
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
  heroSection: {
    padding: 20,
    backgroundColor: '#863ceb',
    borderBottomWidth: 4,
    borderColor: '#0d0d0d',
    paddingTop: 20,
    paddingBottom: 25,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bellButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 2,
    borderColor: '#f6d140',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#f6d140',
    letterSpacing: 1,
    marginBottom: 2,
  },
  userNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 30,
    textTransform: 'uppercase',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f6d140',
  },
  roleBadgeText: {
    color: '#f6d140',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    marginTop: -20,
  },
  statBox: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  actionWrapper: {
    width: '50%',
    padding: 8,
  },
  actionCard: {
    padding: 20,
    height: 140,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  logoutButton: {
    margin: 20,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#0d0d0d',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#863ceb',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#863ceb',
  },
  focusCard: {
    margin: 20, marginTop: 0, padding: 20, backgroundColor: '#0d0d0d',
    borderRadius: 16, borderWidth: 3, borderColor: '#0d0d0d',
    shadowColor: '#863ceb', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  focusIcon: { width: 32, height: 32, backgroundColor: 'rgba(246,209,64,0.1)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  focusTitle: { fontSize: 12, fontWeight: '900', color: '#f6d140', letterSpacing: 1 },
  focusContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  focusCount: { fontSize: 20, fontWeight: '900', color: '#fff' },
  focusSub: { fontSize: 10, fontWeight: '700', color: '#9ca3af', marginTop: 2 },
  standupAction: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  standupActionText: { fontSize: 9, fontWeight: '900', color: '#863ceb' },
  feedScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
  },
  feedCard: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pinnedCard: {
    borderColor: '#863ceb',
    backgroundColor: '#f5f3ff',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f6d140',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: -0.5,
    height: 44,
  },
  feedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  feedAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
  },
  emptyFeedCard: {
    width: 200,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFeedText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9ca3af',
  },
});
