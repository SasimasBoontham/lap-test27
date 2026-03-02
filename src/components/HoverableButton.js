import React, { useState } from 'react';
import { Pressable, View, Platform } from 'react-native';
import theme from '../theme';

// A simple hoverable button wrapper that enlarges (5%) and adds shadow on web hover.
// Falls back to a regular pressable on native platforms.
export default function HoverableButton({ children, style, onPress, ...props }) {
  const [hovered, setHovered] = useState(false);

  const hoverStyle = Platform.OS === 'web' && hovered ? {
    transform: [{ scale: 1.05 }],
    // boxShadow works on web; react-native will ignore unknown props on native
    boxShadow: `0 10px 30px rgba(209,230,231,0.18)`,
  } : {};

  // Remove default browser focus outline on web buttons (prevents black ring/outline)
  const webReset = Platform.OS === 'web' ? { outlineWidth: 0, outlineColor: 'transparent', borderWidth: 0 } : {};

  // For native, we can optionally provide elevation when pressed (not hover)
  const nativePressStyle = Platform.OS !== 'web' ? {} : {};

  const webProps = Platform.OS === 'web' ? {
    style: webReset,
    tabIndex: 0,
    accessibilityRole: 'button',
    // handle Enter/Space activation for keyboard users
    onKeyDown: (e) => {
      // react-native-web sometimes provides nativeEvent.key
      const key = (e && (e.nativeEvent?.key || e.key));
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        e.preventDefault && e.preventDefault();
        onPress && onPress();
      }
    }
  } : {};

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      {...webProps}
      {...props}
    >
      <View style={[{ transform: [{ scale: 1 }] }, nativePressStyle, style, hoverStyle, webReset]}>
        {children}
      </View>
    </Pressable>
  );
}
