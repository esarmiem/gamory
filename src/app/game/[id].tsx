import type { Game, IgdbGameDetails } from '@/features/games/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, Linking, ScrollView, View } from 'react-native';
import { Button, Image, Pressable, Text } from '@/components/ui';
import { getIgdbGameDetails } from '@/lib/api/igdb';
import { deleteGame, getGameById } from '@/lib/db';

type HeroSectionProps = {
  bannerUrl: string | null;
  developer: string;
  game: Game;
  onDelete: () => void;
};

type MetaInfoSectionProps = {
  isLoading: boolean;
  languages: string;
  multiplayer: string;
};

type MediaSectionProps = {
  items: string[];
  title: string;
};

function HeroSection({ bannerUrl, developer, game, onDelete }: HeroSectionProps) {
  return (
    <View className="relative h-64 w-full bg-neutral-300">
      {bannerUrl && (
        <Image source={bannerUrl} className="absolute inset-0 size-full opacity-80" contentFit="cover" />
      )}
      <View className="absolute inset-0 bg-white/45" />

      <View className="absolute top-10 right-4 left-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="rounded-full bg-white/90 p-2">
          <Text className="text-xl text-neutral-900">←</Text>
        </Pressable>
        <Pressable onPress={onDelete} className="rounded-full bg-red-600/80 p-2">
          <Text className="text-sm font-bold text-white">Eliminar</Text>
        </Pressable>
      </View>

      <View className="absolute -bottom-10 left-4 flex-row items-end">
        <View className="h-32 w-24 overflow-hidden rounded-lg border-2 border-neutral-200 bg-neutral-200 shadow-xl">
          {game.cover_url
            ? (
                <Image source={game.cover_url} className="size-full" contentFit="cover" />
              )
            : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-center text-xs text-neutral-500">Sin imagen</Text>
                </View>
              )}
        </View>
        <View className="mb-4 ml-4 flex-1 pr-8">
          <Text className="text-2xl/7 font-bold text-black" numberOfLines={2} ellipsizeMode="tail">
            {game.title}
          </Text>
          <Text className="mt-2 text-sm font-semibold text-neutral-700" numberOfLines={1}>
            {developer}
            {' '}
            {game.release_year ? `• ${game.release_year}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

function InfoChips({ game }: { game: Game }) {
  return (
    <View className="mb-6 flex-row flex-wrap gap-2">
      <View className="rounded-sm bg-primary-100 px-3 py-1">
        <Text className="text-xs font-bold text-primary-800">{game.platform}</Text>
      </View>
      {game.metacritic
        ? (
            <View className="rounded-sm bg-success-100 px-3 py-1">
              <Text className="text-xs font-bold text-success-700">
                Metacritic:
                {game.metacritic}
              </Text>
            </View>
          )
        : null}
      <View className="rounded-sm bg-white px-3 py-1">
        <Text className="text-xs font-bold text-neutral-600">{game.genre || 'Sin género'}</Text>
      </View>
    </View>
  );
}

function RatingCard({ rating }: { rating: number }) {
  return (
    <View className="mb-6 rounded-xl bg-white p-4">
      <Text className="mb-2 text-sm text-neutral-500">Tu Calificación</Text>
      <View className="flex-row items-center">
        <Text className="mr-2 text-2xl font-bold text-neutral-900">
          {rating}
          /5
        </Text>
        <View className="flex-row gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Text key={star} className={`text-2xl ${star <= rating ? 'text-primary-600' : 'text-neutral-300'}`}>
              ★
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function MetaInfoSection({ isLoading, languages, multiplayer }: MetaInfoSectionProps) {
  if (isLoading)
    return <ActivityIndicator size="small" color="#0D5DB8" />;

  return (
    <View className="mb-6 flex-row flex-wrap justify-between gap-4">
      <View className="min-w-[45%] flex-1 rounded-xl bg-white p-4">
        <Text className="mb-1 text-xs text-neutral-500">Multijugador</Text>
        <Text className="text-sm font-semibold text-neutral-900">{multiplayer}</Text>
      </View>
      <View className="min-w-[45%] flex-1 rounded-xl bg-white p-4">
        <Text className="mb-1 text-xs text-neutral-500">Idiomas</Text>
        <Text className="text-sm font-semibold text-neutral-900" numberOfLines={2}>{languages}</Text>
      </View>
    </View>
  );
}

function ScreenshotSection({ items, title }: MediaSectionProps) {
  if (items.length === 0)
    return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-bold text-neutral-900">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {items.map(url => (
          <View key={url} className="mr-3 h-32 w-56 overflow-hidden rounded-xl bg-white">
            <Image source={url} className="size-full" contentFit="cover" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function VideoSection({ items, title }: MediaSectionProps) {
  if (items.length === 0)
    return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-bold text-neutral-900">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {items.map(vid => (
          <Pressable
            key={vid}
            className="mr-3 h-32 w-56 overflow-hidden rounded-xl bg-white"
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
  );
}

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
      <View className="flex-1 items-center justify-center bg-neutral-200">
        <Text className="text-neutral-900">Juego no encontrado</Text>
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
    <View className="flex-1 bg-neutral-200">
      <ScrollView contentContainerClassName="pb-10">
        <HeroSection bannerUrl={bannerUrl} developer={developer} game={game} onDelete={handleDelete} />

        {/* Content */}
        <View className="mt-14 px-4">
          <InfoChips game={game} />
          <RatingCard rating={game.rating} />
          <MetaInfoSection isLoading={isLoading} languages={languages} multiplayer={multiplayer} />
          <ScreenshotSection items={screenshots} title="Capturas" />
          <VideoSection items={videos} title="Videos" />
        </View>
      </ScrollView>
    </View>
  );
}
