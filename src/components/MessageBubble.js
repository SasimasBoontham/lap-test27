import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import theme from '../theme';
import HoverableButton from './HoverableButton';

export default function MessageBubble({ message, onToggleReaction, onDelete }) {
  const currentUserId = message._currentUserId || '';
  const byMe = message.author?.id === currentUserId;
  const greenByMe = message.likedGreen?.some((u) => u.id === currentUserId);
  const warnByMe = message.likedRed?.some((u) => u.id === currentUserId);
  const lastTap = useRef(null);

  const handlePress = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 350) {
      // double-tap detected
      Alert.alert('Delete', 'Delete this message?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete && onDelete(message.id) }
      ]);
      lastTap.current = null;
    } else {
      lastTap.current = now;
      // reset after threshold
      setTimeout(() => {
        lastTap.current = null;
      }, 400);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.bubble, byMe ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={styles.author}>{message.author.name}</Text>
        <Text style={styles.text}>{message.text}</Text>
        <View style={styles.row}>
          <Text style={styles.time}>{new Date(message.createdAt).toLocaleTimeString()}</Text>
          <View style={styles.reactions}>
            <HoverableButton onPress={() => onToggleReaction(message, 'green')} style={styles.reactBtn}>
              <Text style={{ color: greenByMe ? theme.success : '#333', fontSize: 18 }}>{greenByMe ? '💚' : '🤍'}</Text>
            </HoverableButton>
            <HoverableButton onPress={() => onToggleReaction(message, 'red')} style={styles.reactBtn}>
              <Text style={{ color: warnByMe ? theme.danger || 'red' : '#333', fontSize: 18 }}>{warnByMe ? '❤️' : '🤍'}</Text>
            </HoverableButton>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, borderWidth: 1, borderColor: theme.border, borderRadius: 12, marginBottom: 8, maxWidth: '70%' },
  bubbleLeft: { alignSelf: 'flex-start', backgroundColor: theme.cardBackground },
  bubbleRight: { alignSelf: 'flex-end', backgroundColor: theme.cardBackground },
  author: { fontWeight: '600', color: theme.textPrimary },
  text: { marginTop: 6, marginBottom: 6, color: theme.textPrimary },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { color: theme.textSecondary, fontSize: 12 },
  likeBtn: { padding: 6 },
  reactions: { flexDirection: 'row', alignItems: 'center' },
  reactBtn: { paddingHorizontal: 8 }
});
