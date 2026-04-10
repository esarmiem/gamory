import type { IgdbSuggestion, NewGamePayload } from '@/features/games/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { ScrollView, View } from 'react-native';
import { Button, Input, Pressable, Text } from '@/components/ui';
import { useGames } from '@/features/games/hooks';
import { searchIgdb } from '@/lib/api/igdb';

export default function AddGameScreen() {
  const { handleAddGame } = useGames();
  const [results, setResults] = useState<IgdbSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NewGamePayload>({
    title: '',
    platform: '',
    rating: 3,
    cover_url: null,
    genre: null,
    release_year: null,
    metacritic: null,
    igdb_id: null,
    platform_logo_url: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const term = form.title.trim();
    if (term.length < 2 || form.igdb_id !== null) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const res = await searchIgdb(term);
        setResults(res);
      }
      catch (err) {
        setResults([]);
        setError(String(err));
      }
      finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [form.title, form.igdb_id]);

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

  async function onSubmit() {
    if (!form.title.trim())
      return;
    setIsSaving(true);
    try {
      await handleAddGame(form);
      router.back();
    }
    catch (err) {
      setError(String(err));
      setIsSaving(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-neutral-900 p-4 pt-8">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">Agregar juego</Text>
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-primary-300">Cerrar</Text>
        </Pressable>
      </View>

      {error
        ? (
            <View className="mb-4 rounded-sm bg-red-900/50 p-3">
              <Text className="text-red-200">{error}</Text>
            </View>
          )
        : null}

      <View className="relative mb-4">
        <Text className="mb-1 text-sm text-neutral-400">Nombre del juego</Text>
        <Input
          value={form.title}
          onChangeText={val => setForm(prev => ({ ...prev, title: val, igdb_id: null }))}
          placeholder="Ej: The Legend of Zelda..."
          className="bg-neutral-800 text-white"
        />
        {isSearching && (
          <Text className="mt-1 text-xs text-primary-300">Buscando en IGDB…</Text>
        )}
        {results.length > 0 && (
          <View className="mt-2 rounded-xl border border-neutral-700 bg-neutral-800">
            {results.map(res => (
              <Pressable
                key={res.igdb_id}
                onPress={() => applySuggestion(res)}
                className="border-b border-neutral-700 p-3 last:border-b-0"
              >
                <Text className="font-semibold text-white">{res.title}</Text>
                <Text className="text-xs text-neutral-400">
                  {res.platforms.slice(0, 2).join(', ')}
                  {res.release_year ? ` · ${res.release_year}` : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4 flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-1 text-sm text-neutral-400">Plataforma</Text>
          <Input
            value={form.platform}
            onChangeText={val => setForm(prev => ({ ...prev, platform: val }))}
            className="bg-neutral-800 text-white"
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm text-neutral-400">Género</Text>
          <Input
            value={form.genre || ''}
            onChangeText={val => setForm(prev => ({ ...prev, genre: val }))}
            className="bg-neutral-800 text-white"
          />
        </View>
      </View>

      <View className="mb-4 flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-1 text-sm text-neutral-400">Año</Text>
          <Input
            value={form.release_year ? String(form.release_year) : ''}
            onChangeText={val => setForm(prev => ({ ...prev, release_year: val ? Number(val) : null }))}
            keyboardType="number-pad"
            className="bg-neutral-800 text-white"
          />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm text-neutral-400">Metacritic</Text>
          <Input
            value={form.metacritic ? String(form.metacritic) : ''}
            onChangeText={val => setForm(prev => ({ ...prev, metacritic: val ? Number(val) : null }))}
            keyboardType="number-pad"
            className="bg-neutral-800 text-white"
          />
        </View>
      </View>

      <View className="mb-6">
        <Text className="mb-2 text-sm text-neutral-400">Calificación</Text>
        <View className="flex-row gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Pressable
              key={star}
              onPress={() => setForm(prev => ({ ...prev, rating: star }))}
              className={`size-12 items-center justify-center rounded-full ${star <= form.rating ? 'bg-amber-400/20' : 'bg-neutral-800'}`}
            >
              <Text className={`text-2xl ${star <= form.rating ? 'text-amber-400' : 'text-neutral-500'}`}>
                ★
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Button
        label={isSaving ? 'Guardando...' : 'Guardar juego'}
        onPress={onSubmit}
        disabled={isSaving || !form.title}
        className="mb-12 bg-primary-600"
      />
    </ScrollView>
  );
}
