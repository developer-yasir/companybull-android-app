import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';

export default function Standup() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    yesterday: '',
    today: '',
    blockers: '',
  });

  const handleSubmit = async () => {
    if (!form.yesterday || !form.today) {
      Alert.alert('Incomplete', 'Please fill in your primary updates.');
      return;
    }

    try {
      setLoading(true);
      // For now, we'll simulate the stand-up submission since we'll build the 
      // dedicated stand-up model in the next step or treat it as a task-comment.
      // Actually, let's just log it and show a success message for this iteration.
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Stand-up submitted for review!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }, 1500);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Stand-up</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
           <Ionicons name="time" size={32} color="#863ceb" />
           <Text style={styles.introTitle}>SYNC WITH TEAM</Text>
           <Text style={styles.introSub}>Briefly share your progress and any help you need today.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>WHAT DID YOU DO YESTERDAY?</Text>
          <TextInput 
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="e.g. Finished the landing page design..."
            value={form.yesterday}
            onChangeText={(t) => setForm({...form, yesterday: t})}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#863ceb' }]}>WHAT ARE YOU DOING TODAY?</Text>
          <TextInput 
            style={[styles.input, { borderColor: '#863ceb' }]}
            multiline
            numberOfLines={4}
            placeholder="e.g. Implementing the document vault..."
            value={form.today}
            onChangeText={(t) => setForm({...form, today: t})}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#ef4444' }]}>ANY BLOCKERS?</Text>
          <TextInput 
            style={[styles.input, { borderColor: '#ef4444' }]}
            multiline
            numberOfLines={2}
            placeholder="e.g. Waiting for API documentation..."
            value={form.blockers}
            onChangeText={(t) => setForm({...form, blockers: t})}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          activeOpacity={0.9}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#0d0d0d" /> : <Text style={styles.submitBtnText}>SUBMIT UPDATE</Text>}
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
  formGroup: { marginBottom: 24 },
  label: { fontSize: 10, fontWeight: '900', color: '#0d0d0d', marginBottom: 8, letterSpacing: 1 },
  input: {
    backgroundColor: '#f9fafb', borderRadius: 12, borderWidth: 2, borderColor: '#0d0d0d',
    padding: 16, fontSize: 14, fontWeight: '600', color: '#0d0d0d', textAlignVertical: 'top',
    minHeight: 100,
  },
  submitBtn: {
    backgroundColor: '#f6d140', borderRadius: 12, borderWidth: 3, borderColor: '#0d0d0d',
    padding: 20, alignItems: 'center', marginTop: 12,
    shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
  },
  submitBtnText: { fontSize: 14, fontWeight: '900', color: '#0d0d0d', letterSpacing: 1 },
});
