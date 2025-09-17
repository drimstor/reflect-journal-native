import { useLang, useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useSettingsStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  ArchiveBoxIcon,
  ArrowLeftIcon,
  BellIcon,
  BrushIcon,
  CardIcon,
  Chip,
  EmojiIcon,
  GlobalIcon,
  Info,
  Layout,
  LogoutIcon,
  MenuList,
  PaddingLayout,
  Text,
  Toggle,
} from "@/src/shared/ui";
import { FC } from "react";

import { ProfileMenu } from "@/src/features";
import { ScrollView, View } from "react-native";

interface SettingsScreenProps {}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const t = useT();
  const { colors, toggleTheme, theme } = useThemeStore();
  const { toggleLanguage, locale } = useLang();
  const { navigateToFlow, setBottomSheetVisible } = useBottomSheetStore();
  const {
    appearance: { isEmoji },
    updateSettings,
  } = useSettingsStore();

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
    {
      text: t("settings.importExport"),
      IconComponent: ArchiveBoxIcon,
      onPress: toggleLanguage,
      element: <Chip title={t("shared.info.soon")} color={colors.accent} />,
    },
  ];

  const appearanceSettings = [
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
      text: (
        <Info
          textProps={{
            font: "bold",
            style: { fontSize: 16, marginTop: -2 },
          }}
          gap={6}
          tooltipText={t("settings.emojiTooltip")}
        >
          {t("settings.emoji")}
        </Info>
      ),
      IconComponent: EmojiIcon,
      onPress: () => {
        updateSettings({ appearance: { isEmoji: !isEmoji } });
      },
      element: (
        <Toggle
          size="small"
          label={t("settings.emoji")}
          value={isEmoji}
          onValueChange={() => {
            updateSettings({ appearance: { isEmoji: !isEmoji } });
          }}
          style={{ container: { marginRight: -10, marginVertical: -4 } }}
        />
      ),
    },
  ];

  const otherSettings = [
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
        <PaddingLayout style={{ paddingTop: 30, paddingBottom: 250 }}>
          <ProfileMenu />
          <MenuList
            title={t("settings.account")}
            listItemVariant="reverse"
            style={{ marginBottom: 20, marginTop: 40 }}
            items={accountSettings.map(({ text, IconComponent, element }) => ({
              text,
              onPress: () => {},
              IconComponent: (props) => (
                <IconComponent {...props} color={props.color} size={22} />
              ),
              element: element || (
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
            title={t("settings.appearance")}
            listItemVariant="reverse"
            style={{ marginBottom: 20 }}
            items={appearanceSettings.map(
              ({ text, IconComponent, onPress, element }) => ({
                text,
                onPress,
                element,
                IconComponent: (props) => (
                  <IconComponent {...props} color={props.color} size={22} />
                ),
              })
            )}
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
