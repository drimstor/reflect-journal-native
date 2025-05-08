import React from "react";
import { List } from "@/src/shared/ui";
import { useBottomSheetStore } from "@/src/shared/store";
import { LayoutChangeEvent } from "react-native";

const BottomSheetList = () => {
  const { actions, setBottomSheetHeight } = useBottomSheetStore();

  const handleAction = (action: () => void = () => {}) => {
    action();
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    if (e.nativeEvent.layout.height > 0) {
      setBottomSheetHeight(e.nativeEvent.layout.height);
    }
  };

  return (
    <List
      onLayout={handleLayout}
      style={{ paddingBottom: 50, paddingHorizontal: 24 }}
      items={actions.map(
        ({ text, IconComponent, onPress, iconColor, iconSize }) => ({
          text,
          onPress: () => handleAction(onPress),
          IconComponent: (props) => (
            <>
              {IconComponent && (
                <IconComponent
                  {...props}
                  color={iconColor || props.color}
                  size={iconSize || props.size}
                />
              )}
            </>
          ),
        })
      )}
    />
  );
};

export default BottomSheetList;
