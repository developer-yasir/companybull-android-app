import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getAllDepartments } from '../../src/services/departmentService';

export default function Departments() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepts = async () => {
    try {
      setLoading(true);
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
             <Text style={[styles.icon, { color: item.color }]}>🏢</Text>
          </View>
          <View style={styles.titleContainer}>
             <Text style={styles.deptName}>{item.name}</Text>
             <Text style={styles.budget}>{item.budget} Budget</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
           <View style={styles.statBox}>
              <Text style={styles.statLabel}>HEADCOUNT</Text>
              <Text style={styles.statValue}>{item.employeeCount}</Text>
           </View>
           <View style={styles.statBox}>
              <Text style={styles.statLabel}>DIRECTOR</Text>
              <Text style={styles.statValue} numberOfLines={1}>{item.manager?.name || "Unassigned"}</Text>
           </View>
        </View>

        <TouchableOpacity 
          style={styles.viewTeamButton}
          onPress={() => router.push(`/employees?dept=${item.name}`)}
        >
          <Text style={styles.viewTeamText}>VIEW TEAM MEMBERS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Organization</Text>
        <TouchableOpacity onPress={fetchDepts}>
           <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#863ceb" />
          <Text style={styles.loaderText}>Syncing Org Chart...</Text>
        </View>
      ) : (
        <FlatList
          data={departments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchDepts}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f3' },
  header: { 
    padding: 24, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#863ceb',
    borderBottomWidth: 3,
    borderBottomColor: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
  },
  title: { fontSize: 24, fontWeight: '900', color: '#fdfdfc', textTransform: 'uppercase' },
  refreshIcon: { fontSize: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, fontWeight: '800', textTransform: 'uppercase' },
  listContainer: { padding: 20, paddingBottom: 100 },
  card: { 
    backgroundColor: '#fdfdfc', 
    borderRadius: 12, 
    borderWidth: 2.5, 
    borderColor: '#0d0d0d', 
    marginBottom: 24,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    overflow: 'hidden'
  },
  cardAccent: { height: 8, width: '100%' },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 8, borderWidth: 2, borderColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 24 },
  titleContainer: { flex: 1 },
  deptName: { fontSize: 20, fontWeight: '900', color: '#0d0d0d', textTransform: 'uppercase' },
  budget: { fontSize: 10, fontWeight: '800', color: '#863ceb', textTransform: 'uppercase', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 2, borderColor: '#0d0d0d', padding: 12, borderRadius: 8 },
  statLabel: { fontSize: 8, fontWeight: '900', color: '#9ca3af', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '900', color: '#0d0d0d', textTransform: 'uppercase' },
  viewTeamButton: { 
    backgroundColor: '#0d0d0d', 
    padding: 12, 
    borderRadius: 6, 
    alignItems: 'center',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
  },
  viewTeamText: { color: '#fdfdfc', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
});
