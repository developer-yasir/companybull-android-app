import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getOrgHierarchy } from '../../src/services/employeeService';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OrgNode = ({ node, level = 0 }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#863ceb';
      case 'Manager': return '#f6d140';
      case 'HR': return '#fb7185';
      default: return '#34d399';
    }
  };

  return (
    <View style={styles.nodeContainer}>
      <View style={styles.row}>
        {level > 0 && <View style={styles.connectorLine} />}
        
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[
            styles.card, 
            { borderLeftColor: getRoleColor(node.role), borderLeftWidth: 10 }
          ]}
          onPress={() => router.push(`/employees/${node._id}`)}
        >
          <View style={styles.cardContent}>
            <View style={[styles.avatar, { backgroundColor: getRoleColor(node.role) }]}>
              <Text style={styles.avatarText}>
                {node.name.substring(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{node.name}</Text>
              <Text style={styles.jobTitle} numberOfLines={1}>{node.jobTitle}</Text>
            </View>
            
            {hasChildren && (
              <TouchableOpacity onPress={toggleExpand} style={styles.expandTrigger}>
                <Ionicons 
                  name={isExpanded ? "chevron-down" : "chevron-forward"} 
                  size={20} 
                  color="#0d0d0d" 
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {isExpanded && hasChildren && (
        <View style={styles.childrenWrapper}>
          {node.children.map((child) => (
            <OrgNode key={child._id} node={child} level={level + 1} />
          ))}
        </View>
      )}
    </View>
  );
};

export default function OrgChart() {
  const insets = useSafeAreaInsets();
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      const data = await getOrgHierarchy();
      setHierarchy(data);
    } catch (err) {
      console.error('Org Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <View style={styles.heroHeader}>
        <Text style={styles.heroTitle}>Organization</Text>
        <TouchableOpacity onPress={fetchHierarchy} style={styles.headerAction}>
          <Ionicons name="sync" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#863ceb" />
          <Text style={styles.loaderText}>Mapping Structure...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
        >
          {hierarchy.length > 0 ? (
            hierarchy.map((rootNode) => (
              <OrgNode key={rootNode._id} node={rootNode} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>NO DATA FOUND</Text>
              <Text style={styles.emptySub}>Please sync with the admin portal.</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    backgroundColor: '#863ceb',
    borderBottomWidth: 4,
    borderColor: '#0d0d0d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  headerAction: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },
  nodeContainer: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectorLine: {
    width: 15,
    height: 2,
    backgroundColor: '#0d0d0d',
    marginRight: 5,
    opacity: 0.3,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d0d0d',
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  expandTrigger: {
    padding: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    marginLeft: 8,
  },
  childrenWrapper: {
    borderLeftWidth: 2,
    borderLeftColor: '#0d0d0d',
    marginLeft: 20,
    paddingLeft: 10,
    marginTop: -6,
    paddingTop: 10,
    opacity: 0.6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: '900',
    color: '#0d0d0d',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0d0d0d',
    letterSpacing: 1,
  },
  emptySub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
});
