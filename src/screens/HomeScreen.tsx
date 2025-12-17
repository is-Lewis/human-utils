import React, { useState } from 'react';
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

  const filteredCategories = TOOL_CATEGORIES.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          data={selectedCategory ? filteredTools : filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
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

              {/* Breadcrumb / Back to Categories */}
              {selectedCategory && (
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={[styles.backText, { color: colors.primary }]}>
                    ← Back to Categories
                  </Text>
                </TouchableOpacity>
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
                  onPress={() => handleToolPress(item.route)}
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
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  card: {
    width: '48%',
  },
});
