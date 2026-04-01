import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { clockIn, clockOut, getAttendanceHistory } from '../../src/services/attendanceService';
import { useAuth } from '../../src/context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isShiftComplete, setIsShiftComplete] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    
    const initialize = async () => {
      if (!user?._id) return;
      try {
        // Fetch history
        const logs = await getAttendanceHistory(user._id);
        setHistory(logs);
        
        // Check today's status
        const today = new Date().toISOString().split('T')[0];
        const todayLog = logs.find(log => log.date === today);
        
        if (todayLog) {
          if (todayLog.clockIn && todayLog.clockOut) {
            setIsShiftComplete(true);
            setIsClockedIn(false);
            setClockInTime(new Date(todayLog.clockIn).toLocaleTimeString());
          } else if (todayLog.clockIn) {
            setIsClockedIn(true);
            setIsShiftComplete(false);
            setClockInTime(new Date(todayLog.clockIn).toLocaleTimeString());
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
    return () => clearInterval(timer);
  }, [user]);

  const handleClockToggle = async () => {
    if (!user?._id) {
      Alert.alert('Error', 'No authenticated session found.');
      return;
    }

    try {
      if (!isClockedIn && !isShiftComplete) {
        const res = await clockIn(user._id);
        setClockInTime(new Date(res.clockIn).toLocaleTimeString());
        setIsClockedIn(true);
        Alert.alert('Success', 'Clocked in successfully!');
      } else if (isClockedIn) {
        await clockOut(user._id);
        setIsClockedIn(false);
        setIsShiftComplete(true);
        Alert.alert('Success', 'Clocked out successfully!');
      }
      
      // Refresh history
      const logs = await getAttendanceHistory(user._id);
      setHistory(logs);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusInfo = () => {
    if (isShiftComplete) return { text: 'SHIFT COMPLETED', color: styles.complete };
    if (isClockedIn) return { text: 'YOU ARE CLOCKED IN', color: styles.online };
    return { text: 'YOU ARE CLOCKED OUT', color: styles.offline };
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <View style={styles.heroHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.timeCard}>
          <Text style={styles.dateLabel}>{currentDate.toDateString()}</Text>
          <Text style={styles.timeDisplay}>{currentDate.toLocaleTimeString()}</Text>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusIndicator, statusInfo.color]} />
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>

        <TouchableOpacity 
          activeOpacity={0.9}
          style={[
            styles.clockButton, 
            isShiftComplete ? styles.completeButton : (isClockedIn ? styles.clockOutButton : styles.clockInButton)
          ]}
          onPress={handleClockToggle}
          disabled={loading || !user?._id || isShiftComplete}
        >
          <Text style={styles.clockButtonText}>
            {isShiftComplete ? 'SHIFT COMPLETED' : (isClockedIn ? 'CLOCK OUT' : 'CLOCK IN')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Logs</Text>
        <View style={styles.logList}>
          {history.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.noLogs}>No recent activity</Text>
            </View>
          ) : (
            history.map((log, index) => (
              <View key={log._id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{new Date(log.date).toDateString()}</Text>
                  <View style={[styles.logStatus, log.clockOut ? styles.statusDone : styles.statusActive]}>
                    <Text style={styles.logStatusText}>{log.clockOut ? 'DONE' : 'IN'}</Text>
                  </View>
                </View>
                <View style={styles.logBody}>
                  <View style={styles.logTimeBox}>
                    <Text style={styles.logLabel}>IN</Text>
                    <Text style={styles.logValue}>
                      {log.clockIn ? new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </Text>
                  </View>
                  <View style={styles.logTimeBox}>
                    <Text style={styles.logLabel}>OUT</Text>
                    <Text style={styles.logValue}>
                      {log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
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
    padding: 24,
  },
  timeCard: {
    backgroundColor: '#863ceb',
    width: '100%',
    padding: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#f6d140',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 2,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  online: {
    backgroundColor: '#4ade80',
  },
  offline: {
    backgroundColor: '#f87171',
  },
  complete: {
    backgroundColor: '#60a5fa',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  clockButton: {
    width: '100%',
    padding: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  clockInButton: {
    backgroundColor: '#f6d140',
  },
  clockOutButton: {
    backgroundColor: '#863ceb',
  },
  completeButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#9ca3af',
  },
  clockButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logList: {
    gap: 16,
  },
  logCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
  },
  logDate: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  logStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
  },
  statusDone: {
    backgroundColor: '#dcfce7',
  },
  statusActive: {
    backgroundColor: '#fef9c3',
  },
  logStatusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  logBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logTimeBox: {
    gap: 4,
  },
  logLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  logValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  noLogs: {
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
});
