import { FC, ReactNode } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

import { createStyles } from "@/src/shared/ui/Popup/Popup.styles";
import { PALLETE_COLORS } from "@/src/shared/const";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  children: ReactNode;
}

const Popup: FC<PopupProps> = ({ isVisible, onClose, position, children }) => {
  const styles = createStyles(PALLETE_COLORS.dark);

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.popup,
            {
              top: position.y,
              left: position.x - 130,
            },
          ]}
        >
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Popup;
