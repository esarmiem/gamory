import type { IgdbSuggestion, NewGamePayload } from '@/features/games/types';
import { MotiView } from 'moti';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Image, Input, Pressable, Text } from '@/components/ui';
import { useIgdbSearch } from '@/features/games/hooks';

type Props = {
  form: NewGamePayload;
  setForm: React.Dispatch<React.SetStateAction<NewGamePayload>>;
};

function PreviewCard({ form }: { form: NewGamePayload }) {
  if (!form.igdb_id)
    return null;
  return (
    <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 space-y-4">
      <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">Plataforma</Text>
        <Text className="mt-1 font-heading text-base font-semibold text-neutral-900">{form.platform}</Text>
      </View>

      <View className="mt-4 flex-row gap-4">
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">Año</Text>
          <Text className="mt-1 font-heading text-lg font-bold text-neutral-900">{form.release_year || '-'}</Text>
        </View>
        <View className="relative flex-1 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">Metacritic</Text>
          <Text className="mt-1 font-heading text-lg font-bold text-neutral-900">{form.metacritic || '-'}</Text>
          <Text className="absolute -right-2 -bottom-2 text-6xl text-neutral-100/50">★</Text>
        </View>
      </View>

      {form.genre && (
        <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 text-[10px] font-bold tracking-wider text-neutral-500 uppercase">Género</Text>
          <View className="flex-row flex-wrap gap-2">
            {form.genre.split(', ').map(g => (
              <View key={g} className="rounded-full bg-neutral-100 px-3 py-1.5">
                <Text className="text-xs font-semibold text-neutral-700">{g}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        {form.cover_url && (
          <View className="h-24 w-full bg-neutral-200">
            <Image source={form.cover_url} className="size-full opacity-90" contentFit="cover" />
          </View>
        )}
        <View className="p-4">
          <Text className="text-[10px] text-neutral-500 italic">Información sugerida desde</Text>
          <Text className="font-heading text-base font-bold text-neutral-900">Base de datos IGDB</Text>
          <Text className="mt-1 text-xs text-neutral-500">Los datos se sincronizarán automáticamente.</Text>
        </View>
      </View>
    </MotiView>
  );
}

export function StepSearch({ form, setForm }: Props) {
  const { results, isSearching, error, setResults, setError } = useIgdbSearch(form.title, form.igdb_id);

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
          <Text className="font-heading text-3xl/9 font-bold text-neutral-900">
            Encuentra tu
            {'\n'}
            próximo desafío
          </Text>
          <Text className="mt-2 text-base/6 text-neutral-600">
            Busca un juego y completa su ficha desde IGDB para mantener tu colección impecable.
          </Text>
        </View>

        {error && (
          <View className="mb-4 rounded-xl border border-danger-200 bg-danger-50 p-4">
            <Text className="text-danger-700">{error}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-2 text-sm font-semibold text-neutral-600">Nombre del juego</Text>
          <Input
            value={form.title}
            onChangeText={val => setForm(prev => ({ ...prev, title: val, igdb_id: null }))}
            placeholder="Escribe el título..."
            className="rounded-2xl border border-neutral-200 bg-white"
          />
          {isSearching && (
            <Text className="mt-2 text-xs font-semibold text-brand-600">Buscando en IGDB...</Text>
          )}
          {results.length > 0 && (
            <View className="mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {results.map(res => (
                <Pressable
                  key={res.igdb_id}
                  onPress={() => applySuggestion(res)}
                  className="border-b border-neutral-100 p-4 last:border-b-0 active:bg-neutral-50"
                >
                  <Text className="font-heading font-semibold text-neutral-900">{res.title}</Text>
                  <Text className="mt-1 text-xs text-neutral-500">
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
