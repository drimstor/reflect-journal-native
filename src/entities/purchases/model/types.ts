// Типы для работы с покупками и подписками
export interface Product {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  localizedPrice: string;
  type: "subs";
}

export interface Subscription extends Product {
  subscriptionPeriodAndroid?: string;
  subscriptionPeriodIOS?: string;
  introductoryPrice?: string;
  introductoryPricePaymentMode?: string;
  introductoryPriceNumberOfPeriods?: string;
  introductoryPriceSubscriptionPeriod?: string;
  freeTrialPeriod?: string;
}

export interface Purchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  transactionReceipt: string;
  purchaseToken?: string; // Android
  originalTransactionDateIOS?: number; // iOS
  originalTransactionIdentifierIOS?: string; // iOS
  isAcknowledgedAndroid?: boolean; // Android
  purchaseStateAndroid?: number; // Android
  developerPayloadAndroid?: string; // Android
  signatureAndroid?: string; // Android
  autoRenewingAndroid?: boolean; // Android
  obfuscatedAccountIdAndroid?: string; // Android
  obfuscatedProfileIdAndroid?: string; // Android
}

export interface PurchaseError {
  code: string;
  message: string;
  debugMessage?: string;
  responseCode?: number;
}

export interface PurchaseState {
  subscriptions: Subscription[];
  purchases: Purchase[];
  isLoading: boolean;
  error: PurchaseError | null;
  isConnected: boolean;
}

// Константы для типов подписок
export const SUBSCRIPTION_TYPES = {
  PREMIUM_MONTHLY: "premium_monthly",
  PREMIUM_YEARLY: "premium_yearly",
} as const;

export type SubscriptionType =
  (typeof SUBSCRIPTION_TYPES)[keyof typeof SUBSCRIPTION_TYPES];

// Статусы покупок
export const PURCHASE_STATUS = {
  PENDING: "pending",
  PURCHASED: "purchased",
  CANCELED: "canceled",
  DEFERRED: "deferred",
  FAILED: "failed",
} as const;

export type PurchaseStatus =
  (typeof PURCHASE_STATUS)[keyof typeof PURCHASE_STATUS];
