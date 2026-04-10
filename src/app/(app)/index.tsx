import type { Game } from '@/features/games/types';
import { router } from 'expo-router';
import { useState } from 'react';

import { ActivityIndicator, FlatList, View } from 'react-native';
import { Image, Input, Pressable, Text } from '@/components/ui';
import { useGames } from '@/features/games/hooks';

const logoGamory = require('../../../icons/icon.png');

function Stars({ value }: { value: number }) {
  return (
    <View className="mt-1 flex-row items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <Text key={star} className={star <= value ? 'text-amber-400' : 'text-gray-400'}>
          ★
        </Text>
      ))}
    </View>
  );
}

function GameCard({ game, onPress }: { game: Game; onPress: () => void }) {
  const platformLogo = game.platform_logo_url ? game.platform_logo_url.split(',')[0] : null;

  return (
    <Pressable
      onPress={onPress}
      className="m-2 flex-1 overflow-hidden rounded-xl bg-neutral-800"
    >
      <View className="relative aspect-3/4 w-full bg-neutral-700">
        {game.cover_url
          ? (
              <Image source={game.cover_url} className="absolute inset-0 size-full" contentFit="cover" />
            )
          : (
              <View className="absolute inset-0 flex items-center justify-center bg-neutral-700">
                <Text className="text-sm text-neutral-400">Sin imagen</Text>
              </View>
            )}
        {game.metacritic
          ? (
              <View className="absolute top-2 right-2 rounded-sm bg-green-600 px-1.5 py-0.5">
                <Text className="text-xs font-bold text-white">{game.metacritic}</Text>
              </View>
            )
          : null}
      </View>

      <View className="p-3">
        <Text className="mb-1 text-base font-semibold text-white" numberOfLines={1}>
          {game.title}
        </Text>

        <View className="mb-2 flex-row items-center">
          {platformLogo
            ? (
                <Image source={platformLogo} className="mr-2 size-4" contentFit="contain" />
              )
            : null}
          <Text className="text-xs text-neutral-400" numberOfLines={1}>
            {game.platform?.split(', ')[0] || '-'}
          </Text>
        </View>

        <Stars value={game.rating} />
      </View>
    </Pressable>
  );
}

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const { games, isLoading } = useGames(search);

  return (
    <View className="flex-1 bg-neutral-900">
      <View className="bg-primary-900 p-6 pt-12 pb-8">
        <View className="mb-2 flex-row items-center gap-3">
          <Image
            source={logoGamory}
            className="size-10 rounded-xl"
            contentFit="contain"
          />
          <Text className="text-3xl font-bold text-white">Gamory</Text>
        </View>
        <Text className="text-base text-primary-200">
          Lleva control de tus juegos terminados y dales tu rating.
        </Text>
      </View>

      <View className="-mt-5 px-4 pb-4">
        <View className="rounded-xl bg-neutral-800 p-2 shadow-sm">
          <Input
            placeholder="Buscar por nombre o plataforma"
            value={search}
            onChangeText={setSearch}
            className="border-none bg-transparent text-white"
          />
        </View>
      </View>

      {isLoading && games.length === 0
        ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )
        : (
            <View className="flex-1">
              <FlatList
                data={games}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerClassName="p-2 pb-20"
                ListEmptyComponent={(
                  <View className="flex-1 items-center justify-center p-8">
                    <Text className="text-center text-neutral-400">
                      Aún no hay juegos. Agrega el primero con el botón superior.
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => (
                  <GameCard
                    game={item}
                    onPress={() => {
                      router.push(`/game/${item.id}`);
                    }}
                  />
                )}
              />
            </View>
          )}
    </View>
  );
}
