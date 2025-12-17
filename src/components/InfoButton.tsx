/**
 * InfoButton Component
 * 
 * A small circular button with an info icon that triggers a popup when pressed.
 * Used to display contextual help information for UUID versions.
 * 
 * @module components/InfoButton
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { useTheme } from '../theme';

interface InfoButtonProps {
  onPress: () => void;
}

/**
 * A circular info button with an info icon
 * 
 * @param {Function} onPress - Callback when button is pressed
 * 
 * @example
 * <InfoButton onPress={() => setShowPopup(true)} />
 */
export const InfoButton: React.FC<InfoButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.primary + '20' }]}
      onPress={onPress}
      accessibilityLabel="More information"
      accessibilityRole="button"
    >
      <Info size={16} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  }
});
