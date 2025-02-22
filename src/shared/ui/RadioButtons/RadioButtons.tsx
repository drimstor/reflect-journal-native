import { FC } from "react";
import { View } from "react-native";
import { Pressable } from "react-native";
import Text from "../Text/Text";
import CheckedOptionIcon from "./CheckedOptionIcon";
import { createStyles } from "./RadioButtons.styles";
import { PALLETE_COLORS } from "@/src/shared/const";

interface RadioButtonsProps {
  onPress: (id: string) => void;
  optionsList: { label: string; id: string; text?: string }[];
  currentValue: string;
  contained?: boolean;
}

const RadioButtons: FC<RadioButtonsProps> = ({
  onPress,
  optionsList,
  currentValue,
  contained = false,
}) => {
  const styles = createStyles(PALLETE_COLORS.dark);

  return (
    <View style={[styles.wrapper, { gap: contained ? 10 : 20 }]}>
      {optionsList.map(({ label, text, id }) => (
        <Pressable
          onPress={() => onPress(id)}
          key={id}
          style={[styles.optionWrapper, contained && styles.contained]}
        >
          <View style={styles.optionDescription}>
            <Text
              size={contained ? "common" : "normal"}
              color={themeColors.textPrimary}
            >
              {label}
            </Text>
            {text && (
              <Text size="mini" color={themeColors.textSecondary}>
                {text}
              </Text>
            )}
          </View>
          {id === currentValue ? (
            <CheckedOptionIcon />
          ) : (
            <View style={styles.optionUnchecked}></View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export default RadioButtons;
