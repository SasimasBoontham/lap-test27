import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import HoverableButton from '../components/HoverableButton';
import theme from '../theme';
import { AppContext } from '../context/AppContext';
import generateUserCode from '../utils/ids';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('alice@example.com');
  const [name, setName] = useState('Alice');
  const { login } = useContext(AppContext);

  const handleLogin = () => {
    login(email, name);
    navigation.replace('Home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <View style={styles.card}>
        <Text style={styles.title}>Log-in</Text>
        <View style={styles.nameRow}>
          <TextInput style={[styles.input, styles.nameInput]} value={name} onChangeText={setName} placeholder="Name" returnKeyType="next" onSubmitEditing={() => { /* noop: user moves to next field */ }} />
          <HoverableButton
            style={styles.codePill}
            onPress={async () => {
              const code = generateUserCode(name, email);
              if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(code);
                Alert.alert('Copied', 'User code copied to clipboard');
              } else {
                Alert.alert('Copy', `User code: ${code}`);
              }
            }}
          >
            <Text style={styles.codeEmoji}>📋</Text>
            <Text style={styles.codeText}>{generateUserCode(name, email)}</Text>
          </HoverableButton>
        </View>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" returnKeyType="done" onSubmitEditing={handleLogin} />
        <HoverableButton style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </HoverableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: theme.cardBackground, padding: 28, borderRadius: 12, marginHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8, borderWidth: 1, borderColor: theme.border },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', color: theme.textPrimary, fontWeight: '600' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  nameInput: { marginBottom: 0, flex: 1 },
  input: { borderWidth: 1, borderColor: theme.border, padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: '#ffffff' },
  codePill: { marginLeft: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border, minWidth: 80, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  codeEmoji: { marginRight: 8, fontSize: 14 },
  codeText: { fontWeight: '700', color: theme.textPrimary },
  loginBtn: { backgroundColor: '#ffffff', paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  loginText: { color: theme.textPrimary, fontWeight: '700' }
});
