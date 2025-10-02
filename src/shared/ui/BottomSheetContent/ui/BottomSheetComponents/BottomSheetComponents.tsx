import { useThemeStore } from "@/src/shared/store";
import { ArrowRightLongIcon, Divider, PlusIcon, Text } from "@/src/shared/ui";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { styles } from "./BottomSheetComponents.styles";

interface BottomSheetHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  isBorderGap?: boolean;
}

export const BottomSheetHeader = ({
  title,
  onClose,
  onBack,
  isBorderGap = true,
}: BottomSheetHeaderProps) => {
  const { colors } = useThemeStore();
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.mockBlock}>
          {onBack && (
            <Pressable style={styles.backButton} onPress={onBack}>
              <ArrowRightLongIcon size={22} color={colors.contrast} />
            </Pressable>
          )}
        </View>
        <Text
          font="bold"
          size="large"
          color={colors.contrast}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.mockBlock}>
          {onClose && (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <PlusIcon size={26} color={colors.contrast} />
            </Pressable>
          )}
        </View>
      </View>
      <Divider
        color={colors.alternate}
        style={isBorderGap ? {} : { marginBottom: -4 }}
      />
    </View>
  );
};

export const BottomSheetFooter = ({
  children,
  isBorderGap = true,
}: {
  children: ReactNode;
  isBorderGap?: boolean;
}) => {
  const { colors } = useThemeStore();

  return (
    <View>
      <Divider
        color={colors.alternate}
        style={[styles.divider, isBorderGap ? {} : { marginTop: -4 }]}
      />
      <View style={styles.footer}>{children}</View>
    </View>
  );
};
