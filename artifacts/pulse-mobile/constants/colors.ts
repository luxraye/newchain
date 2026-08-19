/**
 * Bloodchain design tokens — synced with the web artifacts' index.css.
 * The Bloodchain brand is dark-only: bg #030508, crimson #e74c3c, cyan #00d4ff.
 * Both palettes carry the same dark values so the app looks correct in any
 * device appearance setting.
 */

const bloodchain = {
  text: '#f5f7fa',
  tint: '#e74c3c',

  background: '#030508',
  foreground: '#f5f7fa',

  card: '#0b0f16',
  cardForeground: '#f5f7fa',

  primary: '#e74c3c',
  primaryForeground: '#ffffff',

  secondary: '#111827',
  secondaryForeground: '#e2e8f0',

  muted: '#111827',
  mutedForeground: '#8b94a3',

  accent: '#00d4ff',
  accentForeground: '#030508',

  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  border: '#1c2430',
  input: '#1c2430',
};

const colors = {
  light: bloodchain,
  dark: bloodchain,
  radius: 12,
};

export default colors;
