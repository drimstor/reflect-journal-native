import { View } from "react-native";
import { styles } from "./Header.styles";
import { IconButton, Text } from "@/src/shared/ui";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { useLang } from "@/src/shared/lib/hooks";
import { ArrowRightIcon, HeartIcon } from "@/src/shared/ui/icons";
import { useGetPadding } from "@/src/shared/lib/hooks";
import { useNavigation } from "@react-navigation/native";
import { PATHS } from "@/src/shared/const";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { toggleTheme, colors } = useThemeStore();
  const { toggleLanguage } = useLang();
  const { paddingHorizontal } = useGetPadding();
  const { isTablet, isIOS } = useDeviceStore();

  const navigation = useNavigation();
  const handleBack = () => {
    // navigation.goBack();
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.headerWrapper,
        { paddingHorizontal, paddingTop: isTablet && isIOS ? 30 : 10 },
      ]}
    >
      <IconButton style={styles.headerLeftIcon} isOpacity onPress={handleBack}>
        <ArrowRightIcon color={colors.contrast} />
      </IconButton>

      <View style={styles.headerTextBox}>
        {title && (
          <Text
            font="bold"
            style={styles.headerTitle}
            color={colors.contrast}
            size={subtitle ? "title" : "header"}
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

      <IconButton isOpacity onPress={toggleTheme}>
        <HeartIcon size={30} color={colors.contrast} />
        {/* <ConfigureIcon size={30} color={colors.contrast} /> */}
        {/* <BellIcon size={30} color={colors.contrast} /> */}
        {/* <SearchIcon color={colors.contrast} /> */}
        {/* <BurgerMenuIcon size={30} color={colors.contrast} /> */}
        {/* <DotsIcon color={colors.contrast} /> */}
      </IconButton>
    </View>
  );
};

export default Header;
