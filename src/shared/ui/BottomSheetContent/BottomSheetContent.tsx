import { BottomSheet, Text } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { useKeyboard } from "../../lib/hooks/useKeyboard";
import { useCallback, Suspense } from "react";
import { View } from "react-native";
import React from "react";
import { FLOWS } from "./const/flows";
import { SmallLoader } from "../Loader/SmallLoader";
import { useBottomSheetVisibility } from "./lib/hooks/useBottomSheetVisibility";

const BottomSheetContent = () => {
  const { colors } = useThemeStore();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  const { handleClose, ref } = useBottomSheetVisibility();

  const {
    currentFlow,
    currentScreen,
    isBottomSheetVisible,
    bottomSheetHeight,
  } = useBottomSheetStore();

  const getSnapPoints = useCallback(() => {
    const baseHeight = bottomSheetHeight ? bottomSheetHeight : 1;
    return [baseHeight + (isKeyboardVisible ? keyboardHeight : 0)];
  }, [keyboardHeight, isKeyboardVisible, bottomSheetHeight]);

  // Получаем активный экран
  const ActiveScreen =
    currentFlow && currentScreen
      ? FLOWS[currentFlow]?.screens[currentScreen]
      : null;

  return (
    <BottomSheet
      ref={ref}
      snapPoints={getSnapPoints()}
      backgroundColor={colors.secondary}
      borderColor={colors.alternate}
      animateOnMount={false}
      style={{ paddingTop: 16 }}
      staticMode
      initialIndex={isBottomSheetVisible ? 0 : -1}
      withBackdrop
      // enableBackdropDismiss
      paddingHorizontal={0}
      onClose={handleClose}
    >
      {ActiveScreen ? (
        <Suspense
          fallback={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SmallLoader />
            </View>
          }
        >
          <ActiveScreen />
        </Suspense>
      ) : (
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text color={colors.contrast}>Ошибка. Попробуйте снова</Text>
        </View>
      )}
    </BottomSheet>
  );
};

export default BottomSheetContent;
