import React, { FC, ReactNode, useMemo } from "react";
import { View } from "react-native";
import Snackbar from "../Snackbar/Snackbar";
import {
  useAppSelector,
  selectSnackbars,
  useDeviceStore,
} from "@/src/shared/store";
import BottomSheetContent from "../BottomSheetContent/BottomSheetContent";
import DynamicIsland from "../DynamicIsland/DynamicIsland";
import { hasDynamicIsland } from "@/src/shared/lib/helpers/deviceFeatures";

interface UILayoutProps {
  children: ReactNode;
}

const UILayout: FC<UILayoutProps> = ({ children }) => {
  const snackbars = useAppSelector(selectSnackbars);
  const { brand, model } = useDeviceStore();

  // Определяем, имеет ли устройство Dynamic Island
  const deviceHasDynamicIsland = useMemo(
    () => hasDynamicIsland(brand, model),
    [brand, model]
  );

  return (
    <View>
      {deviceHasDynamicIsland && <DynamicIsland />}
      {children}
      <BottomSheetContent />
      {!deviceHasDynamicIsland &&
        snackbars.map((snackbar) => (
          <Snackbar key={snackbar.id} data={snackbar} />
        ))}
    </View>
  );
};

export default UILayout;
