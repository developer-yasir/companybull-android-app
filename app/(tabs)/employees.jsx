import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getAllEmployees } from '../../src/services/employeeService';

export default function Employees() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError(true);
      Alert.alert(
        'Connection Error',
        'Could not connect to the CompanyBull server. Please ensure the backend is running.',
        [{ text: 'Retry', onPress: fetchEmployees }, { text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar || item.name.charAt(0)}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.department}</Text>
        </View>
        <Text style={styles.role}>{item.jobTitle || item.role}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Directory</Text>
        <TouchableOpacity onPress={fetchEmployees} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#863ceb" />
          <Text style={styles.loaderText}>Syncing from server...</Text>
        </View>
      ) : error ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>No connection to backend!</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEmployees}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
          refreshing={loading}
          onRefresh={fetchEmployees}
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
  header: {
    padding: 24,
    backgroundColor: '#f6d140', // Secondary yellow
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
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '800',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#863ceb',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  listContainer: {
    padding: 20,
    paddingTop: 32,
  },
  card: {
    backgroundColor: '#fdfdfc',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    marginBottom: 20,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    backgroundColor: '#863ceb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fdfdfc',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 2,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2.5,
    borderTopColor: '#0d0d0d',
    paddingTop: 16,
  },
  badge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  badgeText: {
    fontSize: 12,
    color: '#0d0d0d',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 14,
    color: '#0d0d0d',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
