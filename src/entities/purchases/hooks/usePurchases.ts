import { useCallback, useEffect, useState } from "react";
import type {
  PurchaseState,
  Subscription,
  SubscriptionType,
} from "../model/types";
import { purchaseService } from "../services/PurchaseService";

export const usePurchases = () => {
  const [state, setState] = useState<PurchaseState>({
    subscriptions: [],
    purchases: [],
    isLoading: false,
    error: null,
    isConnected: false,
  });

  // Инициализация сервиса покупок
  const initialize = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const isConnected = await purchaseService.initialize();

      setState((prev) => ({
        ...prev,
        isConnected,
        isLoading: false,
        error: isConnected
          ? null
          : {
              code: "INIT_ERROR",
              message: "Не удалось инициализировать платежную систему",
            },
      }));

      if (isConnected) {
        await loadSubscriptions();
        await checkExistingPurchases();
      }
    } catch (error) {
      console.error("Ошибка инициализации покупок:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          code: "INIT_ERROR",
          message: "Ошибка инициализации платежной системы",
        },
      }));
    }
  }, []);

  // Загрузка доступных подписок
  const loadSubscriptions = useCallback(async () => {
    try {
      const subscriptions = await purchaseService.getAvailableSubscriptions();
      setState((prev) => ({ ...prev, subscriptions }));
    } catch (error) {
      console.error("Ошибка загрузки подписок:", error);
    }
  }, []);

  // Проверка существующих покупок
  const checkExistingPurchases = useCallback(async () => {
    try {
      const purchases = await purchaseService.restorePurchases();
      setState((prev) => ({ ...prev, purchases }));
    } catch (error) {
      console.error("Ошибка проверки покупок:", error);
    }
  }, []);

  // Покупка подписки
  const purchaseSubscription = useCallback(
    async (subscriptionType: SubscriptionType) => {
      try {
        await purchaseService.purchaseSubscription(subscriptionType);
      } catch (error) {
        console.error("Ошибка покупки:", error);
        throw error;
      }
    },
    []
  );

  // Восстановление покупок
  const restorePurchases = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const purchases = await purchaseService.restorePurchases();
      setState((prev) => ({
        ...prev,
        purchases,
        isLoading: false,
      }));
      return purchases;
    } catch (error) {
      console.error("Ошибка восстановления покупок:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          code: "RESTORE_ERROR",
          message: "Не удалось восстановить покупки",
        },
      }));
      throw error;
    }
  }, []);

  // Проверка активной подписки
  const hasActiveSubscription = useCallback(async (): Promise<boolean> => {
    return await purchaseService.checkActiveSubscriptions();
  }, []);

  // Получение подписки по типу
  const getSubscriptionByType = useCallback(
    (subscriptionType: SubscriptionType): Subscription | null => {
      return (
        state.subscriptions.find((item) =>
          item.productId.includes(subscriptionType)
        ) || null
      );
    },
    [state.subscriptions]
  );

  // Очистка ошибки
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Подписка на изменения состояния покупок
  useEffect(() => {
    const unsubscribe = purchaseService.addListener((newState) => {
      setState((prev) => ({ ...prev, ...newState }));
    });

    return unsubscribe;
  }, []);

  // Инициализация при монтировании компонента
  useEffect(() => {
    initialize();

    return () => {
      purchaseService.terminate();
    };
  }, [initialize]);

  return {
    // Состояние
    subscriptions: state.subscriptions,
    purchases: state.purchases,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,

    // Методы
    purchaseSubscription,
    restorePurchases,
    hasActiveSubscription,
    getSubscriptionByType,
    clearError,

    // Перезагрузка данных
    refresh: initialize,
  };
};
