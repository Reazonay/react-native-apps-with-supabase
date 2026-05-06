export const uiColors = {
  backgroundWorkout: '#f4efe6',
  backgroundAdmin: '#fffaf2',
  surface: '#ffffff',
  surfaceBorder: '#e5e7eb',
  surfaceBorderStrong: '#d1d5db',
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  navActive: '#111827',
  navInactive: '#374151',
  badgeSuccessBg: '#d1fae5',
  badgeSuccessText: '#065f46',
  statusLoadingBg: '#fef3c7',
  statusLoadingText: '#92400e',
  statusErrorBg: '#fee2e2',
  statusErrorText: '#991b1b',
  actionPrimary: '#0f766e',
  actionPrimaryText: '#ecfeff'
} as const;

export const uiSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  cardPadding: 20,
  cardGap: 12
} as const;

export const uiRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 9999
} as const;

export const uiTypography = {
  headingXL: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const
  },
  headingLG: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700' as const
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const
  },
  labelCaps: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const
  }
} as const;

export const uiTheme = {
  colors: uiColors,
  spacing: uiSpacing,
  radius: uiRadius,
  typography: uiTypography
} as const;

export type UiTheme = typeof uiTheme;
