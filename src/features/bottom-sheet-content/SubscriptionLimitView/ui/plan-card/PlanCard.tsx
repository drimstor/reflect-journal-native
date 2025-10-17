import { SubscriptionPlan } from "@/src/entities/auth/model/types";
import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { Text } from "@/src/shared/ui";
import React from "react";
import { View } from "react-native";
import { PlanConfig } from "../../const/plans";
import { createStyles } from "./PlanCard.styles";

interface PlanCardProps {
  plan: SubscriptionPlan;
  config: PlanConfig;
  isActive: boolean;
  isCurrent: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  config,
  isActive,
  isCurrent,
}) => {
  const t = useT();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={styles.header}>
        <Text style={styles.planName}>{config.name}</Text>
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentText}>
              {t("subscription.messages.currentPlan")}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.featuresContainer}>
        {config.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>{t(feature.key)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

