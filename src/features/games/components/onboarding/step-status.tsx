import type { NewGamePayload } from '@/features/games/types';
import { MotiView } from 'moti';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Pressable, Text } from '@/components/ui';
import { CheckCircle, PlayCircle } from '@/components/ui/icons';

type Props = {
  form: NewGamePayload;
  setForm: React.Dispatch<React.SetStateAction<NewGamePayload>>;
};

export function StepStatus({ form, setForm }: Props) {
  const isCompleted = form.status === 'completed';
  const isInProgress = form.status === 'in_progress';

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: -20 }}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-8">
        <View className="mb-8">
          <Text className="font-heading text-3xl/9 font-bold text-neutral-900">
            ¿Cuál es el estado de
            {'\n'}
            este juego?
          </Text>
          <Text className="mt-2 text-base/6 text-neutral-600">
            Cuéntanos si ya has terminado esta aventura o si todavía estás en medio de la acción.
          </Text>
        </View>

        <Pressable
          onPress={() => setForm(prev => ({ ...prev, status: 'completed' }))}
          className={`mb-4 rounded-[24px] border-2 p-5 ${isCompleted ? 'border-primary-400 bg-white' : 'border-transparent bg-neutral-100'}`}
        >
          <View className={`mb-3 size-12 items-center justify-center rounded-full ${isCompleted ? 'bg-primary-400' : 'bg-neutral-200'}`}>
            <CheckCircle color={isCompleted ? '#fff' : '#8B8B8B'} />
          </View>
          <Text className="font-heading text-xl font-bold text-neutral-900">Terminado</Text>
          <Text className="mt-2 text-sm/5 text-neutral-500">
            ¡Lo lograste! El juego está completo y listo para tu vitrina de trofeos.
          </Text>
          {isCompleted && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex-row items-center">
              <Text className="text-xs font-bold tracking-wider text-primary-700">SELECCIONADO ✓</Text>
            </MotiView>
          )}
        </Pressable>

        <Pressable
          onPress={() => setForm(prev => ({ ...prev, status: 'in_progress' }))}
          className={`mb-6 rounded-[24px] border-2 p-5 ${isInProgress ? 'border-primary-400 bg-white' : 'border-transparent bg-neutral-100'}`}
        >
          <View className={`mb-3 size-12 items-center justify-center rounded-full ${isInProgress ? 'bg-primary-400' : 'bg-neutral-200'}`}>
            <PlayCircle color={isInProgress ? '#fff' : '#8B8B8B'} />
          </View>
          <Text className="font-heading text-xl font-bold text-neutral-900">En curso</Text>
          <Text className="mt-2 text-sm/5 text-neutral-500">
            Sigues jugando. Mantén un registro de tus progresos actuales.
          </Text>
          {isInProgress && (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex-row items-center">
              <Text className="text-xs font-bold tracking-wider text-primary-700">SELECCIONADO ✓</Text>
            </MotiView>
          )}
        </Pressable>

        <View className="relative h-40 items-center justify-center overflow-hidden rounded-[24px] bg-neutral-300">
          <View className="absolute inset-0 bg-neutral-800/40" />
          <Text className="text-center text-sm font-medium text-white italic shadow-sm">
            "Cada partida es una nueva historia."
          </Text>
        </View>

      </ScrollView>
    </MotiView>
  );
}
