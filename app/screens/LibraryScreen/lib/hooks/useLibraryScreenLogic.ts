import { Chat, Journal } from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { EntityType, NavigationProps } from "@/src/shared/model/types";
import { useFiltersStore } from "@/src/shared/store";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { LIBRARY_ITEMS } from "../../const/static";

export const useLibraryScreenLogic = ({
  snapToIndex,
  bottomSheetIndex,
}: {
  snapToIndex: (index: number) => void;
  bottomSheetIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<NavigationProps>();
  const { resetFilters } = useFiltersStore();

  // Обработка выбора элемента в списке
  const onOpenListItem = (item: Journal | Chat) => {
    const variant = LIBRARY_ITEMS[currentIndex].id as EntityType;
    const params = { variant, item };

    // Для чатов сразу переходим на экран чата
    if (currentIndex === 1) {
      return navigation.navigate(PATHS.CHAT, params);
    }

    // Для остальных элементов - логика навигации в зависимости от типа
    const navigateToNextScreen = () => {
      resetFilters();

      if (bottomSheetIndex === 1) {
        // Для дневников (0) и тестов (4) переходим на список
        if (currentIndex === 0 || currentIndex === 4) {
          return navigation.navigate(PATHS.LIBRARY_LIST, params);
        } else {
          return navigation.navigate(PATHS.LIBRARY_ITEM, params);
        }
      }

      snapToIndex(1);
      setTimeout(() => {
        // Для дневников (0) и тестов (4) переходим на список
        if (currentIndex === 0 || currentIndex === 4) {
          return navigation.navigate(PATHS.LIBRARY_LIST, params);
        } else {
          navigation.navigate(PATHS.LIBRARY_ITEM, params);
        }
      }, 350);
    };

    return navigateToNextScreen();
  };

  // Обработчик изменения индекса карусели
  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
    resetFilters();
  };

  return {
    currentIndex,
    setCurrentIndex: handleIndexChange,
    onOpenListItem,
  };
};
