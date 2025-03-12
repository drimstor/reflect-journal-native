import { Pressable, View } from "react-native";
import { styles } from "./BottomSheetComponents.styles";
import {
  ArrowRightLongIcon,
  Text,
  PlusIcon,
  Divider,
  Button,
} from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { ReactNode } from "react";

interface BottomSheetHeaderProps {
  title: string;
  onClose: () => void;
  onBack: () => void;
}

export const BottomSheetHeader = ({
  title,
  onClose,
  onBack,
}: BottomSheetHeaderProps) => {
  const { colors } = useThemeStore();
  return (
    <View>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <ArrowRightLongIcon size={22} color={colors.contrast} />
        </Pressable>
        <Text
          font="bold"
          size="large"
          color={colors.contrast}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <PlusIcon size={26} color={colors.contrast} />
        </Pressable>
      </View>
      <Divider color={colors.light} />
    </View>
  );
};

export const BottomSheetFooter = ({ children }: { children: ReactNode }) => {
  const { colors } = useThemeStore();

  return (
    <View>
      <Divider color={colors.light} style={styles.divider} />
      <View style={styles.footer}>{children}</View>
    </View>
  );
};
