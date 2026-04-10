import type { Game, IgdbGameDetails } from '@/features/games/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, Linking, ScrollView, View } from 'react-native';
import { Button, Image, Pressable, Text } from '@/components/ui';
import { getIgdbGameDetails } from '@/lib/api/igdb';
import { deleteGame, getGameById } from '@/lib/db';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [details, setDetails] = useState<IgdbGameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id)
      return;
    const found = getGameById(Number(id));
    setGame(found);
  }, [id]);

  useEffect(() => {
    async function loadDetails() {
      if (!game?.igdb_id) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getIgdbGameDetails(game.igdb_id);
        setDetails(data);
      }
      catch (err) {
        console.error('Error fetching game details:', err);
      }
      finally {
        setIsLoading(false);
      }
    }

    if (game) {
      loadDetails();
    }
  }, [game]);

  if (!game) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-900">
        <Text className="text-white">Juego no encontrado</Text>
        <Button label="Volver" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const artworks = details?.artworks || [];
  const screenshots = details?.screenshots || [];
  const videos = details?.videos || [];
  const developer = details?.developer || 'Desconocido';
  const languages = details?.languages?.length ? details.languages.join(', ') : 'No disponible';
  const multiplayer = details?.multiplayer || 'Single Player';
  const bannerUrl = artworks.length > 0 ? artworks[0] : game.cover_url;

  function handleDelete() {
    deleteGame(game!.id);
    router.back();
  }

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView contentContainerClassName="pb-10">
        {/* Header Hero */}
        <View className="relative h-64 w-full bg-neutral-800">
          {bannerUrl && (
            <Image source={bannerUrl} className="absolute inset-0 size-full opacity-60" contentFit="cover" />
          )}
          <View className="absolute inset-0 bg-black/40" />

          <View className="absolute top-10 right-4 left-4 flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="rounded-full bg-black/50 p-2">
              <Text className="text-xl text-white">←</Text>
            </Pressable>
            <Pressable onPress={handleDelete} className="rounded-full bg-red-600/80 p-2">
              <Text className="text-sm font-bold text-white">Eliminar</Text>
            </Pressable>
          </View>

          <View className="absolute -bottom-10 left-4 flex-row items-end">
            <View className="h-32 w-24 overflow-hidden rounded-lg border-2 border-neutral-800 bg-neutral-700 shadow-xl">
              {game.cover_url
                ? (
                    <Image source={game.cover_url} className="size-full" contentFit="cover" />
                  )
                : (
                    <View className="flex-1 items-center justify-center">
                      <Text className="text-center text-xs text-neutral-400">Sin imagen</Text>
                    </View>
                  )}
            </View>
            <View className="mb-2 ml-4 flex-1">
              <Text className="text-2xl font-bold text-white drop-shadow-md" numberOfLines={2}>
                {game.title}
              </Text>
              <Text className="text-sm font-semibold text-neutral-300 drop-shadow-md">
                {developer}
                {' '}
                {game.release_year ? `• ${game.release_year}` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="mt-14 px-4">
          <View className="mb-6 flex-row flex-wrap gap-2">
            <View className="rounded-sm bg-primary-900/50 px-3 py-1">
              <Text className="text-xs font-bold text-primary-300">{game.platform}</Text>
            </View>
            {game.metacritic
              ? (
                  <View className="rounded-sm bg-green-900/50 px-3 py-1">
                    <Text className="text-xs font-bold text-green-400">
                      Metacritic:
                      {game.metacritic}
                    </Text>
                  </View>
                )
              : null}
            <View className="rounded-sm bg-neutral-800 px-3 py-1">
              <Text className="text-xs font-bold text-neutral-300">{game.genre || 'Sin género'}</Text>
            </View>
          </View>

          {/* Rating */}
          <View className="mb-6 rounded-xl bg-neutral-800 p-4">
            <Text className="mb-2 text-sm text-neutral-400">Tu Calificación</Text>
            <View className="flex-row items-center">
              <Text className="mr-2 text-2xl font-bold text-white">
                {game.rating}
                /5
              </Text>
              <View className="flex-row gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Text key={star} className={`text-2xl ${star <= game.rating ? 'text-amber-400' : 'text-neutral-600'}`}>
                    ★
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Meta info grid */}
          {isLoading
            ? (
                <ActivityIndicator size="small" color="#fff" />
              )
            : (
                <View className="mb-6 flex-row flex-wrap justify-between gap-4">
                  <View className="min-w-[45%] flex-1 rounded-xl bg-neutral-800 p-4">
                    <Text className="mb-1 text-xs text-neutral-400">Multijugador</Text>
                    <Text className="text-sm font-semibold text-white">{multiplayer}</Text>
                  </View>
                  <View className="min-w-[45%] flex-1 rounded-xl bg-neutral-800 p-4">
                    <Text className="mb-1 text-xs text-neutral-400">Idiomas</Text>
                    <Text className="text-sm font-semibold text-white" numberOfLines={2}>{languages}</Text>
                  </View>
                </View>
              )}

          {/* Media Galleries */}
          {screenshots.length > 0 && (
            <View className="mb-6">
              <Text className="mb-3 text-lg font-bold text-white">Capturas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {screenshots.map((url, i) => (
                  <View key={i} className="mr-3 h-32 w-56 overflow-hidden rounded-xl bg-neutral-800">
                    <Image source={url} className="size-full" contentFit="cover" />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {videos.length > 0 && (
            <View className="mb-6">
              <Text className="mb-3 text-lg font-bold text-white">Videos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {videos.map((vid) => (
                  <Pressable
                    key={vid}
                    className="mr-3 h-32 w-56 overflow-hidden rounded-xl bg-neutral-800"
                    onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${vid}`)}
                  >
                    <Image
                      source={`https://img.youtube.com/vi/${vid}/maxresdefault.jpg`}
                      className="size-full opacity-80"
                      contentFit="cover"
                    />
                    <View className="absolute inset-0 items-center justify-center">
                      <View className="rounded-full bg-red-600/80 px-4 py-2">
                        <Text className="font-bold text-white">▶</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
