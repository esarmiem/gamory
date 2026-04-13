import { Redirect, useRootNavigationState } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from '@/components/ui';
import { initDatabase } from '@/lib/db';
import { useIsFirstTime } from '@/lib/hooks';

export default function AppEntry() {
  const [isFirstTime] = useIsFirstTime();
  const navigationState = useRootNavigationState();

  if (!navigationState?.key) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECECEC' }}>
        <ActivityIndicator size="large" color="#0D5DB8" />
      </SafeAreaView>
    );
  }

  if (!isFirstTime)
    initDatabase();

  return <Redirect href={isFirstTime ? '/welcome' : '/(app)'} />;
}
