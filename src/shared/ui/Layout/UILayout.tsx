import { hasDynamicIsland } from "@/src/shared/lib/helpers/deviceFeatures";
import {
  selectSnackbars,
  useAppSelector,
  useDeviceStore,
} from "@/src/shared/store";
import { FC, ReactNode, useMemo } from "react";
import { View } from "react-native";
import BottomSheetContent from "../BottomSheetContent/BottomSheetContent";
import DynamicIsland from "../DynamicIsland/DynamicIsland";
import Snackbar from "../Snackbar/Snackbar";

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
