import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import HoverableButton from '../components/HoverableButton';
import { AppContext } from '../context/AppContext';
import theme from '../theme';

export default function CreateGroupScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const { createGroup } = useContext(AppContext);

  const handleCreate = () => {
    if (!title.trim()) return;
    const g = createGroup(title.trim());
    navigation.replace('Chat', { groupId: g.id });
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Group name" value={title} onChangeText={setTitle} style={styles.input} returnKeyType="done" onSubmitEditing={handleCreate} />
      <HoverableButton style={[styles.rectButton, { backgroundColor: theme.createAccent }]} onPress={handleCreate}>
        <Text style={styles.rectButtonText}>Create Group (Invite-only)</Text>
      </HoverableButton>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, input: { borderWidth: 1, borderColor: theme.border, padding: 10, borderRadius: 12, marginBottom: 12 }, rectButton: { backgroundColor: theme.neutralButton, padding: 12, borderRadius: 8, alignItems: 'center' }, rectButtonText: { color: theme.text, fontWeight: '600' } });
