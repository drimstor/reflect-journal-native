import { Platform } from "react-native";
import {
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  getSubscriptions,
  initConnection,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
  Purchase as RNIapPurchase,
} from "react-native-iap";
import {
  getAllSkus,
  getSubscriptionSku,
  SUBSCRIPTION_TYPES,
} from "../const/config";
import type {
  Purchase,
  PurchaseState,
  Subscription,
  SubscriptionType,
} from "../model/types";

class PurchaseService {
  private isInitialized = false;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;
  private listeners: ((state: Partial<PurchaseState>) => void)[] = [];

  // Инициализация соединения с магазином
  async initialize(): Promise<boolean> {
    try {
      const result = await initConnection();
      this.isInitialized = result;

      if (this.isInitialized) {
        this.setupListeners();
      }

      return this.isInitialized;
    } catch (error) {
      console.error("Ошибка инициализации IAP:", error);
      return false;
    }
  }

  // Завершение соединения
  async terminate(): Promise<void> {
    try {
      this.removeListeners();
      await endConnection();
      this.isInitialized = false;
    } catch (error) {
      console.error("Ошибка завершения IAP:", error);
    }
  }

  // Настройка слушателей покупок
  private setupListeners(): void {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase: RNIapPurchase) => {
        console.log("Покупка обновлена:", purchase);
        this.handlePurchaseUpdate(purchase);
      }
    );

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.error("Ошибка покупки:", error);
        this.notifyListeners({ error });
      }
    );
  }

  // Удаление слушателей
  private removeListeners(): void {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  // Обработка обновления покупки
  private async handlePurchaseUpdate(purchase: RNIapPurchase): Promise<void> {
    try {
      // Завершаем транзакцию
      await finishTransaction({ purchase, isConsumable: false });

      // Конвертируем в наш тип
      const convertedPurchase: Purchase = {
        productId: purchase.productId,
        transactionId: purchase.transactionId || "",
        transactionDate: purchase.transactionDate,
        transactionReceipt:
          purchase.transactionReceipt || purchase.transactionId || "",
        purchaseToken: (purchase as any).purchaseToken,
        originalTransactionDateIOS: (purchase as any)
          .originalTransactionDateIOS,
        originalTransactionIdentifierIOS: (purchase as any)
          .originalTransactionIdentifierIOS,
        isAcknowledgedAndroid: (purchase as any).isAcknowledgedAndroid,
        purchaseStateAndroid: (purchase as any).purchaseStateAndroid,
        developerPayloadAndroid: (purchase as any).developerPayloadAndroid,
        signatureAndroid: (purchase as any).signatureAndroid,
        autoRenewingAndroid: (purchase as any).autoRenewingAndroid,
        obfuscatedAccountIdAndroid: (purchase as any)
          .obfuscatedAccountIdAndroid,
        obfuscatedProfileIdAndroid: (purchase as any)
          .obfuscatedProfileIdAndroid,
      };

      // Уведомляем слушателей об успешной покупке
      this.notifyListeners({
        purchases: [convertedPurchase],
        error: null,
      });

      // Здесь можно добавить отправку на сервер для валидации
      await this.validatePurchaseOnServer(convertedPurchase);
    } catch (error) {
      console.error("Ошибка обработки покупки:", error);
      this.notifyListeners({
        error: {
          code: "PURCHASE_PROCESSING_ERROR",
          message: "Ошибка обработки покупки",
        },
      });
    }
  }

  // Получение доступных подписок
  async getAvailableSubscriptions(): Promise<Subscription[]> {
    if (!this.isInitialized) {
      throw new Error("IAP не инициализирован");
    }

    try {
      const platform = Platform.OS as "android" | "ios";
      const skus = getAllSkus(platform);

      // Используем правильный метод API
      const subscriptions = await getSubscriptions(skus);

      // Конвертируем в наш тип с безопасным доступом к свойствам
      return subscriptions.map(
        (subscription: any): Subscription => ({
          productId: subscription.productId || subscription.id || "",
          price: String(subscription.price || "0"),
          currency: subscription.currency || "USD",
          title: subscription.title || "",
          description: subscription.description || "",
          localizedPrice:
            subscription.localizedPrice || String(subscription.price || "0"),
          type: "subs",
          subscriptionPeriodAndroid: subscription.subscriptionPeriodAndroid,
          subscriptionPeriodIOS: subscription.subscriptionPeriodIOS,
          introductoryPrice: subscription.introductoryPrice,
          introductoryPricePaymentMode:
            subscription.introductoryPricePaymentMode,
          introductoryPriceNumberOfPeriods:
            subscription.introductoryPriceNumberOfPeriods,
          introductoryPriceSubscriptionPeriod:
            subscription.introductoryPriceSubscriptionPeriod,
          freeTrialPeriod: subscription.freeTrialPeriod,
        })
      );
    } catch (error) {
      console.error("Ошибка получения подписок:", error);
      throw error;
    }
  }

  // Покупка подписки
  async purchaseSubscription(
    subscriptionType: SubscriptionType
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("IAP не инициализирован");
    }

    try {
      const platform = Platform.OS as "android" | "ios";
      const sku = getSubscriptionSku(subscriptionType, platform);

      // Уведомляем о начале покупки
      this.notifyListeners({ isLoading: true, error: null });

      await requestSubscription(sku);
    } catch (error) {
      console.error("Ошибка покупки подписки:", error);
      this.notifyListeners({
        isLoading: false,
        error: {
          code: "PURCHASE_ERROR",
          message: "Ошибка при покупке подписки",
        },
      });
      throw error;
    }
  }

  // Восстановление покупок
  async restorePurchases(): Promise<Purchase[]> {
    if (!this.isInitialized) {
      throw new Error("IAP не инициализирован");
    }

    try {
      this.notifyListeners({ isLoading: true, error: null });

      const purchases = await getAvailablePurchases();

      // Конвертируем в наш тип
      const convertedPurchases: Purchase[] = purchases.map(
        (purchase: any): Purchase => ({
          productId: purchase.productId,
          transactionId: purchase.transactionId || "",
          transactionDate: purchase.transactionDate,
          transactionReceipt:
            purchase.transactionReceipt || purchase.transactionId || "",
          purchaseToken: purchase.purchaseToken,
          originalTransactionDateIOS: purchase.originalTransactionDateIOS,
          originalTransactionIdentifierIOS:
            purchase.originalTransactionIdentifierIOS,
          isAcknowledgedAndroid: purchase.isAcknowledgedAndroid,
          purchaseStateAndroid: purchase.purchaseStateAndroid,
          developerPayloadAndroid: purchase.developerPayloadAndroid,
          signatureAndroid: purchase.signatureAndroid,
          autoRenewingAndroid: purchase.autoRenewingAndroid,
          obfuscatedAccountIdAndroid: purchase.obfuscatedAccountIdAndroid,
          obfuscatedProfileIdAndroid: purchase.obfuscatedProfileIdAndroid,
        })
      );

      this.notifyListeners({
        purchases: convertedPurchases,
        isLoading: false,
        error: null,
      });

      return convertedPurchases;
    } catch (error) {
      console.error("Ошибка восстановления покупок:", error);
      this.notifyListeners({
        isLoading: false,
        error: {
          code: "RESTORE_ERROR",
          message: "Ошибка восстановления покупок",
        },
      });
      throw error;
    }
  }

  // Валидация покупки на сервере
  private async validatePurchaseOnServer(purchase: Purchase): Promise<void> {
    try {
      // TODO: Реализовать отправку на сервер для валидации
      console.log("Валидация покупки на сервере:", purchase);

      // Здесь будет запрос к вашему API для валидации покупки
      // const response = await api.validatePurchase(purchase);
    } catch (error) {
      console.error("Ошибка валидации покупки на сервере:", error);
    }
  }

  // Проверка активных подписок
  async checkActiveSubscriptions(): Promise<boolean> {
    try {
      const purchases = await this.restorePurchases();

      // Проверяем наличие активных подписок
      const hasActiveSubscription = purchases.some((purchase) => {
        const platform = Platform.OS as "android" | "ios";
        const plusMonthlyId = getSubscriptionSku(
          SUBSCRIPTION_TYPES.PLUS_MONTHLY,
          platform
        );
        const plusYearlyId = getSubscriptionSku(
          SUBSCRIPTION_TYPES.PLUS_YEARLY,
          platform
        );
        const ultimateMonthlyId = getSubscriptionSku(
          SUBSCRIPTION_TYPES.ULTIMATE_MONTHLY,
          platform
        );
        const ultimateYearlyId = getSubscriptionSku(
          SUBSCRIPTION_TYPES.ULTIMATE_YEARLY,
          platform
        );

        return [
          plusMonthlyId,
          plusYearlyId,
          ultimateMonthlyId,
          ultimateYearlyId,
        ].includes(purchase.productId);
      });

      return hasActiveSubscription;
    } catch (error) {
      console.error("Ошибка проверки активных подписок:", error);
      return false;
    }
  }

  // Добавление слушателя изменений состояния
  addListener(callback: (state: Partial<PurchaseState>) => void): () => void {
    this.listeners.push(callback);

    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Уведомление всех слушателей
  private notifyListeners(state: Partial<PurchaseState>): void {
    this.listeners.forEach((callback) => callback(state));
  }
}

// Экспортируем синглтон
export const purchaseService = new PurchaseService();
