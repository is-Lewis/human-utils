/**
 * Base64 Encoder/Decoder Screen - Enhanced
 * 
 * Advanced Base64 encoding/decoding with:
 * - File upload/download support
 * - Auto-detection of Base64 format
 * - URL-safe Base64 option
 * - Batch processing (multi-line)
 * - Conversion history
 * - Size comparison visualization
 * - Quick actions (copy & clear, share)
 * 
 * @module screens/Base64EncoderScreen
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Share, Platform } from 'react-native';
import { ArrowRightLeft, Info, CheckCircle, Copy, X, Trash2, Clock, AlertTriangle, FileText, Download, Share2 } from 'lucide-react-native';
import { Container, InfoButton } from '../components';
import { useTheme } from '../theme';
import { 
  Base64Operation, 
  Base64HistoryEntry,
  BASE64_INFO,
  encodeToBase64, 
  decodeFromBase64, 
  isValidBase64, 
  detectBase64, 
  processBatch 
} from '@human-utils/cli';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';

const MAX_HISTORY = 10;

export const Base64EncoderScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  
  // State
  const [operation, setOperation] = useState<Base64Operation>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [history, setHistory] = useState<Base64HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Auto-detect Base64 in input (Feature 3)
  const isLikelyBase64 = useMemo(() => {
    if (!inputText || inputText.length < 10) return false;
    return detectBase64(inputText);
  }, [inputText]);

  // Calculate sizes and efficiency (Feature 7)
  const inputSize = useMemo(() => new Blob([inputText]).size, [inputText]);
  const outputSize = useMemo(() => new Blob([outputText]).size, [outputText]);
  const sizeRatio = useMemo(() => {
    if (!inputSize || !outputSize) return 0;
    return ((outputSize / inputSize) * 100).toFixed(1);
  }, [inputSize, outputSize]);

  /**
   * Add entry to history (Feature 6)
   */
  const addToHistory = (input: string, output: string, op: Base64Operation) => {
    const entry: Base64HistoryEntry = {
      id: Date.now().toString(),
      operation: op,
      input: input.substring(0, 100),
      output: output.substring(0, 100),
      timestamp: Date.now(),
      urlSafe
    };
    
    setHistory(prev => [entry, ...prev].slice(0, MAX_HISTORY));
  };

  /**
   * Processes the input based on selected operation
   */
  const handleProcess = () => {
    if (!inputText.trim()) {
      Alert.alert('Input Required', 'Please enter some text to process');
      return;
    }

    try {
      let result: string;
      
      if (batchMode) {
        // Batch processing (Feature 5)
        const results = processBatch(inputText, operation, { urlSafe });
        const outputs = results.map(r => r.success ? r.output : `ERROR: ${r.error}`);
        result = outputs.join('\n');
        
        const failedCount = results.filter(r => !r.success).length;
        if (failedCount > 0) {
          Alert.alert('Batch Complete', `Processed ${results.length} lines\n${failedCount} failed`);
        }
      } else {
        // Single processing
        if (operation === 'encode') {
          result = encodeToBase64(inputText, { urlSafe }); // Feature 4: URL-safe
        } else {
          if (!isValidBase64(inputText.trim())) {
            Alert.alert('Invalid Base64', 'The input is not valid Base64 format');
            return;
          }
          result = decodeFromBase64(inputText);
        }
      }
      
      setOutputText(result);
      setHasProcessed(true);
      addToHistory(inputText, result, operation);
      setFileName(null);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to process text');
    }
  };

  /**
   * Pick and encode file (Feature 2)
   */
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });
      
      if (result.canceled) return;
      
      const asset = result.assets[0];
      
      // Check file size (limit to 1MB)
      if (asset.size && asset.size > 1024 * 1024) {
        Alert.alert('File Too Large', 'Please select a file smaller than 1MB');
        return;
      }
      
      // Read file content as text
      const response = await fetch(asset.uri);
      const text = await response.text();
      
      setInputText(text);
      setFileName(asset.name);
      setHasProcessed(false);
      setOutputText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to load file');
    }
  };

  /**
   * Download/Save output (Feature 2)
   */
  const handleDownload = async () => {
    if (!outputText) {
      Alert.alert('No Output', 'Please encode or decode some text first');
      return;
    }
    
    try {
      // Check if running on web
      if (Platform.OS === 'web') {
        // Create a blob and download on web
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `base64-output-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Use Share API on mobile
        const result = await Share.share({
          message: outputText,
          title: 'Base64 Output'
        });
        
        if (result.action === Share.sharedAction) {
          console.log('Shared successfully');
        }
      }
    } catch (error) {
      console.error('Download/Share error:', error);
      Alert.alert('Error', `Failed to download/share: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Switches between encode and decode
   */
  const handleSwitchOperation = () => {
    const newOperation: Base64Operation = operation === 'encode' ? 'decode' : 'encode';
    setOperation(newOperation);
    
    if (hasProcessed && outputText) {
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  /**
   * Clears all inputs and outputs
   */
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setHasProcessed(false);
    setFileName(null);
  };

  /**
   * Copies output to clipboard
   */
  const handleCopyOutput = async () => {
    if (!outputText) return;
    await Clipboard.setStringAsync(outputText);
    Alert.alert('Copied', 'Output copied to clipboard');
  };

  /**
   * Copy and clear (Feature 8)
   */
  const handleCopyAndClear = async () => {
    if (!outputText) return;
    await Clipboard.setStringAsync(outputText);
    handleClear();
    Alert.alert('Copied & Cleared', 'Output copied and inputs cleared');
  };

  /**
   * Share output (Feature 8)
   */
  const handleShare = async () => {
    if (!outputText) return;
    
    try {
      if (Platform.OS === 'web') {
        // On web, copy to clipboard
        await Clipboard.setStringAsync(outputText);
        Alert.alert('Copied!', 'Output copied to clipboard');
      } else {
        // On mobile, use native share
        await Share.share({
          message: outputText,
          title: 'Base64 Output'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  /**
   * Pastes from clipboard to input
   */
  const handlePasteInput = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setInputText(text);
      setHasProcessed(false);
      setOutputText('');
      setFileName(null);
    }
  };

  /**
   * Load from history (Feature 6)
   */
  const handleLoadHistory = (entry: Base64HistoryEntry) => {
    setInputText(entry.input);
    setOperation(entry.operation);
    setUrlSafe(entry.urlSafe || false);
    setShowHistory(false);
  };

  /**
   * Clear history (Feature 6)
   */
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setHistory([]) }
      ]
    );
  };

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: spacing.l }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.title, { color: colors.text }]}>
                Base64 Encoder/Decoder
              </Text>
              <InfoButton onPress={() => setShowInfoPopup(true)} />
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Advanced encoding with smart features
            </Text>
          </View>

          {/* Auto-detection warning (Feature 3) */}
          {isLikelyBase64 && operation === 'encode' && (
            <View style={[styles.warningBanner, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B' }]}>
              <AlertTriangle size={18} color="#F59E0B" style={styles.warningIcon} />
              <Text style={[styles.warningText, { color: '#F59E0B' }]}>
                Input looks like Base64. Switch to decode?
              </Text>
              <TouchableOpacity onPress={() => setOperation('decode')}>
                <Text style={[styles.warningAction, { color: '#F59E0B' }]}>Switch</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Operation Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  backgroundColor: operation === 'encode' ? colors.primary : colors.card,
                  borderColor: colors.border
                }
              ]}
              onPress={() => {
                setOperation('encode');
                setHasProcessed(false);
                setOutputText('');
              }}
            >
              <Text style={[styles.tabText, { color: operation === 'encode' ? '#fff' : colors.text }]}>
                Encode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                {
                  backgroundColor: operation === 'decode' ? colors.primary : colors.card,
                  borderColor: colors.border
                }
              ]}
              onPress={() => {
                setOperation('decode');
                setHasProcessed(false);
                setOutputText('');
              }}
            >
              <Text style={[styles.tabText, { color: operation === 'decode' ? '#fff' : colors.text }]}>
                Decode
              </Text>
            </TouchableOpacity>
          </View>

          {/* Options Row */}
          <View style={styles.optionsRow}>
            {/* URL-Safe Toggle (Feature 4) */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setUrlSafe(!urlSafe)}
            >
              <View style={[styles.checkbox, { borderColor: colors.border, backgroundColor: urlSafe ? colors.primary : 'transparent' }]}>
                {urlSafe && <CheckCircle size={14} color="#fff" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>URL-Safe</Text>
            </TouchableOpacity>

            {/* Batch Mode Toggle (Feature 5) */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setBatchMode(!batchMode)}
            >
              <View style={[styles.checkbox, { borderColor: colors.border, backgroundColor: batchMode ? colors.primary : 'transparent' }]}>
                {batchMode && <CheckCircle size={14} color="#fff" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>Batch Mode</Text>
            </TouchableOpacity>

            {/* History Button (Feature 6) */}
            {history.length > 0 && (
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => setShowHistory(true)}
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
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Input {operation === 'encode' ? '(Plain Text)' : '(Base64)'}
                {fileName && ` - ${fileName}`}
              </Text>
              <View style={styles.sectionActions}>
                <TouchableOpacity onPress={handlePasteInput} style={styles.actionButton}>
                  <Text style={[styles.actionText, { color: colors.primary }]}>Paste</Text>
                </TouchableOpacity>
                {operation === 'encode' && (
                  <TouchableOpacity onPress={handlePickFile} style={styles.actionButton}>
                    <FileText size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border
              }]}
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                setHasProcessed(false);
                setOutputText('');
              }}
              placeholder={batchMode ? 'Enter multiple lines (one per line)...' : operation === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View style={styles.infoRow}>
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {inputText.length} characters • {inputSize} bytes
              </Text>
              {batchMode && inputText && (
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {inputText.split('\n').filter(l => l.trim()).length} lines
                </Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.processButton, { backgroundColor: colors.primary }]}
              onPress={handleProcess}
            >
              <Text style={styles.processButtonText}>
                {operation === 'encode' ? 'Encode' : 'Decode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switchButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleSwitchOperation}
            >
              <ArrowRightLeft size={20} color={colors.primary} />
            </TouchableOpacity>

            {(inputText || outputText) && (
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={handleClear}
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
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Output {operation === 'encode' ? '(Base64)' : '(Plain Text)'}
                  </Text>
                  <CheckCircle size={16} color="#10B981" style={styles.successIcon} />
                </View>
                <View style={styles.sectionActions}>
                  <TouchableOpacity onPress={handleCopyOutput} style={styles.actionButton}>
                    <Copy size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
                    <Download size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={[styles.outputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text style={[styles.outputText, { color: colors.text }]} selectable>
                    {outputText}
                  </Text>
                </ScrollView>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                  {outputText.length} characters • {outputSize} bytes
                </Text>
                {inputSize > 0 && (
                  <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                    {sizeRatio}% of input size
                  </Text>
                )}
              </View>

              {/* Size Comparison Bar (Feature 7) */}
              <View style={styles.sizeComparison}>
                <View style={styles.sizeBarContainer}>
                  <View
                    style={[
                      styles.sizeBar,
                      {
                        backgroundColor: operation === 'encode' ? '#EF4444' : '#10B981',
                        width: '100%'
                      }
                    ]}
                  />
                  <View
                    style={[
                      styles.sizeBar,
                      {
                        backgroundColor: operation === 'encode' ? '#10B981' : '#EF4444',
                        width: `${Math.min(100, parseFloat(sizeRatio.toString()))}%`
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.sizeLabel, { color: colors.textSecondary }]}>
                  Input vs Output
                </Text>
              </View>

              {/* Quick Actions (Feature 8) */}
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={handleCopyAndClear}
                >
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Copy & Clear</Text>
                </TouchableOpacity>
                
                {Platform.OS !== 'web' && (
                  <TouchableOpacity
                    style={[styles.quickActionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={handleShare}
                  >
                    <Share2 size={16} color={colors.text} style={{ marginRight: 4 }} />
                    <Text style={[styles.quickActionText, { color: colors.text }]}>Share</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Info size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                {urlSafe ? 'URL-Safe Base64' : 'Standard Base64'}
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {urlSafe 
                  ? 'Uses - and _ instead of + and /. No padding. Safe for URLs.' 
                  : 'Standard Base64 encoding. Output is ~33% larger than input.'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* History Modal (Feature 6) */}
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
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>
                  Recent Conversions
                </Text>
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
                        {entry.urlSafe && ' (URL-Safe)'}
                      </Text>
                      <Text style={[styles.historyTime, { color: colors.textSecondary }]}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={[styles.historyText, { color: colors.textSecondary }]} numberOfLines={2}>
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
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {BASE64_INFO.title}
                </Text>
                <TouchableOpacity onPress={() => setShowInfoPopup(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScroll}>
                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  {BASE64_INFO.description}
                </Text>
                
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>
                  Common Use Cases
                </Text>
                {BASE64_INFO.useCases.map((useCase, index) => (
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
                  {BASE64_INFO.technicalDetails.title}
                </Text>
                {BASE64_INFO.technicalDetails.points.map((point, index) => (
                  <Text key={index} style={[styles.technicalPoint, { color: colors.textSecondary }]}>
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
    marginBottom: 20
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1
  },
  subtitle: {
    fontSize: 16
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12
  },
  warningIcon: {
    marginRight: 8
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500'
  },
  warningAction: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center'
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600'
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500'
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 4
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  actionButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIcon: {
    marginLeft: 6
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600'
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    fontFamily: 'monospace'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  charCount: {
    fontSize: 12
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  processButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  switchButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  outputBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    maxHeight: 200
  },
  outputText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20
  },
  sizeComparison: {
    marginTop: 12
  },
  sizeBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative'
  },
  sizeBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0
  },
  sizeLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center'
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  quickActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600'
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2
  },
  infoTextContainer: {
    flex: 1
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%'
  },
  modalCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalScroll: {
    maxHeight: 400
  },
  modalDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20
  },
  modalSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8
  },
  useCaseItem: {
    marginBottom: 12
  },
  useCaseTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4
  },
  useCaseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12
  },
  technicalPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6
  },
  historyModal: {
    width: '90%',
    maxHeight: '70%'
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  historyScroll: {
    maxHeight: 400
  },
  historyItem: {
    padding: 12,
    borderBottomWidth: 1,
    marginBottom: 8
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  historyOperation: {
    fontSize: 13,
    fontWeight: '600'
  },
  historyTime: {
    fontSize: 12
  },
  historyText: {
    fontSize: 13,
    fontFamily: 'monospace'
  }
});
