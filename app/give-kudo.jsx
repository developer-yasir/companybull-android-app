import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';
import { getAllEmployees } from '../src/services/employeeService';
import apiClient from '../src/api/client';

const BADGES = ['Team Player', 'Innovator', 'Customer First', 'Problem Solver', 'Rockstar'];

export default function GiveKudo() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    receiverId: '',
    badge: 'Team Player',
    message: '',
  });

  useEffect(() => {
    const fetchEmps = async () => {
      try {
        const data = await getAllEmployees();
        // filter out current user
        const others = data.filter(e => String(e._id || e.id) !== String(user?._id || user?.id));
        setEmployees(others);
        if (others.length > 0) setForm(curr => ({ ...curr, receiverId: others[0]._id || others[0].id }));
      } catch (err) {
        console.error('Failed to load employees for kudos', err);
      }
    };
    fetchEmps();
  }, [user]);

  const handleSubmit = async () => {
    if (!form.receiverId || !form.message) {
      Alert.alert('Incomplete', 'Please select a teammate and write a message.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('recognition/kudos', {
         senderId: user?._id || user?.id,
         ...form
      });
      
      Alert.alert('High Five!', 'Your shoutout is now on the Kudo Wall!', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Submission failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Give a Kudo</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
           <Ionicons name="star" size={32} color="#f6d140" />
           <Text style={styles.introTitle}>RECOGNIZE GREATNESS</Text>
           <Text style={styles.introSub}>Shoutout a teammate who went above and beyond.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>WHO DESERVES A HIGH FIVE?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
             {employees.map(emp => (
                <TouchableOpacity 
                   key={emp._id || emp.id} 
                   style={[styles.chip, form.receiverId === (emp._id || emp.id) && styles.chipActive]}
                   onPress={() => setForm({...form, receiverId: emp._id || emp.id})}
                >
                   <Text style={[styles.chipText, form.receiverId === (emp._id || emp.id) && styles.chipTextActive]}>
                      {emp.name}
                   </Text>
                </TouchableOpacity>
             ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#863ceb' }]}>SELECT A BADGE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeScroll}>
            {BADGES.map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, form.badge === b && styles.chipActive]}
                onPress={() => setForm({...form, badge: b})}
              >
                <Text style={[styles.chipText, form.badge === b && styles.chipTextActive]}>{b.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#ef4444' }]}>YOUR MESSAGE</Text>
          <TextInput 
            style={[styles.input, { borderColor: '#ef4444' }]}
            multiline
            numberOfLines={4}
            placeholder="e.g. Thanks for helping me debug that critical issue!"
            value={form.message}
            onChangeText={(t) => setForm({...form, message: t})}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          activeOpacity={0.9}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#0d0d0d" /> : <Text style={styles.submitBtnText}>SEND KUDO</Text>}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20,
    borderBottomWidth: 1, borderColor: '#f3f4f6',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0d0d0d' },
  scroll: { padding: 24 },
  introCard: { alignItems: 'center', marginBottom: 32 },
  introTitle: { fontSize: 20, fontWeight: '900', color: '#0d0d0d', marginTop: 12, letterSpacing: -0.5 },
  introSub: { fontSize: 13, fontWeight: '600', color: '#6b7280', textAlign: 'center', marginTop: 6, lineHeight: 20 },
  formGroup: { marginBottom: 28 },
  label: { fontSize: 10, fontWeight: '900', color: '#0d0d0d', marginBottom: 12, letterSpacing: 1 },
  badgeScroll: { gap: 10, paddingRight: 20, paddingBottom: 4 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  chipActive: { borderColor: '#0d0d0d', backgroundColor: '#0d0d0d', shadowColor: '#f6d140', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
  chipText: { fontSize: 11, fontWeight: '900', color: '#6b7280', letterSpacing: 0.5 },
  chipTextActive: { color: '#f6d140' },
  input: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#0d0d0d',
    padding: 16, fontSize: 14, fontWeight: '600', color: '#0d0d0d', textAlignVertical: 'top',
    minHeight: 120,
  },
  submitBtn: {
    backgroundColor: '#863ceb', borderRadius: 12, borderWidth: 3, borderColor: '#0d0d0d',
    padding: 20, alignItems: 'center', marginTop: 12,
    shadowColor: '#f6d140', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
  },
  submitBtnText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 1 },
});
