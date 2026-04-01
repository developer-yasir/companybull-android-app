import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getAllEmployees } from '../../src/services/employeeService';

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await getAllEmployees();
      setEmployeeCount(data.length);
    } catch (err) {
      console.error('Dashboard sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: 0 }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <View style={styles.nameRow}>
            <Text style={styles.name}>Yasir</Text>
            {loading && <ActivityIndicator size="small" color="#863ceb" style={{ marginLeft: 10 }} />}
          </View>
          <Text style={styles.date}>Wednesday, April 1</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#f6d140' }]}>
            <Text style={styles.statNumber}>{employeeCount}</Text>
            <Text style={styles.statLabel}>Total Employees</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#863ceb' }]}>
            <Text style={[styles.statNumber, { color: '#ffffff' }]}>12</Text>
            <Text style={[styles.statLabel, { color: '#ffffff' }]}>On Leave</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/employees')}>
            <View style={[styles.actionCard, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Directory</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/leave')}>
            <View style={[styles.actionCard, { backgroundColor: '#fce7f3' }]}>
              <Text style={styles.actionIcon}>✈️</Text>
              <Text style={styles.actionText}>Time Off</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/attendance')}>
            <View style={[styles.actionCard, { backgroundColor: '#e0e7ff' }]}>
              <Text style={styles.actionIcon}>⏱️</Text>
              <Text style={styles.actionText}>Attendance</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.replace('/login')}>
            <View style={[styles.actionCard, { backgroundColor: '#fee2e2' }]}>
              <Text style={styles.actionIcon}>🚪</Text>
              <Text style={styles.actionText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 2.5,
    borderBottomColor: '#0d0d0d',
    backgroundColor: '#fdfdfc',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0d0d0d',
  },
  name: {
    fontSize: 32,
    fontWeight: '900',
    color: '#863ceb',
    letterSpacing: -1,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  actionButton: {
    width: '50%',
    padding: 8,
  },
  actionCard: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
});
