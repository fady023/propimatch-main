export const colors = {
  primary: '#0E5D6C',
  primaryForeground: '#FFFFFF',
  accent: '#33B0AE',
  accentMuted: '#C7ECEB',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  bg: '#0B1215',
  bgMuted: '#0F1A1F',
  surface: '#101A1F',
  surfaceAlt: '#122128',
  border: '#1F2B33',
  text: '#E6F0F2',
  textMuted: '#A7BBC2'
};

export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32
};

export const typography = {
  fontFamily: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24
  }
};

export const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        accent: colors.accent,
      },
      borderColor: {
        DEFAULT: colors.border
      }
    }
  }
};

export type ColorTokens = keyof typeof colors;

