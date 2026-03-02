import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Modal } from 'react-native';
import theme from '../theme';
import HoverableButton from '../components/HoverableButton';
import { AppContext } from '../context/AppContext';
import MessageBubble from '../components/MessageBubble';

export default function ChatScreen({ route }) {
  const { groupId } = route.params;
  const { groups, user, sendMessage } = useContext(AppContext);
  const { addMemberToGroup } = useContext(AppContext);
  const group = groups.find((g) => g.id === groupId) || { messages: [], title: 'Unknown' };
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(groupId, text.trim());
    setText('');
  };

  const { toggleReaction, deleteMessage } = useContext(AppContext);

  const handleToggleReaction = (message, type) => {
    toggleReaction(groupId, message.id, type);
  };

  const handleDeleteMessage = (messageId) => {
    // optional: confirm here, but MessageBubble will prompt first
    deleteMessage(groupId, messageId);
  };

  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (!newMemberId.trim() || !newMemberName.trim()) {
      Alert.alert('Missing information', 'Please enter both ID and name');
      return;
    }
    const member = { id: newMemberId.trim(), name: newMemberName.trim() };
    const res = addMemberToGroup(groupId, member);
    if (res?.success) {
      Alert.alert('Success', `Added member ${member.name}`);
      setNewMemberId('');
      setNewMemberName('');
    } else {
      Alert.alert('Failed', res?.message || 'An error occurred');
    }
  };

  const handleCopyGroupId = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(groupId);
        Alert.alert('Copied', 'Group ID copied to clipboard');
      } else {
        // fallback: show alert with code so user can copy manually
        Alert.alert('Group ID', groupId);
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to copy the code');
    }
  };

  const [showMembers, setShowMembers] = useState(false);
  const handleToggleMembers = () => setShowMembers((v) => !v);

  // attach current user id to messages for UI heart state
  const messagesForUI = group.messages.map((m) => ({ ...m, _currentUserId: user?.id }));

  // set the navigation title to the group's title if navigation exists
  useEffect(() => {
    if (route?.params?.navigation) return; // safety
    // If navigation is available via route, set title via parent (some navigators pass it differently)
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <Text style={styles.title}>{group.title}</Text>
      <View style={styles.infoRow}>
          <Text style={styles.codeLabel}>Group ID:</Text>
          <Text style={styles.code}>{group.id}</Text>
          <HoverableButton onPress={handleCopyGroupId} style={styles.copyBtn}>
            <Text style={styles.copyText}>Copy</Text>
          </HoverableButton>
          <HoverableButton onPress={handleToggleMembers} style={styles.membersBtn}>
            <Text style={styles.copyText}>Members</Text>
          </HoverableButton>
      </View>
    <View style={styles.addMemberRow}>
  <TextInput placeholder="Member ID (id)" value={newMemberId} onChangeText={setNewMemberId} style={styles.smallInput} returnKeyType="next" onSubmitEditing={() => { /* focus moves to next in RN; web will ignore */ }} />
  <TextInput placeholder="Member name" value={newMemberName} onChangeText={setNewMemberName} style={styles.smallInput} returnKeyType="done" onSubmitEditing={handleAddMember} />
  <HoverableButton style={styles.addBtn} onPress={handleAddMember}><Text style={styles.addBtnText}>Add</Text></HoverableButton>
    </View>
      
      <Modal visible={showMembers} animationType="slide" transparent={true} onRequestClose={handleToggleMembers}>
        <View style={styles.modalOverlay}>
          <View style={styles.memberModal}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Group Members</Text>
            <FlatList
              data={group.members}
              keyExtractor={(it) => it.id}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberId}>{item.id}</Text>
                </View>
              )}
            />
            <View style={{ marginTop: 12 }}>
              <HoverableButton style={styles.closeBtn} onPress={handleToggleMembers}><Text style={styles.copyText}>Close</Text></HoverableButton>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={messagesForUI}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            onToggleReaction={(msg, type) => handleToggleReaction(msg, type)}
            onDelete={() => handleDeleteMessage(item.id)}
          />
        )}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.composer}>
  <TextInput value={text} onChangeText={setText} placeholder="Type a message..." style={styles.input} returnKeyType="send" onSubmitEditing={handleSend} />
  <HoverableButton style={styles.sendBtn} onPress={handleSend}><Text style={styles.sendText}>Send</Text></HoverableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', padding: 12, color: theme.textPrimary },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 6 },
  codeLabel: { fontWeight: '600', marginRight: 8, color: theme.textPrimary },
  code: { fontFamily: 'monospace', color: theme.textSecondary, marginRight: 8 },
  copyBtn: { backgroundColor: theme.secondary, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  copyText: { color: theme.buttonText },
  membersBtn: { backgroundColor: theme.secondary, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12, marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  memberModal: { width: '90%', maxHeight: '70%', backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  memberItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: theme.border },
  memberName: { fontWeight: '600', color: theme.textPrimary },
  memberId: { color: theme.textSecondary, fontSize: 12 },
  addMemberRow: { flexDirection: 'row', paddingHorizontal: 12, alignItems: 'center', marginBottom: 6 },
  smallInput: { borderWidth: 1, borderColor: theme.border, padding: 10, borderRadius: 12, marginRight: 8, flex: 1, backgroundColor: '#fff' },
  composer: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  // restore a visible black rounded outline for the message input (oval)
  input: { flex: 1, borderWidth: 1, borderColor: theme.border, marginRight: 8, padding: 12, borderRadius: 999, backgroundColor: '#fff' },
  sendBtn: { backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: theme.buttonText, fontWeight: '600' },
  addBtn: { backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: theme.buttonText },
  closeBtn: { backgroundColor: theme.secondary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }
});
