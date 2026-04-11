import type { NewGamePayload } from '@/features/games/types';
import { MotiView } from 'moti';
import * as React from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Image, Pressable, Text } from '@/components/ui';

type Props = {
  form: NewGamePayload;
  setForm: React.Dispatch<React.SetStateAction<NewGamePayload>>;
};

export function StepReview({ form, setForm }: Props) {
  const isCompleted = form.status === 'completed';

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: -20 }}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-8">

        <View className="mb-6 flex-row gap-4">
          <View className="relative h-32 w-24 overflow-hidden rounded-xl bg-neutral-300 shadow-sm">
            {form.cover_url && <Image source={form.cover_url} className="size-full" contentFit="cover" />}
            <View className="absolute top-2 left-2 rounded-sm bg-primary-400/90 px-2 py-0.5">
              <Text className="text-[8px] font-bold text-neutral-900 uppercase">{isCompleted ? 'Terminado' : 'En curso'}</Text>
            </View>
          </View>
          <View className="flex-1 pt-2">
            <Text className="font-heading text-2xl/7 font-bold text-neutral-900" numberOfLines={3}>
              {form.title}
            </Text>
            <Text className="mt-1 text-xs text-neutral-500">
              {form.genre ? form.genre.split(',')[0] : 'Sin género'}
              {' '}
              •
              {form.release_year || 'Sin año'}
            </Text>
          </View>
        </View>

        {isCompleted
          ? (
              <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="space-y-4">
                <View className="mb-4 items-center rounded-[24px] bg-white p-6 shadow-sm">
                  <Text className="mb-4 text-xs font-bold tracking-[2px] text-neutral-500 uppercase">
                    Tu calificación
                  </Text>
                  <View className="flex-row gap-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Pressable
                        key={star}
                        onPress={() => setForm(prev => ({ ...prev, rating: star }))}
                        className="p-1"
                      >
                        <Text className={`text-4xl ${form.rating && star <= form.rating ? 'text-primary-500' : 'text-neutral-200'}`}>
                          ★
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {form.rating && (
                    <Text className="mt-4 font-heading text-lg font-bold text-primary-600">
                      {form.rating === 5 ? '¡Obra Maestra!' : form.rating >= 4 ? '¡Excelente!' : form.rating === 3 ? 'Buen juego' : form.rating === 2 ? 'Regular' : 'No me gustó'}
                    </Text>
                  )}
                </View>

                <View className="rounded-[24px] bg-white p-6 shadow-sm">
                  <Text className="mb-2 font-heading text-base font-bold text-neutral-900">
                    Reseña rápida
                    {' '}
                    <Text className="text-xs font-normal text-neutral-400">(Opcional)</Text>
                  </Text>
                  <TextInput
                    value={form.quick_review || ''}
                    onChangeText={val => setForm(prev => ({ ...prev, quick_review: val }))}
                    placeholder='"Una experiencia inmersiva..."'
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    className="mt-2 min-h-[80px] text-sm text-neutral-700 italic"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>
              </MotiView>
            )
          : (
              <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} className="mt-8 items-center rounded-[24px] bg-white p-6 shadow-sm">
                <Text className="text-center font-heading text-lg font-bold text-neutral-900">
                  ¡Listo para empezar!
                </Text>
                <Text className="mt-2 text-center text-sm text-neutral-500">
                  Guarda este juego en tu colección para hacerle seguimiento. Podrás calificarlo cuando lo termines.
                </Text>
              </MotiView>
            )}

      </ScrollView>
    </MotiView>
  );
}
