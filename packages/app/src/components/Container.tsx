import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { spacing } from '../theme/spacing';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
}

export const Container: React.FC<ContainerProps> = ({ children, style, maxWidth = 800 }) => {
  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  inner: {
    width: '100%',
    paddingHorizontal: spacing.m,
    flex: 1,
    // On web, this centers the content if it's smaller than maxWidth
    ...Platform.select({
      web: {
        marginHorizontal: 'auto',
      },
    }),
  },
});
