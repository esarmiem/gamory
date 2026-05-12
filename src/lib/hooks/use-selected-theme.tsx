import * as React from 'react';

import { Appearance } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { Uniwind, useUniwind } from 'uniwind';

import { storage } from '../storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

function getSystemColorScheme(): 'light' | 'dark' {
  return Appearance.getColorScheme() ?? 'light';
}

function getEffectiveTheme(
  selectedTheme: ColorSchemeType,
  systemColorScheme: 'light' | 'dark',
): 'light' | 'dark' {
  if (selectedTheme === 'system') {
    return systemColorScheme;
  }
  return selectedTheme;
}

export function useSelectedTheme() {
  const { theme: _theme } = useUniwind();
  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);
  const [systemColorScheme, setSystemColorScheme] = React.useState(getSystemColorScheme);

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('🔍 [Debug]: System color scheme changed:', colorScheme);
      setSystemColorScheme(colorScheme ?? 'light');
    });
    return () => subscription.remove();
  }, []);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      const effectiveTheme = getEffectiveTheme(t, systemColorScheme);
      Uniwind.setTheme(effectiveTheme);
      _setTheme(t);
    },
    [_setTheme, systemColorScheme],
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;

  React.useEffect(() => {
    if (theme === undefined) {
      return;
    }
    const effectiveTheme = getEffectiveTheme(theme as ColorSchemeType, systemColorScheme);
    if (effectiveTheme !== _theme) {
      console.log('🔍 [Debug]: Updating Uniwind theme:', effectiveTheme);
      Uniwind.setTheme(effectiveTheme);
    }
  }, [theme, _theme, systemColorScheme]);

  const effectiveTheme = React.useMemo(() => {
    return getEffectiveTheme(selectedTheme, systemColorScheme);
  }, [selectedTheme, systemColorScheme]);

  return { selectedTheme, setSelectedTheme, effectiveTheme } as const;
}

export function loadSelectedTheme() {
  const theme = storage.getString(SELECTED_THEME);
  if (theme !== undefined) {
    console.log('🔍 [Debug]: Loading selected theme from storage:', theme);
    Uniwind.setTheme(getEffectiveTheme(theme as ColorSchemeType, getSystemColorScheme()));
  }
}
