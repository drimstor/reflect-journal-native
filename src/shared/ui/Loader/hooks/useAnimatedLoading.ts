import { useEffect, useState } from "react";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface UseAnimatedLoadingOptions {
  /** Длительность анимации скрытия в мс */
  hideDuration?: number;
  /** Внешний флаг загрузки, блокирует скрытие пока true */
  externalIsLoading?: boolean;
}

export const useAnimatedLoading = (options: UseAnimatedLoadingOptions = {}) => {
  const { hideDuration = 300, externalIsLoading = false } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [internalTimerFinished, setInternalTimerFinished] = useState(false);
  const opacity = useSharedValue(0);

  const startLoading = () => {
    setIsLoading(true);
    opacity.value = 1;
    setInternalTimerFinished(true);
  };

  // Эффект для скрытия когда и таймер закончился, и внешний isLoading стал false
  useEffect(() => {
    if (internalTimerFinished && !externalIsLoading && isLoading) {
      // Плавно исчезает
      opacity.value = withTiming(0, { duration: hideDuration }, () => {
        runOnJS(setIsLoading)(false);
        runOnJS(setInternalTimerFinished)(false);
      });
    }
  }, [internalTimerFinished, externalIsLoading, isLoading, hideDuration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return {
    isLoading,
    startLoading,
    animatedStyle,
  };
};
