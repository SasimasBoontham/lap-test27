import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { AppContext } from '../context/AppContext';
import theme from '../theme';

export default function NotesScreen() {
  const { groups, user, clearRedLikes } = useContext(AppContext);

  // collect red-liked messages across all groups (liked by anyone)
  const likedMessages = groups.flatMap((g) =>
    g.messages
      .filter((m) => (m.likedRed || []).length > 0)
      .map((m) => ({ ...m, groupTitle: g.title, groupId: g.id }))
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.danger, fontSize: 20 }]}>
        <Text style={{ fontSize: 22 }}>❤️ </Text>
        <Text>Notes</Text>
      </Text>
      <FlatList
        data={likedMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            key={item.id}
            renderRightActions={() => (
              <View style={styles.deleteActionContainer}>
                <Pressable onPress={() => clearRedLikes(item.groupId, item.id)} style={styles.deleteAction}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
            )}
          >
            <View style={[styles.item, { backgroundColor: theme.notesItemBackground }]}>
              <Text style={{ fontWeight: '600' }}>{item.groupTitle}</Text>
              <Text>{item.text}</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </Swipeable>
        )}
        ListEmptyComponent={<Text>No notes from liked messages yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, title: { fontSize: 18, marginBottom: 8 }, item: { padding: 10, borderWidth: 1, borderColor: theme.border, borderRadius: 12, marginBottom: 8 }, deleteActionContainer: { justifyContent: 'center', alignItems: 'flex-end' }, deleteAction: { backgroundColor: '#ff4d4f', justifyContent: 'center', alignItems: 'center', width: 72, height: '80%', borderRadius: 8, marginRight: 8 }, deleteText: { color: '#fff', fontSize: 20 } });
