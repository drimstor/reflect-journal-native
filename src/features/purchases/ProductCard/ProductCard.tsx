import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  PRODUCT_CONFIG,
  PRODUCT_TYPES,
} from "../../../entities/purchases/const/config";
import type {
  Product,
  ProductType,
  Subscription,
} from "../../../entities/purchases/model/types";
import { productCardStyles as styles } from "./ProductCard.styles";

interface ProductCardProps {
  product: Product | Subscription;
  productType: ProductType;
  isLoading?: boolean;
  onPurchase: (productType: ProductType) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productType,
  isLoading = false,
  onPurchase,
}) => {
  const config = PRODUCT_CONFIG[productType];
  const isPopular = config.popular;

  const handlePurchase = () => {
    if (!isLoading) {
      onPurchase(productType);
    }
  };

  const renderFeature = (feature: string, index: number) => (
    <View key={index} style={styles.feature}>
      <Text style={styles.featureIcon}>✓</Text>
      <Text style={styles.featureText}>{feature}</Text>
    </View>
  );

  const getPeriodText = () => {
    switch (productType) {
      case PRODUCT_TYPES.PREMIUM_MONTHLY:
        return "/месяц";
      case PRODUCT_TYPES.PREMIUM_YEARLY:
        return "/год";
      case PRODUCT_TYPES.PREMIUM_LIFETIME:
        return "";
      default:
        return "";
    }
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
          <Text style={styles.priceText}>{product.localizedPrice}</Text>
          <Text style={styles.periodText}>{getPeriodText()}</Text>
        </View>
      </View>

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
          <Text style={styles.purchaseButtonText}>Купить</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
