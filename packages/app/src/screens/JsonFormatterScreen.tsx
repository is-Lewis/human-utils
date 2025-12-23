/**
 * JSON Formatter/Validator Screen
 *
 * Features:
 * - Format JSON with customizable indentation
 * - Minify JSON (remove whitespace)
 * - Validate JSON with error highlighting
 * - Sort object keys alphabetically
 * - History of recent operations
 * - Copy/share functionality
 * - File upload/download
 *
 * @module screens/JsonFormatterScreen
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import {
  Info,
  CheckCircle,
  Copy,
  X,
  Trash2,
  Clock,
  AlertTriangle,
  Download,
  Settings,
} from 'lucide-react-native';
import { Container, InfoButton } from '../components';
import { useTheme } from '../theme';
import {
  JsonHistoryEntry,
  JSON_INFO,
  formatJson,
  minifyJson,
  validateJson,
  getJsonInfo,
} from '@human-utils/cli';
import { useClipboard, useHistory, useDebounce } from '../hooks';
import { FileService } from '../services/FileService';
import { Logger } from '../services/Logger';
import { showError, showInfo, showSuccess } from '../utils';
import { LIMITS } from '../constants/limits';

export const JsonFormatterScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { copy, paste } = useClipboard();
  const { history, addToHistory } = useHistory<JsonHistoryEntry>(LIMITS.HISTORY.MAX_ITEMS);

  // State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Options
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [escapeUnicode, setEscapeUnicode] = useState(false);

  // Debounced validation to avoid expensive operations on every keystroke
  const debouncedInput = useDebounce(inputText, LIMITS.PERFORMANCE.VALIDATION_DEBOUNCE_MS);

  // Validation state - runs on debounced input
  const validation = useMemo(() => {
    if (!debouncedInput.trim()) return null;
    const timer = Logger.startTimer('JSON validation');
    const result = validateJson(debouncedInput);
    timer();
    return result;
  }, [debouncedInput]);

  // JSON info
  const jsonInfo = useMemo(() => {
    if (!validation?.valid) return null;
    return getJsonInfo(debouncedInput);
  }, [debouncedInput, validation]);

  /**
   * Format JSON
   */
  const handleFormat = () => {
    if (!inputText.trim()) {
      showError('Please enter JSON to process');
      return;
    }

    const timer = Logger.startTimer('JSON format');
    const result = formatJson(inputText, { indentSize, sortKeys, escapeUnicode });
    timer();

    if (!result.success) {
      showError(result.error || 'Failed to format JSON', {
        context: { indentSize, sortKeys, escapeUnicode },
      });
      return;
    }

    setOutputText(result.output!);
    addToHistory({
      operation: 'format',
      input: inputText.substring(0, LIMITS.HISTORY.PREVIEW_LENGTH),
      output: result.output!.substring(0, LIMITS.HISTORY.PREVIEW_LENGTH),
      options: { indentSize, sortKeys, escapeUnicode },
    });

    Logger.logUserAction('json_format', {
      indentSize,
      sortKeys,
      escapeUnicode,
      originalSize: result.originalSize,
      formattedSize: result.formattedSize,
    });
  };

  /**
   * Minify JSON
   */
  const handleMinify = () => {
    if (!inputText.trim()) {
      showError('Please enter JSON to process');
      return;
    }

    const timer = Logger.startTimer('JSON minify');
    const result = minifyJson(inputText);
    timer();

    if (!result.success) {
      showError(result.error || 'Failed to minify JSON');
      return;
    }

    setOutputText(result.output!);
    addToHistory({
      operation: 'minify',
      input: inputText.substring(0, LIMITS.HISTORY.PREVIEW_LENGTH),
      output: result.output!.substring(0, LIMITS.HISTORY.PREVIEW_LENGTH),
      options: { indentSize, sortKeys, escapeUnicode },
    });

    Logger.logUserAction('json_minify', {
      originalSize: result.originalSize,
      minifiedSize: result.output!.length,
    });
  };

  /**
   * Validate JSON
   */
  const handleValidate = () => {
    if (!inputText.trim()) {
      showError('Please enter JSON to process');
      return;
    }

    Logger.logUserAction('json_validate');
    const result = validateJson(inputText);

    if (result.valid) {
      showInfo('The JSON syntax is correct');
    } else {
      const message = result.errorLine
        ? `${result.error}\n\nLine: ${result.errorLine}, Column: ${result.errorColumn}`
        : result.error;
      showError(message || 'Invalid JSON');
    }
  };

  /**
   * Pick and load JSON file
   */
  const handlePickFile = async () => {
    try {
      Logger.logUserAction('json_pick_file');

      const result = await FileService.pickFile({
        maxSizeMB: LIMITS.FILE.MAX_SIZE_MB,
      });

      if (!result) {
        return;
      }

      setInputText(result.content);
      setOutputText('');

      Logger.info('JSON file loaded', { size: result.content.length });
    } catch (error) {
      Logger.error('Failed to pick JSON file', error as Error);
      showError('Failed to load file');
    }
  };

  /**
   * Download/Save output
   */
  const handleDownload = async () => {
    if (!outputText) {
      showError('Please format or minify JSON first');
      return;
    }

    try {
      Logger.logUserAction('json_download');
      const timer = Logger.startTimer('JSON download');

      await FileService.downloadFile(
        outputText,
        `formatted-${Date.now()}.json`,
        'application/json'
      );

      timer();
    } catch (error) {
      Logger.error('Failed to download JSON', error as Error);
      showError('Failed to download file');
    }
  };

  /**
   * Clears all inputs and outputs
   */
  const handleClear = () => {
    Logger.logUserAction('json_clear');
    setInputText('');
    setOutputText('');
  };

  /**
   * Copies output to clipboard
   */
  const handleCopyOutput = async () => {
    if (!outputText) return;
    await copy(outputText, 'Output copied to clipboard');
    Logger.logUserAction('json_copy_output', { length: outputText.length });
  };

  /**
   * Pastes from clipboard to input
   */
  const handlePasteInput = async () => {
    const text = await paste();
    if (text) {
      setInputText(text);
      setOutputText('');
      Logger.logUserAction('json_paste_input', { length: text.length });
    }
  };

  /**
   * Load from history
   */
  const handleLoadHistory = (entry: JsonHistoryEntry) => {
    Logger.logUserAction('json_load_history');
    setInputText(entry.input);
    setIndentSize(entry.options?.indentSize || 2);
    setSortKeys(entry.options?.sortKeys || false);
    setEscapeUnicode(entry.options?.escapeUnicode || false);
    setShowHistory(false);
  };

  /**
   * Clear all history
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
              <Text style={[styles.title, { color: colors.text }]}>JSON Formatter</Text>
              <InfoButton onPress={() => setShowInfoPopup(true)} />
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Format, validate & minify JSON
            </Text>
          </View>

          {/* Validation Status */}
          {inputText && validation && (
            <View
              style={[
                styles.statusBanner,
                {
                  backgroundColor: validation.valid ? '#10B98115' : '#EF444415',
                  borderColor: validation.valid ? '#10B981' : '#EF4444',
                },
              ]}
            >
              {validation.valid ? (
                <>
                  <CheckCircle size={18} color="#10B981" style={styles.statusIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.statusText, { color: '#10B981' }]}>
                      Valid JSON{jsonInfo ? ` • ${jsonInfo.type}` : ''}
                      {jsonInfo?.keys ? ` • ${jsonInfo.keys} keys` : ''}
                      {jsonInfo?.items ? ` • ${jsonInfo.items} items` : ''}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} color="#EF4444" style={styles.statusIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.statusText, { color: '#EF4444' }]}>Invalid JSON</Text>
                    {validation.errorLine && (
                      <Text style={[styles.errorDetail, { color: '#EF4444' }]}>
                        Line {validation.errorLine}, Column {validation.errorColumn}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          )}

          {/* Top Actions */}
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => setShowOptions(true)}
              accessibilityLabel="Open formatting options"
              accessibilityRole="button"
            >
              <Settings size={16} color={colors.primary} />
              <Text style={[styles.optionsButtonText, { color: colors.primary }]}>Options</Text>
            </TouchableOpacity>

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
          </View>

          {/* Input Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Input JSON</Text>
              <View style={styles.sectionActions}>
                <TouchableOpacity
                  onPress={handlePasteInput}
                  style={styles.actionButton}
                  accessibilityLabel="Paste JSON from clipboard"
                  accessibilityRole="button"
                >
                  <Text style={[styles.actionText, { color: colors.primary }]}>Paste</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePickFile}
                  style={styles.actionButton}
                  accessibilityLabel="Pick JSON file"
                  accessibilityRole="button"
                >
                  <Text style={[styles.actionText, { color: colors.primary }]}>File</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: validation && !validation.valid ? '#EF4444' : colors.border,
                },
              ]}
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setOutputText('');
              }}
              placeholder='Enter or paste JSON here...\n\n{\n  "example": "value"\n}'
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.infoRow}>
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {inputText.length} characters
              </Text>
              {validation?.error && (
                <Text style={[styles.errorText, { color: '#EF4444' }]} numberOfLines={1}>
                  {validation.error}
                </Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.primary, opacity: validation?.valid ? 1 : 0.5 },
              ]}
              onPress={handleFormat}
              disabled={!validation?.valid}
              accessibilityLabel="Format JSON"
              accessibilityRole="button"
              accessibilityState={{ disabled: !validation?.valid }}
            >
              <Text style={styles.actionBtnText}>Format</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.primary, opacity: validation?.valid ? 1 : 0.5 },
              ]}
              onPress={handleMinify}
              disabled={!validation?.valid}
              accessibilityLabel="Minify JSON"
              accessibilityRole="button"
              accessibilityState={{ disabled: !validation?.valid }}
            >
              <Text style={styles.actionBtnText}>Minify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.validateBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={handleValidate}
              accessibilityLabel="Validate JSON"
              accessibilityRole="button"
            >
              <Text style={[styles.validateBtnText, { color: colors.text }]}>Validate</Text>
            </TouchableOpacity>

            {(inputText || outputText) && (
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={handleClear}
                accessibilityLabel="Clear all"
                accessibilityRole="button"
              >
                <Trash2 size={18} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>

          {/* Output Section */}
          {outputText && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Output</Text>
                  <CheckCircle size={16} color="#10B981" style={styles.successIcon} />
                </View>
                <View style={styles.sectionActions}>
                  <TouchableOpacity
                    onPress={handleCopyOutput}
                    style={styles.actionButton}
                    accessibilityLabel="Copy output to clipboard"
                    accessibilityRole="button"
                  >
                    <Copy size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDownload}
                    style={styles.actionButton}
                    accessibilityLabel="Download JSON"
                    accessibilityRole="button"
                  >
                    <Download size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.outputBox,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text style={[styles.outputText, { color: colors.text }]} selectable>
                    {outputText}
                  </Text>
                </ScrollView>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {outputText.length} characters
                </Text>
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {((new Blob([outputText]).size / new Blob([inputText]).size) * 100).toFixed(0)}%
                  of original
                </Text>
              </View>
            </View>
          )}

          {/* Info Card */}
          <View
            style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Info size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Current Settings</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Indent: {indentSize} spaces • Sort keys: {sortKeys ? 'Yes' : 'No'} • Escape unicode:{' '}
                {escapeUnicode ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsModal} onStartShouldSetResponder={() => true}>
            <View style={[styles.optionsCard, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Format Options</Text>
                <TouchableOpacity onPress={() => setShowOptions(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.optionItem}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Indentation</Text>
                <View style={styles.segmentControl}>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      {
                        backgroundColor: indentSize === 2 ? colors.primary : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setIndentSize(2)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        { color: indentSize === 2 ? '#fff' : colors.text },
                      ]}
                    >
                      2 spaces
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      {
                        backgroundColor: indentSize === 4 ? colors.primary : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setIndentSize(4)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        { color: indentSize === 4 ? '#fff' : colors.text },
                      ]}
                    >
                      4 spaces
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.optionItem}>
                <View style={styles.optionRow}>
                  <View>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>Sort Keys</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                      Sort object keys alphabetically
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      { backgroundColor: sortKeys ? colors.primary : colors.border },
                    ]}
                    onPress={() => setSortKeys(!sortKeys)}
                  >
                    <View style={[styles.toggleThumb, { marginLeft: sortKeys ? 20 : 0 }]} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.optionItem}>
                <View style={styles.optionRow}>
                  <View>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>Escape Unicode</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                      Convert unicode to \uXXXX format
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      { backgroundColor: escapeUnicode ? colors.primary : colors.border },
                    ]}
                    onPress={() => setEscapeUnicode(!escapeUnicode)}
                  >
                    <View style={[styles.toggleThumb, { marginLeft: escapeUnicode ? 20 : 0 }]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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
                <Text style={[styles.modalTitle, { color: colors.text }]}>Recent Operations</Text>
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
                        {entry.operation.toUpperCase()}
                      </Text>
                      <Text style={[styles.historyTime, { color: colors.textSecondary }]}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text
                      style={[styles.historyText, { color: colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {entry.input}
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
                <Text style={[styles.modalTitle, { color: colors.text }]}>{JSON_INFO.title}</Text>
                <TouchableOpacity onPress={() => setShowInfoPopup(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  {JSON_INFO.description}
                </Text>

                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Common Use Cases
                </Text>
                {JSON_INFO.useCases.map((useCase, index) => (
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
                  {JSON_INFO.technicalDetails.title}
                </Text>
                {JSON_INFO.technicalDetails.points.map((point, index) => (
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  statusIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorDetail: {
    fontSize: 12,
    marginTop: 2,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  optionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
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
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginLeft: 6,
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
    minHeight: 180,
    fontFamily: 'monospace',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  charCount: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  validateBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  validateBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outputBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  outputText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
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
  technicalPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  optionsModal: {
    width: '90%',
    maxHeight: '70%',
  },
  optionsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  optionItem: {
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  segmentControl: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
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
  },
});
