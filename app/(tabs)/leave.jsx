import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { submitLeaveRequest, getLeaveHistory } from '../../src/services/leaveService';
import { getAllEmployees } from '../../src/services/employeeService';

export default function Leave() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [leaveType, setLeaveType] = useState('Annual');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const employees = await getAllEmployees();
        if (employees.length > 0) {
          const id = employees[0]._id;
          setEmployeeId(id);
          const logs = await getLeaveHistory(id);
          setHistory(logs);
        }
      } catch (error) {
        console.error('Leave init error:', error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for your leave.');
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      await submitLeaveRequest({
        employeeId,
        type: leaveType,
        startDate: today,
        endDate: nextWeek,
        reason,
      });

      Alert.alert('Success', 'Your leave request has been submitted!');
      setReason('');
      
      // Refresh history
      const logs = await getLeaveHistory(employeeId);
      setHistory(logs);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  const leaveBalances = [
    { type: 'Annual', total: 20, used: 5, color: '#f6d140' },
    { type: 'Sick', total: 10, used: 2, color: '#863ceb' },
    { type: 'Casual', total: 5, used: 1, color: '#dcfce7' },
  ];

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#863ceb" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leave Manager</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <Text style={styles.sectionTitle}>Your Balance</Text>
        <View style={styles.balanceContainer}>
          {leaveBalances.map((item) => (
            <View key={item.type} style={[styles.balanceCard, { backgroundColor: item.color }]}>
              <Text style={styles.balanceType}>{item.type}</Text>
              <Text style={styles.balanceNumber}>{item.total - item.used}</Text>
              <Text style={styles.balanceLabel}>Days Left</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Request Leave</Text>
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Leave Type</Text>
          <View style={styles.typeSelector}>
            {['Annual', 'Sick', 'Casual'].map((type) => (
              <TouchableOpacity 
                key={type} 
                style={[styles.typeButton, leaveType === type && styles.activeTypeButton]}
                onPress={() => setLeaveType(type)}
              >
                <Text style={[styles.typeButtonText, leaveType === type && styles.activeTypeButtonText]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Reason</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Why are you taking leave?"
            value={reason}
            onChangeText={setReason}
            placeholderTextColor="#666"
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>

        {history.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <View style={styles.historyContainer}>
              {history.map((item) => (
                <View key={item._id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyType}>{item.type} Leave</Text>
                    <View style={[styles.statusBadge, item.status === 'Approved' ? styles.statusApproved : styles.statusPending]}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.historyDates}>
                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyReason} numberOfLines={1}>"{item.reason}"</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f3',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f3',
  },
  header: {
    padding: 24,
    backgroundColor: '#863ceb',
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
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 16,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
  },
  balanceType: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#0d0d0d',
    marginBottom: 4,
  },
  balanceNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0d0d0d',
  },
  formCard: {
    backgroundColor: '#fdfdfc',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    backgroundColor: '#f7f7f3',
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#f6d140',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#0d0d0d',
  },
  activeTypeButtonText: {
    color: '#0d0d0d',
  },
  textArea: {
    backgroundColor: '#fdfdfc',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    color: '#0d0d0d',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#863ceb',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  historyContainer: {
    gap: 16,
  },
  historyCard: {
    backgroundColor: '#fdfdfc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
  },
  statusPending: {
    backgroundColor: '#f6d140',
  },
  statusApproved: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  historyDates: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 4,
  },
  historyReason: {
    fontSize: 13,
    color: '#4b5563',
    fontStyle: 'italic',
  },
});
