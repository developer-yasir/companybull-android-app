import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { getAllEmployees } from '../../src/services/employeeService';
import { Ionicons } from '@expo/vector-icons';

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Human Resources', 'Sales', 'Marketing', 'Finance'];

const DEPT_COLORS = {
  Engineering: '#dbeafe',
  Product: '#dcfce7',
  Design: '#f3e8ff',
  'Human Resources': '#fef9c3',
  Sales: '#fee2e2',
  Marketing: '#ffedd5',
  Finance: '#d1fae5',
  All: '#0d0d0d',
};

export default function Employees() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDept]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/employees/${item._id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.cardInner}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.department) }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.jobTitle}>{item.jobTitle || item.role}</Text>
          <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#0d0d0d" />
      </View>
      <View style={styles.cardFooter}>
        <View style={[styles.badge, { backgroundColor: DEPT_COLORS[item.department] || '#e5e7eb' }]}>
          <Text style={styles.badgeText}>{item.department || 'N/A'}</Text>
        </View>
        <View style={[styles.rolePill, { backgroundColor: item.status === 'Active' ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={styles.rolePillText}>{item.status || 'Active'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.heroHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0d0d0d" />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>DIRECTORY</Text>
          <Text style={styles.headerSubtitle}>{employees.length} members</Text>
        </View>
        <TouchableOpacity onPress={fetchEmployees} style={styles.syncButton}>
          <Ionicons name="sync" size={20} color="#0d0d0d" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, title or email..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Department Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {DEPARTMENTS.map((dept, index) => (
          <TouchableOpacity
            key={dept}
            style={[
              styles.filterChip,
              selectedDept === dept && styles.filterChipActive,
              { marginRight: index < DEPARTMENTS.length - 1 ? 10 : 20 },
            ]}
            onPress={() => setSelectedDept(dept)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedDept === dept && styles.filterChipTextActive,
              ]}
              numberOfLines={1}
            >
              {dept === 'Human Resources' ? 'HR' : dept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#863ceb" />
          <Text style={styles.loaderText}>SYNCING...</Text>
        </View>
      ) : error ? (
        <View style={styles.loader}>
          <Ionicons name="wifi-outline" size={48} color="#9ca3af" />
          <Text style={styles.errorText}>NO CONNECTION</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEmployees}>
            <Text style={styles.retryText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchEmployees}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>NO RESULTS FOUND</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const getAvatarColor = (dept) => {
  const colors = {
    Engineering: '#863ceb',
    Product: '#10b981',
    Design: '#8b5cf6',
    'Human Resources': '#f59e0b',
    Sales: '#ef4444',
    Marketing: '#f97316',
    Finance: '#3b82f6',
  };
  return colors[dept] || '#6b7280';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f3' },
  heroHeader: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#f6d140',
    borderBottomWidth: 4,
    borderColor: '#0d0d0d',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  headerTitleGroup: { flex: 1 },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4b5563',
  },
  syncButton: {
    width: 42,
    height: 42,
    backgroundColor: '#0d0d0d',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#0d0d0d',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0d0d0d',
    paddingVertical: 6,
  },
  filterRow: {
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    minWidth: 60,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#863ceb',
    borderColor: '#863ceb',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  infoContainer: { flex: 1 },
  name: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: -0.3,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#863ceb',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0d0d0d',
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loaderText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9ca3af',
    letterSpacing: 2,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 1,
  },
  retryButton: {
    backgroundColor: '#863ceb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
  },
  retryText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  emptyState: { paddingTop: 80, alignItems: 'center', gap: 14 },
  emptyText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#9ca3af',
    letterSpacing: 2,
  },
});
