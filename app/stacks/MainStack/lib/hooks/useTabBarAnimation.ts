import { useEffect } from "react";
import { useSpringAnimation } from "@/src/shared/lib/hooks/animation/useSpringAnimation";
import { useAnimationStore } from "@/src/shared/store";

export const useTabBarAnimation = () => {
  const { animation, animate } = useSpringAnimation();
  const { tabBar, setTabBar } = useAnimationStore();

  useEffect(() => {
    setTimeout(() => {
      setTabBar(1);
    }, 500);
  }, []);

  useEffect(() => {
    animate(tabBar);
  }, [tabBar]);

  return { animation };
};
