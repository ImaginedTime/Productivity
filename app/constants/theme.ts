export const theme = {
  colors: {
    // Primary Colors
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    primaryBg: '#8B5CF610',

    // Secondary Colors
    secondary: '#6366F1',
    secondaryLight: '#818CF8',
    secondaryDark: '#4F46E5',

    // Status Colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Priority Colors
    highPriority: '#EF4444',
    mediumPriority: '#F59E0B',
    lowPriority: '#10B981',

    // Background Colors
    background: '#F5F5F5',
    card: '#FFFFFF',
    
    // Text Colors
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      tertiary: '#999999',
      light: '#FFFFFF',
      disabled: '#CCCCCC',
    },

    // Border Colors
    border: '#E0E0E0',

    // Gradient Colors
    gradient: {
      primary: ['#8B5CF6', '#7C3AED'],
      secondary: ['#6366F1', '#4F46E5'],
    },

    // Status Background Colors
    statusBg: {
      high: '#FEE2E2',
      medium: '#FEF3C7',
      low: '#D1FAE5',
    },

    // Component specific colors
    input: {
      bg: '#F5F5F5',
      placeholder: '#99999980',
      text: '#1A1A1A',
    },
    
    // Status opacity variants
    statusOpacity: {
      high: '10',
      medium: '20',
      low: '10',
    },

    // Overlay colors
    overlay: {
      dark: '#00000080',
      light: '#FFFFFF20',
    },
  },

  // You can add other theme properties like spacing, typography, etc.
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

// Type definitions for theme
export type Theme = typeof theme;

// Helper function to get color with type safety
export const getColor = (path: keyof typeof theme.colors) => theme.colors[path];

export default theme; 