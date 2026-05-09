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
  indicatorClassName?: string;
};

export type ProgressBarRef = {
  setProgress: (value: number) => void;
};

export function ProgressBar({ ref, progress: progressProp, initialProgress = 0, className = '', indicatorClassName = 'bg-primary-500 dark:bg-primary-400' }: Props & { ref?: React.RefObject<ProgressBarRef | null> }) {
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
      height: '100%',
    };
  });
  return (
    <View className={twMerge(`h-2 overflow-hidden bg-[#EAEAEA] dark:bg-charcoal-700`, className)}>
      <Animated.View style={style} className={indicatorClassName} />
    </View>
  );
}
