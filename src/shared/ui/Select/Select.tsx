import React, { FC, lazy, Suspense } from "react";
import { Platform } from "react-native";
import { SelectProps } from "./model/types";

// Динамический импорт компонентов по платформе
const SelectAndroid = lazy(() => import("./Select.android"));
const SelectIOS = lazy(() => import("./Select.ios"));

const Select: FC<SelectProps> = (props) => {
  const Component = Platform.OS === "android" ? SelectAndroid : SelectIOS;

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default Select;
