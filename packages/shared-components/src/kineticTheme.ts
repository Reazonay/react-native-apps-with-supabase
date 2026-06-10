export const kineticColors = {
  background: '#0a0a05',
  surfaceContainerLow: '#11110a',
  surfaceContainer: '#1a1a0f',
  surfaceContainerHigh: '#222214',
  surfaceVariant: '#2d2d1f',
  surfaceBright: '#333325',
  outline: '#555540',
  outlineVariant: '#333322',
  onBackground: '#ffffff',
  onSurface: '#f5f5f0',
  onSurfaceVariant: '#a8a892',
  primary: '#ede900',
  primaryDim: '#c4c000',
  onPrimary: '#0a0a05',
  secondary: '#a4c9ff',
  tertiary: '#99f1f3',
  error: '#ff5544'
} as const;

export const kineticSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  containerMargin: 24,
  inlineGap: 16,
  stackGap: 24,
  cardPadding: 16
} as const;

export const kineticRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999
} as const;

export const kineticTypography = {
  displayXL: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.64
  },
  headlineLG: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.24
  },
  titleMD: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700' as const
  },
  bodyBase: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const
  },
  bodySM: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const
  },
  labelCaps: {
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const
  }
} as const;

export const kineticTheme = {
  colors: kineticColors,
  spacing: kineticSpacing,
  radius: kineticRadius,
  typography: kineticTypography
} as const;

export type KineticTheme = typeof kineticTheme;