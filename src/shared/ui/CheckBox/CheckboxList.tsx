import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";
import { styles } from "./CheckBox.styles";

interface CheckboxListProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CheckboxList: FC<CheckboxListProps> = ({ children, style }) => {
  return <View style={[styles.checkboxList, style]}>{children}</View>;
};

export default CheckboxList;
