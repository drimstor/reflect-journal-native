import { useTimingAnimation } from "@/src/shared/lib/hooks";

export const useMessageAnimation = () => {
  const { animation: translateY, animate: animateTranslate } =
    useTimingAnimation(undefined, {
      initialValue: 0,
      useNativeDriver: true,
    });

  const { animation: scale, animate: animateScale } = useTimingAnimation(
    undefined,
    {
      initialValue: 1,
      useNativeDriver: true,
    }
  );

  const scaleAnimation = (scale: number) => {
    animateScale(scale);
  };

  const translateAnimation = (offset: number) => {
    animateTranslate(offset);
  };

  const animatedStyle = {
    transform: [{ scale }, { translateY }],
  };

  return {
    animatedStyle,
    translateAnimation,
    scaleAnimation,
  };
};
