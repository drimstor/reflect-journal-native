import { type SubscriptionType } from "../model/types";

// Константы для типов подписок
export const SUBSCRIPTION_TYPES = {
  PREMIUM_MONTHLY: "premium_monthly",
  PREMIUM_YEARLY: "premium_yearly",
} as const;

// Конфигурация SKU для Android и iOS
export const SUBSCRIPTION_SKUS = {
  [SUBSCRIPTION_TYPES.PREMIUM_MONTHLY]: {
    android: "premium_monthly_android",
    ios: "premium_monthly_ios",
  },
  [SUBSCRIPTION_TYPES.PREMIUM_YEARLY]: {
    android: "premium_yearly_android",
    ios: "premium_yearly_ios",
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
  [SUBSCRIPTION_TYPES.PREMIUM_MONTHLY]: {
    title: "Premium",
    subtitle: "Месячная подписка",
    description: "Все возможности приложения без ограничений",
    features: [
      "Безлимитные записи",
      "Расширенная аналитика",
      "Персональный ИИ-ассистент",
      "Приоритетная поддержка",
      "Экспорт данных",
    ],
    badge: null,
    popular: false,
    hasFreeTrial: true,
    trialDays: 7,
  },
  [SUBSCRIPTION_TYPES.PREMIUM_YEARLY]: {
    title: "Premium",
    subtitle: "Годовая подписка",
    description: "Максимальные возможности со скидкой 30%",
    features: [
      "Безлимитные записи",
      "Расширенная аналитика",
      "Персональный ИИ-ассистент",
      "Приоритетная поддержка",
      "Экспорт данных",
    ],
    badge: "Скидка 30%",
    popular: true,
    hasFreeTrial: true,
    trialDays: 7,
  },
} as const;
