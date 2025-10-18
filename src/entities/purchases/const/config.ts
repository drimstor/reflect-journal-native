import { type SubscriptionType } from "../model/types";

// Константы для типов подписок
export const SUBSCRIPTION_TYPES = {
  PRO_MONTHLY: "pro_monthly",
  PRO_YEARLY: "pro_yearly",
} as const;

// Конфигурация SKU для Android и iOS
export const SUBSCRIPTION_SKUS = {
  [SUBSCRIPTION_TYPES.PRO_MONTHLY]: {
    android: "pro_monthly_android",
    ios: "pro_monthly_ios",
  },
  [SUBSCRIPTION_TYPES.PRO_YEARLY]: {
    android: "pro_yearly_android",
    ios: "pro_yearly_ios",
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
  [SUBSCRIPTION_TYPES.PRO_MONTHLY]: {
    title: "Pro",
    subtitle: "Месячная подписка",
    description: "Все возможности приложения без ограничений",
    features: [
      "Безлимитные дневники и записи",
      "Безлимитные цели и генерации",
      "Безлимитные чаты и сообщения",
      "Безлимитные саммари и тесты",
      "Персональный AI+ ассистент",
      "Вложения и голосовой ввод",
    ],
    badge: null,
    popular: false,
    hasFreeTrial: true,
    trialDays: 3,
  },
  [SUBSCRIPTION_TYPES.PRO_YEARLY]: {
    title: "Pro",
    subtitle: "Годовая подписка",
    description: "Максимальные возможности со скидкой 30%",
    features: [
      "Безлимитные дневники и записи",
      "Безлимитные цели и генерации",
      "Безлимитные чаты и сообщения",
      "Безлимитные саммари и тесты",
      "Персональный AI+ ассистент",
      "Вложения и голосовой ввод",
    ],
    badge: "Скидка 30%",
    popular: true,
    hasFreeTrial: true,
    trialDays: 3,
  },
} as const;
