export const colors = {
  primary: '#E3350D',
  secondary: '#FFCB05',
  blue: '#3B4CCA',
  dark: '#1F2937',
  bg: '#F5F7FB',
  white: '#FFFFFF',
  success: '#22C55E',
  danger: '#EF4444',
  muted: '#6B7280',
  border: '#E5E7EB',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 16, lg: 24, pill: 999 };

export const typography = {
  title: { fontSize: 24, fontWeight: '800', color: colors.dark },
  subtitle: { fontSize: 16, fontWeight: '700', color: colors.dark },
  body: { fontSize: 14, color: colors.dark },
  caption: { fontSize: 12, color: colors.muted },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};
