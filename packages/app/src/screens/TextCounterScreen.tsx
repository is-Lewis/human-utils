/**
 * Text Counter Screen
 *
 * Provides text analysis with counts for characters, words, lines, sentences,
 * and paragraphs, along with reading time estimates.
 *
 * @module screens/TextCounterScreen
 * @author Lewis Goodwin <https://github.com/is-Lewis>
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { countText, TextStats } from '@human-utils/cli';
import { useTheme } from '../theme/ThemeContext';
import { Container } from '../components/Container';
import { ToolHeader } from '../components/ToolHeader';

/**
 * Text Counter Screen Component
 */
export default function TextCounterScreen() {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const stats = useMemo(() => countText(text), [text]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputSection: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
      minHeight: 150,
      textAlignVertical: 'top',
    },
    statsContainer: {
      gap: 12,
    },
    statCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastStatRow: {
      borderBottomWidth: 0,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
  });

  const renderStat = (label: string, value: number | string, isLast = false) => (
    <View style={[styles.statRow, isLast && styles.lastStatRow]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <Container>
      <ToolHeader
        title="Text Counter"
        subtitle="Count characters, words, lines, sentences, and paragraphs"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter Text</Text>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Type or paste your text here..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            {renderStat('Characters', stats.characters)}
            {renderStat('Characters (no spaces)', stats.charactersNoSpaces)}
            {renderStat('Words', stats.words)}
            {renderStat('Lines', stats.lines)}
            {renderStat('Sentences', stats.sentences)}
            {renderStat('Paragraphs', stats.paragraphs)}
            {renderStat('Average Word Length', stats.averageWordLength.toFixed(1))}
            {renderStat(
              'Reading Time',
              stats.readingTime < 1
                ? '< 1 min'
                : `${Math.ceil(stats.readingTime)} min`,
              true
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
