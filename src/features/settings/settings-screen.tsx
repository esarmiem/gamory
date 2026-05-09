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
    <SafeAreaView className="flex-1 bg-background dark:bg-charcoal-950">
      <FocusAwareStatusBar />

      <ScrollView className="bg-background dark:bg-charcoal-950">
        <View className="flex-1 px-4 pt-6 pb-28">
          <Text className="font-heading text-3xl font-bold text-foreground dark:text-white">
            Ajustes
          </Text>
          <Text className="mt-2 text-sm text-muted-foreground dark:text-neutral-400">
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
    </SafeAreaView>
  );
}
