/**
 * Theme configuration for the Crypto Converter landing page
 * Defines colors, spacing, and other theme variables
 */

// Theme colors
export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#8A2BE2', // Vibrant purple
    light: '#9D50BB',
    dark: '#6A0DAD',
    gradient: 'linear-gradient(135deg, #8A2BE2 0%, #9D50BB 100%)',
  },
  
  // Secondary colors
  secondary: {
    DEFAULT: '#00CED1', // Teal
    light: '#40E0D0',
    dark: '#008B8B',
    gradient: 'linear-gradient(135deg, #00CED1 0%, #40E0D0 100%)',
  },
  
  // Background colors
  background: {
    dark: '#121212',
    darker: '#0A0A0A',
    card: '#1E1E1E',
    gradient: 'linear-gradient(180deg, #121212 0%, #0A0A0A 100%)',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    muted: '#999999',
  },
  
  // Accent colors
  accent: {
    green: '#4CAF50',
    red: '#F44336',
    yellow: '#FFC107',
    blue: '#2196F3',
  },
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index values
export const zIndex = {
  navbar: 100,
  modal: 200,
  tooltip: 300,
};

// Animation durations
export const durations = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
};

// Shadow styles
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  glow: '0 0 15px rgba(138, 43, 226, 0.5)',
};

// Border radius values
export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
}; 