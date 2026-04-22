import { Link, Tabs } from 'expo-router';
import * as React from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';

const logoGamory = require('../../../icons/icon.png');

export default function TabLayout() {
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
          fontFamily: 'SpaceGrotesk-Bold',
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          display: 'none',
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 8,
          marginTop: 2,
        },
      }}
    >
      {/*
      Configuracion original visible de tabs.
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
      */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerRight: () => <CreateNewGameLink />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

function BrandHeader() {
  return (
    <View className="flex-row items-center gap-3">
      <Image source={logoGamory} className="size-8 rounded-lg" contentFit="contain" />
      <Text className="font-heading text-xl font-bold text-neutral-900">Gamory</Text>
    </View>
  );
}

function CreateNewGameLink() {
  return (
    <Link href="/add" asChild>
      <Pressable className="h-8 min-w-[108px] items-center justify-center rounded-full bg-primary-400 px-4">
        <Text className="text-center font-heading font-bold text-neutral-900">+ Agregar</Text>
      </Pressable>
    </Link>
  );
}
