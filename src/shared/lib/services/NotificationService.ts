import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Типы для уведомлений
export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface DailyReminderConfig {
  title: string;
  body: string;
  hour: number; // 0-23
  minute: number; // 0-59
}

export interface WeeklyReminderConfig {
  title: string;
  body: string;
  weekday: number; // 1-7 (1 = Monday, 7 = Sunday)
  hour: number; // 0-23
  minute: number; // 0-59
}

// Идентификаторы для уведомлений
const DAILY_REMINDER_ID = "daily-journal-reminder";
const WEEKLY_REMINDER_ID = "weekly-summary-reminder";

/**
 * Сервис для работы с локальными уведомлениями
 */
export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.initializeNotificationHandler();
  }

  /**
   * Получить экземпляр сервиса (Singleton)
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Инициализация обработчика уведомлений
   */
  private initializeNotificationHandler(): void {
    // Настройка поведения уведомлений при получении
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  /**
   * Проверка и запрос разрешений на уведомления
   */
  public async ensurePermissions(): Promise<boolean> {
    try {
      // Проверяем, что это физическое устройство
      if (!Device.isDevice) {
        console.warn("Уведомления работают только на физических устройствах");
        return false;
      }

      // Получаем текущие разрешения
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Если разрешения не предоставлены, запрашиваем их
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Для Android настраиваем канал уведомлений
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#4da3b0",
        });
      }

      return finalStatus === "granted";
    } catch (error) {
      console.error("Ошибка при запросе разрешений на уведомления:", error);
      return false;
    }
  }

  /**
   * Отправка немедленного уведомления
   */
  public async sendNotification(
    notificationData: NotificationData
  ): Promise<string | null> {
    try {
      // Проверяем разрешения
      const hasPermissions = await this.ensurePermissions();
      if (!hasPermissions) {
        console.warn("Нет разрешений на отправку уведомлений");
        return null;
      }

      // Отправляем уведомление
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data || {},
        },
        trigger: null, // Немедленная отправка
      });

      return notificationId;
    } catch (error) {
      console.error("Ошибка при отправке уведомления:", error);
      return null;
    }
  }

  /**
   * Планирование ежедневного напоминания
   */
  public async scheduleDailyReminder(
    config: DailyReminderConfig
  ): Promise<boolean> {
    try {
      // Проверяем разрешения
      const hasPermissions = await this.ensurePermissions();
      if (!hasPermissions) {
        console.warn("Нет разрешений на планирование уведомлений");
        return false;
      }

      // Отменяем предыдущее ежедневное напоминание
      await this.cancelDailyReminder();

      // Создаем новое ежедневное напоминание
      await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: { type: "daily-reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: config.hour,
          minute: config.minute,
          // repeats: true,
        },
        identifier: DAILY_REMINDER_ID,
      });

      console.log(
        `Ежедневное напоминание запланировано на ${config.hour}:${config.minute
          .toString()
          .padStart(2, "0")}`
      );
      return true;
    } catch (error) {
      console.error("Ошибка при планировании ежедневного напоминания:", error);
      return false;
    }
  }

  /**
   * Отмена ежедневного напоминания
   */
  public async cancelDailyReminder(): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
      console.log("Ежедневное напоминание отменено");
      return true;
    } catch (error) {
      console.error("Ошибка при отмене ежедневного напоминания:", error);
      return false;
    }
  }

  /**
   * Планирование еженедельного напоминания
   */
  public async scheduleWeeklyReminder(
    config: WeeklyReminderConfig
  ): Promise<boolean> {
    try {
      // Проверяем разрешения
      const hasPermissions = await this.ensurePermissions();
      if (!hasPermissions) {
        console.warn("Нет разрешений на планирование уведомлений");
        return false;
      }

      // Отменяем предыдущее еженедельное напоминание
      await this.cancelWeeklyReminder();

      // Создаем новое еженедельное напоминание
      await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: { type: "weekly-reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: config.weekday,
          hour: config.hour,
          minute: config.minute,
        },
        identifier: WEEKLY_REMINDER_ID,
      });

      console.log(
        `Еженедельное напоминание запланировано на ${
          config.weekday
        } день недели в ${config.hour}:${config.minute
          .toString()
          .padStart(2, "0")}`
      );
      return true;
    } catch (error) {
      console.error(
        "Ошибка при планировании еженедельного напоминания:",
        error
      );
      return false;
    }
  }

  /**
   * Отмена еженедельного напоминания
   */
  public async cancelWeeklyReminder(): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(WEEKLY_REMINDER_ID);
      console.log("Еженедельное напоминание отменено");
      return true;
    } catch (error) {
      console.error("Ошибка при отмене еженедельного напоминания:", error);
      return false;
    }
  }

  /**
   * Получение всех запланированных уведомлений
   */
  public async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Ошибка при получении запланированных уведомлений:", error);
      return [];
    }
  }

  /**
   * Отмена всех запланированных уведомлений
   */
  public async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Все запланированные уведомления отменены");
      return true;
    } catch (error) {
      console.error("Ошибка при отмене всех уведомлений:", error);
      return false;
    }
  }

  /**
   * Проверка статуса разрешений
   */
  public async getPermissionStatus(): Promise<
    "granted" | "denied" | "undetermined"
  > {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error("Ошибка при проверке статуса разрешений:", error);
      return "denied";
    }
  }
}

// Экспортируем экземпляр сервиса
export const notificationService = NotificationService.getInstance();
