import { NotificationSettingKey } from "../model/types";

// Конфигурация для пунктов меню уведомлений
export interface NotificationMenuItem {
  key: NotificationSettingKey;
  translationKey: string;
  isComingSoon?: boolean; // Для функций, которые пока недоступны
}

// Создание конфигурации пунктов меню уведомлений
export const createNotificationMenuItems = (): NotificationMenuItem[] => [
  {
    key: "dailyReminders",
    translationKey: "notifications.settings.dailyReminders",
  },
  {
    key: "summaryReports",
    translationKey: "notifications.settings.summaryReports",
  },
  {
    key: "aiInsights",
    translationKey: "notifications.settings.aiInsights",
    isComingSoon: true, // Пока недоступно
  },
];
