import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import HoverableButton from './HoverableButton';
import theme from '../theme';

export default function ShareAppLink({ appUrl }) {
  const copyToClipboard = async () => {
    if (!appUrl) {
      Alert.alert('No link set', 'Please set the app link in src/config.js');
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(appUrl);
        Alert.alert('Copied', 'App link copied to clipboard');
      } else {
        // Fallback: show the link so user can copy manually
        Alert.alert('Copy link', appUrl);
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to copy the link');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Shareable link:</Text>
      <Text style={styles.url} numberOfLines={1} ellipsizeMode="middle">
        {appUrl || 'Not set (configure src/config.js)'}
      </Text>
      <HoverableButton onPress={copyToClipboard} style={styles.button}>
        <Text style={styles.buttonText}>Copy link</Text>
      </HoverableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: theme.background },
  label: { marginBottom: 6, color: theme.text },
  url: { color: theme.secondary, marginBottom: 8 },
  button: { backgroundColor: theme.button, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, alignSelf: 'flex-start' },
  buttonText: { color: theme.text, fontWeight: '600' }
});
