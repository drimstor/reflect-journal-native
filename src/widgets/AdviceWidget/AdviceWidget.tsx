import { useThemeStore } from "@/src/shared/store";
import { GradientAffirmation } from "@/src/features";
import { LampIcon } from "@/src/shared/ui/icons";
import { View } from "react-native";
import { AffirmationResponse } from "@/src/entities/affirmations/model/types";

interface AdviceWidgetProps {
  /** Внешние данные совета (опционально) */
  data?: AffirmationResponse;
}

const AdviceWidget = ({ data: externalData }: AdviceWidgetProps) => {
  const { colors, theme } = useThemeStore();

  return (
    <GradientAffirmation
      colors={colors}
      value={externalData?.content ?? ""}
      icon={
        <View
          style={{
            width: 54,
            height: 54,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              borderRadius: 16,
              backgroundColor: colors.primary,
              height: 46,
              width: 46,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LampIcon
              color={theme === "dark" ? colors.purple : "#9cfd91"}
              size={28}
            />
          </View>
        </View>
      }
    />
  );
};

export default AdviceWidget;
