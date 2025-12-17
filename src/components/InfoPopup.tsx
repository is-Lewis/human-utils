/**
 * InfoPopup Component
 * 
 * A dismissible modal popup that displays detailed information about a UUID version.
 * Shows features, use cases, and other metadata to help users understand each version.
 * 
 * @module components/InfoPopup
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { UUIDVersionMetadata } from '../tools/uuid-generator/metadata';

interface InfoPopupProps {
  visible: boolean;
  onClose: () => void;
  metadata: UUIDVersionMetadata;
}

/**
 * A modal popup displaying detailed information about a UUID version
 * 
 * @param {boolean} visible - Whether the popup is visible
 * @param {Function} onClose - Callback when popup is dismissed
 * @param {UUIDVersionMetadata} metadata - The UUID version metadata to display
 * 
 * @example
 * <InfoPopup 
 *   visible={showPopup}
 *   onClose={() => setShowPopup(false)}
 *   metadata={UUID_VERSION_METADATA.v4}
 * />
 */
export const InfoPopup: React.FC<InfoPopupProps> = ({ visible, onClose, metadata }) => {
  const { colors, spacing } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={[styles.popup, { backgroundColor: colors.card }]}
          onStartShouldSetResponder={() => true}
        >
          <ScrollView>
            <View style={{ padding: spacing.l }}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                  UUID {metadata.version.toUpperCase()}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {metadata.name}
                </Text>
              </View>

              {/* Description */}
              <Text style={[styles.description, { color: colors.text }]}>
                {metadata.description}
              </Text>

              {/* Features */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Features
                </Text>
                {metadata.features.map((feature, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                    <Text style={[styles.listText, { color: colors.text }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Use Cases */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Use Cases
                </Text>
                {metadata.useCases.map((useCase, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                    <Text style={[styles.listText, { color: colors.text }]}>
                      {useCase}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.primary }]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  popup: {
    borderRadius: 12,
    maxWidth: 500,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  },
  closeButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
