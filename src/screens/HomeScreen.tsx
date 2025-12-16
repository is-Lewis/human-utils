import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme, typography } from '../theme';
import { spacing } from '../theme/spacing';
import { APP_NAME, TOOL_CATEGORIES } from '../constants';
import { CategoryCard, SearchBar, Container } from '../components';

export const HomeScreen = () => {
  const { colors, toggleTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = TOOL_CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Container>
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* Top Bar with Theme Toggle */}
              <View style={styles.topBar}>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                  {theme === 'light' ? (
                    <Moon size={24} color={colors.text} />
                  ) : (
                    <Sun size={24} color={colors.text} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Centered Hero Section */}
              <View style={styles.hero}>
                <Text style={[styles.logoIcon, { color: colors.primary, fontFamily: typography.code }]}>
                  &gt;_
                </Text>
                <Text style={[styles.title, { color: colors.text, fontFamily: typography.primary }]}>{APP_NAME}</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: typography.primary }]}>
                  Trustworthy. Useful. Honest.
                </Text>
              </View>
              
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="What do you need to do?"
                style={styles.searchBar}
              />
            </View>
          }
          renderItem={({ item }) => (
            <CategoryCard
              title={item.title}
              icon={item.icon}
              onPress={() => console.log(`Pressed ${item.id}`)}
              style={styles.card}
            />
          )}
        />
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.m,
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.s,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: spacing.s,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  themeButton: {
    padding: spacing.s,
    borderRadius: 20,
  },
  searchBar: {
    marginTop: spacing.m,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  card: {
    width: '48%',
  },
});
