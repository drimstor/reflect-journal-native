import { GradientAffirmation } from "@/src/features";
import { useThemeStore } from "@/src/shared/store";
import { LampIcon } from "@/src/shared/ui/icons";
import { View } from "react-native";
import { IAdviceWidgetProps } from "./types";

const AdviceWidget = ({ data: externalData }: IAdviceWidgetProps) => {
  const { colors } = useThemeStore();

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
            <LampIcon color={colors.accent} size={28} />
          </View>
        </View>
      }
    />
  );
};

export default AdviceWidget;
