import { useSpringAnimation } from "@/src/shared/lib/hooks/animation/useSpringAnimation";
import { useAnimationStore } from "@/src/shared/store";
import { useEffect } from "react";

export const useTabBarAnimation = () => {
  const { animation, animate } = useSpringAnimation(undefined, {
    useNativeDriver: true,
  });
  const { tabBar, setTabBar } = useAnimationStore();

  useEffect(() => {
    setTimeout(() => {
      setTabBar(1);
    }, 1000);
  }, []);

  useEffect(() => {
    animate(tabBar);
  }, [tabBar]);

  return { animation };
};
