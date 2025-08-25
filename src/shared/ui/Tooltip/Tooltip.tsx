import { useThemeStore } from "@/src/shared/store";
import { FC, memo } from "react";
import { Modal, Pressable, View } from "react-native";
import Text from "../Text/Text";
import { TooltipProps } from "./model/types";
import { createStyles } from "./Tooltip.styles";

const Tooltip: FC<TooltipProps> = ({
  text,
  visible = true,
  onPress,
  position,
}) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      pointerEvents="none"
    >
      <Pressable
        style={{
          width: "100%",
          height: "100%",
          paddingTop: position?.top ?? 0,
          paddingLeft: position?.left ?? 0,
          paddingRight: position?.right ?? 0,
          paddingBottom: position?.bottom ?? 0,
        }}
        onPress={onPress}
      >
        <View style={styles.tooltipContainer}>
          <Text color={colors.contrast}>{text}</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

export default memo(Tooltip);
