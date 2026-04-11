import type { Game } from '@/features/games/types';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { ActivityIndicator, FlatList, View } from 'react-native';
import { Image, Input, Pressable, Text } from '@/components/ui';
import { CheckCircle, PlayCircle, Search as SearchIcon } from '@/components/ui/icons';
import { useGames } from '@/features/games/hooks';

type FilterKey = 'all' | 'favorites' | 'inProgress';

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'favorites', label: 'Favoritos' },
  { key: 'inProgress', label: 'En curso' },
];

function Stars({ value }: { value: number }) {
  return (
    <View className="mt-2 flex-row items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Text key={star} className={star <= value ? 'text-primary-600' : 'text-neutral-300'}>
          ★
        </Text>
      ))}
    </View>
  );
}

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${isActive ? 'bg-primary-400' : 'bg-white'}`}
    >
      <Text className={`font-heading text-xs font-bold uppercase ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function GameCard({ game, onPress }: { game: Game; onPress: () => void }) {
  const platformLogo = game.platform_logo_url ? game.platform_logo_url.split(',')[0] : null;

  return (
    <Pressable
      onPress={onPress}
      className="mx-1.5 mb-4 flex-1 rounded-[24px] bg-white p-3"
    >
      <View className="relative rounded-[20px] bg-[#171B2C] p-2">
        {game.cover_url
          ? (
              <Image
                source={game.cover_url}
                className="aspect-3/4 w-full rounded-[16px]"
                contentFit="cover"
              />
            )
          : (
              <View className="aspect-3/4 items-center justify-center rounded-[16px] bg-neutral-300">
                <Text className="text-sm text-neutral-500">Sin imagen</Text>
              </View>
            )}
        {game.metacritic
          ? (
              <View className="absolute top-3 right-3 rounded-xl bg-brand-100 px-2 py-1">
                <Text className="text-[10px] font-bold text-brand-800">{game.metacritic}</Text>
              </View>
            )
          : null}
      </View>

      <View className="pt-3">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 font-heading text-base font-semibold text-neutral-900" numberOfLines={1}>
            {game.title}
          </Text>
          <View className="p-1">
            {game.status === 'completed' ? <CheckCircle color="#10B981" width={18} height={18} /> : <PlayCircle color="#F59E0B" width={18} height={18} />}
          </View>
        </View>

        <View className="mt-1 flex-row items-center pr-2">
          {platformLogo
            ? (
                <Image source={platformLogo} className="mr-2 size-4 shrink-0" contentFit="contain" />
              )
            : null}
          <Text className="flex-1 text-xs font-medium tracking-wide text-neutral-500 uppercase" numberOfLines={1}>
            {game.platform?.split(', ')[0] || '-'}
          </Text>
        </View>

        {game.rating !== null ? <Stars value={game.rating} /> : <View className="mt-2 h-4" />}
      </View>
    </Pressable>
  );
}

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const { games, isLoading } = useGames(search);
  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        if (activeFilter === 'favorites')
          return game.rating === 5;
        if (activeFilter === 'inProgress')
          return game.status === 'in_progress';

        return true;
      }),
    [activeFilter, games],
  );

  return (
    <View className="flex-1 bg-neutral-200">
      {isLoading && games.length === 0
        ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#0D5DB8" />
            </View>
          )
        : (
            <FlatList
              data={filteredGames}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerClassName="px-4 pb-32 pt-6"
              ListHeaderComponent={(
                <View className="pb-5">
                  <View className="rounded-[20px] bg-brand-600 px-4 py-3.5">
                    <Text className="font-heading text-xs font-bold tracking-[2px] text-brand-100 uppercase">
                      Tu historial gamer
                    </Text>
                    <Text className="mt-1.5 font-heading text-2xl/7 font-bold text-white">
                      Registra y califica tus juegos
                    </Text>
                    <Text className="mt-1 text-xs text-brand-100" numberOfLines={2}>
                      Guarda lo que terminaste, lo que juegas ahora y puntualos del 1 al 5.
                    </Text>
                  </View>

                  <View className="mt-5 flex-row items-center rounded-[18px] bg-white px-4">
                    <SearchIcon color="#7D7D7D" />
                    <Input
                      placeholder="Buscar por nombre o plataforma"
                      value={search}
                      onChangeText={setSearch}
                      className="flex-1 border-0 bg-transparent px-3 py-4 text-neutral-700"
                    />
                  </View>

                  <View className="mt-4 flex-row gap-3">
                    {filters.map(filter => (
                      <FilterChip
                        key={filter.key}
                        label={filter.label}
                        isActive={activeFilter === filter.key}
                        onPress={() => setActiveFilter(filter.key)}
                      />
                    ))}
                  </View>
                </View>
              )}
              ListEmptyComponent={(
                <View className="items-center rounded-[24px] bg-white p-8">
                  <Text className="text-center text-base font-semibold text-neutral-900">
                    No hay juegos para este filtro.
                  </Text>
                  <Text className="mt-2 text-center text-sm text-neutral-500">
                    Prueba con otra búsqueda o agrega tu siguiente título desde el botón superior.
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
          )}
    </View>
  );
}
