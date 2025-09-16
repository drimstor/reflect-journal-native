import { tokenService } from "@/src/shared/store";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { notificationService } from "../services/NotificationService";

interface UseNotificationInitReturn {
  isInitialized: boolean;
  initializationError: string | null;
  retryInitialization: () => Promise<void>;
}

/**
 * Безопасный хук для инициализации уведомлений
 * Запускается после полной загрузки приложения с задержкой
 */
export const useNotificationInit = (): UseNotificationInitReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null
  );

  const initializeNotifications = async (): Promise<void> => {
    try {
      console.log("Начинаем инициализацию уведомлений...");

      // Проверяем, что это физическое устройство
      if (!Device.isDevice) {
        console.log("Уведомления доступны только на физических устройствах");
        setIsInitialized(true); // Считаем инициализацию завершенной
        return;
      }

      // Проверяем, что пользователь авторизован
      const isAuthenticated = await tokenService.isAuthenticated();
      if (!isAuthenticated) {
        console.log(
          "Пользователь не авторизован, пропускаем инициализацию уведомлений"
        );
        setIsInitialized(true); // Считаем инициализацию завершенной
        return;
      }

      // Запрашиваем разрешения
      const hasPermissions = await notificationService.ensurePermissions();
      console.log(
        "Разрешения на уведомления:",
        hasPermissions ? "получены" : "отклонены"
      );

      if (hasPermissions) {
        // Настраиваем ежедневное напоминание на 20:00
        const success = await notificationService.scheduleDailyReminder({
          title: "Время для дневника",
          body: "Не забудьте записать свои мысли сегодня!",
          hour: 20,
          minute: 0,
        });

        if (success) {
          console.log("Ежедневное напоминание настроено успешно");
        } else {
          console.warn("Не удалось настроить ежедневное напоминание");
        }
      }

      setIsInitialized(true);
      setInitializationError(null);
      console.log("Инициализация уведомлений завершена успешно");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      console.error("Ошибка при инициализации уведомлений:", error);
      setInitializationError(errorMessage);
      setIsInitialized(false);
    }
  };

  const retryInitialization = async (): Promise<void> => {
    setInitializationError(null);
    await initializeNotifications();
  };

  useEffect(() => {
    // Добавляем задержку для обеспечения полной загрузки приложения
    const initTimer = setTimeout(() => {
      initializeNotifications();
    }, 2000); // 2 секунды задержки

    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  // Переинициализация при возврате приложения из фона
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && !isInitialized && !initializationError) {
        // Если приложение стало активным и уведомления не инициализированы,
        // пытаемся инициализировать их снова
        setTimeout(() => {
          initializeNotifications();
        }, 1000);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, [isInitialized, initializationError]);

  return {
    isInitialized,
    initializationError,
    retryInitialization,
  };
};
