import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';

import { useTheme } from '../themeContext';
import { KineticText } from './KineticText';

export type KineticButtonVariant = 'primary' | 'ghost' | 'pill';

export interface KineticButtonProps extends PressableProps {
  label: string;
  variant?: KineticButtonVariant;
}

export function KineticButton({ label, variant = 'primary', style, disabled, ...props }: KineticButtonProps) {
  const theme = useTheme();

  const getButtonStyles = () => {
    const base = {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: variant === 'pill' ? theme.radius.pill : theme.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: theme.colors.accent,
      };
    } else if (variant === 'ghost') {
      return {
        ...base,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    } else { // pill
      return {
        ...base,
        backgroundColor: theme.colors.accent,
      };
    }
  };

  const getLabelColor = (): any => {
    if (variant === 'primary' || variant === 'pill') {
      return 'accentText';
    }
    return 'textSecondary';
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(state) => [
        getButtonStyles(),
        state.pressed && !disabled && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        typeof style === 'function' ? style(state) : style
      ]}
    >
      <KineticText
        variant="body"
        color={getLabelColor()}
        style={{ fontWeight: '700' }}
      >
        {label}
      </KineticText>
    </Pressable>
  );
}
