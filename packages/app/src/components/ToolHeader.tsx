/**
 * ToolHeader Component
 *
 * A reusable header for tool screens with back navigation and theme toggle.
 * Provides consistent navigation and theme switching across all tool screens.
 *
 * @module components/ToolHeader
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Sun, Moon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';

interface ToolHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Header component for tool screens with navigation and theme toggle
 *
 * @param {string} title - The main title of the tool
 * @param {string} subtitle - Optional subtitle/description
 *
 * @example
 * <ToolHeader title="UUID Generator" subtitle="Generate universally unique identifiers" />
 */
export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, subtitle }) => {
  const navigation = useNavigation();
  const { colors, spacing, theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.l }]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.themeButton}
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

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  themeButton: {
    padding: 8,
    marginRight: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
});
