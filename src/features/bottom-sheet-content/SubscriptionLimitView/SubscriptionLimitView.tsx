import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  CheckBox,
  CheckIcon,
  Chip,
  Divider,
  PaddingLayout,
  PlusIcon,
  Text,
} from "@/src/shared/ui";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItemPreview } from "../..";

// Конфигурация строк таблицы функций
const FEATURES_CONFIG = [
  {
    key: "journals",
    icon: "📔",
    isBoolean: false,
  },
  {
    key: "goals",
    icon: "🎯",
    isBoolean: false,
  },
  {
    key: "chats",
    icon: "💬",
    isBoolean: false,
  },
  {
    key: "summaries",
    icon: "🪞",
    isBoolean: false,
  },
  {
    key: "tests",
    icon: "📝",
    isBoolean: false,
  },
  {
    key: "assistant",
    icon: "🤖",
    isBoolean: false,
  },
  {
    key: "attachments",
    icon: "📎",
    isBoolean: true,
  },
  {
    key: "voiceInput",
    icon: "🎤",
    isBoolean: true,
  },
] as const;

const SubscriptionLimitView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  const [selectedPlan, setSelectedPlan] = useState("Yearly");

  const isFreeTrialAvialible = false;

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("subscription.title")} />

      {/* Таблица сравнения функций */}
      <PaddingLayout>
        <View style={styles.tableContainer}>
          {/* Заголовок таблицы */}
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.firstColumn]} />
            <View style={styles.tableCell}>
              <Text size="medium" font="bold" color={colors.contrast}>
                {t("subscription.features.free")}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.lastColumn]}>
              <Text size="medium" font="bold" color={colors.accent}>
                {t("subscription.features.pro")}
              </Text>
            </View>
          </View>

          {/* Строки с функциями */}
          {FEATURES_CONFIG.map((feature, index) => (
            <View
              key={feature.key}
              style={[
                styles.tableRow,
                index % 2 === 0 && {
                  backgroundColor:
                    theme === "dark" ? colors.light : colors.alternate + 90,
                },
              ]}
            >
              <View style={[styles.tableCell, styles.firstColumn]}>
                <Text size="small" color={colors.contrast}>
                  {feature.icon}
                  {"  "}
                  {t(`subscription.features.${feature.key}.label`)}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text size="small" color={colors.contrast} withOpacity={70}>
                  {feature.isBoolean ? (
                    <View
                      style={{
                        transform: [{ rotate: "45deg" }, { scale: 1.2 }],
                      }}
                    >
                      <PlusIcon color={colors.contrast + 70} size={16} />
                    </View>
                  ) : (
                    t(`subscription.features.${feature.key}.free`)
                  )}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.lastColumn]}>
                <Text size="medium" font="bold" color={colors.accent}>
                  {feature.isBoolean ? (
                    <CheckIcon color={colors.accent} size={16} />
                  ) : feature.key === "assistant" ? (
                    t(`subscription.features.${feature.key}.pro`)
                  ) : (
                    <Text
                      // size="medium"
                      // font="bold"
                      color={colors.accent}
                      style={{ fontSize: 18 }}
                    >
                      {t("subscription.features.unlimited")}
                    </Text>
                  )}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </PaddingLayout>

      <Divider color={colors.alternate} />

      {/* Выбор плана */}
      <PaddingLayout style={{ gap: 12 }}>
        <ListItemPreview
          onPress={() => setSelectedPlan("Yearly")}
          title={t("subscription.plans.yearly.title")}
          subTitle={t("subscription.plans.yearly.price")}
          customComponent={
            <CheckBox
              checked={selectedPlan === "Yearly"}
              onPress={() => {}}
              checkedColor={colors.accent}
            />
          }
          backgroundColorForAnimate={colors.alternate}
          backgroundColor={
            selectedPlan === "Yearly"
              ? theme === "dark"
                ? "#494459"
                : "#f0ecfb"
              : colors.light
          }
          borderColor={
            selectedPlan === "Yearly" ? colors.accent + 90 : undefined
          }
          element={
            <Chip
              style={{ borderRadius: 7 }}
              color={colors.accent}
              title={
                <Text size="medium" color={colors.secondary} font="bold">
                  {t("subscription.plans.yearly.discount")}
                </Text>
              }
            />
          }
        />
        <ListItemPreview
          onPress={() => setSelectedPlan("Monthly")}
          title={t("subscription.plans.monthly.title")}
          subTitle={t("subscription.plans.monthly.price")}
          customComponent={
            <CheckBox
              checked={selectedPlan === "Monthly"}
              onPress={() => {}}
              checkedColor={colors.accent}
            />
          }
          backgroundColorForAnimate={colors.alternate}
          backgroundColor={
            selectedPlan === "Monthly"
              ? theme === "dark"
                ? "#494459"
                : "#f0ecfb"
              : colors.light
          }
          borderColor={
            selectedPlan === "Monthly" ? colors.accent + 90 : undefined
          }
        />
      </PaddingLayout>

      <BottomSheetFooter>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          onPress={() => {}}
          isLoading={false}
        >
          {isFreeTrialAvialible
            ? t("subscription.button.freeTrial")
            : t("shared.actions.continue")}
        </Button>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 10,
          }}
        >
          <Text
            size="small"
            style={{ textAlign: "center" }}
            color={colors.contrast}
            withOpacity={90}
          >
            {t("subscription.links.privacy")}
          </Text>
          <Text
            size="small"
            style={{ textAlign: "center" }}
            color={colors.contrast}
            withOpacity={90}
          >
            {t("subscription.links.terms")}
          </Text>
        </View>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: -10,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    borderRadius: 10,
  },
  tableCell: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  firstColumn: {
    flex: 1,
    paddingLeft: 11,
  },
  lastColumn: {
    width: "15%",
    alignItems: "flex-start",
  },
});

export default SubscriptionLimitView;
