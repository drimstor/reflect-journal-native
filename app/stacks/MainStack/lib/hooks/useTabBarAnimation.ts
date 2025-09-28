import { useSpringAnimation } from "@/src/shared/lib/hooks/animation/useSpringAnimation";
import { useAnimationStore } from "@/src/shared/store";
import { useEffect } from "react";

export const useTabBarAnimation = () => {
  const { animation, animate } = useSpringAnimation(undefined, {
    useNativeDriver: true,
  });
  const { tabBar, setTabBar } = useAnimationStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTabBar(1);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    animate(tabBar);
  }, [tabBar]);

  return { animation };
};
