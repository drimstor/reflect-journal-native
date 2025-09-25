import { useThemeStore } from "@/src/shared/store";
import { FC, useEffect } from "react";
import { Pressable, StyleProp, TextStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "../Text/Text";
import { styles } from "./CheckBox.styles";
import CheckedIcon from "./CheckedIcon";

interface CheckBoxProps {
  checked: boolean;
  onPress?: () => void;
  borderColor?: string;
  checkedColor?: string;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  textDecoration?: boolean;
}

const CheckBox: FC<CheckBoxProps> = ({
  checked,
  onPress,
  borderColor,
  checkedColor,
  text,
  textStyle,
  textDecoration,
}) => {
  const fadeAnim = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const { colors } = useThemeStore();

  useEffect(() => {
    fadeAnim.value = withTiming(checked ? 1 : 0, { duration: 150 });
    textOpacity.value = withTiming(checked && textDecoration ? 0.5 : 1, {
      duration: 150,
    });
  }, [checked, textDecoration]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <Pressable style={styles.checkBoxWrapper} onPress={onPress}>
      <View
        style={[
          styles.unchecked,
          { borderColor: borderColor || colors.contrast + 30 },
        ]}
      >
        <Animated.View style={[iconAnimatedStyle, styles.checkBoxIcon]}>
          <CheckedIcon color={checkedColor || colors.accent} size={28} />
        </Animated.View>
      </View>
      {text && (
        <Animated.View style={textAnimatedStyle}>
          <Text
            color={colors.contrast}
            style={[
              {
                textDecorationLine:
                  checked && textDecoration ? "line-through" : "none",
              },
              textStyle,
            ]}
          >
            {text}
          </Text>
        </Animated.View>
      )}
    </Pressable>
  );
};

export default CheckBox;
