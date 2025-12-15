import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme, typography } from '../theme';
import { spacing } from '../theme/spacing';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  icon: Icon, 
  onPress, 
  style 
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: colors.surface,
          borderWidth: 1, 
          borderColor: colors.secondary 
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={32} color={colors.primary} style={styles.icon} />
      <Text 
        style={[styles.title, { color: colors.text, fontFamily: typography.primary }]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  icon: {
    marginBottom: spacing.s,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
});