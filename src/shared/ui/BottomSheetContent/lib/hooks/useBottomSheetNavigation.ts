import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const { setNavigation, navigation: navigationStore } = useBottomSheetStore();

  useEffect(() => {
    // Обработка прямой навигации на указанный экран
    if (navigationStore.isNavigate && navigationStore.navigateToPath) {
      navigation.navigate(
        navigationStore.navigateToPath,
        navigationStore.navigateParams || {}
      );

      // Сбрасываем данные навигации
      setNavigation(false);
    }
  }, [navigationStore.isNavigate]);
};
