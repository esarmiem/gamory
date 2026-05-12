import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import colors from '@/components/ui/colors';

import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary[200],
    background: colors.charcoal[950],
    text: colors.charcoal[100],
    border: colors.charcoal[500],
    card: colors.charcoal[850],
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[400],
    background: colors.neutral[200],
    card: colors.white,
    border: colors.neutral[300],
    text: colors.neutral[900],
  },
};

export function useThemeConfig() {
  const { effectiveTheme } = useSelectedTheme();

  if (effectiveTheme === 'dark')
    return DarkTheme;

  return LightTheme;
}
