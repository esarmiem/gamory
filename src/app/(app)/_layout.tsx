import { Link, Tabs } from 'expo-router';
import * as React from 'react';
import { Image, Pressable, Text, View } from '@/components/ui';
import { Github } from '@/components/ui/icons';
import { Modal, useModal } from '@/components/ui/modal';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { openLinkInBrowser } from '@/lib/utils';

const logoGamory = require('../../../icons/icon.png');

export default function TabLayout() {
  const { effectiveTheme } = useSelectedTheme();
  const isDark = effectiveTheme === 'dark';
  const bgColor = isDark ? '#0a0a0a' : '#ECECEC'; // background o charcoal-950

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: bgColor,
        },
        headerTitle: '',
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: bgColor,
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
  const { ref, present } = useModal();

  return (
    <>
      <Pressable onPress={() => present()} className="flex-row items-center gap-3">
        <Image source={logoGamory} className="size-8 rounded-lg" contentFit="contain" />
        <Text className="font-heading text-xl font-bold text-foreground dark:text-white">Gamory</Text>
      </Pressable>
      <AboutModal ref={ref} />
    </>
  );
}

function AboutModal({ ref }: { ref: React.RefObject<any> }) {
  return (
    <Modal
      ref={ref}
      snapPoints={['70%']}
      detached
    >
      <View className="flex flex-col items-center px-6 py-4">
        <Image source={logoGamory} className="size-24 rounded-2xl" contentFit="contain" />
        <Text className="mt-4 font-heading text-2xl font-bold text-foreground dark:text-white">
          ¡Gracias por usar Gamory!
        </Text>
        <Text className="mt-3 text-center text-sm/relaxed text-gray-500 dark:text-gray-400">
          Tu historial gamer en el bolsillo.
          {'\n'}
          Si te gusta la app, considera apoyar el desarrollo.
        </Text>

        <View className="mt-8 w-full gap-3">
          <Pressable
            onPress={() => openLinkInBrowser('https://github.com/esarmiem/gamory')}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-gray-200 px-4 py-3 dark:bg-neutral-800"
          >
            <Github color="#24292e" className="dark:fill-white" />
            <Text className="text-center font-semibold text-gray-600 dark:text-white">GitHub</Text>
          </Pressable>

          <View className="mt-4 flex-row items-center justify-center gap-4 rounded-xl bg-gray-200 px-4 py-3 dark:bg-neutral-800">
            <Text className="text-center text-sm text-gray-600 dark:text-gray-300">Dolar App</Text>
            <Text className="text-center text-sm text-gray-600 dark:text-gray-300">$eldersarmiento</Text>
          </View>

          <View className="mt-4 flex-row items-center justify-center gap-4 rounded-xl bg-gray-200 px-4 py-3 dark:bg-neutral-800">
            <Text className="text-center text-sm text-gray-600 dark:text-gray-300">
              Llave bre-B (🇨🇴)
            </Text>
            <Text className="text-center text-sm text-gray-600 dark:text-gray-300">
              @elder351
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function CreateNewGameLink() {
  return (
    <Link href="/add" asChild>
      <Pressable className="h-8 min-w-[108px] items-center justify-center rounded-full bg-primary-400 px-4">
        <Text className="text-center font-heading font-bold text-black">+ Agregar</Text>
      </Pressable>
    </Link>
  );
}
