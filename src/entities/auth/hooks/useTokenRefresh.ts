import { useCallback, useEffect } from "react";
import { tokenService } from "@/src/shared/store";
import { useRefreshMutation } from "@/src/entities/auth/api/authApi";
import { useNavigation } from "@react-navigation/native";
import { PATHS } from "@/src/shared/const";
import { NavigationProps } from "@/src/shared/model/types";

export const useTokenRefresh = () => {
  const navigation = useNavigation<NavigationProps>();
  const [refreshMutation] = useRefreshMutation();

  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = await tokenService.getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error("No refresh token found");
      }
      const result = await refreshMutation(currentRefreshToken).unwrap();
      await tokenService.setTokens(result.access_token, result.refresh_token);
    } catch (err) {
      console.log(err);
      await tokenService.removeTokens();
      navigation.navigate(PATHS.AUTH);
    }
  }, []);

  useEffect(() => {
    const REFRESH_BEFORE_EXPIRY = 60 * 1000; // Обновляем за 1 минуту до истечения
    let refreshTimer: NodeJS.Timeout;

    const setupRefreshTimer = async () => {
      const accessToken = await tokenService.getAccessToken();
      if (!accessToken) return;

      try {
        // Декодируем JWT токен для получения времени истечения
        const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
        const expiresIn = tokenData.exp * 1000; // Переводим в миллисекунды
        const refreshTime = expiresIn - Date.now() - REFRESH_BEFORE_EXPIRY;

        if (refreshTime <= 0) {
          // Если токен уже истек или истекает скоро, обновляем немедленно
          await refreshToken();
        } else {
          // Устанавливаем таймер на обновление
          refreshTimer = setTimeout(async () => {
            try {
              await refreshToken();
              // После успешного обновления устанавливаем новый таймер
              setupRefreshTimer();
            } catch (error) {
              console.error("Failed to refresh token:", error);
            }
          }, REFRESH_BEFORE_EXPIRY);
        }
      } catch (error) {
        console.error("Error processing token:", error);
        navigation.navigate(PATHS.AUTH);
      }
    };

    setupRefreshTimer();

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [refreshToken]);
};
