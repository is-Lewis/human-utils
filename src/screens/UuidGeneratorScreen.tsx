/**
 * UUID Generator Screen
 * 
 * Screen for generating UUIDs with support for multiple versions (v1, v4, v5, v7).
 * Provides an educational UI with info popups and guidance to help users choose
 * the right UUID version for their needs.
 * 
 * @module screens/UuidGeneratorScreen
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { ChevronDown, ChevronRight, Dice5, Database, RefreshCw, Clock } from 'lucide-react-native';
import { Container, InfoButton, InfoPopup } from '../components';
import { useTheme } from '../theme';
import { UUIDVersion, UUID_NAMESPACES } from '../tools/uuid-generator/types';
import { UUID_VERSION_METADATA, HELP_ME_CHOOSE_GUIDE, UUIDVersionMetadata } from '../tools/uuid-generator/metadata';
import { generateUUID, generateV5 } from '../tools/uuid-generator';
import * as Clipboard from 'expo-clipboard';

export const UuidGeneratorScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  
  // State
  const [selectedVersion, setSelectedVersion] = useState<UUIDVersion>('v4');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoMetadata, setInfoMetadata] = useState<UUIDVersionMetadata>(UUID_VERSION_METADATA.v4);
  const [showHelp, setShowHelp] = useState(false);
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);
  const [count, setCount] = useState('1');
  
  // v5 specific state
  const [namespace, setNamespace] = useState<keyof typeof UUID_NAMESPACES>('DNS');
  const [name, setName] = useState('');

  /**
   * Opens the info popup for a specific UUID version
   */
  const handleInfoPress = (version: UUIDVersion) => {
    setInfoMetadata(UUID_VERSION_METADATA[version]);
    setShowInfoPopup(true);
  };

  /**
   * Generates UUIDs based on selected version and options
   */
  const handleGenerate = () => {
    try {
      const numCount = parseInt(count, 10);
      
      if (isNaN(numCount) || numCount < 1 || numCount > 100) {
        Alert.alert('Invalid Count', 'Please enter a number between 1 and 100');
        return;
      }

      // Special handling for v5 (requires namespace and name)
      if (selectedVersion === 'v5') {
        if (!name.trim()) {
          Alert.alert('Name Required', 'Please enter a name for v5 UUID generation');
          return;
        }
        
        const uuids = Array(numCount).fill(null).map(() => 
          generateV5(UUID_NAMESPACES[namespace], name)
        );
        setGeneratedUUIDs(uuids);
      } else {
        const uuids = Array(numCount).fill(null).map(() => 
          generateUUID(selectedVersion)
        );
        setGeneratedUUIDs(uuids);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to generate UUID');
    }
  };

  /**
   * Copies all generated UUIDs to clipboard
   */
  const handleCopyAll = async () => {
    if (generatedUUIDs.length === 0) return;
    
    await Clipboard.setStringAsync(generatedUUIDs.join('\n'));
    Alert.alert('Copied', `${generatedUUIDs.length} UUID(s) copied to clipboard`);
  };

  /**
   * Copies a single UUID to clipboard
   */
  const handleCopySingle = async (uuid: string) => {
    await Clipboard.setStringAsync(uuid);
    Alert.alert('Copied', 'UUID copied to clipboard');
  };

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: spacing.l }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              UUID Generator
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Generate universally unique identifiers
            </Text>
          </View>

          {/* Help Me Choose Section */}
          <TouchableOpacity
            style={[styles.helpSection, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowHelp(!showHelp)}
            activeOpacity={0.7}
          >
            {showHelp ? (
              <ChevronDown size={20} color={colors.primary} style={styles.helpIcon} />
            ) : (
              <ChevronRight size={20} color={colors.primary} style={styles.helpIcon} />
            )}
            <Text style={[styles.helpTitle, { color: colors.text }]}>
              Help me choose
            </Text>
          </TouchableOpacity>

          {showHelp && (
            <View style={[styles.helpContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {HELP_ME_CHOOSE_GUIDE.map((guide, index) => {
                const IconComponent = {
                  Dice5,
                  Database,
                  RefreshCw,
                  Clock
                }[guide.icon];

                return (
                  <View 
                    key={index} 
                    style={[
                      styles.helpItem,
                      { borderBottomColor: colors.border },
                      index === HELP_ME_CHOOSE_GUIDE.length - 1 && styles.helpItemLast
                    ]}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                      <IconComponent size={22} color={colors.primary} />
                    </View>
                    <View style={styles.helpTextContainer}>
                      <Text style={[styles.helpQuestion, { color: colors.text }]}>
                        {guide.question}
                      </Text>
                      <Text style={[styles.helpAnswer, { color: colors.primary }]}>
                        {guide.recommendation}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Version Selector */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.l }]}>
            Select Version
          </Text>

          {(Object.keys(UUID_VERSION_METADATA) as UUIDVersion[]).map((version) => {
            const metadata = UUID_VERSION_METADATA[version];
            const isSelected = selectedVersion === version;

            return (
              <TouchableOpacity
                key={version}
                style={[
                  styles.versionOption,
                  { 
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedVersion(version)}
              >
                <View style={styles.versionHeader}>
                  <View style={styles.versionLeft}>
                    <View style={[
                      styles.radio,
                      { borderColor: isSelected ? colors.primary : colors.border }
                    ]}>
                      {isSelected && (
                        <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.versionTitle, { color: colors.text }]}>
                        {version.toUpperCase()} - {metadata.name}
                      </Text>
                      <Text style={[styles.versionDescription, { color: colors.textSecondary }]}>
                        {metadata.description}
                      </Text>
                    </View>
                  </View>
                  <InfoButton onPress={() => handleInfoPress(version)} />
                </View>
              </TouchableOpacity>
            );
          })}

          {/* v5 Options */}
          {selectedVersion === 'v5' && (
            <View style={[styles.v5Options, { backgroundColor: colors.card }]}>
              <Text style={[styles.optionLabel, { color: colors.text }]}>Namespace</Text>
              <View style={styles.namespaceButtons}>
                {(Object.keys(UUID_NAMESPACES) as (keyof typeof UUID_NAMESPACES)[]).map((ns) => (
                  <TouchableOpacity
                    key={ns}
                    style={[
                      styles.namespaceButton,
                      { 
                        backgroundColor: namespace === ns ? colors.primary : colors.background,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => setNamespace(ns)}
                  >
                    <Text style={[
                      styles.namespaceButtonText,
                      { color: namespace === ns ? '#fff' : colors.text }
                    ]}>
                      {ns}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.optionLabel, { color: colors.text, marginTop: spacing.m }]}>
                Name
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
                placeholder="e.g., example.com"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          )}

          {/* Count Input */}
          <View style={styles.countSection}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>Count</Text>
            <TextInput
              style={[styles.countInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={count}
              onChangeText={setCount}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: colors.primary }]}
            onPress={handleGenerate}
          >
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>

          {/* Generated UUIDs */}
          {generatedUUIDs.length > 0 && (
            <View style={styles.resultsSection}>
              <View style={styles.resultsHeader}>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>
                  Generated UUIDs ({generatedUUIDs.length})
                </Text>
                <TouchableOpacity onPress={handleCopyAll}>
                  <Text style={[styles.copyAllButton, { color: colors.primary }]}>
                    Copy All
                  </Text>
                </TouchableOpacity>
              </View>

              {generatedUUIDs.map((uuid, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.uuidItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => handleCopySingle(uuid)}
                >
                  <Text style={[styles.uuidText, { color: colors.text }]}>
                    {uuid}
                  </Text>
                  <Text style={[styles.tapToCopy, { color: colors.textSecondary }]}>
                    Tap to copy
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Info Popup */}
      <InfoPopup
        visible={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
        metadata={infoMetadata}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  helpIcon: {
    marginRight: 8
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  helpContent: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  helpItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1
  },
  helpItemLast: {
    borderBottomWidth: 0
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  helpTextContainer: {
    flex: 1
  },
  helpQuestion: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4
  },
  helpAnswer: {
    fontSize: 14,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  versionOption: {
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 12,
    padding: 16
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  versionLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
    alignItems: 'flex-start'
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  versionDescription: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
    flexWrap: 'wrap'
  },
  v5Options: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  namespaceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  namespaceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1
  },
  namespaceButtonText: {
    fontSize: 14,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15
  },
  countSection: {
    marginBottom: 20
  },
  countInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    width: 80
  },
  generateButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600'
  },
  resultsSection: {
    marginBottom: 24
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  copyAllButton: {
    fontSize: 15,
    fontWeight: '600'
  },
  uuidItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8
  },
  uuidText: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 4
  },
  tapToCopy: {
    fontSize: 12
  }
});
