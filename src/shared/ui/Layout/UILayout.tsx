import React, { FC, ReactNode } from "react";
import { View } from "react-native";
import BottomSheetActions from "../BottomSheetActions/BottomSheetActions";
import Snackbar from "../Snackbar/Snackbar";
import { useAppSelector, selectSnackbars } from "@/src/shared/store";
import BottomSheetContent from "../BottomSheetContent/BottomSheetContent";

interface UILayoutProps {
  children: ReactNode;
}

const UILayout: FC<UILayoutProps> = ({ children }) => {
  const snackbars = useAppSelector(selectSnackbars);

  return (
    <View>
      {children}
      <BottomSheetActions />
      <BottomSheetContent />
      {snackbars.map((snackbar) => (
        <Snackbar key={snackbar.id} data={snackbar} />
      ))}
    </View>
  );
};

export default UILayout;
