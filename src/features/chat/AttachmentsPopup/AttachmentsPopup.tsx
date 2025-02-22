import { FC } from "react";
import { Animated, TouchableOpacity } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import { useThemeStore } from "@/src/shared/store";
import {
  DocumentTextIcon,
  MicrophoneIcon,
  ImageIcon,
} from "@/src/shared/ui/icons";
import { useSpringAnimation } from "@/src/shared/lib/hooks";
import { createStyles } from "./AttachmentsPopup.styles";

interface AttachmentsPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const AttachmentsPopup: FC<AttachmentsPopupProps> = ({
  isVisible,
  onClose,
}) => {
  const { colors, theme } = useThemeStore();
  const { animation } = useSpringAnimation(isVisible);
  const styles = createStyles(colors, theme, animation);
  const iconColor = theme === "dark" ? colors.accent : colors.primary;

  const buttonsConfig = [
    { icon: <DocumentTextIcon color={iconColor} size={22} /> },
    { icon: <MicrophoneIcon color={iconColor} size={24} /> },
    { icon: <ImageIcon color={iconColor} size={22} /> },
  ];

  return (
    <OutsidePressHandler
      style={[styles.container, { pointerEvents: isVisible ? "auto" : "none" }]}
      onOutsidePress={onClose}
      disabled={!isVisible}
    >
      <Animated.View style={styles.popup}>
        {buttonsConfig.map((button, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            {button.icon}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </OutsidePressHandler>
  );
};

export default AttachmentsPopup;
