import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import HoverableButton from '../components/HoverableButton';
import { AppContext } from '../context/AppContext';
import theme from '../theme';

export default function JoinGroupScreen({ navigation }) {
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');
  const { joinGroupById } = useContext(AppContext);

  const handleJoin = () => {
    const res = joinGroupById(groupId.trim());
    if (res.success) {
      navigation.replace('Chat', { groupId: groupId.trim() });
    } else {
      setMessage(res.message || 'Unable to join');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Enter Group ID (e.g. g-123)" value={groupId} onChangeText={setGroupId} style={styles.input} returnKeyType="done" onSubmitEditing={handleJoin} />
      <HoverableButton style={[styles.rectButton, { backgroundColor: theme.createAccent }]} onPress={handleJoin}>
        <Text style={styles.rectButtonText}>Join Group</Text>
      </HoverableButton>
      {message ? <Text style={{ color: theme.warning, marginTop: 8 }}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, input: { borderWidth: 1, borderColor: theme.border, padding: 10, borderRadius: 12, marginBottom: 12 }, rectButton: { backgroundColor: theme.neutralButton, padding: 12, borderRadius: 8, alignItems: 'center' }, rectButtonText: { color: theme.text, fontWeight: '600' } });
