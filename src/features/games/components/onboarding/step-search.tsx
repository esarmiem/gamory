import type { IgdbSuggestion, NewGamePayload } from '@/features/games/types';
import { MotiView } from 'moti';
import * as React from 'react';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Image, Input, Pressable, Text } from '@/components/ui';
import { useIgdbSearch } from '@/features/games/hooks';
import { findExistingGame, getDuplicateGameMessage } from '@/lib/db';

type Props = {
  form: NewGamePayload;
  setForm: React.Dispatch<React.SetStateAction<NewGamePayload>>;
};

function PreviewCard({ form }: { form: NewGamePayload }) {
  if (!form.igdb_id)
    return null;
  return (
    <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 space-y-4">
      <View className="mt-4 rounded-2xl bg-card p-4 shadow-sm dark:bg-charcoal-850">
        <Text className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase dark:text-neutral-400">Plataforma</Text>
        <Text className="mt-1 font-heading text-base font-semibold text-foreground dark:text-white">{form.platform}</Text>
      </View>

      <View className="mt-4 flex-row gap-4">
        <View className="flex-1 rounded-2xl bg-card p-4 shadow-sm dark:bg-charcoal-850">
          <Text className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase dark:text-neutral-400">Año</Text>
          <Text className="mt-1 font-heading text-lg font-bold text-foreground dark:text-white">{form.release_year || '-'}</Text>
        </View>
        <View className="relative flex-1 overflow-hidden rounded-2xl bg-card p-4 shadow-sm dark:bg-charcoal-850">
          <Text className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase dark:text-neutral-400">Metacritic</Text>
          <Text className="mt-1 font-heading text-lg font-bold text-foreground dark:text-white">{form.metacritic || '-'}</Text>
          <Text className="absolute -right-2 -bottom-2 text-6xl text-muted/50 dark:text-charcoal-700/50">★</Text>
        </View>
      </View>

      {form.genre && (
        <View className="mt-4 rounded-2xl bg-card p-4 shadow-sm dark:bg-charcoal-850">
          <Text className="mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase dark:text-neutral-400">Género</Text>
          <View className="flex-row flex-wrap gap-2">
            {form.genre.split(', ').map(g => (
              <View key={g} className="rounded-full bg-muted px-3 py-1.5 dark:bg-charcoal-800">
                <Text className="text-xs font-semibold text-foreground dark:text-neutral-200">{g}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="mt-4 overflow-hidden rounded-2xl bg-card shadow-sm dark:bg-charcoal-850">
        {form.cover_url && (
          <View className="h-24 w-full bg-muted dark:bg-charcoal-800">
            <Image source={form.cover_url} className="size-full opacity-90" contentFit="cover" />
          </View>
        )}
        <View className="p-4">
          <Text className="text-[10px] text-muted-foreground italic dark:text-neutral-400">Información sugerida desde</Text>
          <Text className="font-heading text-base font-bold text-foreground dark:text-white">Base de datos IGDB</Text>
          <Text className="mt-1 text-xs text-muted-foreground dark:text-neutral-400">Los datos se sincronizarán automáticamente.</Text>
        </View>
      </View>
    </MotiView>
  );
}

export function StepSearch({ form, setForm }: Props) {
  const { results, isSearching, error, setResults, setError } = useIgdbSearch(form.title, form.igdb_id);
  const duplicateGameMessage = useMemo(() => {
    const existingGame = findExistingGame(form);
    return existingGame ? getDuplicateGameMessage(existingGame) : null;
  }, [form]);

  function applySuggestion(game: IgdbSuggestion) {
    setForm(prev => ({
      ...prev,
      title: game.title,
      platform: game.platforms.join(', '),
      cover_url: game.cover_url,
      genre: game.genres.join(', '),
      release_year: game.release_year,
      metacritic: game.metacritic,
      igdb_id: game.igdb_id,
      platform_logo_url: game.platform_logo_url,
    }));
    setResults([]);
    setError(null);
  }

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: -20 }}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-8">
        <View className="mb-6">
          <Text className="font-heading text-3xl/9 font-bold text-foreground dark:text-white">
            Encuentra tu
            {'\n'}
            próximo desafío
          </Text>
          <Text className="mt-2 text-base/6 text-muted-foreground dark:text-neutral-400">
            Busca un juego y completa su ficha desde IGDB para mantener tu colección impecable.
          </Text>
        </View>

        {error && (
          <View className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <Text className="text-destructive">{error}</Text>
          </View>
        )}

        {duplicateGameMessage && (
          <View className="mb-4 rounded-xl border border-warning-300 bg-warning-50 p-4 dark:border-warning-700/50 dark:bg-warning-900/30">
            <Text className="font-semibold text-warning-800 dark:text-warning-400">Juego ya guardado</Text>
            <Text className="mt-1 text-warning-700 dark:text-warning-300">{duplicateGameMessage}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-muted-foreground dark:text-neutral-300">Nombre del juego</Text>
          <Input
            value={form.title}
            onChangeText={val => setForm(prev => ({ ...prev, title: val, igdb_id: null }))}
            placeholder="Escribe el título..."
            className="rounded-2xl border border-border bg-card dark:border-charcoal-700 dark:bg-charcoal-850 dark:text-white"
          />
          {isSearching && (
            <Text className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400">Buscando en IGDB...</Text>
          )}
          {results.length > 0 && (
            <View className="mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-charcoal-700 dark:bg-charcoal-850">
              {results.map(res => (
                <Pressable
                  key={res.igdb_id}
                  onPress={() => applySuggestion(res)}
                  className="border-b border-border p-4 last:border-b-0 active:bg-muted dark:border-charcoal-700 dark:active:bg-charcoal-800"
                >
                  <Text className="font-heading font-semibold text-foreground dark:text-white">{res.title}</Text>
                  <Text className="mt-1 text-xs text-muted-foreground dark:text-neutral-400">
                    {res.platforms.slice(0, 2).join(', ')}
                    {res.release_year ? ` · ${res.release_year}` : ''}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <PreviewCard form={form} />
      </ScrollView>
    </MotiView>
  );
}
