import { type SubscriptionType } from "../model/types";

// Константы для типов подписок
export const SUBSCRIPTION_TYPES = {
  PLUS_MONTHLY: "plus_monthly",
  PLUS_YEARLY: "plus_yearly",
  ULTIMATE_MONTHLY: "ultimate_monthly",
  ULTIMATE_YEARLY: "ultimate_yearly",
} as const;

// Конфигурация SKU для Android и iOS
export const SUBSCRIPTION_SKUS = {
  [SUBSCRIPTION_TYPES.PLUS_MONTHLY]: {
    android: "plus_monthly_android",
    ios: "plus_monthly_ios",
  },
  [SUBSCRIPTION_TYPES.PLUS_YEARLY]: {
    android: "plus_yearly_android",
    ios: "plus_yearly_ios",
  },
  [SUBSCRIPTION_TYPES.ULTIMATE_MONTHLY]: {
    android: "ultimate_monthly_android",
    ios: "ultimate_monthly_ios",
  },
  [SUBSCRIPTION_TYPES.ULTIMATE_YEARLY]: {
    android: "ultimate_yearly_android",
    ios: "ultimate_yearly_ios",
  },
} as const;

// Получение SKU для текущей платформы
export const getSubscriptionSku = (
  subscriptionType: SubscriptionType,
  platform: "android" | "ios"
): string => {
  return SUBSCRIPTION_SKUS[subscriptionType][platform];
};

// Получение всех SKU для платформы
export const getAllSkus = (platform: "android" | "ios"): string[] => {
  return Object.values(SUBSCRIPTION_SKUS).map((sku) => sku[platform]);
};

// Конфигурация отображения подписок
export const SUBSCRIPTION_CONFIG = {
  [SUBSCRIPTION_TYPES.PLUS_MONTHLY]: {
    title: "Plus",
    subtitle: "Месячная подписка",
    description: "Расширенные возможности для ведения дневника",
    features: [
      "Безлимитные записи",
      "Базовая аналитика",
      "Экспорт данных",
      "Поддержка",
    ],
    badge: null,
    popular: false,
    hasFreeTrial: true,
    trialDays: 7,
  },
  [SUBSCRIPTION_TYPES.PLUS_YEARLY]: {
    title: "Plus",
    subtitle: "Годовая подписка",
    description: "Расширенные возможности со скидкой 30%",
    features: [
      "Безлимитные записи",
      "Базовая аналитика",
      "Экспорт данных",
      "Поддержка",
    ],
    badge: "Скидка 30%",
    popular: true,
    hasFreeTrial: true,
    trialDays: 7,
  },
  [SUBSCRIPTION_TYPES.ULTIMATE_MONTHLY]: {
    title: "Ultimate",
    subtitle: "Месячная подписка",
    description: "Все возможности приложения без ограничений",
    features: [
      "Все из Plus",
      "Расширенная аналитика",
      "Персональный ИИ-ассистент",
      "Приоритетная поддержка",
      "Эксклюзивные функции",
    ],
    badge: null,
    popular: false,
    hasFreeTrial: false,
    trialDays: 0,
  },
  [SUBSCRIPTION_TYPES.ULTIMATE_YEARLY]: {
    title: "Ultimate",
    subtitle: "Годовая подписка",
    description: "Максимальные возможности со скидкой 40%",
    features: [
      "Все из Plus",
      "Расширенная аналитика",
      "Персональный ИИ-ассистент",
      "Приоритетная поддержка",
      "Эксклюзивные функции",
    ],
    badge: "Скидка 40%",
    popular: false,
    hasFreeTrial: false,
    trialDays: 0,
  },
} as const;
