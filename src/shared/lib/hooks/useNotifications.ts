import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import {
  DailyReminderConfig,
  NotificationData,
  notificationService,
} from "../services/NotificationService";
import { useT } from "./useLang";

interface UseNotificationsReturn {
  // Состояние разрешений
  permissionStatus: "granted" | "denied" | "undetermined";
  isLoading: boolean;

  // Методы для работы с уведомлениями
  sendNotification: (
    title: string,
    body: string,
    data?: Record<string, any>
  ) => Promise<string | null>;
  setupDailyReminder: (hour: number, minute: number) => Promise<boolean>;
  cancelDailyReminder: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;

  // Информация о запланированных уведомлениях
  scheduledNotifications: Notifications.NotificationRequest[];
  refreshScheduledNotifications: () => Promise<void>;

  // Утилиты
  cancelAllNotifications: () => Promise<boolean>;
}

/**
 * Хук для работы с уведомлениями
 * Предоставляет удобный интерфейс для отправки уведомлений и управления ими
 */
export const useNotifications = (): UseNotificationsReturn => {
  const t = useT();
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [isLoading, setIsLoading] = useState(true);
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notifications.NotificationRequest[]
  >([]);

  // Проверка текущего статуса разрешений
  const checkPermissionStatus = useCallback(async () => {
    try {
      const status = await notificationService.getPermissionStatus();
      setPermissionStatus(status);
    } catch (error) {
      console.error("Ошибка при проверке статуса разрешений:", error);
      setPermissionStatus("denied");
    }
  }, []);

  // Обновление списка запланированных уведомлений
  const refreshScheduledNotifications = useCallback(async () => {
    try {
      const notifications =
        await notificationService.getScheduledNotifications();
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error("Ошибка при получении запланированных уведомлений:", error);
      setScheduledNotifications([]);
    }
  }, []);

  // Запрос разрешений на уведомления
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const granted = await notificationService.ensurePermissions();
      const status = granted ? "granted" : "denied";
      setPermissionStatus(status);
      return granted;
    } catch (error) {
      console.error("Ошибка при запросе разрешений:", error);
      setPermissionStatus("denied");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Отправка уведомления
  const sendNotification = useCallback(
    async (
      title: string,
      body: string,
      data?: Record<string, any>
    ): Promise<string | null> => {
      try {
        const notificationData: NotificationData = {
          title,
          body,
          data,
        };

        const notificationId = await notificationService.sendNotification(
          notificationData
        );

        if (notificationId) {
          console.log("Уведомление отправлено:", notificationId);
          await refreshScheduledNotifications();
        }

        return notificationId;
      } catch (error) {
        console.error("Ошибка при отправке уведомления:", error);
        return null;
      }
    },
    [refreshScheduledNotifications]
  );

  // Настройка ежедневного напоминания
  const setupDailyReminder = useCallback(
    async (hour: number, minute: number): Promise<boolean> => {
      try {
        // Используем переводы для текста уведомления
        const title =
          t("notifications.dailyReminder.title") || "Время для дневника";
        const body =
          t("notifications.dailyReminder.body") ||
          "Не забудьте записать свои мысли сегодня!";

        const config: DailyReminderConfig = {
          title,
          body,
          hour,
          minute,
        };

        const success = await notificationService.scheduleDailyReminder(config);

        if (success) {
          await refreshScheduledNotifications();
          console.log(
            `Ежедневное напоминание настроено на ${hour}:${minute
              .toString()
              .padStart(2, "0")}`
          );
        }

        return success;
      } catch (error) {
        console.error("Ошибка при настройке ежедневного напоминания:", error);
        return false;
      }
    },
    [t, refreshScheduledNotifications]
  );

  // Отмена ежедневного напоминания
  const cancelDailyReminder = useCallback(async (): Promise<boolean> => {
    try {
      const success = await notificationService.cancelDailyReminder();

      if (success) {
        await refreshScheduledNotifications();
        console.log("Ежедневное напоминание отменено");
      }

      return success;
    } catch (error) {
      console.error("Ошибка при отмене ежедневного напоминания:", error);
      return false;
    }
  }, [refreshScheduledNotifications]);

  // Отмена всех уведомлений
  const cancelAllNotifications = useCallback(async (): Promise<boolean> => {
    try {
      const success = await notificationService.cancelAllNotifications();

      if (success) {
        await refreshScheduledNotifications();
        console.log("Все уведомления отменены");
      }

      return success;
    } catch (error) {
      console.error("Ошибка при отмене всех уведомлений:", error);
      return false;
    }
  }, [refreshScheduledNotifications]);

  // Инициализация при монтировании компонента
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await checkPermissionStatus();
        await refreshScheduledNotifications();
      } catch (error) {
        console.error("Ошибка при инициализации уведомлений:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [checkPermissionStatus, refreshScheduledNotifications]);

  // Подписка на события уведомлений
  useEffect(() => {
    // Обработчик получения уведомления когда приложение активно
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Уведомление получено:", notification);
      }
    );

    // Обработчик взаимодействия с уведомлением
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Пользователь взаимодействовал с уведомлением:", response);

        // Здесь можно добавить логику обработки нажатия на уведомление
        const notificationData = response.notification.request.content.data;
        if (notificationData?.type === "daily-reminder") {
          // Можно добавить навигацию к экрану создания записи
          console.log("Пользователь нажал на ежедневное напоминание");
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    permissionStatus,
    isLoading,
    sendNotification,
    setupDailyReminder,
    cancelDailyReminder,
    requestPermissions,
    scheduledNotifications,
    refreshScheduledNotifications,
    cancelAllNotifications,
  };
};
