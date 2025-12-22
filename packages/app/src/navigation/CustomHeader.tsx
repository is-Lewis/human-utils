/**
 * Custom Header Component for React Navigation
 * 
 * Provides a consistent header with theme toggle across all screens.
 * Automatically shows back button on non-home screens.
 * 
 * @module navigation/CustomHeader
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme';

/**
 * Custom header component for navigation screens
 * 
 * Shows theme toggle on all screens and back button on non-home screens
 */
export const CustomHeader: React.FC<NativeStackHeaderProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, spacing, theme, toggleTheme } = useTheme();
  
  const isHomeScreen = route.name === 'Home';

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingHorizontal: spacing.l, paddingTop: spacing.m }]}>
      <View style={styles.content}>
        {/* Back Button (only on non-home screens) */}
        {!isHomeScreen && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}

        {/* Spacer to push theme toggle to the right */}
        {isHomeScreen && <View style={{ flex: 1 }} />}

        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.themeButton, !isHomeScreen && styles.themeButtonWithBack]}
          onPress={toggleTheme}
          accessibilityLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          accessibilityRole="button"
        >
          {theme === 'light' ? (
            <Moon size={24} color={colors.text} />
          ) : (
            <Sun size={24} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    flex: 1
  },
  themeButton: {
    padding: 8,
    marginRight: -8
  },
  themeButtonWithBack: {
    marginLeft: 'auto'
  }
});
