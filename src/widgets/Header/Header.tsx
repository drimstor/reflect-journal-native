import { useGetPadding } from "@/src/shared/lib/hooks";
import { NavigationProps } from "@/src/shared/model/types";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { IconButton, Text } from "@/src/shared/ui";
import { ArrowLeftIcon } from "@/src/shared/ui/icons";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { styles } from "./Header.styles";
import { HeaderProps } from "./model/types";

const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  backButton,
  style,
}: HeaderProps) => {
  const { colors } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const { isTablet, isIOS, window } = useDeviceStore();
  const navigation = useNavigation<NavigationProps>();

  const backIcon = {
    icon: <ArrowLeftIcon color={colors.contrast} />,
    onPress: navigation.goBack,
  };

  const leftIconProps = backButton ? backIcon : leftIcon;

  return (
    <View
      style={[
        styles.headerWrapper,
        { paddingHorizontal, paddingTop: isTablet && isIOS ? 30 : 10 },
        style,
      ]}
    >
      <View style={styles.headerIconBox}>
        {leftIconProps && (
          <IconButton isAnimated onPress={leftIconProps.onPress}>
            {leftIconProps.icon}
          </IconButton>
        )}
      </View>

      <View style={styles.headerTextBox}>
        {title && (
          <Text
            font="bold"
            style={[
              styles.headerTitle,
              { maxWidth: window.width - (120 + paddingHorizontal * 2) },
            ]}
            color={colors.contrast}
            size={subtitle ? "title" : "header"}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text withOpacity={70} color={colors.contrast}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.headerIconBox}>
        {rightIcon && (
          <IconButton isAnimated onPress={rightIcon.onPress}>
            {rightIcon.icon}
          </IconButton>
        )}
      </View>
    </View>
  );
};

export default Header;
