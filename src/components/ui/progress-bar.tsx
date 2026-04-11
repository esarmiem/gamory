import * as React from 'react';
import { useImperativeHandle } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

type Props = {
  progress?: number;
  initialProgress?: number;
  className?: string;
};

export type ProgressBarRef = {
  setProgress: (value: number) => void;
};

export function ProgressBar({ ref, progress: progressProp, initialProgress = 0, className = '' }: Props & { ref?: React.RefObject<ProgressBarRef | null> }) {
  const progress = useSharedValue<number>(progressProp ?? initialProgress ?? 0);

  React.useEffect(() => {
    if (progressProp !== undefined) {
      progress.value = withTiming(progressProp, {
        duration: 250,
        easing: Easing.inOut(Easing.quad),
      });
    }
  }, [progressProp, progress]);
  useImperativeHandle(ref, () => {
    return {
      setProgress: (value: number) => {
        progress.value = withTiming(value, {
          duration: 250,
          easing: Easing.inOut(Easing.quad),
        });
      },
    };
  }, [progress]);

  const style = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
      backgroundColor: '#000',
      height: 2,
    };
  });
  return (
    <View className={twMerge(`bg-[#EAEAEA]`, className)}>
      <Animated.View style={style} />
    </View>
  );
}
