import { tokenService } from "@/src/shared/store";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_STORAGE_KEY,
  NotificationSettingKey,
  NotificationSettings,
} from "@/src/widgets/settings/NotificationsView/model/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { notificationService } from "../services/NotificationService";
import { useT } from "./useLang";

interface UseNotificationInitReturn {
  isInitialized: boolean;
  initializationError: string | null;
  retryInitialization: () => Promise<void>;
  // Настройки уведомлений
  settings: NotificationSettings;
  isLoading: boolean;
  isSaving: boolean;
  updateSetting: (key: NotificationSettingKey, value: boolean) => Promise<void>;
  isSettingEnabled: (key: NotificationSettingKey) => boolean;
}

/**
 * Безопасный хук для инициализации уведомлений
 * Запускается после полной загрузки приложения с задержкой
 */
export const useNotificationInit = (): UseNotificationInitReturn => {
  const t = useT();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null
  );

  // Состояния для настроек уведомлений
  const [settings, setSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка настроек из AsyncStorage
  const loadSettings = useCallback(async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(
        NOTIFICATION_SETTINGS_STORAGE_KEY
      );
      if (storedSettings) {
        const parsedSettings = JSON.parse(
          storedSettings
        ) as NotificationSettings;
        // Мержим с дефолтными настройками на случай добавления новых полей
        setSettings({ ...DEFAULT_NOTIFICATION_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек уведомлений:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение настроек в AsyncStorage
  const saveSettings = useCallback(
    async (newSettings: NotificationSettings) => {
      setIsSaving(true);
      try {
        await AsyncStorage.setItem(
          NOTIFICATION_SETTINGS_STORAGE_KEY,
          JSON.stringify(newSettings)
        );
        setSettings(newSettings);
      } catch (error) {
        console.error("Ошибка сохранения настроек уведомлений:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Обновление расписания уведомлений на основе настроек
  const updateNotificationSchedules = useCallback(
    async (currentSettings: NotificationSettings) => {
      try {
        // Если push-уведомления отключены, отменяем все
        if (!currentSettings.pushNotifications) {
          await notificationService.cancelDailyReminder();
          await notificationService.cancelWeeklyReminder();
          return;
        }

        // Настройка ежедневного напоминания
        if (currentSettings.dailyReminders) {
          await notificationService.scheduleDailyReminder({
            title: t("notifications.dailyReminder.title"),
            body: t("notifications.dailyReminder.body"),
            hour: 20, // 20:00
            minute: 0,
          });
        } else {
          await notificationService.cancelDailyReminder();
        }

        // Настройка еженедельного напоминания
        if (currentSettings.summaryReports) {
          await notificationService.scheduleWeeklyReminder({
            title: t("notifications.weeklyReport.title"),
            body: t("notifications.weeklyReport.body"),
            weekday: 6, // Суббота (1 = Monday, 6 = Saturday)
            hour: 18, // 18:00
            minute: 0,
          });
        } else {
          await notificationService.cancelWeeklyReminder();
        }
      } catch (error) {
        console.error("Ошибка при обновлении расписания уведомлений:", error);
      }
    },
    [t]
  );

  // Обновление отдельной настройки
  const updateSetting = useCallback(
    async (key: NotificationSettingKey, value: boolean) => {
      // Избегаем лишних обновлений, если значение не изменилось
      if (settings[key] === value) return;

      const newSettings = { ...settings, [key]: value };

      // Если отключаем push-уведомления, отключаем все остальные
      if (key === "pushNotifications" && !value) {
        newSettings.dailyReminders = false;
        newSettings.summaryReports = false;
        newSettings.aiInsights = false;
      }

      // Если включаем push-уведомления, включаем все доступные типы уведомлений
      if (key === "pushNotifications" && value) {
        newSettings.dailyReminders = true;
        newSettings.summaryReports = true;
        // aiInsights оставляем false, так как эта функция пока недоступна
      }

      await saveSettings(newSettings);

      // Обновляем уведомления на основе новых настроек
      await updateNotificationSchedules(newSettings);
    },
    [settings, saveSettings, updateNotificationSchedules]
  );

  // Проверка, доступна ли настройка (зависит от главного переключателя)
  const isSettingEnabled = useCallback(
    (key: NotificationSettingKey) => {
      if (key === "pushNotifications") return true;
      return settings.pushNotifications;
    },
    [settings.pushNotifications]
  );

  const initializeNotifications = useCallback(async (): Promise<void> => {
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
        // Настраиваем уведомления на основе пользовательских настроек
        await updateNotificationSchedules(settings);
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
  }, [settings, updateNotificationSchedules]);

  const retryInitialization = async (): Promise<void> => {
    setInitializationError(null);
    await initializeNotifications();
  };

  // Загружаем настройки при инициализации
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    // Добавляем задержку для обеспечения полной загрузки приложения
    const initTimer = setTimeout(() => {
      initializeNotifications();
    }, 5000); // 5 секунд задержки

    return () => {
      clearTimeout(initTimer);
    };
  }, [settings, initializeNotifications]); // Зависимость от settings, чтобы переинициализировать при изменении настроек

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
  }, [isInitialized, initializationError, initializeNotifications]);

  return {
    isInitialized,
    initializationError,
    retryInitialization,
    // Настройки уведомлений
    settings,
    isLoading,
    isSaving,
    updateSetting,
    isSettingEnabled,
  };
};
