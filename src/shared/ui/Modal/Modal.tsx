import { FC } from "react";
import { Animated, Pressable, Modal as RNModal, View } from "react-native";

import { Theme } from "@/src/shared/model/types";
import { createStyles } from "./Modal.styles";
import { PALLETE_COLORS } from "@/src/shared/const";

interface ModalProps {
  isDrawerVisible: boolean;
  closeDrawer: () => void;
  animatedHeight: any;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({
  isDrawerVisible,
  closeDrawer,
  animatedHeight,
  children,
}) => {
  const styles = createStyles(PALLETE_COLORS.dark);

  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isDrawerVisible}
      onRequestClose={closeDrawer}
    >
      <Pressable style={styles.modalOverlay} onPress={closeDrawer}>
        <Animated.View
          style={[styles.drawerContainer, { height: animatedHeight }]}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
        >
          <View style={styles.modalHandle}></View>
          {children}
        </Animated.View>
      </Pressable>
    </RNModal>
  );
};

export default Modal;
