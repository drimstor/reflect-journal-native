import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  SUBSCRIPTION_CONFIG,
  SUBSCRIPTION_TYPES,
} from "../../../entities/purchases/const/config";
import type {
  Subscription,
  SubscriptionType,
} from "../../../entities/purchases/model/types";
import { productCardStyles as styles } from "../ProductCard/ProductCard.styles";

interface SubscriptionCardProps {
  subscription: Subscription;
  subscriptionType: SubscriptionType;
  isLoading?: boolean;
  onPurchase: (subscriptionType: SubscriptionType) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  subscriptionType,
  isLoading = false,
  onPurchase,
}) => {
  const config = SUBSCRIPTION_CONFIG[subscriptionType];
  const isPopular = config.popular;

  const handlePurchase = () => {
    if (!isLoading) {
      onPurchase(subscriptionType);
    }
  };

  const renderFeature = (feature: string, index: number) => (
    <View key={index} style={styles.feature}>
      <Text style={styles.featureIcon}>✓</Text>
      <Text style={styles.featureText}>{feature}</Text>
    </View>
  );

  const getPeriodText = () => {
    switch (subscriptionType) {
      case SUBSCRIPTION_TYPES.PREMIUM_MONTHLY:
        return "/месяц";
      case SUBSCRIPTION_TYPES.PREMIUM_YEARLY:
        return "/год";
      default:
        return "";
    }
  };

  const getTrialText = () => {
    if (config.hasFreeTrial && config.trialDays > 0) {
      return `${config.trialDays} дней бесплатно, затем `;
    }
    return "";
  };

  return (
    <View style={[styles.container, isPopular && styles.popularContainer]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
        </View>
        {config.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{config.badge}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{config.description}</Text>

      <View style={styles.featuresContainer}>
        {config.features.map(renderFeature)}
      </View>

      <View style={styles.priceContainer}>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.priceText}>{subscription.localizedPrice}</Text>
          <Text style={styles.periodText}>{getPeriodText()}</Text>
        </View>
      </View>

      {config.hasFreeTrial && (
        <Text style={styles.trialText}>
          {getTrialText()}
          {subscription.localizedPrice}
          {getPeriodText()}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.purchaseButton,
          isLoading && styles.purchaseButtonDisabled,
        ]}
        onPress={handlePurchase}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.loadingText}>Покупка...</Text>
          </View>
        ) : (
          <Text style={styles.purchaseButtonText}>
            {config.hasFreeTrial ? "Начать бесплатный период" : "Подписаться"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
