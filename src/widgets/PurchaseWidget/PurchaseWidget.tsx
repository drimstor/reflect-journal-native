import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PRODUCT_TYPES,
  getProductSku,
} from "../../entities/purchases/const/config";
import { usePurchases } from "../../entities/purchases/hooks/usePurchases";
import type { ProductType } from "../../entities/purchases/model/types";
import { ProductCard } from "../../features/purchases/ProductCard/ProductCard";
import { purchaseWidgetStyles as styles } from "./PurchaseWidget.styles";

export const PurchaseWidget: React.FC = () => {
  const {
    products,
    subscriptions,
    isLoading,
    error,
    isConnected,
    purchaseProduct,
    restorePurchases,
    clearError,
    refresh,
  } = usePurchases();

  // Объединяем продукты и подписки
  const allProducts = [...products, ...subscriptions];

  // Обработка покупки продукта
  const handlePurchase = useCallback(
    async (productType: ProductType) => {
      try {
        await purchaseProduct(productType);

        Alert.alert(
          "Покупка успешна!",
          "Спасибо за покупку! Все премиум функции теперь доступны.",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error("Ошибка покупки:", error);

        Alert.alert(
          "Ошибка покупки",
          "Не удалось завершить покупку. Попробуйте еще раз.",
          [{ text: "OK" }]
        );
      }
    },
    [purchaseProduct]
  );

  // Обработка восстановления покупок
  const handleRestorePurchases = useCallback(async () => {
    try {
      const restoredPurchases = await restorePurchases();

      if (restoredPurchases.length > 0) {
        Alert.alert(
          "Покупки восстановлены",
          `Восстановлено покупок: ${restoredPurchases.length}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Покупки не найдены",
          "У вас нет активных покупок для восстановления.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Ошибка восстановления:", error);

      Alert.alert(
        "Ошибка восстановления",
        "Не удалось восстановить покупки. Попробуйте еще раз.",
        [{ text: "OK" }]
      );
    }
  }, [restorePurchases]);

  // Получение продукта по типу
  const getProductByType = useCallback(
    (productType: ProductType) => {
      const platform = Platform.OS as "android" | "ios";
      const sku = getProductSku(productType, platform);

      return allProducts.find((product) => product.productId === sku);
    },
    [allProducts]
  );

  // Повторная попытка при ошибке
  const handleRetry = useCallback(() => {
    clearError();
    refresh();
  }, [clearError, refresh]);

  // Рендер состояния загрузки
  if (isLoading && allProducts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Загрузка продуктов...</Text>
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
  if (allProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Продукты недоступны</Text>
        <Text style={styles.emptyMessage}>
          В данный момент продукты недоступны. Попробуйте обновить список позже.
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
        <Text style={styles.title}>Премиум подписка</Text>
        <Text style={styles.subtitle}>
          Разблокируйте все функции приложения и получите максимум от ведения
          дневника
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productsContainer}>
          {/* Годовая подписка */}
          {getProductByType(PRODUCT_TYPES.PREMIUM_YEARLY) && (
            <ProductCard
              product={getProductByType(PRODUCT_TYPES.PREMIUM_YEARLY)!}
              productType={PRODUCT_TYPES.PREMIUM_YEARLY}
              isLoading={isLoading}
              onPurchase={handlePurchase}
            />
          )}

          {/* Месячная подписка */}
          {getProductByType(PRODUCT_TYPES.PREMIUM_MONTHLY) && (
            <ProductCard
              product={getProductByType(PRODUCT_TYPES.PREMIUM_MONTHLY)!}
              productType={PRODUCT_TYPES.PREMIUM_MONTHLY}
              isLoading={isLoading}
              onPurchase={handlePurchase}
            />
          )}

          {/* Пожизненная покупка */}
          {getProductByType(PRODUCT_TYPES.PREMIUM_LIFETIME) && (
            <ProductCard
              product={getProductByType(PRODUCT_TYPES.PREMIUM_LIFETIME)!}
              productType={PRODUCT_TYPES.PREMIUM_LIFETIME}
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
