import { useScreenInfoStore } from "@/src/shared/store";
import { SCREEN_NAMES } from "../../const/screenNames";

/**
 * Кастомный хук для обработки изменений состояния навигации
 * Автоматически обновляет информацию о текущем экране в store
 */
export const useNavigationHandler = () => {
  const { setScreenInfo } = useScreenInfoStore();

  // Получаем текущий активный маршрут из состояния навигации
  const getCurrentRoute = (navigationState: any): any => {
    if (!navigationState.routes || navigationState.index === undefined) {
      return navigationState;
    }

    const currentRoute = navigationState.routes[navigationState.index];

    // Если это вложенная навигация, рекурсивно ищем активный маршрут
    if (currentRoute.state) {
      return getCurrentRoute(currentRoute.state);
    }

    return currentRoute;
  };

  // Обработчик изменения состояния навигации
  const handleStateChange = (state: any) => {
    if (!state) return;

    const currentRoute = getCurrentRoute(state);
    const screenName = SCREEN_NAMES[currentRoute.name];

    if (screenName) {
      setScreenInfo({ name: screenName });
    }
  };

  return {
    handleStateChange,
  };
};
