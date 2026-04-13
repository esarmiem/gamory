import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Image, Pressable, SafeAreaView, Text, View } from '@/components/ui';
import { useWelcomeSlides } from '@/features/welcome/hooks';
import { initDatabase } from '@/lib/db';
import { useIsFirstTime } from '@/lib/hooks';

function PlaceholderHero() {
  return (
    <View className="size-full items-center justify-center rounded-[32px] bg-neutral-900">
      <Text className="font-heading text-lg font-semibold text-white">Gamory</Text>
      <Text className="mt-1 text-center text-xs text-neutral-300">Imagen no disponible</Text>
    </View>
  );
}

export default function WelcomeScreen() {
  const [isFirstTime, setIsFirstTime] = useIsFirstTime();
  const [activeIndex, setActiveIndex] = useState(0);
  const { slides, isLoading, error } = useWelcomeSlides();

  const currentSlide = slides[activeIndex];
  const isLastSlide = activeIndex === slides.length - 1;

  const buttonLabel = useMemo(() => (isLastSlide ? 'Empezar' : 'Siguiente'), [isLastSlide]);

  useEffect(() => {
    if (!isFirstTime)
      router.replace('/(app)');
  }, [isFirstTime]);

  if (!isFirstTime)
    return null;

  if (isLoading && !currentSlide) {
    return (
      <SafeAreaView style={styles.screen}>
        <ActivityIndicator size="large" color="#FFD231" />
      </SafeAreaView>
    );
  }

  function handleNext() {
    if (!isLastSlide) {
      setActiveIndex(prev => prev + 1);
      return;
    }

    initDatabase();
    setIsFirstTime(false);
    router.replace('/(app)');
  }

  if (!currentSlide)
    return null;

  return (
    <SafeAreaView style={styles.screen}>
      <View className="flex-1 px-5 pb-6">
        <View className="relative mt-2 h-[56%] min-h-[360px] overflow-hidden rounded-[32px] bg-neutral-900">
          {currentSlide.imageUrl
            ? (
                <Image
                  source={currentSlide.imageUrl}
                  className="size-full"
                  contentFit="cover"
                />
              )
            : (
                <PlaceholderHero />
              )}
          <View className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1.5">
            <Text className="text-[10px] font-semibold tracking-[1px] text-white uppercase">
              {activeIndex + 1}
              {' / '}
              {slides.length}
            </Text>
          </View>
        </View>

        <View className="mt-6 flex-row gap-2">
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              className={`h-1.5 rounded-full ${index === activeIndex ? 'w-10 bg-primary-400' : 'w-4 bg-neutral-600'}`}
            />
          ))}
        </View>

        <Text className="mt-5 text-xs font-semibold tracking-[1.5px] text-primary-400 uppercase">
          {currentSlide.badge}
        </Text>
        <Text className="mt-2 font-heading text-[32px] leading-[38px] font-bold text-white">
          {currentSlide.title}
        </Text>
        <Text className="mt-3 text-base/6 text-neutral-300">
          {currentSlide.description}
        </Text>

        {error
          ? (
              <View className="mt-4 rounded-2xl border border-danger-400/40 bg-danger-400/10 px-4 py-3">
                <Text className="text-sm text-danger-200">{error}</Text>
              </View>
            )
          : null}

        <Pressable
          onPress={handleNext}
          className="mt-auto h-14 items-center justify-center rounded-full bg-primary-400"
        >
          <Text className="font-heading text-lg font-bold text-neutral-900">{buttonLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0C0C10',
  },
});
