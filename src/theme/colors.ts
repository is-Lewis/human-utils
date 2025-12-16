/**
 * Color palette for HumanUtils
 * 
 * Philosophy:
 * - Accent restraint: Only green + cyan for emphasis
 * - No rainbow UI: Other colors for status only
 * - Bootstrap-aligned: Maps to primary, info, secondary, warning, danger
 * - Accessible-first: High contrast
 * - Timeless: No trendy neons
 */
export const colors = {
  // Brand & Core UI
  primary: '#558B6E', // Brand Green: Trust, stability
  info: '#38BDF8',    // Cyan: Clarity, technical confidence

  // Status / Feedback
  secondary: '#6B7280', // Neutral UI elements, borders
  warning: '#F2A541',   // Warnings only (never decorative)
  danger: '#E16F7C',    // Errors, destructive actions

  // Neutrals & Backgrounds
  dark: '#0B0E14',        // Dark theme background
  darkSurface: '#151922', // Dark theme cards/panels
  light: '#F3F5F8',       // Light theme background
  lightSurface: '#FAFAFA',// Light theme cards

  // Text Colors
  textOnDark: '#E7EAF0',       // Primary text on dark bg
  textMutedOnDark: '#AAB3C5',  // Secondary text on dark bg
  textOnLight: '#0B0E14',      // Primary text on light bg (using Dark color)
  textMutedOnLight: '#4B5565', // Secondary text on light bg
};
