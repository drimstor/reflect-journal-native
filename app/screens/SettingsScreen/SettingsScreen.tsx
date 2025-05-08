import { FC } from "react";
import {
  ArrowLeftIcon,
  ArrowRightLongIcon,
  BellIcon,
  BrushIcon,
  CardIcon,
  GlobalIcon,
  Layout,
  LogoutIcon,
  MenuList,
  PaddingLayout,
  Text,
} from "@/src/shared/ui";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";

import { ProfileMenu } from "@/src/features";
import { ScrollView, View } from "react-native";

interface SettingsScreenProps {}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const t = useT();
  const { colors, toggleTheme, theme } = useThemeStore();
  const { toggleLanguage, locale } = useLang();
  const { navigateToFlow, setBottomSheetVisible } = useBottomSheetStore();

  const accountSettings = [
    {
      text: t("settings.subscription"),
      IconComponent: CardIcon,
      onPress: toggleTheme,
    },
    {
      text: t("settings.notifications"),
      IconComponent: BellIcon,
      onPress: toggleLanguage,
    },
  ];

  const otherSettings = [
    {
      text: t("settings.theme"),
      IconComponent: BrushIcon,
      onPress: toggleTheme,
      element: (
        <Text
          style={{ textTransform: "capitalize" }}
          color={colors.contrast + 80}
        >
          {theme}
        </Text>
      ),
    },
    {
      text: t("settings.language"),
      IconComponent: GlobalIcon,
      onPress: toggleLanguage,
      element: (
        <Text
          style={{ textTransform: "uppercase" }}
          color={colors.contrast + 80}
        >
          {locale}
        </Text>
      ),
    },
    {
      text: t("shared.actions.logout"),
      IconComponent: LogoutIcon,
      onPress: () => {
        navigateToFlow("logout", "areYouSure");

        setTimeout(() => {
          setBottomSheetVisible(true);
        }, 150);
      },
      color: colors.error,
    },
  ];

  return (
    <Layout>
      <ScrollView>
        <PaddingLayout style={{ marginTop: 30 }}>
          <ProfileMenu />
          <MenuList
            title={t("settings.account")}
            listItemVariant="reverse"
            style={{ marginVertical: 40 }}
            items={accountSettings.map(({ text, IconComponent }) => ({
              text,
              onPress: () => {},
              IconComponent: (props) => (
                <IconComponent {...props} color={props.color} size={22} />
              ),
              element: (
                <View
                  style={{
                    transform: [{ rotate: "180deg" }, { translateX: -5 }],
                  }}
                >
                  <ArrowLeftIcon size={20} color={colors.contrast + 70} />
                </View>
              ),
            }))}
          />
          <MenuList
            title={t("settings.other")}
            listItemVariant="reverse"
            items={otherSettings.map(
              ({ text, IconComponent, onPress, color, element }) => ({
                text,
                onPress,
                element,
                IconComponent: (props) => (
                  <IconComponent
                    {...props}
                    color={color || props.color}
                    size={22}
                  />
                ),
              })
            )}
          />
        </PaddingLayout>
      </ScrollView>
    </Layout>
  );
};

export default SettingsScreen;
