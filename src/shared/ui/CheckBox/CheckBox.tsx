import { FC, useRef, useEffect } from "react";
import { View, Animated, StyleProp, TextStyle } from "react-native";
import { Pressable } from "react-native";
import { styles } from "./CheckBox.styles";
import CheckedIcon from "./CheckedIcon";
import { useThemeStore } from "@/src/shared/store";
import Text from "../Text/Text";

interface CheckBoxProps {
  checked: boolean;
  onPress?: () => void;
  borderColor?: string;
  checkedColor?: string;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
}

const CheckBox: FC<CheckBoxProps> = ({
  checked,
  onPress,
  borderColor,
  checkedColor,
  text,
  textStyle,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const { colors } = useThemeStore();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: checked ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: checked ? 0.5 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [checked]);

  return (
    <Pressable style={styles.checkBoxWrapper} onPress={onPress}>
      <View
        style={[
          styles.unchecked,
          { borderColor: borderColor || colors.contrast + 30 },
        ]}
      >
        <Animated.View style={[{ opacity: fadeAnim }, styles.checkBoxIcon]}>
          <CheckedIcon color={checkedColor || colors.accent} size={28} />
        </Animated.View>
      </View>
      <Animated.View style={{ opacity: textOpacity }}>
        <Text
          color={colors.contrast}
          style={[
            { textDecorationLine: checked ? "line-through" : "none" },
            textStyle,
          ]}
        >
          {text}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default CheckBox;
