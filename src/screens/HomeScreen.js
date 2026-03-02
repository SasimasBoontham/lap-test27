import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Alert } from 'react-native';
import HoverableButton from '../components/HoverableButton';
import { Swipeable } from 'react-native-gesture-handler';
import { Pressable } from 'react-native';
import { AppContext } from '../context/AppContext';
import theme from '../theme';
// Share link removed from Home screen per request

export default function HomeScreen({ navigation }) {
  const { user, groups, deleteGroup } = useContext(AppContext);

  const myGroups = groups.filter((g) => g.members.find((m) => m.id === user?.id));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.welcome}>Welcome, {user?.name}</Text>
        <View style={styles.headerRight}>
          <HoverableButton
            style={styles.userCodePill}
            onPress={async () => {
              const code = user?.code || '';
              if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(code);
                Alert.alert('Copied', 'User code copied to clipboard');
              } else {
                Alert.alert('User code', code || '');
              }
            }}
          >
            <Text style={styles.userCodeEmoji}>📋</Text>
            <Text style={styles.userCodeText}>{user?.code}</Text>
          </HoverableButton>
          <HoverableButton style={styles.createFull} onPress={() => navigation.navigate('CreateGroup')}>
            <Text style={styles.createText}>+ Create Group</Text>
          </HoverableButton>
        </View>
      </View>

      <View style={styles.pillRow} />

  <Text style={styles.section}>Your Groups</Text>
      <FlatList
        data={myGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={styles.deleteActionContainer}>
                <Pressable onPress={() => deleteGroup(item.id)} style={styles.deleteAction}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>
            )}
          >
            <HoverableButton style={styles.groupItem} onPress={() => navigation.navigate('Chat', { groupId: item.id })}>
              <View style={styles.groupInner}>
                <View style={styles.accent} />
                <View style={styles.groupContent}>
                  <Text style={styles.groupTitle}>{item.title}</Text>
                  <Text style={styles.groupMeta}>{item.members.length} members</Text>
                </View>
              </View>
            </HoverableButton>
          </Swipeable>
        )}
        ListEmptyComponent={<Text style={{ color: theme.text }}>You have no groups yet</Text>}
      />

      {/* Footer: bottom actions for Calendar and Notes */}
      <View style={styles.footer}>
        <HoverableButton style={[styles.footerBtn, { backgroundColor: theme.success }]} onPress={() => navigation.navigate('Calendar')}>
          <Text style={[styles.footerText, { color: '#ffffff' }]}>Calendar</Text>
        </HoverableButton>

        <HoverableButton style={[styles.footerBtn, styles.createFull]} onPress={() => navigation.navigate('JoinGroup')}>
          <Text style={styles.createText}>Join Group</Text>
        </HoverableButton>

        <HoverableButton style={[styles.footerBtn, { backgroundColor: theme.danger }]} onPress={() => navigation.navigate('Notes')}>
          <Text style={[styles.footerText, { color: '#ffffff' }]}>Notes</Text>
        </HoverableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: theme.background,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
    color: theme.text,
    fontWeight: '600',
    letterSpacing: 0.2,
    // use a clean sans-serif stack on web, System on native
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' : 'System',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  userCodePill: { marginRight: 8, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border, flexDirection: 'row', alignItems: 'center' },
  userCodeEmoji: { marginRight: 8, fontSize: 14 },
  userCodeText: { fontWeight: '700', color: theme.textPrimary },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10
  },
  section: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 12,
    color: theme.textPrimary,
    fontWeight: '500'
  },
  groupItem: {
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.border,
    padding: 0,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 0
  },
  deleteActionContainer: { justifyContent: 'center', alignItems: 'flex-end' },
  deleteAction: { backgroundColor: '#ff4d4f', justifyContent: 'center', alignItems: 'center', width: 72, height: '80%', borderRadius: 8, marginRight: 8 },
  deleteText: { color: '#fff', fontSize: 20 },
  groupInner: { flexDirection: 'row', alignItems: 'center' },
  accent: { width: 6, height: '100%', backgroundColor: theme.primary, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  groupContent: { padding: 12, flex: 1 },
  groupTitle: { fontSize: 16, color: theme.textPrimary, fontWeight: '600' },
  groupMeta: { color: theme.textSecondary, marginTop: 4 },
  pillButton: {
    backgroundColor: theme.neutralButton,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    minWidth: 110,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 0
  },
  pillRow: { flexDirection: 'row', marginTop: 12, marginBottom: 12, flexWrap: 'wrap' },
  createFull: {
    backgroundColor: theme.createAccent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  createText: {
    color: theme.text,
    fontWeight: '600'
  },
  buttonText: {
    color: theme.buttonText,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' : 'System'
  }
  ,
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  footerBtn: {
    backgroundColor: theme.neutralButton,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 28,
    minWidth: 140,
    alignItems: 'center'
  },
  footerText: { fontWeight: '600' }
});
