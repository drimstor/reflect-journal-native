import { PATHS } from "@/src/shared/const";
import { useSpringAnimation } from "@/src/shared/lib/hooks/animation/useSpringAnimation";
import { useTabBarStore } from "@/src/shared/store";
import { useEffect } from "react";

export const useTabBarAnimation = () => {
  const { animation, animate } = useSpringAnimation(undefined, {
    useNativeDriver: true,
  });
  const {
    tabBar,
    setTabBar,
    checkDailyActivation,
    isItemActive,
    items,
    activateItem,
  } = useTabBarStore();

  // Инициализация таб-бара и проверка ежедневных элементов
  useEffect(() => {
    // Инициализация PATHS.HOME как daily элемента, если его еще нет
    if (!items[PATHS.HOME]) {
      activateItem(PATHS.HOME, "daily");
    }

    // Проверяем ежедневные активации
    checkDailyActivation();

    // Анимация появления таб-бара
    const timer = setTimeout(() => {
      setTabBar(1);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    animate(tabBar);
  }, [tabBar]);

  return {
    animation,
    isItemActive,
  };
};
