import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, typography } from '../theme';
import { spacing } from '../theme/spacing';
import { APP_NAME, TOOL_CATEGORIES, TOOLS } from '../constants';
import { CategoryCard, SearchBar, Container } from '../components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter and combine results based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      // No search - show categories or tools in selected category
      if (selectedCategory) {
        return TOOLS.filter((tool) => tool.categories.includes(selectedCategory));
      }
      return TOOL_CATEGORIES;
    }

    const query = searchQuery.toLowerCase();
    const matchedTools = TOOLS.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.categories.some((catId) =>
          TOOL_CATEGORIES.find((cat) => cat.id === catId)
            ?.title.toLowerCase()
            .includes(query)
        )
    );

    const matchedCategories = TOOL_CATEGORIES.filter((cat) =>
      cat.title.toLowerCase().includes(query)
    );

    // Return tools first, then categories
    return [...matchedTools, ...matchedCategories];
  }, [searchQuery, selectedCategory]);

  const isSearching = searchQuery.trim().length > 0;

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleToolPress = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Container>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* Centered Hero Section */}
              <View style={styles.hero}>
                <Text
                  style={[styles.logoIcon, { color: colors.primary, fontFamily: typography.code }]}
                >
                  &gt;_
                </Text>
                <Text
                  style={[styles.title, { color: colors.text, fontFamily: typography.primary }]}
                >
                  {APP_NAME}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.textMuted, fontFamily: typography.primary },
                  ]}
                >
                  Trustworthy. Useful. Honest.
                </Text>
              </View>

              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search tools or categories..."
                style={styles.searchBar}
              />

              {/* Back to Categories Button */}
              {selectedCategory && !isSearching && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedCategory(null)}
                  accessibilityLabel="Back to categories"
                  accessibilityRole="button"
                >
                  <Text style={[styles.backText, { color: colors.primary }]}>
                    ← Back to Categories
                  </Text>
                </TouchableOpacity>
              )}

              {/* Search Results Header */}
              {isSearching && searchResults.length > 0 && (
                <Text style={[styles.resultsHeader, { color: colors.textMuted }]}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </Text>
              )}

              {/* No Results Message */}
              {isSearching && searchResults.length === 0 && (
                <View style={styles.noResults}>
                  <Text style={[styles.noResultsText, { color: colors.textMuted }]}>
                    No tools or categories found for &quot;{searchQuery}&quot;
                  </Text>
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => {
            if ('route' in item) {
              // Tool item
              return (
                <CategoryCard
                  title={item.title}
                  icon={item.icon}
                  onPress={() => handleToolPress(item.route as keyof RootStackParamList)}
                  style={styles.card}
                />
              );
            } else {
              // Category item
              return (
                <CategoryCard
                  title={item.title}
                  icon={item.icon}
                  onPress={() => handleCategoryPress(item.id)}
                  style={styles.card}
                />
              );
            }
          }}
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
  searchBar: {
    marginTop: spacing.m,
  },
  backButton: {
    marginTop: spacing.m,
    paddingVertical: spacing.s,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsHeader: {
    marginTop: spacing.m,
    fontSize: 14,
    fontWeight: '500',
  },
  noResults: {
    marginTop: spacing.l,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  card: {
    width: '48%',
  },
});
