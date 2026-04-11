import type { Game } from '@/features/games/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, Linking, ScrollView, TextInput, View } from 'react-native';
import { Button, Image, Modal, Pressable, Text, useModal } from '@/components/ui';
import { useGames, useIgdbDetails } from '@/features/games/hooks';
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
          <Text className="font-heading text-sm font-bold text-white">Eliminar</Text>
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
          <Text className="font-heading text-2xl/7 font-bold text-black" numberOfLines={2} ellipsizeMode="tail">
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

function RatingCard({ rating, quickReview }: { rating: number | null; quickReview?: string | null }) {
  if (rating === null)
    return null;

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
      {quickReview
        ? (
            <View className="mt-4 border-t border-neutral-100 pt-4">
              <Text className="text-sm text-neutral-600 italic">
                "
                {quickReview}
                "
              </Text>
            </View>
          )
        : null}
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
      <Text className="mb-3 font-heading text-lg font-bold text-neutral-900">{title}</Text>
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
      <Text className="mb-3 font-heading text-lg font-bold text-neutral-900">{title}</Text>
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

function CompleteGameModal({
  modal,
  game,
  onCompleteGame,
  isSaving,
  rating,
  setRating,
  review,
  setReview,
}: any) {
  return (
    <Modal ref={modal.ref} snapPoints={['65%']} title="Completar Juego">
      <View className="p-6">
        <Text className="mb-4 text-center font-heading text-lg font-bold text-neutral-900">
          ¡Felicidades por terminar
          {' '}
          {game.title}
          !
        </Text>

        <Text className="mb-2 text-center text-sm font-semibold text-neutral-500">
          ¿Qué calificación le das?
        </Text>
        <View className="mb-6 flex-row justify-center gap-3">
          {[1, 2, 3, 4, 5].map(star => (
            <Pressable key={star} onPress={() => setRating(star)} className="p-2">
              <Text className={`text-4xl ${rating && star <= rating ? 'text-primary-500' : 'text-neutral-200'}`}>
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mb-2 text-sm font-semibold text-neutral-500">
          Reseña rápida (Opcional)
        </Text>
        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder='"Una experiencia increíble..."'
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          className="mb-6 min-h-[80px] rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 italic"
          style={{ textAlignVertical: 'top' }}
        />

        <Button
          label={isSaving ? 'Guardando...' : 'Marcar como Completado'}
          onPress={onCompleteGame}
          disabled={!rating || isSaving}
          className={`rounded-full ${rating && !isSaving ? 'bg-primary-400' : 'bg-neutral-300'}`}
          textClassName="text-neutral-900"
        />
      </View>
    </Modal>
  );
}

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const { handleCompleteGame } = useGames();

  const modal = useModal();
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id)
      return;
    const found = getGameById(Number(id));
    setGame(found);
  }, [id]);

  const { details, isLoading } = useIgdbDetails(game?.igdb_id);

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

  async function onCompleteGame() {
    if (!rating)
      return;
    setIsSaving(true);
    try {
      await handleCompleteGame(game!.id, rating, review.trim() || null);
      const updated = getGameById(game!.id);
      setGame(updated);
      modal.dismiss();
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-neutral-200">
      <ScrollView contentContainerClassName="pb-10">
        <HeroSection bannerUrl={bannerUrl} developer={developer} game={game} onDelete={handleDelete} />

        {/* Content */}
        <View className="mt-14 px-4">
          <InfoChips game={game} />

          {game.status === 'in_progress' && (
            <Pressable
              onPress={() => modal.present()}
              className="mb-6 items-center justify-center rounded-xl bg-primary-400 p-4"
            >
              <Text className="font-heading font-bold text-neutral-900">Completar juego</Text>
            </Pressable>
          )}

          <RatingCard rating={game.rating} quickReview={game.quick_review} />
          <MetaInfoSection isLoading={isLoading} languages={languages} multiplayer={multiplayer} />
          <ScreenshotSection items={screenshots} title="Capturas" />
          <VideoSection items={videos} title="Videos" />
        </View>
      </ScrollView>

      <CompleteGameModal
        modal={modal}
        game={game}
        onCompleteGame={onCompleteGame}
        isSaving={isSaving}
        rating={rating}
        setRating={setRating}
        review={review}
        setReview={setReview}
      />
    </View>
  );
}
