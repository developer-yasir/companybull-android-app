import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e, p) => {
    const loginEmail = e !== undefined ? e : email;
    const loginPass = p !== undefined ? p : password;
    
    if (!loginEmail || !loginPass) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting login for:', loginEmail);
      const result = await login(loginEmail, loginPass);
      console.log('Login result:', result.success ? 'Success' : 'Failure - ' + result.message);
      if (!result.success) {
        Alert.alert('Login Failed', result.message);
      }
      // Success is handled by AuthContext redirecting to '/'
    } catch (error) {
      console.error('Login screen crash:', error);
      Alert.alert('Error', 'Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicFill = (role) => {
    let demoEmail = '';
    const demoPass = 'password123';
    
    switch(role) {
      case 'Admin': demoEmail = 'jennifer@companybull.com'; break;
      case 'HR': demoEmail = 'lisa@companybull.com'; break;
      case 'Manager': demoEmail = 'sarah@companybull.com'; break;
      case 'Employee': demoEmail = 'yasir@companybull.com'; break;
    }
    
    setEmail(demoEmail);
    setPassword(demoPass);
    
    // Auto-trigger login for convenience as requested
    handleLogin(demoEmail, demoPass);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>CompanyBull</Text>
          <Text style={styles.subtitle}>Secure Employee Portal</Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#666"
            editable={!isSubmitting}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
            editable={!isSubmitting}
          />
          
          <TouchableOpacity 
            style={[styles.primaryButton, isSubmitting && styles.disabledButton]} 
            onPress={() => handleLogin()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>Quick Demo Login (Fill & Sign):</Text>
          <View style={styles.demoGrid}>
            {['Admin', 'HR', 'Manager', 'Employee'].map((role) => (
              <TouchableOpacity 
                key={role} 
                style={styles.demoButton} 
                onPress={() => handleMagicFill(role)}
                disabled={isSubmitting}
              >
                <Text style={styles.demoButtonText}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f3',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0d0d0d',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#0d0d0d',
    textAlign: 'center',
    fontWeight: '800',
    textTransform: 'uppercase',
    backgroundColor: '#f6d140',
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  formContainer: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#0d0d0d',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: '#863ceb',
    borderWidth: 2.5,
    borderColor: '#0d0d0d',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#666',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  demoContainer: {
    alignItems: 'center',
    borderTopWidth: 2.5,
    borderTopColor: '#0d0d0d',
    paddingTop: 24,
    marginTop: 16,
  },
  demoText: {
    fontSize: 11,
    color: '#0d0d0d',
    fontWeight: '900',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  demoButton: {
    backgroundColor: '#fdfdfc',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '46%',
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  demoButtonText: {
    color: '#0d0d0d',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
