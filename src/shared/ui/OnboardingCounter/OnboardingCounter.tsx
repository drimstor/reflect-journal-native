import { CheckIcon, Text } from "@/src/shared/ui";
import { StyleProp, View, ViewStyle } from "react-native";
import { getContrastColor } from "../../lib/helpers/getContrastColor";
import { useThemeStore } from "../../store";
import { styles } from "./OnboardingCounter.styles";

const OnboardingCounter = ({
  steps,
  currentStep = 0,
  style,
  secondaryColor,
}: {
  steps: string[];
  currentStep: number;
  style?: StyleProp<ViewStyle>;
  secondaryColor?: string;
}) => {
  const { colors, theme } = useThemeStore();

  return (
    <View style={[styles.globalBox, style]}>
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;

        const localSecondaryColor =
          secondaryColor || (theme === "dark" ? colors.light : colors.white);
        const backgroundColor = isActive ? colors.accent : localSecondaryColor;

        const textColor = getContrastColor(backgroundColor);

        const lineColor = isCompleted ? colors.accent : localSecondaryColor;
        const isShowLine = index < steps.length - 1;

        return (
          <View style={styles.counterBox} key={index}>
            <View style={[styles.counter, { backgroundColor }]}>
              {isCompleted ? (
                <CheckIcon size={16} color={textColor} />
              ) : (
                <Text
                  color={textColor}
                  font="bold"
                  size="medium"
                  style={styles.counterTitle}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            {isShowLine && (
              <View
                style={[styles.progressLine, { backgroundColor: lineColor }]}
              />
            )}
            <Text
              font="bold"
              size="medium"
              style={styles.counterText}
              color={colors.contrast}
              withOpacity={isActive ? undefined : 90}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default OnboardingCounter;
