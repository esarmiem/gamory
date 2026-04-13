import type { NewGamePayload } from '@/features/games/types';
import { router } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { Pressable, ProgressBar, Text } from '@/components/ui';
import { StepReview, StepSearch, StepStatus } from '@/features/games/components/onboarding';
import { useGames } from '@/features/games/hooks';

const initialForm: NewGamePayload = {
  title: '',
  platform: '',
  rating: null,
  cover_url: null,
  genre: null,
  release_year: null,
  metacritic: null,
  igdb_id: null,
  platform_logo_url: null,
  status: 'completed',
  quick_review: null,
};

function WizardHeader() {
  return (
    <View
      className="flex-row items-center justify-between p-4"
      style={{
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : undefined,
      }}
    >
      <Pressable onPress={() => router.back()} className="p-2">
        <Text className="text-2xl text-neutral-600">←</Text>
      </Pressable>
      <Text className="font-heading text-lg font-bold text-neutral-900">Agregar juego</Text>
      <Pressable onPress={() => router.back()} className="p-2">
        <Text className="text-xl text-neutral-600">✕</Text>
      </Pressable>
    </View>
  );
}

function WizardProgress({ step }: { step: number }) {
  const stepMap: Record<number, { text: string; value: number }> = {
    1: { text: '33%', value: 33 },
    2: { text: '66%', value: 66 },
    3: { text: '100%', value: 100 },
  };
  const text = stepMap[step]?.text || '100%';
  const value = stepMap[step]?.value || 100;

  return (
    <View className="mb-6 px-6">
      <View className="mb-2 flex-row justify-between">
        <Text className="text-[10px] font-bold tracking-[1.5px] text-neutral-500 uppercase">
          PASO
          {' '}
          {step}
          {' '}
          DE 3
        </Text>
        <Text className="text-[10px] font-bold tracking-[1.5px] text-primary-700 uppercase">
          {text}
        </Text>
      </View>
      <ProgressBar progress={value} className="h-1.5 rounded-full bg-neutral-200" />
    </View>
  );
}

function WizardFooter({
  step,
  canGoNext,
  isSaving,
  onBack,
  onNext,
  onSubmit,
}: {
  step: number;
  canGoNext: boolean;
  isSaving: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between bg-neutral-50 px-6 py-4">
      {step > 1 && (
        <Pressable onPress={onBack} className="rounded-full bg-neutral-200 px-6 py-4">
          <Text className="font-heading text-xs font-bold text-neutral-700 uppercase">← Atrás</Text>
        </Pressable>
      )}
      {step <= 1 && <View />}

      {step < 3 && (
        <Pressable
          onPress={onNext}
          disabled={!canGoNext}
          className={`flex-row items-center gap-2 rounded-full px-8 py-4 ${canGoNext ? 'bg-primary-500' : 'bg-neutral-300'}`}
        >
          <Text className={`font-heading text-xs font-bold uppercase ${canGoNext ? 'text-white' : 'text-neutral-500'}`}>Siguiente</Text>
          <Text className={`font-bold ${canGoNext ? 'text-white' : 'text-neutral-500'}`}>→</Text>
        </Pressable>
      )}
      {step >= 3 && (
        <Pressable
          onPress={onSubmit}
          disabled={isSaving || !canGoNext}
          className={`flex-row items-center gap-2 rounded-full px-8 py-4 ${canGoNext && !isSaving ? 'bg-primary-500' : 'bg-neutral-300'}`}
        >
          <Text className={`font-heading text-xs font-bold uppercase ${canGoNext && !isSaving ? 'text-white' : 'text-neutral-500'}`}>
            {isSaving ? 'Guardando...' : 'Guardar Juego'}
          </Text>
          {canGoNext && !isSaving && <Text className="font-bold text-white">✓</Text>}
        </Pressable>
      )}
    </View>
  );
}

export default function AddGameScreen() {
  const { handleAddGame } = useGames();
  const [form, setForm] = useState<NewGamePayload>(initialForm);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGoNext = () => {
    if (step === 1)
      return form.title.trim().length > 0;
    if (step === 2)
      return form.status === 'completed' || form.status === 'in_progress';
    if (step === 3)
      return form.status === 'in_progress' || form.rating !== null;
    return false;
  };

  const handleNext = () => {
    if (step < 3)
      setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1)
      setStep(step - 1);
  };

  const onSubmit = async () => {
    if (!canGoNext())
      return;
    setIsSaving(true);
    setError(null);
    try {
      await handleAddGame(form);
      router.back();
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el juego.');
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <WizardHeader />
      <WizardProgress step={step} />

      {error && (
        <View className="mx-4 mb-4 rounded-xl border border-danger-200 bg-danger-50 p-4">
          <Text className="text-danger-700">{error}</Text>
        </View>
      )}

      <View className="flex-1">
        {step === 1 && <StepSearch form={form} setForm={setForm} />}
        {step === 2 && <StepStatus form={form} setForm={setForm} />}
        {step === 3 && <StepReview form={form} setForm={setForm} />}
      </View>

      <WizardFooter
        step={step}
        canGoNext={canGoNext()}
        isSaving={isSaving}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={onSubmit}
      />
    </SafeAreaView>
  );
}
