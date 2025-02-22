import { FC } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { styles } from "./Divider.styles";

interface DividerProps {
  color: string;
  style?: StyleProp<ViewStyle>;
}

const Divider: FC<DividerProps> = ({ color, style }) => {
  return (
    <View style={[styles.divider, { backgroundColor: color }, style]}></View>
  );
};

export default Divider;
