import type { IgdbSuggestion, NewGamePayload } from '@/features/games/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { ScrollView, View } from 'react-native';
import { Button, Input, Pressable, Text } from '@/components/ui';
import { useGames } from '@/features/games/hooks';
import { searchIgdb } from '@/lib/api/igdb';

type FormState = NewGamePayload;

const initialForm: FormState = {
  title: '',
  platform: '',
  rating: 3,
  cover_url: null,
  genre: null,
  release_year: null,
  metacritic: null,
  igdb_id: null,
  platform_logo_url: null,
};

type SearchSectionProps = {
  form: FormState;
  isSearching: boolean;
  results: IgdbSuggestion[];
  onApplySuggestion: (game: IgdbSuggestion) => void;
  onChangeTitle: (value: string) => void;
};

type DualFieldSectionProps = {
  leftLabel: string;
  leftValue: string;
  onChangeLeft: (value: string) => void;
  rightLabel: string;
  rightValue: string;
  onChangeRight: (value: string) => void;
  keyboardType?: 'default' | 'number-pad';
};

function AddGameHeader() {
  return (
    <View className="mb-6 flex-row items-center justify-between rounded-[24px] bg-white px-5 py-4">
      <View className="flex-1 pr-4">
        <Text className="font-heading text-2xl font-bold text-neutral-900">Agregar juego</Text>
        <Text className="mt-1 text-sm text-neutral-500">
          Busca un juego y completa su ficha desde IGDB.
        </Text>
      </View>
      <Pressable onPress={() => router.back()} className="rounded-full bg-primary-100 px-4 py-2">
        <Text className="font-heading font-semibold text-neutral-900">Cerrar</Text>
      </Pressable>
    </View>
  );
}

function ErrorAlert({ error }: { error: string | null }) {
  if (!error)
    return null;

  return (
    <View className="mb-4 rounded-[20px] border border-danger-200 bg-danger-50 p-4">
      <Text className="text-danger-700">{error}</Text>
    </View>
  );
}

function SearchSection({
  form,
  isSearching,
  results,
  onApplySuggestion,
  onChangeTitle,
}: SearchSectionProps) {
  return (
    <View className="relative mb-4 rounded-[24px] bg-white p-4">
      <Text className="mb-2 text-sm font-semibold text-neutral-600">Nombre del juego</Text>
      <Input
        value={form.title}
        onChangeText={onChangeTitle}
        placeholder="Ej: The Legend of Zelda..."
      />
      {isSearching && (
        <Text className="mt-1 text-xs font-semibold text-brand-600">Buscando en IGDB...</Text>
      )}
      {results.length > 0 && (
        <View className="mt-2 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-100">
          {results.map(res => (
            <Pressable
              key={res.igdb_id}
              onPress={() => onApplySuggestion(res)}
              className="border-b border-neutral-200 p-4 last:border-b-0"
            >
              <Text className="font-heading font-semibold text-neutral-900">{res.title}</Text>
              <Text className="text-xs text-neutral-500">
                {res.platforms.slice(0, 2).join(', ')}
                {res.release_year ? ` · ${res.release_year}` : ''}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function DualFieldSection({
  leftLabel,
  leftValue,
  onChangeLeft,
  rightLabel,
  rightValue,
  onChangeRight,
  keyboardType = 'default',
}: DualFieldSectionProps) {
  return (
    <View className="mb-4 rounded-[24px] bg-white p-4">
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="mb-2 text-sm font-semibold text-neutral-600">{leftLabel}</Text>
          <Input
            value={leftValue}
            onChangeText={onChangeLeft}
            keyboardType={keyboardType}
          />
        </View>
        <View className="flex-1">
          <Text className="mb-2 text-sm font-semibold text-neutral-600">{rightLabel}</Text>
          <Input
            value={rightValue}
            onChangeText={onChangeRight}
            keyboardType={keyboardType}
          />
        </View>
      </View>
    </View>
  );
}

function RatingSection({
  rating,
  onChangeRating,
}: {
  rating: number;
  onChangeRating: (value: number) => void;
}) {
  return (
    <View className="mb-6 rounded-[24px] bg-white p-4">
      <Text className="mb-3 text-sm font-semibold text-neutral-600">Calificación</Text>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <Pressable
            key={star}
            onPress={() => onChangeRating(star)}
            className={`size-12 items-center justify-center rounded-full ${star <= rating ? 'bg-primary-100' : 'bg-neutral-200'}`}
          >
            <Text className={`text-2xl ${star <= rating ? 'text-primary-600' : 'text-neutral-500'}`}>
              ★
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function useIgdbSearch(form: FormState) {
  const [results, setResults] = useState<IgdbSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return { error, isSearching, results, setError, setResults };
}

export default function AddGameScreen() {
  const { handleAddGame } = useGames();
  const [form, setForm] = useState<FormState>(initialForm);
  const { error, isSearching, results, setError, setResults } = useIgdbSearch(form);
  const [isSaving, setIsSaving] = useState(false);

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
    <ScrollView className="flex-1 bg-neutral-200">
      <View className="px-4 pt-6 pb-28">
        <AddGameHeader />
        <ErrorAlert error={error} />
        <SearchSection
          form={form}
          isSearching={isSearching}
          results={results}
          onApplySuggestion={applySuggestion}
          onChangeTitle={val => setForm(prev => ({ ...prev, title: val, igdb_id: null }))}
        />
        <DualFieldSection
          leftLabel="Plataforma"
          leftValue={form.platform}
          onChangeLeft={val => setForm(prev => ({ ...prev, platform: val }))}
          rightLabel="Género"
          rightValue={form.genre || ''}
          onChangeRight={val => setForm(prev => ({ ...prev, genre: val }))}
        />
        <DualFieldSection
          leftLabel="Año"
          leftValue={form.release_year ? String(form.release_year) : ''}
          onChangeLeft={val => setForm(prev => ({ ...prev, release_year: val ? Number(val) : null }))}
          rightLabel="Metacritic"
          rightValue={form.metacritic ? String(form.metacritic) : ''}
          onChangeRight={val => setForm(prev => ({ ...prev, metacritic: val ? Number(val) : null }))}
          keyboardType="number-pad"
        />
        <RatingSection
          rating={form.rating}
          onChangeRating={star => setForm(prev => ({ ...prev, rating: star }))}
        />

        <Button
          label={isSaving ? 'Guardando...' : 'Guardar juego'}
          onPress={onSubmit}
          disabled={isSaving || !form.title}
          className="mb-12 h-14 rounded-full bg-primary-400"
          textClassName="text-neutral-900"
        />
      </View>
    </ScrollView>
  );
}
