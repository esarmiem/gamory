import { Link, SplashScreen, Tabs } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons';

const logoGamory = require('../../../icons/icon.png');

export default function TabLayout() {
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      hideSplash();
    }, 1000);
    return () => clearTimeout(timer);
  }, [hideSplash]);

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: '#ECECEC',
        },
        headerTitle: '',
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#ECECEC',
        },
        headerLeft: () => <BrandHeader />,
        headerLeftContainerStyle: {
          paddingLeft: 16,
          paddingBottom: 4,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: '#1F1F1F',
        tabBarInactiveTintColor: '#8B8B8B',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: 68,
          borderTopWidth: 1,
          borderTopColor: '#E2E2E2',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: '#FFFFFF',
          paddingTop: 8,
          paddingBottom: 8,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 8,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          headerRight: () => <CreateNewGameLink />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

function BrandHeader() {
  return (
    <View className="flex-row items-center gap-3">
      <Image source={logoGamory} className="size-8 rounded-lg" contentFit="contain" />
      <Text className="text-xl font-bold text-neutral-900">Gamory</Text>
    </View>
  );
}

function CreateNewGameLink() {
  return (
    <Link href="/add" asChild>
      <Pressable className="h-8 min-w-[108px] items-center justify-center rounded-full bg-primary-400 px-4">
        <Text className="text-center font-bold text-neutral-900">+ Agregar</Text>
      </Pressable>
    </Link>
  );
}
