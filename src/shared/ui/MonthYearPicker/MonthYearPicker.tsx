import React, { FC, lazy, Suspense } from "react";
import { Platform } from "react-native";
import { MonthYearPickerProps } from "./model/types";

// Динамический импорт компонентов по платформе
const MonthYearPickerAndroid = lazy(() => import("./MonthYearPicker.android"));
const MonthYearPickerIOS = lazy(() => import("./MonthYearPicker.ios"));

const MonthYearPicker: FC<MonthYearPickerProps> = (props) => {
  const Component =
    Platform.OS === "android" ? MonthYearPickerAndroid : MonthYearPickerIOS;

  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default MonthYearPicker;
