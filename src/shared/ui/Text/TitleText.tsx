import { StyleProp, View, ViewStyle } from "react-native";
import Text from "./Text";
import { textStyles } from "./Text.styles";

type TitleTextProps = {
  text: string;
  textColor: string;
  element?: React.ReactNode;
  variant?: "title" | "subTitle";
  style?: StyleProp<ViewStyle>;
};

const TitleText = ({
  text,
  textColor,
  element,
  variant = "title",
  style,
}: TitleTextProps) => {
  return (
    <View style={[textStyles.titleBox, style]}>
      <Text
        size={variant === "title" ? "title" : "large"}
        font="bold"
        color={textColor}
      >
        {text}
      </Text>
      {element}
    </View>
  );
};

export default TitleText;
