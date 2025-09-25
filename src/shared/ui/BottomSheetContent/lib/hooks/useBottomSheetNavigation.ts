import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";

/**
 * Хук для обработки навигации после закрытия BottomSheet
 *
 * Позволяет:
 * - Автоматически перенаправлять на указанный экран
 * - Обрабатывать навигацию назад
 * - Настраивать пути для редиректа через flowData
 */
export const useBottomSheetNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {
    setNavigation,
    navigation: { isNavigate, navigateToPath, navigateParams },
  } = useBottomSheetStore();

  useEffect(() => {
    // Обработка прямой навигации на указанный экран
    if (isNavigate && navigateToPath) {
      navigation.navigate(navigateToPath, navigateParams || {});

      // Сбрасываем данные навигации
      setNavigation(false);
    }
  }, [isNavigate]);
};
