import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

/**
 * Supported theme modes
 */
export type Theme = 'light' | 'dark';

/**
 * Interface for the Theme Context
 * Provides current theme state, toggle function, and dynamic colors
 */
export interface ThemeContextType {
  /** Current active theme mode */
  theme: Theme;
  /** Function to toggle between light and dark modes */
  toggleTheme: () => void;
  /**
   * Dynamic color palette based on current theme.
   * Includes base colors plus semantic colors (background, surface, text)
   * that automatically adjust.
   */
  colors: typeof colors & {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    card: string;
    border: string;
    textSecondary: string;
  };
  /** Spacing constants for consistent layout */
  spacing: typeof spacing;
}

/**
 * Context instance for Theme
 * @internal
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 *
 * Wraps the application to provide theme state and dynamic colors.
 * Automatically detects system color scheme on first load.
 *
 * @param props - Component props
 * @returns Provider component
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

  /**
   * Toggles the current theme between light and dark
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Computed colors based on current theme
  const themeColors = {
    ...colors,
    background: theme === 'light' ? colors.light : colors.dark,
    surface: theme === 'light' ? colors.lightSurface : colors.darkSurface,
    text: theme === 'light' ? colors.textOnLight : colors.textOnDark,
    textMuted: theme === 'light' ? colors.textMutedOnLight : colors.textMutedOnDark,
    card: theme === 'light' ? colors.lightSurface : colors.darkSurface,
    border: theme === 'light' ? '#E5E7EB' : '#374151',
    textSecondary: theme === 'light' ? colors.textMutedOnLight : colors.textMutedOnDark,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors, spacing }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the current theme context
 *
 * @returns The current theme context containing theme state and colors
 * @throws Error if used outside of a ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
