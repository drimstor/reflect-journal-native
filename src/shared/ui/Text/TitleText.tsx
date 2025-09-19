import {
  TextProps as RNTextProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Text from "./Text";
import { textStyles } from "./Text.styles";

export type TitleTextProps = {
  text: string;
  textColor: string;
  element?: React.ReactNode;
  variant?: "title" | "subTitle";
  style?: StyleProp<ViewStyle>;
  numberOfLines?: number;
  ellipsizeMode?: RNTextProps["ellipsizeMode"];
};

const TitleText = ({
  text,
  textColor,
  element,
  variant = "title",
  style,
  numberOfLines,
  ellipsizeMode,
}: TitleTextProps) => {
  return (
    <View style={[textStyles.titleBox, style]}>
      <Text
        size={variant === "title" ? "title" : "large"}
        font="bold"
        color={textColor}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {text}
      </Text>
      {element}
    </View>
  );
};

export default TitleText;
