import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { submitLeaveRequest, getLeaveHistory, getManagedLeaves, updateLeaveStatus } from '../../src/services/leaveService';
import { useAuth } from '../../src/context/AuthContext';

export default function Leave() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('My History');
  const [leaveType, setLeaveType] = useState('Annual');
  const [reason, setReason] = useState('');
  const [numDays, setNumDays] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Default to tomorrow
    return d;
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [managedLeaves, setManagedLeaves] = useState([]);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + numDays - 1);

  const fmtDate = (d) => d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const adjustStartDate = (days) => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + days);
    const today = new Date(); today.setHours(0,0,0,0);
    if (next > today) setStartDate(next); // Can't pick today or past
  };

  const fetchData = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const [historyLogs, managedLogs] = await Promise.all([
        getLeaveHistory(user._id),
        getManagedLeaves().catch(() => []) // Fallback for non-managers
      ]);
      setHistory(historyLogs);
      setManagedLeaves(managedLogs);
    } catch (error) {
      console.error('Leave fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for your leave.');
      return;
    }
    if (numDays < 1) {
      Alert.alert('Error', 'Please select at least 1 day of leave.');
      return;
    }

    setSubmitting(true);
    try {
      await submitLeaveRequest({
        employeeId: user._id,
        employeeName: user.name,
        type: leaveType,
        startDate,
        endDate,
        reason,
      });

      Alert.alert('Success', `${numDays} day(s) of ${leaveType} leave submitted!`);
      setReason('');
      setNumDays(1);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      Alert.alert('Success', `Leave request has been ${status.toLowerCase()}.`);
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update leave status.');
    }
  };

  const leaveBalances = [
    { type: 'Annual', left: user?.leaveBalances?.annual || 0, color: '#f6d140' },
    { type: 'Sick', left: user?.leaveBalances?.sick || 0, color: '#863ceb' },
    { type: 'Casual', left: user?.leaveBalances?.casual || 0, color: '#dcfce7' },
  ];

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#863ceb" />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.tabContainer}>
           {['My History', 'Team Approvals'].map((tab) => (
             <TouchableOpacity 
               key={tab} 
               style={[styles.tab, activeTab === tab && styles.activeTab, activeTab === tab && { backgroundColor: tab === 'My History' ? '#863ceb' : '#f6d140' }]} 
               onPress={() => setActiveTab(tab)}
             >
               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                 {tab} {tab === 'Team Approvals' && managedLeaves.length > 0 && `(${managedLeaves.length})`}
               </Text>
             </TouchableOpacity>
           ))}
        </View>

        {activeTab === 'My History' ? (
          <>
            <Text style={styles.sectionTitle}>Request Leave</Text>
            <View style={styles.formCard}>
              <View style={styles.typeSelector}>
                {['Annual', 'Sick', 'Casual', 'Unpaid'].map((type) => (
                  <TouchableOpacity 
                    key={type} 
                    style={[styles.typeButton, leaveType === type && styles.activeTypeButton]}
                    onPress={() => setLeaveType(type)}
                  >
                    <Text style={[styles.typeButtonText, leaveType === type && styles.activeTypeButtonText]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Pickers */}
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.dateFieldLabel}>START DATE</Text>
                  <View style={styles.dateStepper}>
                    <TouchableOpacity style={styles.stepBtn} onPress={() => adjustStartDate(-1)}>
                      <Text style={styles.stepBtnText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.dateValue}>{fmtDate(startDate)}</Text>
                    <TouchableOpacity style={styles.stepBtn} onPress={() => adjustStartDate(1)}>
                      <Text style={styles.stepBtnText}>›</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.dateField}>
                  <Text style={styles.dateFieldLabel}>NO. OF DAYS</Text>
                  <View style={styles.dateStepper}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setNumDays(n => Math.max(1, n - 1))}
                    >
                      <Text style={styles.stepBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.dayCount}>{numDays}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setNumDays(n => Math.min(30, n + 1))}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Date Summary */}
              <View style={styles.dateSummary}>
                <Text style={styles.dateSummaryText}>
                  📅  {numDays} day{numDays > 1 ? 's' : ''}  •  {fmtDate(startDate)} → {fmtDate(endDate)}
                </Text>
              </View>

              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
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
                {submitting ? <ActivityIndicator color="#0d0d0d" /> : <Text style={styles.submitButtonText}>Submit Request</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Your Balance</Text>
            <View style={styles.balanceContainer}>
              {leaveBalances.map((item) => (
                <View key={item.type} style={[styles.balanceCard, { backgroundColor: item.color }]}>
                  <Text style={styles.balanceType}>{item.type}</Text>
                  <Text style={styles.balanceNumber}>{item.left}</Text>
                  <Text style={styles.balanceLabel}>Left</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Past Requests</Text>
            <View style={styles.historyContainer}>
              {history.length === 0 ? (
                <Text style={styles.emptyText}>No past requests found.</Text>
              ) : history.map((item) => (
                <View key={item._id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyType}>{item.type}</Text>
                    <View style={[styles.statusBadge, item.status === 'Approved' ? styles.statusApproved : item.status === 'Rejected' ? styles.statusRejected : styles.statusPending]}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.historyDates}>
                    {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyReason} numberOfLines={1}>"{item.reason}"</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Pending Team Approvals</Text>
            <View style={styles.historyContainer}>
              {managedLeaves.length === 0 ? (
                <Text style={styles.emptyText}>No pending requests from your team.</Text>
              ) : managedLeaves.map((item) => (
                <View key={item._id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.managerEmpName}>{item.employeeName}</Text>
                    <Text style={styles.historyType}>{item.type}</Text>
                  </View>
                  <Text style={styles.historyDates}>
                    Requested: {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyReason}>"{item.reason || 'No reason provided'}"</Text>
                  
                  <View style={styles.mgmtActions}>
                    <TouchableOpacity 
                      style={[styles.mgmtBtn, styles.approveBtn]} 
                      onPress={() => handleUpdateStatus(item._id, 'Approved')}
                    >
                      <Text style={styles.mgmtBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.mgmtBtn, styles.rejectBtn]}
                      onPress={() => handleUpdateStatus(item._id, 'Rejected')}
                    >
                      <Text style={[styles.mgmtBtnText, { color: '#ffffff' }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
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
    backgroundColor: '#fdfdfc',
    borderBottomWidth: 3,
    borderBottomColor: '#0d0d0d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#fdfdfc',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  refreshText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    backgroundColor: '#fdfdfc',
    alignItems: 'center',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  activeTab: {
    shadowOffset: { width: 4, height: 4 },
    transform: [{ scale: 1.02 }],
  },
  tabText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 12,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  balanceContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  balanceCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    alignItems: 'center',
  },
  balanceType: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#0d0d0d',
  },
  balanceNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0d0d0d',
  },
  balanceLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#0d0d0d',
  },
  formCard: {
    backgroundColor: '#fdfdfc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    backgroundColor: '#f7f7f3',
  },
  activeTypeButton: {
    backgroundColor: '#f6d140',
  },
  typeButtonText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#f6d140',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dateField: {
    flex: 1,
  },
  dateFieldLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  dateStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  stepBtn: {
    width: 36,
    height: 44,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#f6d140',
    lineHeight: 24,
  },
  dateValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#0d0d0d',
    paddingHorizontal: 4,
  },
  dayCount: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#863ceb',
  },
  dateSummary: {
    backgroundColor: '#f5f3ff',
    borderWidth: 2,
    borderColor: '#863ceb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  dateSummaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#863ceb',
  },
  statusPending: { backgroundColor: '#f6d140' },
  statusApproved: { backgroundColor: '#dcfce7' },
  statusRejected: { backgroundColor: '#fee2e2' },
  statusText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  historyDates: { fontSize: 11, fontWeight: '800', color: '#6b7280', marginBottom: 4 },
  historyReason: { fontSize: 12, color: '#4b5563', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', fontStyle: 'italic', color: '#999', marginVertical: 20 },
  managerEmpName: { fontSize: 16, fontWeight: '900', color: '#863ceb' },
  mgmtActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  mgmtBtn: { flex: 1, padding: 10, borderRadius: 6, borderWidth: 2, borderColor: '#0d0d0d', alignItems: 'center' },
  approveBtn: { backgroundColor: '#dcfce7' },
  rejectBtn: { backgroundColor: '#ef4444' },
  mgmtBtnText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  historyContainer: {
    gap: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyType: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0d0d0d',
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
});
