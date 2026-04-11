import Env from 'env';

import {
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { LanguageItem } from './components/language-item';
import { SettingsContainer } from './components/settings-container';
import { SettingsItem } from './components/settings-item';
import { ThemeItem } from './components/theme-item';

export function SettingsScreen() {
  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView className="bg-neutral-200">
        <View className="flex-1 px-4 pt-6 pb-28">
          <Text className="font-heading text-3xl font-bold text-neutral-900">
            Ajustes
          </Text>
          <Text className="mt-2 text-sm text-neutral-500">
            Personaliza idioma, tema y revisa la información de la app.
          </Text>
          <SettingsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </SettingsContainer>

          <SettingsContainer title="settings.about">
            <SettingsItem
              text="settings.app_name"
              value={Env.EXPO_PUBLIC_NAME}
            />
            <SettingsItem
              text="settings.version"
              value={Env.EXPO_PUBLIC_VERSION}
            />
          </SettingsContainer>
        </View>
      </ScrollView>
    </>
  );
}
