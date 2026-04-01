import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { clockIn, clockOut, getAttendanceHistory } from '../../src/services/attendanceService';
import { getAllEmployees } from '../../src/services/employeeService';

export default function Attendance() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    
    const initialize = async () => {
      try {
        // For development: Get the first employee to act as "Logged In"
        const employees = await getAllEmployees();
        if (employees.length > 0) {
          const id = employees[0]._id;
          setEmployeeId(id);
          
          // Fetch history
          const logs = await getAttendanceHistory(id);
          setHistory(logs);
          
          // Check if already clocked in today
          const today = new Date().toISOString().split('T')[0];
          const todayLog = logs.find(log => log.date === today);
          if (todayLog && todayLog.clockIn && !todayLog.clockOut) {
            setIsClockedIn(true);
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
  }, []);

  const handleClockToggle = async () => {
    if (!employeeId) {
      Alert.alert('Error', 'No employee found to clock in.');
      return;
    }

    try {
      if (!isClockedIn) {
        const res = await clockIn(employeeId);
        setClockInTime(new Date(res.clockIn).toLocaleTimeString());
        setIsClockedIn(true);
        Alert.alert('Success', 'Clocked in successfully!');
      } else {
        await clockOut(employeeId);
        setIsClockedIn(false);
        setClockInTime(null);
        Alert.alert('Success', 'Clocked out successfully!');
      }
      
      // Refresh history
      const logs = await getAttendanceHistory(employeeId);
      setHistory(logs);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.timeCard}>
          <Text style={styles.dateText}>{currentDate.toDateString()}</Text>
          <Text style={styles.timeText}>{currentDate.toLocaleTimeString()}</Text>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusIndicator, isClockedIn ? styles.online : styles.offline]} />
          <Text style={styles.statusText}>{isClockedIn ? 'YOU ARE CLOCKED IN' : 'YOU ARE CLOCKED OUT'}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.clockButton, isClockedIn ? styles.clockOutButton : styles.clockInButton]}
          onPress={handleClockToggle}
          disabled={loading || !employeeId}
        >
          <Text style={styles.clockButtonText}>{isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</Text>
        </TouchableOpacity>

        {isClockedIn && (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Clocked In At:</Text>
            <Text style={styles.infoValue}>{clockInTime}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Recent Logs</Text>
        <View style={styles.logCard}>
          {history.length === 0 ? (
            <Text style={styles.noLogs}>No recent activity</Text>
          ) : (
            history.map((log, index) => (
              <View key={log._id}>
                <View style={styles.logItem}>
                  <Text style={styles.logDate}>{new Date(log.date).toDateString()}</Text>
                  <Text style={styles.logTime}>
                    {log.clockIn ? new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    {' - '}
                    {log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Still In'}
                  </Text>
                </View>
                {index < history.length - 1 && <View style={styles.logSeparator} />}
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
    alignItems: 'center',
  },
  timeCard: {
    backgroundColor: '#863ceb',
    width: '100%',
    padding: 32,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  timeText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#f6d140',
    letterSpacing: -1,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  online: {
    backgroundColor: '#dcfce7',
  },
  offline: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 1,
  },
  clockButton: {
    width: '100%',
    padding: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  clockInButton: {
    backgroundColor: '#f6d140',
  },
  clockOutButton: {
    backgroundColor: '#fee2e2',
  },
  clockButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 2,
  },
  infoCard: {
    backgroundColor: '#fdfdfc',
    width: '100%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#863ceb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    alignSelf: 'flex-start',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logCard: {
    backgroundColor: '#fdfdfc',
    width: '100%',
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    padding: 16,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  logItem: {
    paddingVertical: 12,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
  },
  logTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 4,
  },
  logSeparator: {
    height: 2,
    backgroundColor: '#0d0d0d',
  },
  noLogs: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
