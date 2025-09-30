// Типы для настроек уведомлений
export interface NotificationSettings {
  pushNotifications: boolean; // Главный переключатель push-уведомлений
  dailyReminders: boolean; // Ежедневные напоминания о ведении дневника
  summaryReports: boolean; // Готовность новых саммари
  aiInsights: boolean; // Персональные инсайты от ИИ-ассистента (пока недоступно)
}

// Ключи настроек уведомлений
export type NotificationSettingKey = keyof NotificationSettings;

// Дефолтные настройки уведомлений
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushNotifications: true,
  dailyReminders: true,
  summaryReports: true,
  aiInsights: false, // Пока недоступно
};

// Ключ для хранения в AsyncStorage
export const NOTIFICATION_SETTINGS_STORAGE_KEY = "@notification_settings";
