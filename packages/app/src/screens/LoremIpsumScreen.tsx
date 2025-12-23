/**
 * Lorem Ipsum Generator Screen
 *
 * Features:
 * - Generate by words, sentences, or paragraphs
 * - Option to start with "Lorem ipsum dolor sit amet"
 * - HTML paragraph tags option
 * - Real-time word/character/paragraph count
 * - Quick copy functionality
 * - Adjustable count with slider
 *
 * @module screens/LoremIpsumScreen
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Copy, Info, X, RefreshCw, Type, FileText, List } from 'lucide-react-native';
import { Container, InfoButton } from '../components';
import { useTheme } from '../theme';
import { LoremUnit, LOREM_INFO, generateLorem } from '@human-utils/cli';
import { useClipboard } from '../hooks';
import { LIMITS } from '../constants/limits';
import { Logger } from '../services/Logger';
import Slider from '@react-native-community/slider';

export const LoremIpsumScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { copy } = useClipboard();

  // State
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [htmlParagraphs, setHtmlParagraphs] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Generate lorem ipsum
  const result = useMemo(() => {
    const timer = Logger.startTimer('Lorem generation');
    const generated = generateLorem({
      count,
      unit,
      startWithLorem,
      htmlParagraphs: unit === 'paragraphs' && htmlParagraphs,
    });
    timer();
    return generated;
    // refreshKey intentionally included to trigger regeneration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, unit, startWithLorem, htmlParagraphs, refreshKey]);

  // Get max count based on unit using constants
  const maxCount =
    unit === 'words'
      ? LIMITS.LOREM.MAX_WORDS
      : unit === 'sentences'
        ? LIMITS.LOREM.MAX_SENTENCES
        : LIMITS.LOREM.MAX_PARAGRAPHS;
  const minCount = LIMITS.LOREM.MIN_COUNT;

  /**
   * Copy to clipboard using reusable hook
   */
  const handleCopy = async () => {
    Logger.logUserAction('lorem_copy', {
      unit,
      count,
      wordCount: result.wordCount,
    });
    await copy(result.text, 'Copied to clipboard');
  };

  /**
   * Regenerate text
   */
  const handleRegenerate = () => {
    Logger.logUserAction('lorem_regenerate', { unit, count });
    setRefreshKey((prev) => prev + 1);
  };

  /**
   * Quick preset buttons
   */
  const handleApplyPreset = (newUnit: LoremUnit, newCount: number) => {
    Logger.logUserAction('lorem_preset', { unit: newUnit, count: newCount });
    setUnit(newUnit);
    setCount(newCount);
  };

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: spacing.l }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.title, { color: colors.text }]}>Lorem Ipsum Generator</Text>
              <InfoButton onPress={() => setShowInfoPopup(true)} />
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Generate placeholder text for designs
            </Text>
          </View>

          {/* Unit Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Generate By</Text>
            <View style={styles.unitButtons}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'words' ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setUnit('words')}
                accessibilityLabel="Generate by words"
                accessibilityRole="tab"
                accessibilityState={{ selected: unit === 'words' }}
              >
                <Type size={18} color={unit === 'words' ? '#fff' : colors.text} />
                <Text
                  style={[
                    styles.unitButtonText,
                    { color: unit === 'words' ? '#fff' : colors.text },
                  ]}
                >
                  Words
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'sentences' ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setUnit('sentences')}
                accessibilityLabel="Generate by sentences"
                accessibilityRole="tab"
                accessibilityState={{ selected: unit === 'sentences' }}
              >
                <List size={18} color={unit === 'sentences' ? '#fff' : colors.text} />
                <Text
                  style={[
                    styles.unitButtonText,
                    { color: unit === 'sentences' ? '#fff' : colors.text },
                  ]}
                >
                  Sentences
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitButton,
                  {
                    backgroundColor: unit === 'paragraphs' ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setUnit('paragraphs')}
                accessibilityLabel="Generate by paragraphs"
                accessibilityRole="tab"
                accessibilityState={{ selected: unit === 'paragraphs' }}
              >
                <FileText size={18} color={unit === 'paragraphs' ? '#fff' : colors.text} />
                <Text
                  style={[
                    styles.unitButtonText,
                    { color: unit === 'paragraphs' ? '#fff' : colors.text },
                  ]}
                >
                  Paragraphs
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Count Slider */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Count: {count}</Text>
              <Text style={[styles.sliderRange, { color: colors.textSecondary }]}>
                {minCount} - {maxCount}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={minCount}
              maximumValue={maxCount}
              step={1}
              value={count}
              onValueChange={setCount}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
          </View>

          {/* Quick Presets */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Presets</Text>
            <View style={styles.presetButtons}>
              <TouchableOpacity
                style={[
                  styles.presetButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleApplyPreset('words', 50)}
                accessibilityLabel="Apply 50 words preset"
                accessibilityRole="button"
              >
                <Text style={[styles.presetText, { color: colors.text }]}>50 Words</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.presetButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleApplyPreset('words', 150)}
                accessibilityLabel="Apply 150 words preset"
                accessibilityRole="button"
              >
                <Text style={[styles.presetText, { color: colors.text }]}>150 Words</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.presetButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleApplyPreset('sentences', 5)}
                accessibilityLabel="Apply 5 sentences preset"
                accessibilityRole="button"
              >
                <Text style={[styles.presetText, { color: colors.text }]}>5 Sentences</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.presetButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleApplyPreset('paragraphs', 3)}
                accessibilityLabel="Apply 3 paragraphs preset"
                accessibilityRole="button"
              >
                <Text style={[styles.presetText, { color: colors.text }]}>3 Paragraphs</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Options</Text>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => setStartWithLorem(!startWithLorem)}
              accessibilityLabel={`Start with Lorem ipsum ${startWithLorem ? 'enabled' : 'disabled'}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: startWithLorem }}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: colors.border,
                    backgroundColor: startWithLorem ? colors.primary : 'transparent',
                  },
                ]}
              >
                {startWithLorem && <View style={styles.checkmark} />}
              </View>
              <Text style={[styles.optionText, { color: colors.text }]}>
                Start with &quot;Lorem ipsum&quot;
              </Text>
            </TouchableOpacity>

            {unit === 'paragraphs' && (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setHtmlParagraphs(!htmlParagraphs)}
                accessibilityLabel={`Wrap in HTML paragraph tags ${htmlParagraphs ? 'enabled' : 'disabled'}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: htmlParagraphs }}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: colors.border,
                      backgroundColor: htmlParagraphs ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {htmlParagraphs && <View style={styles.checkmark} />}
                </View>
                <Text style={[styles.optionText, { color: colors.text }]}>
                  Wrap in {'<p>'} tags (HTML)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Generated Text */}
          <View style={styles.section}>
            <View style={styles.outputHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Generated Text</Text>
              <View style={styles.outputActions}>
                <TouchableOpacity
                  onPress={handleRegenerate}
                  style={styles.actionButton}
                  accessibilityLabel="Regenerate lorem ipsum text"
                  accessibilityRole="button"
                >
                  <RefreshCw size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={styles.actionButton}
                  accessibilityLabel="Copy generated text to clipboard"
                  accessibilityRole="button"
                >
                  <Copy size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.outputBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <ScrollView style={styles.outputScroll} nestedScrollEnabled>
                <Text style={[styles.outputText, { color: colors.text }]} selectable>
                  {result.text}
                </Text>
              </ScrollView>
            </View>

            {/* Statistics */}
            <View style={styles.stats}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {result.wordCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Words</Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {result.charCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Characters</Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {result.paragraphCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Paragraphs</Text>
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View
            style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Info size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>What is Lorem Ipsum?</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Placeholder text used in design mockups since the 1500s. Tap the info button above
                to learn more.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Info Popup */}
      <Modal
        visible={showInfoPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoPopup(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInfoPopup(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{LOREM_INFO.title}</Text>
                <TouchableOpacity onPress={() => setShowInfoPopup(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  {LOREM_INFO.description}
                </Text>

                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Common Use Cases
                </Text>
                {LOREM_INFO.useCases.map((useCase, index) => (
                  <View key={index} style={styles.useCaseItem}>
                    <Text style={[styles.useCaseTitle, { color: colors.text }]}>
                      • {useCase.title}
                    </Text>
                    <Text style={[styles.useCaseDescription, { color: colors.textSecondary }]}>
                      {useCase.description}
                    </Text>
                  </View>
                ))}

                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  {LOREM_INFO.history.title}
                </Text>
                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  {LOREM_INFO.history.text}
                </Text>
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderRange: {
    fontSize: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 15,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  outputActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  outputBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  outputScroll: {
    maxHeight: 300,
  },
  outputText: {
    fontSize: 14,
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  useCaseItem: {
    marginBottom: 12,
  },
  useCaseTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  useCaseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
});
