import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { AppContext } from '../context/AppContext';
import theme from '../theme';

export default function CalendarScreen() {
  const { groups, user, clearGreenLikes } = useContext(AppContext);

  // collect green-liked messages across all groups (liked by anyone)
  const likedMessages = groups.flatMap((g) =>
    g.messages
      .filter((m) => (m.likedGreen || []).length > 0)
      .map((m) => ({ ...m, groupTitle: g.title, groupId: g.id }))
  );

  // group by date
  const grouped = likedMessages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  const sections = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map((date) => ({ date, items: grouped[date] }));

  return (
    <View style={[styles.container, { backgroundColor: theme.calendarBackground }]}>
      <Text style={[styles.title, { color: theme.success, fontSize: 20 }]}>
        <Text style={{ fontSize: 22 }}>💚 </Text>
        <Text>Calendar</Text>
      </Text>
      <FlatList
        data={sections}
        keyExtractor={(s) => s.date}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.date}>{item.date}</Text>
            {item.items.map((m) => (
              <Swipeable
                key={m.id}
                renderRightActions={() => (
                  <View style={styles.deleteActionContainer}>
                    <Pressable onPress={() => clearGreenLikes(m.groupId, m.id)} style={styles.deleteAction}>
                      <Text style={styles.deleteText}>🗑️</Text>
                    </Pressable>
                  </View>
                )}
              >
                <View style={[styles.item, { backgroundColor: theme.calendarItemBackground }]}>
                  <Text style={{ fontWeight: '600' }}>{m.groupTitle}</Text>
                  <Text>{m.text}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{new Date(m.createdAt).toLocaleTimeString()}</Text>
                </View>
              </Swipeable>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text>No liked messages yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, title: { fontSize: 18, marginBottom: 8 }, section: { marginBottom: 12 }, date: { fontSize: 16, fontWeight: '600', marginBottom: 6 }, item: { padding: 8, borderWidth: 1, borderColor: theme.border, borderRadius: 12, marginBottom: 6 }, deleteActionContainer: { justifyContent: 'center', alignItems: 'flex-end' }, deleteAction: { backgroundColor: '#ff4d4f', justifyContent: 'center', alignItems: 'center', width: 72, height: '80%', borderRadius: 8, marginRight: 8 }, deleteText: { color: '#fff', fontSize: 20 } });
