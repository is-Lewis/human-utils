/**
 * URL Encoder Screen Component
 *
 * Provides an interactive interface for encoding and decoding URLs and URL components.
 * Features automatic operation switching, conversion history, and clipboard integration.
 *
 * @module screens/UrlEncoderScreen
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Copy, X, Trash2, Clock, ArrowRightLeft, RefreshCw } from 'lucide-react-native';
import { Container, InfoButton } from '../components';
import { useTheme } from '../theme';
import { useClipboard, useHistory, useDebounce } from '../hooks';
import { LIMITS } from '../constants/limits';
import {
  UrlOperation,
  UrlHistoryEntry,
  URL_ENCODER_INFO,
  processUrl,
} from '@human-utils/cli';
import { Logger } from '../services/Logger';
import { showError } from '../utils';
import { Picker } from '@react-native-picker/picker';

const OPERATION_OPTIONS: { value: UrlOperation; label: string; example: string }[] = [
  { value: 'encode', label: 'Encode', example: 'Hello World → Hello%20World' },
  { value: 'decode', label: 'Decode', example: 'Hello%20World → Hello World' },
];

export const UrlEncoderScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { copy, paste } = useClipboard();
  const { history, addToHistory } = useHistory<UrlHistoryEntry>(LIMITS.HISTORY.MAX_ITEMS);

  // State
  const [inputText, setInputText] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<UrlOperation>('encode');
  const [outputText, setOutputText] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [livePreview, setLivePreview] = useState('');

  // Debounced input for live preview
  const debouncedInput = useDebounce(inputText, 300);

  // Live preview effect
  React.useEffect(() => {
    if (debouncedInput.trim()) {
      const result = processUrl(debouncedInput, selectedOperation);
      if (result.success) {
        setLivePreview(result.output);
      }
    } else {
      setLivePreview('');
    }
  }, [debouncedInput, selectedOperation]);

  /**
   * Converts the input text using the selected operation.
   */
  const handleConvert = () => {
    if (!inputText.trim()) {
      showError('Please enter text to process');
      return;
    }

    const timer = Logger.startTimer('URL conversion');
    const result = processUrl(inputText, selectedOperation);
    timer();

    if (!result.success) {
      showError(result.error || 'Failed to process URL', {
        context: { operation: selectedOperation, inputLength: inputText.length },
      });
      return;
    }

    setOutputText(result.output);
    addToHistory({
      input: inputText.substring(0, LIMITS.HISTORY.PREVIEW_LENGTH),
      output: result.output.substring(0, LIMITS.HISTORY.PREVIEW_LENGTH),
      operation: selectedOperation,
    });

    Logger.logUserAction('url_convert', {
      operation: selectedOperation,
      length: inputText.length,
    });
  };

  /**
   * Swaps input and output text for chained conversions.
   */
  const handleSwap = () => {
    if (!outputText) return;
    Logger.logUserAction('url_swap');
    setInputText(outputText);
    setOutputText('');
    // Auto-toggle operation
    setSelectedOperation(selectedOperation === 'encode' ? 'decode' : 'encode');
  };

  /**
   * Clears all input and output text fields.
   */
  const handleClear = () => {
    Logger.logUserAction('url_clear');
    setInputText('');
    setOutputText('');
  };

  /**
   * Copies the converted output text to the system clipboard.
   */
  const handleCopyOutput = async () => {
    if (!outputText) return;
    await copy(outputText, 'Output copied to clipboard');
    Logger.logUserAction('url_copy_output', { length: outputText.length });
  };

  /**
   * Pastes text from the system clipboard into the input field.
   */
  const handlePasteInput = async () => {
    const text = await paste();
    if (text) {
      setInputText(text);
      setOutputText('');
      Logger.logUserAction('url_paste_input', { length: text.length });
    }
  };

  /**
   * Loads a previous conversion from history into the current session.
   */
  const handleLoadHistory = (entry: UrlHistoryEntry) => {
    Logger.logUserAction('url_load_history');
    setInputText(entry.input);
    setSelectedOperation(entry.operation);
    setShowHistory(false);
  };

  /**
   * Clears all conversion history entries.
   */
  const handleClearHistory = () => {
    history.splice(0, history.length);
    setShowHistory(false);
  };

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: spacing.l }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.title, { color: colors.text }]}>URL Encoder</Text>
              <InfoButton onPress={() => setShowInfoPopup(true)} />
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Encode or decode URLs and components
            </Text>
          </View>

          {/* History Button */}
          {history.length > 0 && (
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setShowHistory(true)}
              accessibilityLabel={`View history, ${history.length} items`}
              accessibilityRole="button"
            >
              <Clock size={16} color={colors.primary} />
              <Text style={[styles.historyButtonText, { color: colors.primary }]}>
                History ({history.length})
              </Text>
            </TouchableOpacity>
          )}

          {/* Input Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Input Text</Text>
              <TouchableOpacity
                onPress={handlePasteInput}
                style={styles.actionButton}
                accessibilityLabel="Paste from clipboard"
                accessibilityRole="button"
              >
                <Text style={[styles.actionText, { color: colors.primary }]}>Paste</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              ]}
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setOutputText('');
              }}
              placeholder="Enter or paste URL or text here..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {inputText.length} characters
            </Text>
          </View>

          {/* Operation Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Operation</Text>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Picker
                selectedValue={selectedOperation}
                onValueChange={(value) => setSelectedOperation(value as UrlOperation)}
                style={[styles.picker, { color: colors.text, backgroundColor: colors.card }]}
                dropdownIconColor={colors.text}
                itemStyle={{ color: colors.text }}
              >
                {OPERATION_OPTIONS.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={`${option.label} (${option.example})`}
                    value={option.value}
                    color={colors.text}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Live Preview */}
          {livePreview && !outputText && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
                <Text style={[styles.previewBadge, { color: colors.textSecondary }]}>Live</Text>
              </View>
              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.previewText, { color: colors.textSecondary }]} selectable>
                  {livePreview}
                </Text>
              </View>
            </View>
          )}

          {/* Convert Button */}
          <TouchableOpacity
            style={[
              styles.convertButton,
              { backgroundColor: colors.primary, opacity: inputText.trim() ? 1 : 0.5 },
            ]}
            onPress={handleConvert}
            disabled={!inputText.trim()}
            accessibilityLabel={`${selectedOperation} URL`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !inputText.trim() }}
          >
            <ArrowRightLeft size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.convertButtonText}>
              {selectedOperation === 'encode' ? 'Encode' : 'Decode'} URL
            </Text>
          </TouchableOpacity>

          {/* Output Section */}
          {outputText && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Output</Text>
                <View style={styles.outputActions}>
                  <TouchableOpacity
                    onPress={handleSwap}
                    style={styles.actionButton}
                    accessibilityLabel="Swap input/output"
                    accessibilityRole="button"
                  >
                    <RefreshCw size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCopyOutput}
                    style={styles.actionButton}
                    accessibilityLabel="Copy output"
                    accessibilityRole="button"
                  >
                    <Copy size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleClear}
                    style={styles.actionButton}
                    accessibilityLabel="Clear all"
                    accessibilityRole="button"
                  >
                    <Trash2 size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.outputBox,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.outputText, { color: colors.text }]} selectable>
                  {outputText}
                </Text>
              </View>

              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {outputText.length} characters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHistory(false)}
        >
          <View style={styles.historyModal} onStartShouldSetResponder={() => true}>
            <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Recent Conversions</Text>
                <View style={styles.historyActions}>
                  <TouchableOpacity onPress={handleClearHistory} style={{ marginRight: 12 }}>
                    <Trash2 size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowHistory(false)}>
                    <X size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={styles.historyScroll}>
                {history.map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={[styles.historyItem, { borderColor: colors.border }]}
                    onPress={() => handleLoadHistory(entry)}
                  >
                    <View style={styles.historyItemHeader}>
                      <Text style={[styles.historyOperation, { color: colors.primary }]}>
                        {entry.operation === 'encode' ? '→ Encode' : '← Decode'}
                      </Text>
                      <Text style={[styles.historyTime, { color: colors.textSecondary }]}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={[styles.historyText, { color: colors.text }]} numberOfLines={1}>
                      {entry.input}
                    </Text>
                    <Text
                      style={[styles.historyOutput, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {entry.output}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {URL_ENCODER_INFO.title}
                </Text>
                <TouchableOpacity onPress={() => setShowInfoPopup(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  {URL_ENCODER_INFO.description}
                </Text>

                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Common Use Cases
                </Text>
                {URL_ENCODER_INFO.useCases.map((useCase, index) => (
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
                  {URL_ENCODER_INFO.technicalDetails.title}
                </Text>
                {URL_ENCODER_INFO.technicalDetails.points.map((point, index) => (
                  <Text
                    key={index}
                    style={[styles.technicalPoint, { color: colors.textSecondary }]}
                  >
                    • {point}
                  </Text>
                ))}
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
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 16,
    gap: 4,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    fontFamily: 'monospace',
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  picker: {
    height: 54,
    fontSize: 16,
    borderWidth: 0,
  },
  previewBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    borderStyle: 'dashed',
  },
  previewText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontStyle: 'italic',
  },
  previewBadge: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outputActions: {
    flexDirection: 'row',
    gap: 12,
  },
  outputBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  outputText: {
    fontSize: 14,
    fontFamily: 'monospace',
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
  technicalPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  historyModal: {
    width: '90%',
    maxHeight: '70%',
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyScroll: {
    maxHeight: 400,
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyOperation: {
    fontSize: 13,
    fontWeight: '600',
  },
  historyTime: {
    fontSize: 12,
  },
  historyText: {
    fontSize: 13,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  historyOutput: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
