import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

import apiClient from '../src/api/client';

export default function Assistant() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', text: "Hello! I'm Bull-Bot 🤖. I can help you with your leave balance, payroll dates, and company policies. How can I assist you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef(null);

  const sendMessage = async (textOverride = null) => {
    const playText = textOverride || inputText.trim();
    if (!playText) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: playText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await apiClient.post('/ai/chat', { 
        userId: user?._id || user?.id, 
        message: playText 
      });
      const data = res.data;
      
      const botMsg = { id: (Date.now()+1).toString(), role: 'assistant', text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Bull-Bot Chat Error:', err.message, err.response?.data || err);
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', text: "I'm having trouble connecting to the mainframe. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!isUser && <View style={styles.botAvatar}><Ionicons name="hardware-chip" size={14} color="#f6d140" /></View>}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
      </View>
    );
  };

  const PRESETS = [
    "What is my leave balance?",
    "When is payday?",
    "What are the remote work policies?"
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="close" size={24} color="#0d0d0d" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
           <Text style={styles.headerTitle}>Bull-Bot</Text>
           <View style={styles.onlineDot} />
        </View>
        <View style={{ width: 44 }} />
      </View>

      <FlatList 
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatScroll}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && (
         <View style={styles.typingBox}>
           <Text style={styles.typingText}>Bull-Bot is typing...</Text>
           <ActivityIndicator size="small" color="#863ceb" />
         </View>
      )}

      {/* Preset Chips */}
      {messages.length < 3 && !isTyping && (
         <View style={styles.presetScroll}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PRESETS.map((p, i) => (
                 <TouchableOpacity key={i} style={styles.presetChip} onPress={() => sendMessage(p)}>
                    <Text style={styles.presetText}>{p}</Text>
                 </TouchableOpacity>
              ))}
           </ScrollView>
         </View>
      )}

      <View style={styles.inputArea}>
         <TextInput 
           style={styles.inputBox}
           placeholder="Ask Bull-Bot something..."
           placeholderTextColor="#9ca3af"
           value={inputText}
           onChangeText={setInputText}
           onSubmitEditing={() => sendMessage()}
         />
         <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()} disabled={isTyping || !inputText.trim()}>
            <Ionicons name="send" size={18} color="#fff" />
         </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: '#fff', borderBottomWidth: 3, borderColor: '#0d0d0d',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitleBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0d0d0d', letterSpacing: -0.5 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
  chatScroll: { padding: 20, paddingBottom: 40, gap: 16 },
  messageBubble: { maxWidth: '85%', padding: 14, borderRadius: 16, borderWidth: 2, borderColor: '#0d0d0d', shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#f6d140', borderBottomRightRadius: 4 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderBottomLeftRadius: 4, flexDirection: 'row', gap: 10 },
  botAvatar: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#863ceb', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  userText: { fontSize: 14, fontWeight: '700', color: '#0d0d0d', lineHeight: 20 },
  botText: { fontSize: 14, fontWeight: '600', color: '#4b5563', lineHeight: 22, flexShrink: 1 },
  typingBox: { paddingLeft: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { fontSize: 12, fontWeight: '800', fontStyle: 'italic', color: '#9ca3af' },
  presetScroll: { paddingHorizontal: 20, paddingBottom: 10 },
  presetChip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 2, borderColor: '#e5e7eb', marginRight: 10 },
  presetText: { fontSize: 12, fontWeight: '800', color: '#6b7280' },
  inputArea: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 3, borderColor: '#0d0d0d', alignItems: 'center', gap: 12, paddingBottom: Platform.OS === 'ios' ? 50 : 45 },
  inputBox: { flex: 1, backgroundColor: '#f3f4f6', height: 48, borderRadius: 12, paddingHorizontal: 16, fontSize: 14, fontWeight: '600', color: '#0d0d0d', borderWidth: 2, borderColor: '#e5e7eb' },
  sendBtn: { width: 48, height: 48, backgroundColor: '#0d0d0d', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#863ceb', shadowColor: '#f6d140', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0 },
});
