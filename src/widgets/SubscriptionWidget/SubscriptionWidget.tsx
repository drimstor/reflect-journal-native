import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SUBSCRIPTION_TYPES } from "../../entities/purchases/const/config";
// import { usePurchases } from "../../entities/purchases/hooks/usePurchases";
import { SubscriptionCard } from "../../features/purchases/SubscriptionCard/SubscriptionCard";
import { subscriptionWidgetStyles as styles } from "./SubscriptionWidget.styles";

export const SubscriptionWidget: React.FC = () => {
  // const {
  //   subscriptions,
  //   isLoading,
  //   error,
  //   isConnected,
  //   purchaseSubscription,
  //   restorePurchases,
  //   clearError,
  //   refresh,
  // } = usePurchases();

  // Обработка покупки подписки
  // const handlePurchase = useCallback(
  //   async (subscriptionType: SubscriptionType) => {
  //     try {
  //       await purchaseSubscription(subscriptionType);

  //       Alert.alert(
  //         "Подписка активирована!",
  //         "Спасибо за подписку! Все премиум функции теперь доступны.",
  //         [{ text: "OK" }]
  //       );
  //     } catch (error) {
  //       console.error("Ошибка покупки:", error);

  //       Alert.alert(
  //         "Ошибка подписки",
  //         "Не удалось оформить подписку. Попробуйте еще раз.",
  //         [{ text: "OK" }]
  //       );
  //     }
  //   },
  //   [purchaseSubscription]
  // );

  // // Обработка восстановления покупок
  // const handleRestorePurchases = useCallback(async () => {
  //   try {
  //     const restoredPurchases = await restorePurchases();

  //     if (restoredPurchases.length > 0) {
  //       Alert.alert(
  //         "Покупки восстановлены",
  //         `Восстановлено покупок: ${restoredPurchases.length}`,
  //         [{ text: "OK" }]
  //       );
  //     } else {
  //       Alert.alert(
  //         "Покупки не найдены",
  //         "У вас нет активных подписок для восстановления.",
  //         [{ text: "OK" }]
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Ошибка восстановления:", error);

  //     Alert.alert(
  //       "Ошибка восстановления",
  //       "Не удалось восстановить покупки. Попробуйте еще раз.",
  //       [{ text: "OK" }]
  //     );
  //   }
  // }, [restorePurchases]);

  // // Получение подписки по типу
  // const getSubscriptionByType = useCallback(
  //   (subscriptionType: SubscriptionType) => {
  //     const platform = Platform.OS as "android" | "ios";
  //     const sku = getSubscriptionSku(subscriptionType, platform);

  //     return subscriptions.find(
  //       (subscription) => subscription.productId === sku
  //     );
  //   },
  //   [subscriptions]
  // );

  // // Повторная попытка при ошибке
  // const handleRetry = useCallback(() => {
  //   clearError();
  //   refresh();
  // }, [clearError, refresh]);

  const isLoading = false;
  const subscriptions = [];
  const error = null;
  const isConnected = false;
  const handleRetry = () => {};
  const getSubscriptionByType = () => {};
  const handlePurchase = () => {};
  const handleRestorePurchases = () => {};
  const refresh = () => {};

  // Рендер состояния загрузки
  if (isLoading && subscriptions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Загрузка подписок...</Text>
      </View>
    );
  }

  // Рендер состояния ошибки
  if (error && !isConnected) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Ошибка подключения</Text>
        <Text style={styles.errorMessage}>
          Не удалось подключиться к магазину приложений. Проверьте подключение к
          интернету и попробуйте еще раз.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Рендер пустого состояния
  if (subscriptions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Подписки недоступны</Text>
        <Text style={styles.emptyMessage}>
          В данный момент подписки недоступны. Попробуйте обновить список позже.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Обновить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Выберите подписку</Text>
        <Text style={styles.subtitle}>
          Разблокируйте все возможности приложения и получите максимум от
          ведения дневника
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productsContainer}>
          {/* Premium Yearly (популярная) */}
          {getSubscriptionByType(SUBSCRIPTION_TYPES.PREMIUM_YEARLY) && (
            <SubscriptionCard
              subscription={
                getSubscriptionByType(SUBSCRIPTION_TYPES.PREMIUM_YEARLY)!
              }
              subscriptionType={SUBSCRIPTION_TYPES.PREMIUM_YEARLY}
              isLoading={isLoading}
              onPurchase={handlePurchase}
            />
          )}

          {/* Premium Monthly */}
          {getSubscriptionByType(SUBSCRIPTION_TYPES.PREMIUM_MONTHLY) && (
            <SubscriptionCard
              subscription={
                getSubscriptionByType(SUBSCRIPTION_TYPES.PREMIUM_MONTHLY)!
              }
              subscriptionType={SUBSCRIPTION_TYPES.PREMIUM_MONTHLY}
              isLoading={isLoading}
              onPurchase={handlePurchase}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={isLoading}
        >
          <Text style={styles.restoreButtonText}>Восстановить покупки</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Подписка автоматически продлевается, если не отменена за 24 часа до
          окончания текущего периода.{"\n"}
          <Text style={styles.termsLink}>Условия использования</Text> •{" "}
          <Text style={styles.termsLink}>Политика конфиденциальности</Text>
        </Text>
      </View>
    </View>
  );
};
