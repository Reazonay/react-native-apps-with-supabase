import React, { createContext, useContext, ReactNode } from 'react';
import { uiTheme } from './uiTokens';
import { kineticTheme } from './kineticTheme';

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentText: string;
  successBg: string;
  successText: string;
  warningBg: string;
  warningText: string;
  errorBg: string;
  errorText: string;
  navActive: string;
  navInactive: string;
}

export interface ThemeTypography {
  headingXL: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '700' | '800';
    letterSpacing?: number;
  };
  headingLG: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '700';
    letterSpacing?: number;
  };
  subheading: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '400';
  };
  title: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '700';
  };
  body: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '500';
  };
  labelCaps: {
    fontSize: number;
    lineHeight: number;
    fontWeight: '700';
    letterSpacing: number;
    textTransform: 'uppercase';
  };
}

export interface AppTheme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    [key: string]: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  typography: ThemeTypography;
}

export const uiSemanticTheme: AppTheme = {
  colors: {
    background: uiTheme.colors.backgroundWorkout,
    surface: uiTheme.colors.surface,
    border: uiTheme.colors.surfaceBorder,
    textPrimary: uiTheme.colors.textPrimary,
    textSecondary: uiTheme.colors.textSecondary,
    textMuted: uiTheme.colors.textMuted,
    accent: uiTheme.colors.actionPrimary,
    accentText: uiTheme.colors.actionPrimaryText,
    successBg: uiTheme.colors.badgeSuccessBg,
    successText: uiTheme.colors.badgeSuccessText,
    warningBg: uiTheme.colors.statusLoadingBg,
    warningText: uiTheme.colors.statusLoadingText,
    errorBg: uiTheme.colors.statusErrorBg,
    errorText: uiTheme.colors.statusErrorText,
    navActive: uiTheme.colors.navActive,
    navInactive: uiTheme.colors.navInactive,
  },
  spacing: {
    xs: uiTheme.spacing.xs,
    sm: uiTheme.spacing.sm,
    md: uiTheme.spacing.md,
    lg: uiTheme.spacing.lg,
    xl: uiTheme.spacing.xl,
    xxl: uiTheme.spacing.xxl,
    cardPadding: uiTheme.spacing.cardPadding,
    cardGap: uiTheme.spacing.cardGap,
  },
  radius: uiTheme.radius,
  typography: uiTheme.typography,
};

export const kineticSemanticTheme: AppTheme = {
  colors: {
    background: kineticTheme.colors.background,
    surface: kineticTheme.colors.surfaceContainer,
    border: kineticTheme.colors.outlineVariant,
    textPrimary: kineticTheme.colors.onSurface,
    textSecondary: kineticTheme.colors.onSurfaceVariant,
    textMuted: kineticTheme.colors.outline,
    accent: kineticTheme.colors.primary,
    accentText: kineticTheme.colors.onPrimary,
    successBg: '#005b14', // Forest green from Stitch
    successText: '#88d982', // Light green from Stitch
    warningBg: kineticTheme.colors.surfaceVariant,
    warningText: kineticTheme.colors.onSurfaceVariant,
    errorBg: kineticTheme.colors.error,
    errorText: '#141408',
    navActive: kineticTheme.colors.primary,
    navInactive: kineticTheme.colors.onSurfaceVariant,
  },
  spacing: {
    xs: kineticTheme.spacing.xs,
    sm: kineticTheme.spacing.sm,
    md: kineticTheme.spacing.md,
    lg: kineticTheme.spacing.lg,
    xl: kineticTheme.spacing.xl,
    xxl: kineticTheme.spacing.xl, // mapped for compatibility
    cardPadding: kineticTheme.spacing.cardPadding,
    cardGap: kineticTheme.spacing.inlineGap,
  },
  radius: kineticTheme.radius,
  typography: {
    headingXL: {
      ...kineticTheme.typography.displayXL,
      fontWeight: '700', // adjust for React Native type compatibility if needed
    },
    headingLG: {
      ...kineticTheme.typography.headlineLG,
      fontWeight: '700',
    },
    subheading: {
      ...kineticTheme.typography.bodyBase,
      fontWeight: '400',
    },
    title: {
      ...kineticTheme.typography.titleMD,
      fontWeight: '700',
    },
    body: {
      ...kineticTheme.typography.bodySM,
      fontWeight: '500',
    },
    labelCaps: {
      ...kineticTheme.typography.labelCaps,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
  },
};

const ThemeContext = createContext<AppTheme>(uiSemanticTheme);

export interface ThemeProviderProps {
  theme?: AppTheme;
  children?: ReactNode;
}

export function ThemeProvider({ theme = uiSemanticTheme, children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
